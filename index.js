const core = require('@actions/core');
const { createAppAuth } = require("@octokit/auth-app");
const { request } = require("@octokit/request");

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
  installationId: core.getInput('APP_INSTALLATION_ID'),
  // https://github.com/octokit/request.js#request
  request: request.defaults({
    request: {
      timeout
    }
  })
});

auth({
  type: "app"
}).then((res, err) => {
  if (err) return core.setFailed(err.message);
  console.log(Buffer.from(res.token).toString('base64'))
  return core.setOutput("app_token", res.token);
})
