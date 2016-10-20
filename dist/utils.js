'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var keys = Object.keys;

/**
 * Throws error if required settings aren't provided
 */
var checkRequired = function checkRequired(settingsReceived, settingsRequired) {
  var missingSettings = {};

  keys(settingsRequired).forEach(function (prop) {
    if (!settingsReceived.hasOwnProperty(prop)) {
      missingSettings[prop] = settingsRequired[prop];
    }
  });

  if (!settingsReceived || keys(missingSettings).length) {
    throw new Error(generateError(missingSettings));
  }
};

exports.checkRequired = checkRequired;
function generateError(missingSettings) {
  return 'The following required settings are missing:\n    ' + keys(missingSettings).map(function (key) {
    return '- ' + key + ': ' + missingSettings[key] + '\n';
  }) + '\n  ';
}

var withDefaults = function withDefaults(_ref) {
  var _ref$resolves = _ref.resolves;
  var resolves = _ref$resolves === undefined ? [] : _ref$resolves;
  var _ref$featureFlags = _ref.featureFlags;
  var featureFlags = _ref$featureFlags === undefined ? {} : _ref$featureFlags;
  var _ref$devServer = _ref.devServer;
  var devServer = _ref$devServer === undefined ? {} : _ref$devServer;

  var rest = _objectWithoutProperties(_ref, ['resolves', 'featureFlags', 'devServer']);

  return _extends({
    resolves: resolves,
    featureFlags: featureFlags,
    devServer: _extends({
      host: 'localhost',
      port: '8080'
    }, devServer)
  }, rest);
};
exports.withDefaults = withDefaults;