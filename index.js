const https = require("node:https");
const core = require("@actions/core");
const jwt = require("jsonwebtoken");

const appId = core.getInput("APP_ID");
const privateKey = core.getInput("APP_PEM");
const installationId = core.getInput("APP_INSTALLATION_ID");
const inputTimeout = core.getInput('timeout');

// Set defaul input to 30 seconds
let timeout = 30000;

// Set the timeout value if an input was received
if (inputTimeout) {
  const value = Number(inputTimeout)

  if (value === NaN || value < 0) {
    return core.setFailed("Timeout must be a number greater than or equal to 0");
  }

  timeout = value * 1000;
}

const request = (options) =>
  new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      if (res.statusCode !== 201)
        return reject(
          new Error(
            `HTTP response status: ${res.statusCode} (${res.statusMessage})`
          )
        );

      let body = "";

      res
        .on("data", (chunk) => {
          body += chunk;
        })
        .on("end", () => {
          try {
            const data = JSON.parse(body);
            resolve(data);
          } catch (error) {
            reject(error);
          }
        });
    });

    req.on("error", (e) => {
      reject(e);
    });
    req.end();
  });

const timeInSeconds = Math.floor(Date.now() / 1000);
const token = jwt.sign(
  {
    // issued at time, 60 seconds in the past to allow for clock drift
    iat: timeInSeconds - 60,
    // JWT expiration time (10 minute maximum)
    exp: timeInSeconds + ( 10 * 60 ),
    // GitHub App's identifier
    iss: appId,
  },
  privateKey,
  { algorithm: "RS256" }
);

const options = {
  method: "POST",
  hostname: "api.github.com",
  port: 443,
  path: `/app/installations/${installationId}/access_tokens`,
  headers: {
    Accept: "application/vnd.github+json",
    Authorization: "token " + token,
  },
  timeout
};

const req = request(options).then((res, err) => {
  if (err) return core.setFailed(err.message);
  return core.setOutput("app_token", res.token);
});