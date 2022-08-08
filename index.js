const https = require("node:https");
const core = require("@actions/core");
const jwt = require("jsonwebtoken");

const appId = core.getInput("APP_ID");
const privateKey = core.getInput("APP_PEM");
const installationId = core.getInput("APP_INSTALLATION_ID");
const inputTimeout = core.getInput("timeout");

// Set defaul input to 30 seconds
let timeout = 30000;

// Set the timeout value if an input was received
if (inputTimeout) {
  const value = Number(inputTimeout);

  if (value === NaN || value < 0) {
    return core.setFailed(
      "Timeout must be a number greater than or equal to 0"
    );
  }

  timeout = value * 1000;
}

const timeInSeconds = Math.floor(Date.now() / 1000);
const token = jwt.sign(
  {
    // issued at time, 60 seconds in the past to allow for clock drift
    iat: timeInSeconds - 60,
    // JWT expiration time (10 minute maximum)
    exp: timeInSeconds + 10 * 60,
    // GitHub App's identifier
    iss: appId,
  },
  privateKey,
  { algorithm: "RS256" }
);

const options = {
  method: 'POST',
  hostname: 'api.github.com',
  path: `/app/installations/${installationId}/access_tokens`,
  headers: {
    'User-Agent': 'Flutter-Tech/github-app-token v2',
    'Accept': 'application/vnd.github+json',
    'Authorization': `Bearer ${token}`
  }
};

const req = https.request(options, function (res) {
  const chunks = [];

  res.on("data", function (chunk) {
    chunks.push(chunk);
  });

  res.on("end", function (chunk) {
    const body = Buffer.concat(chunks);
    try {
      const {token} = JSON.parse(body.toString());
      core.setOutput("token", token);
    } catch (error) {
      core.setFailed(error);
    }
  });

  res.on("error", function (error) {
    core.setFailed(error);
  });
});

req.end();