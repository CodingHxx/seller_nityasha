const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Add explicit serializer configuration
config.serializer = {
  ...config.serializer,
  sourceMapString: require('metro/src/DeltaBundler/Serializers/sourceMapString').default
};

module.exports = withNativeWind(config, { input: "./global.css" });