#!/usr/bin/env python3

import time
import requests
import jwt
import os


class BearerAuth(requests.auth.AuthBase):
    def __init__(self, token):
        self.token = token

    def __call__(self, r):
        r.headers["authorization"] = f"Bearer {self.token}"
        return r


if __name__ == "__main__":

    # Deprecation notice
    print(
        "::warning::The 'github-app-token' action is being deprecated. We encourage you to update your workflows to use the official GitHub action, 'create-github-app-token'. This change will ensure continued support and access to the latest features. For detailed instructions and more information, please visit: https://github.com/actions/create-github-app-token. Thank you for your understanding and cooperation!"
    )

    app_id = os.environ.get("INPUT_APP_ID")
    app_installation_id = os.environ.get("INPUT_APP_INSTALLATION_ID")
    app_key = os.environ.get("INPUT_APP_PEM")

    time_since_epoch_in_seconds = int(time.time())
    payload = {
        # issued at time
        "iat": time_since_epoch_in_seconds,
        # JWT expiration time (10 minute maximum)
        "exp": time_since_epoch_in_seconds + (10 * 60) - 10,
        # GitHub App's identifier
        "iss": app_id,
    }

    encoded_jwt = jwt.encode(payload, app_key, algorithm="RS256")

    call_headers = {"Accept": "application/vnd.github.machine-man-preview+json"}

    get_installation_token_url = (
        f"https://api.github.com/app/installations/{app_installation_id}/access_tokens"
    )
    get_installation_token_response = requests.post(
        get_installation_token_url,
        headers=call_headers,
        auth=BearerAuth(encoded_jwt),
    )

    token = get_installation_token_response.json()["token"]

    print(f"::add-mask::{token}")
    print(f"::set-output name=app_token::{token}")
