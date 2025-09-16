declare global {
	type IAuthenticateGeneric = import("n8n-workflow").IAuthenticateGeneric;

	type ICredentialTestRequest = import("n8n-workflow").ICredentialTestRequest;

	type ICredentialType = import("n8n-workflow").ICredentialType;

	type IExecuteFunctions = import("n8n-workflow").IExecuteFunctions;

	type INodeExecutionData = import("n8n-workflow").INodeExecutionData;

	type INodeProperties = import("n8n-workflow").INodeProperties;

	type INodeType = import("n8n-workflow").INodeType;

	type INodeTypeDescription = import("n8n-workflow").INodeTypeDescription;

	interface IBinariesOptions {
		mimeTypes?: string;
		maxSize?: number;
		includeBinaryField?: boolean;
	}

	interface IBinariesRejection {
		mime: boolean;
		size: boolean;
	}
}

export {};
