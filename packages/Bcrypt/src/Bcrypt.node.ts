import bcrypt from "bcrypt";
import type {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from "n8n-workflow";
import { NodeConnectionType } from "n8n-workflow";

export class Bcrypt implements INodeType {
  description: INodeTypeDescription = {
    displayName: "Bcrypt",
    name: "bcrypt",
    group: ["transform"],
    version: 1,
    description: "Bcrypt node for n8n",
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

    for (let i = 0; i < items.length; i++) {
      const action = this.getNodeParameter("action", i) as string;
      const plainText = this.getNodeParameter("plainText", i) as string;

      if (action === "hash") {
        const saltRounds = this.getNodeParameter("saltRounds", i) as number;
        const hash = await bcrypt.hash(plainText, saltRounds);

        outputData.push({
          json: { hash },
        });
      } else if (action === "compare") {
        const hashedText = this.getNodeParameter("hashedText", i) as string;
        const matches = await bcrypt.compare(plainText, hashedText);

        outputData.push({
          json: { matches },
        });
      }
    }

    return [outputData];
  }
}
