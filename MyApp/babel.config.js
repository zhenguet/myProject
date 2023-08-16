const presets = ['module:metro-react-native-babel-preset']
const plugins = []

plugins.push(
  [
    'module-resolver',
    {
      root: ['./src'],
      extensions: ['.js', '.json'],
      alias: {
        '@': './src',
      },
    },
  ],
  [
    'react-native-reanimated/plugin',
    { globals: ['__scanQRCodes', '__decode'] },
  ],
)

module.exports = {
  presets,
  plugins,
}
