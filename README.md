# Custom n8n Nodes Monorepo

This repository contains a collection of custom nodes for [n8n](https://n8n.io/), an extendable workflow automation tool. Each package in this monorepo provides a specific node or utility to enhance your n8n workflows, such as binary extraction, password hashing, and more.

## Structure

- Each node is organized as a separate package under the `packages/` directory.
- Shared config and utility code are located in the `support/` directory.
- Each package contains its own source code, documentation, and configuration files.

## Node Codex Categories

When configuring a node for n8n, you may specify one or more categories in your node's configuration JSON. This ensures your node appears in the correct section of the n8n nodes panel.

**Allowed categories:**

- Data & Storage
- Finance & Accounting
- Marketing & Content
- Productivity
- Miscellaneous
- Sales
- Development
- Analytics
- Communication
- Utility

You must match the syntax exactly (e.g., `Data & Storage`, not `data and storage`).

See the [n8n documentation on node codex categories](https://docs.n8n.io/integrations/creating-nodes/build/reference/node-codex-files/#node-categories) for more details.

## Contributing

Contributions are welcome! Please open issues or pull requests for bug fixes, improvements, or new nodes.

---
