import bcrypt from "bcrypt";
import type { IExecuteFunctions, INodeExecutionData, INodeType, INodeTypeDescription } from "n8n-workflow";
import { NodeConnectionType, NodeOperationError } from "n8n-workflow";

export class Bcrypt implements INodeType {
	description: INodeTypeDescription = {
		displayName: "Bcrypt",
		name: "bcrypt",
		icon: "file:Bcrypt.node.svg",
		group: ["transform"],
		version: 1,
		description: "Bcrypt node for n8n",
		subtitle: `={{$parameter.action.charAt(0).toUpperCase() + $parameter.action.slice(1)}}`,
		defaults: {
			name: "Bcrypt",
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		properties: [
			{
				displayName: "Action",
				name: "action",
				type: "options",
				noDataExpression: true,
				default: "hash",
				options: [
					{
						name: "Hash",
						value: "hash",
						action: "Hash",
					},
					{
						name: "Compare",
						value: "compare",
						action: "Compare",
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
						action: ["hash"],
					},
				},
			},
			{
				displayName: "Plain Text",
				name: "plainText",
				type: "string",
				default: "",
			},
			{
				displayName: "Hashed Text",
				name: "hashedText",
				type: "string",
				default: "",
				displayOptions: {
					show: {
						action: ["compare"],
					},
				},
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const outputData: INodeExecutionData[] = [];

		const action = this.getNodeParameter("action", 0) as string;

		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			try {
				const plainText = this.getNodeParameter("plainText", itemIndex) as string;

				if (action === "hash") {
					const saltRounds = this.getNodeParameter("saltRounds", itemIndex) as number;
					const hash = await bcrypt.hash(plainText, saltRounds);

					outputData.push({
						json: { hash },
						pairedItem: itemIndex,
					});
				}

				if (action === "compare") {
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

        throw new NodeOperationError(this.getNode(), error, {
          itemIndex,
        });
			}
		}

		return [outputData];
	}
}
