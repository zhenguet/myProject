import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Animated, Easing, Image, StyleSheet, Text, View } from 'react-native'

const defaultRectStyle = {
  height: 200,
  width: 200,
  borderWidth: 0,
  borderColor: '#000000',
  marginBottom: 0,
}
const defaultCornerStyle = {
  height: 32,
  width: 32,
  borderWidth: 8,
  borderColor: '#1A6DD5',
}
const defaultScanBarStyle = {
  marginHorizontal: 8,
  borderRadius: 2,
  backgroundColor: '#1A6DD5',
}
const defaultHintTextStyle = {
  color: '#fff',
  fontSize: 14,
  backgroundColor: 'transparent',
  marginTop: 32,
}

export class ScannerRectView extends Component {
  static propTypes = {
    maskColor: PropTypes.string, // 遮罩颜色
    rectStyle: PropTypes.object, // 扫码框样式

    cornerStyle: PropTypes.object, // 转角样式
    cornerOffsetSize: PropTypes.number, // 转角偏移距离
    isShowCorner: PropTypes.bool, // 是否显示转角

    isShowScanBar: PropTypes.bool, // 是否显示扫描条
    scanBarAnimateTime: PropTypes.number, // 扫描动画时长
    scanBarAnimateReverse: PropTypes.bool, // 扫描条来回移动
    scanBarImage: PropTypes.any, // 自定义扫描条图片
    scanBarStyle: PropTypes.object, // 扫描条样式

    hintText: PropTypes.string, // 提示文字
    hintTextStyle: PropTypes.object, // 提示文字样式
  }

  static defaultProps = {
    maskColor: '#0000004D',
    cornerOffsetSize: 0,
    isShowScanBar: true,
    isShowCorner: true,
    scanBarAnimateTime: 3000,
    hintText: '',
  }

  state = {
    animatedValue: new Animated.Value(0),
  }

  constructor(props) {
    super(props)
    this.innerRectStyle = Object.assign(defaultRectStyle, props.rectStyle)
    this.innerCornerStyle = Object.assign(defaultCornerStyle, props.cornerStyle)
    this.innerScanBarStyle = Object.assign(
      defaultScanBarStyle,
      props.scanBarStyle,
    )
    this.innerHintTextStyle = Object.assign(
      defaultHintTextStyle,
      props.hintTextStyle,
    )
  }

  componentDidMount() {
    this.scanBarMove()
  }

  componentWillUnmount() {
    this.scanBarAnimation && this.scanBarAnimation.stop()
  }

  // 扫描动画
  scanBarMove() {
    const { cornerOffsetSize, scanBarAnimateReverse, isShowScanBar } =
      this.props
    const scanBarHeight = isShowScanBar ? this.innerScanBarStyle.height || 4 : 0
    const startValue = this.innerCornerStyle.borderWidth
    const endValue =
      this.innerRectStyle.height -
      (this.innerRectStyle.borderWidth +
        cornerOffsetSize +
        this.innerCornerStyle.borderWidth) -
      scanBarHeight
    // if (scanBarAnimateReverse) {
    this.scanBarAnimation = Animated.sequence([
      Animated.timing(this.state.animatedValue, {
        toValue: endValue,
        duration: this.props.scanBarAnimateTime,
        easing: Easing.linear,
        isInteraction: false,
        useNativeDriver: true,
      }),
      Animated.timing(this.state.animatedValue, {
        toValue: startValue,
        duration: this.props.scanBarAnimateTime,
        easing: Easing.linear,
        isInteraction: false,
        useNativeDriver: true,
      }),
    ]).start(() => this.scanBarMove())
    // } else {
    //   this.state.animatedValue.setValue(startValue); //重置Rotate动画值为0
    //   this.scanBarAnimation = Animated.timing(this.state.animatedValue, {
    //     toValue: endValue,
    //     duration: this.props.scanBarAnimateTime,
    //     easing: Easing.linear,
    //     isInteraction: false,
    //     useNativeDriver: true,
    //   }).start(() => this.scanBarMove());
    // }
  }

  //获取背景颜色
  getBackgroundColor = () => {
    return { backgroundColor: this.props.maskColor }
  }

  //获取扫描框背景大小
  getRectSize = () => {
    return {
      height: this.innerRectStyle.height,
      width: this.innerRectStyle.width,
    }
  }

  //获取扫描框偏移量
  getRectOffsetHeight = () => {
    return { height: this.innerRectStyle.marginBottom }
  }

