import type {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from "n8n-workflow";
import { BINARY_ENCODING, NodeConnectionType } from "n8n-workflow";

const mimeTypeMap: Record<string, string> = {
  "application/pdf": "pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    "docx",
};

export class ExtractFromDocument implements INodeType {
  description: INodeTypeDescription = {
    displayName: "Extract from Document",
    name: "extractFromDocument",
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
            description:
              "Whether to merge text from all pages or return an array of text per page",
          },
          {
            displayName: "Max Pages",
            name: "maxPages",
            type: "number",
            default: 0,
            description: "Maximum number of pages to include",
          },
        ],
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const outputData: INodeExecutionData[] = [];

    for (let i = 0; i < items.length; i++) {
      const binaryField = this.getNodeParameter("binaryField", i) as string;
      const binaryData = this.helpers.assertBinaryData(i, binaryField);
      const options = this.getNodeParameter("options", i) as IOptions;

      const { mimeType } = binaryData;

      // Check if the mimeType is supported
      const resolvedFileType = mimeTypeMap[mimeType];
      if (!resolvedFileType) {
        throw new Error(
          `Unsupported file type: ${mimeType}. Supported types are: ${Object.values(mimeTypeMap).join(", ")}`
        );
      }

      let buffer: Buffer;
      if (binaryData.id) {
        const stream = await this.helpers.getBinaryStream(binaryData.id);
        buffer = await this.helpers.binaryToBuffer(stream);
      } else {
        buffer = Buffer.from(binaryData.data, BINARY_ENCODING);
      }

      const fn = (await import(`./extractors/${resolvedFileType}`)).default;
      const extract: IExtract = await fn(buffer, options);

      outputData.push({
        json: { ...extract },
        binary: { [binaryField]: binaryData },
      });
    }

    return [outputData];
  }
}
