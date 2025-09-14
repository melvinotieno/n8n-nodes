declare global {
	type IExecuteFunctions = import("n8n-workflow").IExecuteFunctions;

	type INodeExecutionData = import("n8n-workflow").INodeExecutionData;

	type INodeType = import("n8n-workflow").INodeType;

	type INodeTypeDescription = import("n8n-workflow").INodeTypeDescription;
}

export {};
