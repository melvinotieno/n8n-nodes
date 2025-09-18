import type { Icon } from "n8n-workflow";

export class Jwks implements ICredentialType {
	displayName = "JWKS Auth";

	name = "jwks";

	icon: Icon = "file:Jwks.svg";

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
		},
		{
			displayName: "Audience",
			name: "audience",
			type: "string",
			default: "",
			description: "The expected recipient the JWT is intended for",
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
			description: "The maximum age of the token",
			hint: "Resolved into a number of seconds when a string (e.g. 5 seconds, 10 minutes, 2 hours)",
		},
		{
			displayName: "Clock Tolerance",
			name: "clockTolerance",
			type: "string",
			default: "",
			description: "The amount of clock skew allowed when verifying the JWT",
			hint: "Resolved into a number of seconds when a string (e.g. 5 seconds, 10 minutes, 2 hours)",
		},
		{
			displayName: "Required Claims",
			name: "requiredClaims",
			type: "multiOptions",
			description: "List of claims that must be present in the JWT payload",
			default: [],
			options: [
				{ name: "Issuer (iss)", value: "iss" },
				{ name: "Audience (aud)", value: "aud" },
				{ name: "Subject (sub)", value: "sub" },
				{ name: "Issued At (iat)", value: "iat" },
			],
		},
	];
}
