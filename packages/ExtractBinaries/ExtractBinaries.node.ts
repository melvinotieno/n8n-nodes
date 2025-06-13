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
        displayName: "Mime Types",
        name: "mimeTypes",
        type: "string",
        default: "",
        placeholder: "Add Mime Types (e.g., application/pdf, image/png)",
      },
      {
        displayName: "Maximum Size (Bytes)",
        name: "maxSize",
        type: "number",
        default: "",
        placeholder: "0 for no limit",
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();

    const accepted: INodeExecutionData[] = [];
    const rejected: INodeExecutionData[] = [];

    for (let i = 0; i < items.length; i++) {
      const binary = items[i].binary;

      if (!binary) {
        continue;
      }

      const mimeTypes = this.getNodeParameter("mimeTypes", i, "") as string;
      const maxSize = this.getNodeParameter("maxSize", i, -1) as number;

      const mimes = mimeTypes
        .split(",")
        .map((type) => type.trim())
        .filter((type) => Boolean(type));

      for (const key in binary) {
        const file = binary[key];

        const { data, ...metadata } = file;
        const { mimeType, fileSize = "0" } = metadata;

        const outputData: INodeExecutionData = {
          binary: { file },
          json: { metadata },
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
