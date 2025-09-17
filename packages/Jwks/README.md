# JWKS Node

The **JWKS Node** for n8n enables you to fetch JSON Web Key Sets (JWKS) from a remote endpoint and verify JSON Web Tokens (JWTs) directly within your workflow. JWKS is a standard for representing cryptographic keys in a JSON structure, commonly used for JWT verification.

## Features

- Fetch JWKS from a URL
- Verify JWTs using the keys from the JWKS endpoint
- Cache keys for efficient repeated verification
- Integrate authentication and authorization into your n8n workflows

## Usage

1. **Add the JWKS Node** to your n8n workflow.
2. **Configure the JWKS URL**: Enter the endpoint where your JWKS is hosted (e.g., `https://example.com/.well-known/jwks.json`).
3. **Provide the JWT**: Supply the JWT you want to verify as an input to the node.
4. **Receive verification results**: The node outputs the decoded JWT payload if verification succeeds.

## Example Output

```json
{
  "verified": true,
  "payload": {
    "sub": "user123",
    "exp": 1712345678,
    "iat": 1712341678
  }
}
```

# JWKS Credentials
