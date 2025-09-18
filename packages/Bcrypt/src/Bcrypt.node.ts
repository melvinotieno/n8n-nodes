import bcrypt from "bcrypt";
import { NodeConnectionType, NodeOperationError } from "n8n-workflow";

export class Bcrypt implements INodeType {
	description: INodeTypeDescription = {
		displayName: "Bcrypt",
		name: "bcrypt",
		icon: "file:Bcrypt.node.svg",
		group: ["transform"],
		version: 1,
		description: "Password hashing and comparison using bcrypt",
		subtitle: `={{$parameter.operation.charAt(0).toUpperCase() + $parameter.operation.slice(1)}}`,
		defaults: {
			name: "Bcrypt",
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		properties: [
			{
				displayName: "Operation",
				name: "operation",
				type: "options",
				noDataExpression: true,
				default: "hash",
				options: [
					{
						name: "Hash",
						value: "hash",
					},
					{
						name: "Compare",
						value: "compare",
					},
				],
			},
			{
				displayName: "Salt Rounds",
				name: "saltRounds",
				type: "number",
				default: 10,
				displayOptions: {
					show: {
						operation: ["hash"],
					},
				},
			},
			{
				displayName: "Plain Text",
				name: "plainText",
				type: "string",
				required: true,
				default: "",
			},
			{
				displayName: "Hashed Text",
				name: "hashedText",
				type: "string",
				required: true,
				default: "",
				displayOptions: {
					show: {
						operation: ["compare"],
					},
				},
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const outputData: INodeExecutionData[] = [];

		const operation = this.getNodeParameter("operation", 0);

		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			try {
				const plainText = this.getNodeParameter("plainText", itemIndex) as string;

				if (operation === "hash") {
					const saltRounds = this.getNodeParameter("saltRounds", itemIndex) as number;
					const hash = await bcrypt.hash(plainText, saltRounds);

					outputData.push({
						json: { hash },
						pairedItem: itemIndex,
					});
				}

				if (operation === "compare") {
					const hashedText = this.getNodeParameter("hashedText", itemIndex) as string;
					const matches = await bcrypt.compare(plainText, hashedText);

					outputData.push({
						json: { matches },
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
