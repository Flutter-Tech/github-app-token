const core = require('@actions/core');
const { createAppAuth } = require("@octokit/auth-app");

// Set defaul input to 30 seconds
let timeout = 30000;

// Set the timeout value if an input was received
const inputTimeout = core.getInput('timeout');
if (inputTimeout) {
  const value = Number(inputTimeout)

  if (value === NaN || value < 0) {
    return core.setFailed("Timeout must be a number greater than or equal to 0");
  }

  timeout = value * 1000;
}

const auth = new createAppAuth({
  appId: core.getInput('APP_ID'),
  privateKey: core.getInput('APP_PEM'),
  installationId: core.getInput('APP_INSTALLATION_ID')
});

const promises = [];

// Setup timeout promise if the time value is greater than 0
if (timeout > 0) {
  const timeoutPromise = new Promise((resolve, reject) => setTimeout(()=>{reject(new Error("Timeout reached"))}, timeout));
  promises.push(timeoutPromise);
}

// Create auth promise
promises.push(auth({
  type: "app"
}))

// Race timeout and auth promises
Promise.race(promises).then((res, err) => {
  if (err) return core.setFailed(err.message);

  return core.setOutput("app_token", res.token);
});
