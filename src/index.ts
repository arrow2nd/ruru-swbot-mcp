import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { SwitchBotClient } from "./client.js";
import { createMcpServer } from "./server.js";

const token = process.env.SWITCHBOT_TOKEN;
const secret = process.env.SWITCHBOT_SECRET;

if (!token || !secret) {
	console.error(
		"Missing required environment variables: SWITCHBOT_TOKEN, SWITCHBOT_SECRET",
	);
	process.exit(1);
}

const client = new SwitchBotClient(token, secret);
const mcpServer = createMcpServer(client);

const transport = new StdioServerTransport();
await mcpServer.connect(transport);
