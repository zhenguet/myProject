import React from 'react'
import {
  BackHandler,
  Dimensions,
  Platform,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'
import * as REA from 'react-native-reanimated'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import AntDesign from 'react-native-vector-icons/AntDesign'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import {
  Camera,
  useCameraDevices,
  useFrameProcessor,
} from 'react-native-vision-camera'
import {
  DBRConfig,
  decode,
  TextResult,
} from 'vision-camera-dynamsoft-barcode-reader'

//see https://github.com/MarnoDev/react-native-qrcode-scanner-view
import { ScannerRectView } from './ScannerRectView'
import { goBack } from '@/Navigators/utils'
import { useTheme } from '@/Hooks'

let pressedResult: TextResult | undefined

function BarcodeScanner(props: any) {
  const { route, navigation } = props
  const { params } = route
  const { Common, Fonts, Gutters, Layout } = useTheme()

  const mounted = REA.useSharedValue(true)
  const regionEnabledShared = REA.useSharedValue(false)
  const [hasPermission, setHasPermission] = React.useState(false)
  const [isActive, setIsActive] = React.useState(true)
  const [frameWidth, setFrameWidth] = React.useState(1280)
  const [frameHeight, setFrameHeight] = React.useState(720)
  const [torchEnabled, setTorchEnabled] = React.useState(false)
  const useFrontShared = REA.useSharedValue(false)

  const devices = useCameraDevices()
  const backCam = devices.back

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
    mounted.value = true
    return () => {
      mounted.value = false
    }
  })

  const onBarCodeDetected = (results: TextResult[]) => {
    if (!scanned) {
      navigation.navigate({
        name: params?.name,
        params: {
          ...params,
          results: results,
        },
      })
      scanned = true
    }
  }

  const updateFrameSize = (width: number, height: number) => {
    if (mounted.value) {
      setFrameWidth(width)
      setFrameHeight(height)
    }
  }

  const onBarcodeScanned = (results: TextResult[]) => {
    if (mounted.value) {
      if (results.length > 0) {
        onBarCodeDetected(results)
      }
    }
  }

  const frameProcessor = useFrameProcessor(frame => {
    'worklet'
    REA.runOnJS(updateFrameSize)(frame.width, frame.height)
    const config: DBRConfig = {}
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
    <SafeAreaView style={styles.container}>
      {backCam != null && hasPermission && (
        <Camera
          style={StyleSheet.absoluteFill}
          device={backCam}
          isActive={isActive}
          torch={torchEnabled ? 'on' : 'off'}
          frameProcessor={frameProcessor}
        />
      )}

      <View style={[StyleSheet.absoluteFill]}>
        <View style={{ backgroundColor: 'rgba(0,0,0,0.3)', flex: 1 }} />
        <View style={Layout.row}>
          <View style={{ backgroundColor: 'rgba(0,0,0,0.3)', flex: 1 }} />
          <ScannerRectView />
          <View style={{ backgroundColor: 'rgba(0,0,0,0.3)', flex: 1 }} />
        </View>
        <View style={{ backgroundColor: 'rgba(0,0,0,0.3)', flex: 1 }} />
      </View>
      <TouchableOpacity
        style={{
          position: 'absolute',
          top: 15 + getStatusBarHeight(),
          left: 15,
          backgroundColor: 'rgba(255, 255, 255, 0.25)',
          borderRadius: 9999,
        }}
        onPress={() => {
          navigation.goBack()
        }}
      >
        <AntDesign name="left" size={28} color="#FFF" style={[Gutters.smallPadding]} />
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          position: 'absolute',
          top: 15 + getStatusBarHeight(),
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
          style={[Gutters.smallPadding]}
        />
      </TouchableOpacity>
    </SafeAreaView>
  )
}

export default React.memo(BarcodeScanner)

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