  //获取扫描框边框大小
  getBorderStyle() {
    const { cornerOffsetSize } = this.props
    return {
      height: this.innerRectStyle.height - cornerOffsetSize * 2,
      width: this.innerRectStyle.width - cornerOffsetSize * 2,
      borderWidth: this.innerRectStyle.borderWidth,
      borderColor: this.innerRectStyle.borderColor,
    }
  }

  //获取扫描框转角的颜色
  getCornerStyle() {
    return {
      height: this.innerCornerStyle.height,
      width: this.innerCornerStyle.width,
      borderColor: this.innerCornerStyle.borderColor,
    }
  }

  getScanImageWidth() {
    return (
      this.innerRectStyle.width - this.innerScanBarStyle.marginHorizontal * 2
    )
  }

  // 获取扫描条图片的高度
  measureScanBarImage = e => {
    this.setState({ scanBarImageHeight: Math.round(e.layout.height) })
  }

  //绘制扫描线
  renderScanBar() {
    const { isShowScanBar, scanBarImage } = this.props

    if (!isShowScanBar) return
    return scanBarImage ? (
      <Image
        source={scanBarImage}
        style={[
          this.innerScanBarStyle,
          {
            resizeMode: 'contain',
            backgroundColor: 'transparent',
            width: this.getScanImageWidth(),
          },
        ]}
      />
    ) : (
      <View style={[{ height: 4 }, this.innerScanBarStyle]} />
    )
  }

  render() {
    const animatedStyle = {
      transform: [{ translateY: this.state.animatedValue }],
    }

    const { borderWidth } = this.innerCornerStyle
    const { isShowCorner } = this.props

    return (
      <View style={[styles.container, { bottom: 0 }]}>
        {/*扫描框上方遮罩*/}
        <View style={[this.getBackgroundColor(), { flex: 1 }]} />

        <View style={{ flexDirection: 'row' }}>
          {/*扫描框左侧遮罩*/}
          <View style={[this.getBackgroundColor(), { flex: 1 }]} />

          {/*扫描框*/}
          <View style={[styles.viewfinder, this.getRectSize()]}>
            {/*扫描框边线*/}
            <View style={this.getBorderStyle()}>
              <Animated.View style={[animatedStyle]}>
                {this.renderScanBar()}
              </Animated.View>
            </View>

            {/*/!*扫描框转角-左上角*!/*/}
            {isShowCorner && (
              <View
                style={[
                  this.getCornerStyle(),
                  styles.topLeftCorner,
                  { borderLeftWidth: borderWidth, borderTopWidth: borderWidth },
                ]}
              />
            )}

            {/*扫描框转角-右上角*/}
            {isShowCorner && (
              <View
                style={[
                  this.getCornerStyle(),
                  styles.topRightCorner,
                  {
                    borderRightWidth: borderWidth,
                    borderTopWidth: borderWidth,
                  },
                ]}
              />
            )}

            {/*扫描框转角-左下角*/}
            {isShowCorner && (
              <View
                style={[
                  this.getCornerStyle(),
                  styles.bottomLeftCorner,
                  {
                    borderLeftWidth: borderWidth,
                    borderBottomWidth: borderWidth,
                  },
                ]}
              />
            )}

            {/*扫描框转角-右下角*/}
            {isShowCorner && (
              <View
                style={[
                  this.getCornerStyle(),
                  styles.bottomRightCorner,
                  {
                    borderRightWidth: borderWidth,
                    borderBottomWidth: borderWidth,
                  },
                ]}
              />
            )}
          </View>

          {/*扫描框右侧遮罩*/}
          <View style={[this.getBackgroundColor(), { flex: 1 }]} />
        </View>

        {/*扫描框下方遮罩*/}
        {/* <View
          style={[this.getBackgroundColor(), {flex: 1, alignItems: 'center'}]}>
          <Text style={this.innerHintTextStyle} numberOfLines={1}>
            {this.props.hintText}
          </Text>
        </View> */}

        <View style={[this.getBackgroundColor(), this.getRectOffsetHeight()]} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  topContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  container: {
    height: 200,
    width: 200,
    borderRadius: 15,
  },
  viewfinder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  topLeftCorner: {
    position: 'absolute',
    top: -4,
    left: -4,
    borderTopLeftRadius: 15,
    zIndex: 9,
  },
  topRightCorner: {
    position: 'absolute',
    top: -4,
    right: -4,
    borderTopRightRadius: 15,
    zIndex: 9,
  },
  bottomLeftCorner: {
    position: 'absolute',
    bottom: -4,
    left: -4,
    borderBottomLeftRadius: 15,
    zIndex: 9,
  },
  bottomRightCorner: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    borderBottomRightRadius: 15,
    zIndex: 9,
  },
})
