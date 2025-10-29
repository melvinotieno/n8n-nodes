import type { Icon } from "n8n-workflow";

export class Mercure implements ICredentialType {
	displayName = "Mercure";

	name = "mercure";

	icon: Icon = "file:Mercure.svg";

	documentationUrl = `https://github.com/melvinotieno/n8n-nodes/tree/main/packages/Mercure/README.md#mercure-credentials`;

	properties: INodeProperties[] = [
		{
			displayName: "Host",
			name: "host",
			type: "string",
			default: "https://localhost",
			required: true,
		},
		{
			displayName: "Publisher JWT Key",
			name: "pubJwtKey",
			type: "string",
			typeOptions: {
				password: true,
			},
			default: "",
			required: true,
		},
		{
			displayName: "Subscriber JWT Key",
			name: "subJwtKey",
			type: "string",
			typeOptions: {
				password: true,
			},
			default: "",
			required: true,
		},
	];
}
