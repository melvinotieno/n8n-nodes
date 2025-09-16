declare global {
	type IAuthenticateGeneric = import("n8n-workflow").IAuthenticateGeneric;

	type ICredentialTestRequest = import("n8n-workflow").ICredentialTestRequest;

	type ICredentialType = import("n8n-workflow").ICredentialType;

	type IExecuteFunctions = import("n8n-workflow").IExecuteFunctions;

	type INodeExecutionData = import("n8n-workflow").INodeExecutionData;

	type INodeProperties = import("n8n-workflow").INodeProperties;

	type INodeType = import("n8n-workflow").INodeType;

	type INodeTypeDescription = import("n8n-workflow").INodeTypeDescription;

	interface IDocumentOptions {
		mergePages?: boolean;
		maxPages?: number;
		password?: string;
		keepSource?: "json" | "binary" | "both";
	}

	interface IDocumentExtract {
		text: string | string[];
		numpages: number;
		version?: string;
		info?: Record<string, unknown>;
		metadata?: Record<string, unknown>;
	}
}

export {};
