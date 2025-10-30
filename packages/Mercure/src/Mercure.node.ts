import { NodeOperationError } from "n8n-workflow";
import { generatePublisherToken, generateSubscriberToken } from "./utilities/token";
import { getTopics } from "./utilities/topics";

export class Mercure implements INodeType {
	description: INodeTypeDescription = {
		displayName: "Mercure",
		name: "mercure",
		icon: "file:Mercure.svg",
		group: ["transform"],
		version: 1,
		description: "Consume Mercure APIs",
		subtitle: `={{$parameter.operation.charAt(0).toUpperCase() + $parameter.operation.slice(1)}}`,
		defaults: {
			name: "Mercure",
		},
		inputs: ["main"],
		outputs: ["main"],
		credentials: [
			{
				name: "mercure",
				required: true,
			},
		],
		properties: [
			{
				displayName: "Operation",
				name: "operation",
				type: "options",
				noDataExpression: true,
				default: "publish",
				options: [
					{
						name: "Subscriber",
						value: "subscriber",
						description: "Get subscriber details",
					},
					{
						name: "Publish",
						value: "publish",
						description: "Publish a message",
					},
				],
			},
			{
				displayName: "Topics",
				name: "topics",
				type: "string",
				default: "*",
				required: true,
				hint: "Comma separated list of topics",
			},
			{
				displayName: "Message",
				name: "message",
				type: "string",
				default: "",
				description: "The message to publish",
				displayOptions: {
					show: {
						operation: ["publish"],
					},
				},
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const outputData: INodeExecutionData[] = [];

		const operation = this.getNodeParameter("operation", 0);
		const credentials = await this.getCredentials<IMercureCredentials>("mercure");

		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			try {
				const hubUrl = `${credentials.host}/.well-known/mercure`;
				const topicsData = this.getNodeParameter("topics", itemIndex) as string;
				const topics = getTopics(topicsData);

				if (operation === "subscriber") {
					const subToken = generateSubscriberToken({
						jwtKey: credentials.subJwtKey,
						topics,
					});

					outputData.push({
						json: {
							url: hubUrl,
							token: subToken,
							topics,
						},
						pairedItem: itemIndex,
					});
				}

				if (operation === "publish") {
					const pubToken = generatePublisherToken({
						jwtKey: credentials.pubJwtKey,
						topics,
					});

					const message = this.getNodeParameter("message", itemIndex) as string;

					const params = new URLSearchParams({ data: message });

					for (const topic of topics) {
						params.append("topic", topic);
					}

					const requestOptions: IHttpRequestOptions = {
						url: `${hubUrl}`,
						method: "POST",
						headers: {
							"Content-Type": "application/x-www-form-urlencoded",
							Authorization: `Bearer ${pubToken}`,
						},
						body: params.toString(),
					};

					const response = await this.helpers.httpRequest(requestOptions);

					outputData.push({
						json: { id: response },
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

				throw new NodeOperationError(this.getNode(), error, { itemIndex });
			}
		}

		return [outputData];
	}
}
