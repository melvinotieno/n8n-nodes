import unset from "lodash.unset";
import { BINARY_ENCODING, deepCopy, NodeConnectionType, NodeOperationError } from "n8n-workflow";

export class ExtractFromDocument implements INodeType {
	description: INodeTypeDescription = {
		displayName: "Extract from Document",
		name: "extractFromDocument",
		icon: "file:ExtractFromDocument.node.svg",
		group: ["input"],
		version: 1,
		description: "Extract text from a document",
		defaults: {
			name: "Extract from Document",
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		properties: [
			{
				displayName: "Input Binary Field",
				name: "binaryField",
				type: "string",
				default: "data",
				required: true,
				placeholder: "e.g., data",
				hint: "The name of the binary field containing the document file to be extracted",
			},
			{
				displayName: "Options",
				name: "options",
				type: "collection",
				placeholder: "Add option",
				default: {},
				options: [
					{
						displayName: "Merge Pages",
						name: "mergePages",
						type: "boolean",
						default: true,
						description: "Whether to merge text from all pages or return an array of text per page",
					},
					{
						displayName: "Max Pages",
						name: "maxPages",
						type: "number",
						default: -1,
						description: "Maximum number of pages to include",
					},
					{
						displayName: "Password",
						name: "password",
						type: "string",
						typeOptions: {
							password: true,
						},
						default: "",
						description: "Password to open the document if it is password-protected (PDF only)",
					},
					{
						displayName: "Keep Source",
						name: "keepSource",
						type: "options",
						default: "json",
						options: [
							{
								name: "JSON",
								value: "json",
								description: "Include JSON data of the input item",
							},
							{
								name: "Binary",
								value: "binary",
								description: "Include binary data of the input item",
							},
							{
								name: "Both",
								value: "both",
								description: "Include both JSON and binary data of the input item",
							},
						],
					},
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const outputData: INodeExecutionData[] = [];

		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			try {
				const binaryField = this.getNodeParameter("binaryField", itemIndex) as string;
				const options = this.getNodeParameter("options", itemIndex) as IDocumentOptions;
				const binaryData = this.helpers.assertBinaryData(itemIndex, binaryField);
				const resolvedMimeType = ExtractFromDocument.prototype.resolveMimeType(binaryData.mimeType);

				let buffer: Buffer;
				if (binaryData.id) {
					const stream = await this.helpers.getBinaryStream(binaryData.id);
					buffer = await this.helpers.binaryToBuffer(stream);
				} else {
					buffer = Buffer.from(binaryData.data, BINARY_ENCODING);
				}

				const fn = (await import(`./extractors/${resolvedMimeType}`)).default;
				const extract: IDocumentExtract = await fn(buffer, options);

				const outputItem: INodeExecutionData = {
					json: {},
					pairedItem: itemIndex,
				};

				const item = items[itemIndex];
				const { keepSource = "json" } = options;

				if (keepSource !== "binary") {
					outputItem.json = { ...deepCopy(item.json), ...extract };
				} else {
					outputItem.json = { ...extract };
				}

				if (keepSource === "binary" || keepSource === "both") {
					outputItem.binary = item.binary;
				} else {
					// copy other binary data but exclude the processed binary data
					outputItem.binary = deepCopy(item.binary);
					unset(outputItem.binary, binaryField);
				}

				outputData.push(outputItem);
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

	private resolveMimeType(mimeType: string): string {
		const mimeTypeMap: Record<string, string> = {
			"application/pdf": "pdf",
			"application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
		};

		const resolvedMimeType = mimeTypeMap[mimeType];

		if (!resolvedMimeType) {
			throw new Error(
				`Unsupported file type: ${mimeType}. Supported types are: ${Object.keys(mimeTypeMap).join(", ")}`,
			);
		}

		return resolvedMimeType;
	}
}
