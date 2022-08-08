# Github App Token docker action

This action retrieves a token for a GitHub app according to its ID, installation ID and private key.

## Inputs

| Input               	| Description                                    	 |
| --------------------- | ------------------------------------------------ |
| `APP_PEM`.          	| **Required** The app's private key in pem format |
| `APP_ID`            	| **Required** The app's ID                        |
| `APP_INSTALLATION_ID` | **Required** The app's installation ID  	       |
| `timeout`           	| Request timeout in seconds (default: 30)  	     |

## Outputs

## `app_token`

The token for the Github app.

## Example usage

It is possible to use this action by simply adding it as one of the step in your workflow, like demonstrate in the example below.

```
- name: Step
  uses: Flutter-Tech/github-app-token@v1
  with:
    APP_PEM: ${{ APP_PEM }}
    APP_ID: ${{ APP_ID }}
    APP_INSTALLATION_ID: ${{ APP_INSTALLATION_ID }}
```