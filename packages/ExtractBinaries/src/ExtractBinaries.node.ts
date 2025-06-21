import type {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from "n8n-workflow";
import { NodeConnectionType } from "n8n-workflow";

export class ExtractBinaries implements INodeType {
  description: INodeTypeDescription = {
    displayName: "Extract Binaries",
    name: "extractBinaries",
    group: ["transform"],
    version: 1,
    description: "Extract binaries from a webhook",
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
            description:
              "Comma-separated list of allowed MIME types. If empty, all types are accepted.",
          },
          {
            displayName: "Maximum Size (Bytes)",
            name: "maxSize",
            type: "number",
            default: "",
            placeholder: "0 or negative for no limit",
            description:
              "Maximum size of the binary file in bytes. Set to 0 for no limit.",
          },
        ],
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();

    const accepted: INodeExecutionData[] = [];
    const rejected: INodeExecutionData[] = [];

    for (let i = 0; i < items.length; i++) {
      const binary = items[i].binary;

      if (!binary) continue;

      const binaryField = this.getNodeParameter("binaryField", i) as string;
      const options = this.getNodeParameter("options", i) as IOptions;
      const { mimeTypes = "", maxSize = -1 } = options;

      const mimes = mimeTypes
        .split(",")
        .map((type) => type.trim())
        .filter((type) => Boolean(type));

      for (const key in binary) {
        const binaryData = binary[key];
        const { data, ...metadata } = binaryData;
        const { mimeType, fileSize = "0" } = metadata;

        const outputData: INodeExecutionData = {
          binary: { [binaryField]: binaryData },
          json: { metadata, originalBinaryField: key },
        };

        const isMimeAllowed = mimes.length === 0 || mimes.includes(mimeType);
        const isSizeAllowed = maxSize <= 0 || parseInt(fileSize) <= maxSize;

        if (isMimeAllowed && isSizeAllowed) {
          accepted.push(outputData);
        } else {
          rejected.push(outputData);
        }
      }
    }

    return [accepted, rejected];
  }
}
