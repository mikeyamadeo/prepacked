const { keys } = Object

/**
 * Throws error if required settings aren't provided
 */
export const checkRequired = (settingsReceived, settingsRequired) => {
  let missingSettings = {}

  keys(settingsRequired).forEach((prop) => {
    if (!settingsReceived.hasOwnProperty(prop)) {
      missingSettings[prop] = settingsRequired[prop]
    }
  })

  if (!settingsReceived || keys(missingSettings).length) {
    throw new Error(generateError(missingSettings))
  }
}

function generateError (missingSettings) {
  return `The following required settings are missing:
    ${keys(missingSettings).map(key =>
      `- ${key}: ${missingSettings[key]}\n`
    )}
  `
}

export const withDefaults = ({
  resolves = [],
  featureFlags = {},
  ...rest
}) => ({
  resolves,
  featureFlags,
  ...rest
})
