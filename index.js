const core = require('@actions/core');
const github = require('@actions/github');
const { createAppAuth } = require("@octokit/auth-app");


const auth = new createAppAuth({
  appId: core.getInput('APP_ID'),
  privateKey: core.getInput('APP_PEM'),
  installationId: core.getInput('APP_INSTALLATION_ID')
});

auth.then((res, err) => {
  if (err) return core.setFailed(err.message);
  console.log(res);
  return core.setOutput("app_token", res.token);
});
