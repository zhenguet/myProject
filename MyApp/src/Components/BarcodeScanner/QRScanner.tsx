import React from 'react'
import {
  BackHandler,
  Dimensions,
  Modal,
  Platform,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'
import * as REA from 'react-native-reanimated'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import {
  Camera,
  useCameraDevices,
  useFrameProcessor,
} from 'react-native-vision-camera'
import {
  DBRConfig,
  TextResult,
  decode,
} from 'vision-camera-dynamsoft-barcode-reader'
import { ScannerRectView } from './ScannerRectView2'
import { goBack } from '@/Navigators/utils'
import { useTheme } from '@/Hooks'

let pressedResult: TextResult | undefined

function QRScanner({ onSetResult }: any) {
  const { Common, Fonts, Gutters, Layout } = useTheme()

  const mounted = REA.useSharedValue(true)
  const rotated = REA.useSharedValue(false)
  const regionEnabledShared = REA.useSharedValue(false)
  const continuous = true
  const [hasPermission, setHasPermission] = React.useState(false)
  const [barcodeResults, setBarcodeResults] = React.useState([] as TextResult[])
  const [buttonText, setButtonText] = React.useState('Pause')
  const [isActive, setIsActive] = React.useState(true)
  const [frameWidth, setFrameWidth] = React.useState(1280)
  const [frameHeight, setFrameHeight] = React.useState(720)
  const [regionEnabled, setRegionEnabled] = React.useState(false)
  const [torchEnabled, setTorchEnabled] = React.useState(false)
  const [useFront, setUseFront] = React.useState(false)
  const useFrontShared = REA.useSharedValue(false)
  const [modalVisible, setModalVisible] = React.useState(false)

  const devices = useCameraDevices()
  const frontCam = devices.front
  const backCam = devices.back

  let actionSheetRef: any = React.useRef(null)
  let scanned = false

  React.useEffect(() => {
    ;(async () => {
      const status = await Camera.requestCameraPermission()
      setHasPermission(status === 'authorized')
    })()

    const backAction = () => {
      setIsActive(false)
      goBack()
      return true
    }

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    )

    return () => backHandler.remove()
  }, [])

  React.useEffect(() => {
    mounted.value = true // to avoid the error: Can’t perform a React state update on an unmounted component.
    return () => {
      mounted.value = false
    }
  })

  const onBarCodeDetected = (results: TextResult[]) => {
    // if (!scanned) {
    onSetResult(results)
    setModalVisible(false)
    scanned = true
    // }
  }

  const toggleCameraStatus = () => {
    if (buttonText == 'Pause') {
      setButtonText('Resume')
      setIsActive(false)
    } else {
      setButtonText('Pause')
      setIsActive(true)
    }
  }

  const getPointsData = (lr: TextResult) => {
    var pointsData = lr.x1 + ',' + lr.y1 + ' '
    pointsData = pointsData + lr.x2 + ',' + lr.y2 + ' '
    pointsData = pointsData + lr.x3 + ',' + lr.y3 + ' '
    pointsData = pointsData + lr.x4 + ',' + lr.y4
    return pointsData
  }

  const getViewBox = () => {
    const frameSize = getFrameSize()
    const viewBox = '0 0 ' + frameSize[0] + ' ' + frameSize[1]
    console.log('viewBox' + viewBox)
    updateRotated()
    return viewBox
  }

  const getFrameSize = (): number[] => {
    let width: number, height: number
    if (HasRotation()) {
      width = frameHeight
      height = frameWidth
    } else {
      width = frameWidth
      height = frameHeight
    }
    return [width, height]
  }

  const HasRotation = () => {
    let value = false
    if (Platform.OS === 'android') {
      if (
        !(
          frameWidth > frameHeight &&
          Dimensions.get('window').width > Dimensions.get('window').height
        )
      ) {
        value = true
      }
    }
    return value
  }

  const updateRotated = () => {
    rotated.value = HasRotation()
  }

  const updateFrameSize = (width: number, height: number) => {
    if (mounted.value) {
      setFrameWidth(width)
      setFrameHeight(height)
    }
  }

  const onBarcodeScanned = (results: TextResult[]) => {
    if (mounted.value) {
      setBarcodeResults(results)
      if (results.length > 0) {
        onBarCodeDetected(results)
      }
    }
  }

  const format = React.useMemo(() => {
    const desiredWidth = 1280
    const desiredHeight = 720
    let selectedCam
    if (useFront) {
      selectedCam = frontCam
    } else {
      selectedCam = backCam
    }
    if (selectedCam) {
      for (let index = 0; index < selectedCam.formats.length; index++) {
        const format = selectedCam.formats[index]
        console.log('h: ' + format.videoHeight)
        console.log('w: ' + format.videoWidth)
        if (
          format.videoWidth == desiredWidth &&
          format.videoHeight == desiredHeight
        ) {
          console.log('select format: ' + format)
          return format
        }
      }
    }
    return undefined
  }, [useFront])

  const frameProcessor = useFrameProcessor(frame => {
    'worklet'
    // console.log('height: ' + frame.height);
    // console.log('width: ' + frame.width);
    REA.runOnJS(updateFrameSize)(frame.width, frame.height)
    const config: DBRConfig = {}
    //config.template="{\"ImageParameter\":{\"BarcodeFormatIds\":[\"BF_QR_CODE\"],\"Description\":\"\",\"Name\":\"Settings\"},\"Version\":\"3.0\"}";
    config.isFront = useFrontShared.value
    if (regionEnabledShared.value) {
      let settings
      if (config.template) {
        settings = JSON.parse(config.template)
      } else {
        const template = `{
          "ImageParameter": {
            "Name": "Settings"
          },
          "Version": "3.0"
        }`
        settings = JSON.parse(template)
      }
      settings['ImageParameter']['RegionDefinitionNameArray'] = ['Settings']
      settings['RegionDefinition'] = {
        Left: 10,
        Right: 90,
        Top: 20,
        Bottom: 65,
        MeasuredByPercentage: 1,
        Name: 'Settings',
      }
      config.template = JSON.stringify(settings)
    }

    const results: TextResult[] = decode(frame, config)
    REA.runOnJS(onBarcodeScanned)(results)
  }, [])

  return (
    <>
      <TouchableOpacity
        onPress={() => {
          scanned = false
          setModalVisible(true)
        }}
      >
        <Ionicons
          name="barcode-outline"
          size={28}
          style={[Gutters.regularPadding]}
        />
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView style={styles.container}>
          {backCam != null && hasPermission && (
            <Camera
              style={StyleSheet.absoluteFill}
              device={backCam}
              isActive={isActive}
              // format={format}
              torch={torchEnabled ? 'on' : 'off'}
              frameProcessor={frameProcessor}
              // frameProcessorFps={5}
            />
          )}
          <View style={[StyleSheet.absoluteFill]}>
            <View style={{ backgroundColor: 'rgba(0,0,0,0.3)', flex: 1 }} />
            <View style={Layout.row}>
              <View style={{ backgroundColor: 'rgba(0,0,0,0.3)', flex: 1 }} />
              {/* see https://github.com/MarnoDev/react-native-qrcode-scanner-view */}
              <ScannerRectView />
              <View style={{ backgroundColor: 'rgba(0,0,0,0.3)', flex: 1 }} />
            </View>
            <View style={{ backgroundColor: 'rgba(0,0,0,0.3)', flex: 1 }} />
          </View>
          <TouchableOpacity
            style={{
              position: 'absolute',
              top: 15,
              left: 15,
              backgroundColor: 'rgba(255, 255, 255, 0.25)',
              borderRadius: 9999,
            }}
            onPress={() => {
              setModalVisible(false)
            }}
          >
            <AntDesign
              name="left"
              size={28}
              color="#FFF"
              style={[Gutters.regularPadding]}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              position: 'absolute',
              top: 15,
              right: 15,
              backgroundColor: torchEnabled
                ? 'rgba(255, 245, 204,0.85)'
                : 'rgba(255, 255, 255, 0.25)',
              borderRadius: 9999,
            }}
            onPress={() => {
              setTorchEnabled(prevState => !prevState)
            }}
          >
            <MaterialCommunityIcons
              name={torchEnabled ? 'flashlight' : 'flashlight-off'}
              size={28}
              color="#FFF"
              style={[Gutters.regularPadding]}
            />
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>
    </>
  )
}

export default React.memo(QRScanner)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  barcodeText: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  toggleCameraStatusButton: {
    flex: 0.2,
    justifyContent: 'center',
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: 5,
    padding: 8,
    margin: 5,
  },
  control: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    height: '15%',
    width: '100%',
    alignSelf: 'flex-start',
    borderColor: 'white',
    borderWidth: 0.1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
  },
  switchContainer: {
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
})
