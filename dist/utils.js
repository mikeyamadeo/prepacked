"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
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
  return "The following required settings are missing:\n    " + keys(missingSettings).map(function (key) {
    return "- " + key + ": " + missingSettings[key] + "\n";
  }) + "\n  ";
}

var withDefaults = function withDefaults(_ref) {
  var isDev = _ref.isDev;
  var src = _ref.src;
  var out = _ref.out;
  var styleSrc = _ref.styleSrc;
  var _ref$resolves = _ref.resolves;
  var resolves = _ref$resolves === undefined ? [] : _ref$resolves;
  var html = _ref.html;
  var devServer = _ref.devServer;
  return {
    isDev: isDev,
    src: src,
    out: out,
    styleSrc: styleSrc,
    resolves: resolves,
    html: html,
    devServer: devServer
  };
};
exports.withDefaults = withDefaults;