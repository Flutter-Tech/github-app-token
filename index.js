const core = require('@actions/core');
const github = require('@actions/github');
const { App } = require("@octokit/app");

try {
  const app = new App({
    appId: core.getInput('APP_ID'),
    privateKey: core.getInput('APP_PEM'),
  });

  app.getInstallationOctokit(core.getInput('APP_INSTALLATION_ID')).then((res, err)=>{
    if(err) return core.setFailed(err.message);
    console.log(res);
    return core.setOutput("app_token", "textoqq");
  });

  
} catch (error) {
  core.setFailed(error.message);
}

/* try {
  // `who-to-greet` input defined in action metadata file
  const nameToGreet = core.getInput('who-to-greet');
  console.log(`Hello ${nameToGreet}!`);
  const time = (new Date()).toTimeString();
  core.setOutput("time", time);
  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context.payload, undefined, 2)
  console.log(`The event payload: ${payload}`);
} catch (error) {
  core.setFailed(error.message);
} */