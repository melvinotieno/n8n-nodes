# Mercure Node

## Overview

The Mercure node provides integration with a Mercure hub to publish real-time updates (and to configure subscription parameters when used as a trigger). It helps n8n workflows send events to Mercure topics using the Mercure protocol.

## Features

- Publish messages/events to one or more Mercure topics.
- Reusable credentials to store hub URL and authentication (JWT).

## Usage

1. Add the Mercure node to your n8n workflow.
2. Configure the node with your Mercure credentials.
3. Select the desired operation (e.g., Subscriber or Publish).
4. Provide necessary parameters such as topics, and message where required.

### Subscriber

This operation is used to get subscriber details for Mercure topics. These include: mercure hub url, topics to subscribe to, and a generated JWT token for subscription.

### Publish

This operation allows you to send messages to specified Mercure topics. You can define the topics and message content.

# Mercure Credentials

Create a Mercure credential in n8n to reuse across workflows. Required fields:

- Hub URL: The base URL to your Mercure hub (for example `https://example.com/`).
- Publisher JWT Key: The JWT key used to sign publisher tokens.
- Subscriber JWT Key: The JWT key used to sign subscriber tokens.

## Resources

- [Mercure Official Documentation](https://mercure.rocks/docs)
