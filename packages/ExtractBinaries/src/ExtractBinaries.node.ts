import { parseFileSize } from "@repo/utilities";
import { NodeConnectionType } from "n8n-workflow";

export class ExtractBinaries implements INodeType {
	description: INodeTypeDescription = {
		displayName: "Extract Binaries",
		name: "extractBinaries",
		icon: "file:ExtractBinaries.node.svg",
		group: ["input"],
		version: 1,
		description: "Extract binaries from a previous connecting node",
		defaults: {
			name: "Extract Binaries",
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main, NodeConnectionType.Main],
		outputNames: ["Accepted", "Rejected"],
		properties: [
			{
				displayName: "Output Binary Field",
				name: "binaryField",
				type: "string",
				default: "data",
				required: true,
				placeholder: "e.g., data",
				hint: "The name of the field that will contain the extracted binary data",
			},
			{
				displayName: "Options",
				name: "options",
				type: "collection",
				placeholder: "Add option",
				default: {},
				options: [
					{
						displayName: "Mime Types",
						name: "mimeTypes",
						type: "string",
						default: "",
						placeholder: "Add Mime Types (e.g., application/pdf, image/png)",
						description: "Comma-separated allowed MIME types. Leave empty to accept all.",
					},
					{
						displayName: "Maximum Size (Bytes)",
						name: "maxSize",
						type: "number",
						default: -1,
						description: "Max binary file size in bytes. Negative number for no limit.",
					},
					{
						displayName: "Include Binary Field",
						name: "includeBinaryField",
						type: "boolean",
						default: false,
						description: "Whether to include the original binary field name in the output.",
					},
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();

		const accepted: INodeExecutionData[] = [];
		const rejected: INodeExecutionData[] = [];

		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			const binary = items[itemIndex].binary;

			if (!binary) continue;

			const binaryField = this.getNodeParameter("binaryField", itemIndex) as string;
			const options = this.getNodeParameter("options", itemIndex) as IBinariesOptions;

			const { mimeTypes = "", maxSize = -1, includeBinaryField = false } = options;

			const mimes = mimeTypes
				.split(",")
				.map((type) => type.trim())
				.filter((type) => Boolean(type));

			for (const key in binary) {
				const binaryData = binary[key];
				const { data: _, ...metadata } = binaryData;
				const { mimeType, fileSize = "0" } = metadata;

				const outputData: INodeExecutionData = {
					binary: { [binaryField]: binaryData },
					json: { metadata },
					pairedItem: itemIndex,
				};

				if (includeBinaryField) {
					outputData.json.originalBinaryField = key;
				}

				const isMimeAllowed = mimes.length === 0 || mimes.includes(mimeType);
				const isSizeAllowed = maxSize <= 0 || parseFileSize(fileSize) <= maxSize;

				if (isMimeAllowed && isSizeAllowed) {
					accepted.push(outputData);
				} else {
					const filters: IBinariesRejection = {
						mime: !isMimeAllowed,
						size: !isSizeAllowed,
					};

					outputData.json.reason = ExtractBinaries.prototype.getRejectionReason(filters);

					rejected.push(outputData);
				}
			}
		}

		return [accepted, rejected];
	}

	private getRejectionReason(filters: IBinariesRejection): string {
		if (filters.mime) return "MIME type not allowed";

		if (filters.size) return "File size exceeds limit";

		return "Unknown rejection reason";
	}
}
