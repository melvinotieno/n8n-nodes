declare global {
	type IAuthenticateGeneric = import("n8n-workflow").IAuthenticateGeneric;

	type ICredentialTestRequest = import("n8n-workflow").ICredentialTestRequest;

	type ICredentialType = import("n8n-workflow").ICredentialType;

	type IDataObject = import("n8n-workflow").IDataObject;

	type IExecuteFunctions = import("n8n-workflow").IExecuteFunctions;

	type INodeExecutionData = import("n8n-workflow").INodeExecutionData;

	type INodeProperties = import("n8n-workflow").INodeProperties;

	type INodeType = import("n8n-workflow").INodeType;

	type INodeTypeDescription = import("n8n-workflow").INodeTypeDescription;

	interface IJwksClaims {
		issuer?: string;
		audience?: string;
		subject?: string;
		maxTokenAge?: number | string;
	}

	interface IJwksOptions {
		clockTolerance?: number;
		requiredClaims?: string[];
	}

	interface IJwksCredentials extends IJwksClaims, IJwksOptions {
		url: string;
	}
}

export {};
