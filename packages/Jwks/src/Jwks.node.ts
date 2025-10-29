import { createRemoteJWKSet, type JWTVerifyOptions, jwtVerify } from "jose";
import { NodeConnectionType, NodeOperationError } from "n8n-workflow";

const prettifyOperation = (operation: string) => {
	if (operation === "verify") {
		return "Verify a JWT";
	}

	return operation;
};

export class Jwks implements INodeType {
	description: INodeTypeDescription = {
		displayName: "JWKS",
		name: "jwks",
		icon: "file:Jwks.svg",
		group: ["transform"],
		version: 1,
		description: "JWKS",
		subtitle: `={{(${prettifyOperation})($parameter.operation)}}`,
		defaults: {
			name: "JWKS",
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: "jwks",
				required: true,
			},
		],
		properties: [
			{
				displayName: "Operation",
				name: "operation",
				type: "options",
				noDataExpression: true,
				default: "verify",
				options: [
					{
						name: "Verify",
						value: "verify",
						action: "Verify a JWT",
					},
				],
			},
			{
				displayName: "Token",
				name: "token",
				type: "string",
				typeOptions: { password: true },
				required: true,
				validateType: "jwt",
				default: "",
				description: "The token to verify",
			},
			{
				displayName: "Payload Claims",
				name: "claims",
				type: "collection",
				description: "The expected claims in the JWT payload (overrides credentials)",
				placeholder: "Add Claim",
				default: {},
				options: [
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
					},
				],
			},
			{
				displayName: "Options",
				name: "options",
				type: "collection",
				description: "Additional options to be used by the node",
				placeholder: "Add Option",
				default: {},
				options: [
					{
						displayName: "Clock Tolerance",
						name: "clockTolerance",
						type: "string",
						default: "",
						description: "The amount of clock skew allowed when verifying the JWT",
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
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const outputData: INodeExecutionData[] = [];

		const operation = this.getNodeParameter("operation", 0);
		const credentials = await this.getCredentials<IJwksCredentials>("jwks");

		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			try {
				if (operation === "verify") {
					const token = this.getNodeParameter("token", itemIndex) as string;
					const claims = this.getNodeParameter("claims", itemIndex, {}) as IJwksClaims;
					const options = this.getNodeParameter("options", itemIndex, {}) as IJwksOptions;

					if (!token) {
						throw new NodeOperationError(this.getNode(), "The JWT token was not provided", {
							itemIndex,
							description: "A valid JWT token must be added to the 'Token' parameter",
						});
					}

					const JWKS = createRemoteJWKSet(new URL(credentials.url));

					const verifyOptions: JWTVerifyOptions = {
						issuer: claims.issuer || credentials.issuer || undefined,
						audience: claims.audience || credentials.audience || undefined,
						subject: claims.subject || credentials.subject || undefined,
						maxTokenAge: claims.maxTokenAge || credentials.maxTokenAge || undefined,
						clockTolerance: options.clockTolerance || credentials.clockTolerance || undefined,
						requiredClaims: options.requiredClaims || credentials.requiredClaims || undefined,
					};

					const { payload } = await jwtVerify(token, JWKS, verifyOptions);

					outputData.push({
						json: { payload },
						pairedItem: itemIndex,
					});
				}
			} catch (error) {
				if (this.continueOnFail()) {
					outputData.push({
						json: this.getInputData(itemIndex)[0].json,
						error,
						pairedItem: itemIndex,
					});

					continue;
				}

				if (error.context) {
					error.context.itemIndex = itemIndex;
					throw error;
				}

				throw new NodeOperationError(this.getNode(), error, { itemIndex });
			}
		}

		return [outputData];
	}
}
