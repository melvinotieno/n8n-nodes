export class Jwks implements ICredentialType {
	displayName = "JWKS Auth";

	name = "jwks";

	documentationUrl = `https://github.com/melvinotieno/n8n-nodes/tree/main/packages/Jwks/README.md#jwks-credentials`;

	properties: INodeProperties[] = [
		{
			displayName: "URL",
			name: "url",
			type: "string",
			required: true,
			validateType: "url",
			default: "",
			description: "The URL to the JWKS endpoint",
			placeholder: "https://example.com/.well-known/jwks.json",
		},
		{
			displayName: "Issuer",
			name: "issuer",
			type: "string",
			default: "",
			description: "The expected issuer of the JWT",
			placeholder: "https://example.com",
		},
		{
			displayName: "Audience",
			name: "audience",
			type: "string",
			default: "",
			description: "The expected recipient the JWT is intended for",
			placeholder: "https://example.com/api",
		},
		{
			displayName: "Subject",
			name: "subject",
			type: "string",
			default: "",
			description: "The expected subject of the JWT",
		},
		{
			displayName: "Max Token Age",
			name: "maxTokenAge",
			type: "string",
			default: "",
			description: "The maximum age of the token (e.g., '3600' for 1 hour)",
		},
	];
}
