# JWKS Node

The **JWKS Node** for n8n enables you to fetch JSON Web Key Sets (JWKS) from a remote endpoint and verify JSON Web Tokens (JWTs) directly within your workflow. JWKS is a standard for representing cryptographic keys in a JSON structure, commonly used for JWT verification.

## Features

- Fetch JWKS from a URL
- Verify JWTs using the keys from the JWKS endpoint
- Cache keys for efficient repeated verification
- Integrate authentication and authorization into your n8n workflows

## Usage

1. **Add the JWKS Node** to your n8n workflow.
2. **Configure JWKS Credentials**: In the credentials section, enter the endpoint where your JWKS is hosted (e.g., `https://example.com/.well-known/jwks.json`).  
   You can also set additional verification options such as issuer, audience, subject, max token age, clock tolerance, and required claims in the credentials.  
   These options can be overridden per node execution.  
   See [JWKS Credentials](#jwks-credentials) for details.
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

The JWKS Node requires the following credentials to connect and verify JWTs:

- **URL**: The HTTPS endpoint where your JWKS (JSON Web Key Set) is hosted.  
  Example: `https://example.com/.well-known/jwks.json`
- **Issuer** (optional): The expected issuer (`iss`) of the JWT.  
  _Can be overridden in the node._
- **Audience** (optional): The expected audience (`aud`) for the JWT.  
  _Can be overridden in the node._
- **Subject** (optional): The expected subject (`sub`) of the JWT.  
  _Can be overridden in the node._
- **Max Token Age** (optional): The maximum age of the JWT.  
  _Can be overridden in the node._
  - In seconds when a number (e.g. `5`)
  - Resolved into a number of seconds when a string (e.g. `"5 seconds"`, `"10 minutes"`, `"2 hours"`)
- **Clock Tolerance** (optional): Allowed clock skew when verifying the JWT.  
  _Can be overridden in the node._
  - In seconds when a number (e.g. `5`)
  - Resolved into a number of seconds when a string (e.g. `"5 seconds"`, `"10 minutes"`, `"2 hours"`)
- **Required Claims** (optional): List of claims that must be present in the JWT payload.  
  _Can be overridden in the node._
  - **Default behavior:**
    - If the issuer option is set, then JWT `"iss"` (Issuer) claim must be present
    - If the audience option is set, then JWT `"aud"` (Audience) claim must be present
    - If the subject option is set, then JWT `"sub"` (Subject) claim must be present
    - If the maxTokenAge option is set, then JWT `"iat"` (Issued At) claim must be present

These fields are configured in the credentials UI when you add the JWKS Node to your n8n workflow.

## References

- [`jose` library documentation](https://github.com/panva/jose)

---
