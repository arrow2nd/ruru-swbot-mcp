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

if (process.argv.includes("--http")) {
	const { StreamableHTTPTransport } = await import("@hono/mcp");
	const { serve } = await import("@hono/node-server");
	const { Hono } = await import("hono");

	const port = process.env.PORT ? Number(process.env.PORT) : 0;

	const transport = new StreamableHTTPTransport();
	await mcpServer.connect(transport);

	const app = new Hono();
	app.all("/mcp", (c) => transport.handleRequest(c));
	app.get("/health", (c) => c.json({ status: "ok" }));

	serve({ fetch: app.fetch, port }, (info) => {
		console.error(
			`ruru-swbot-mcp server running on http://localhost:${info.port}`,
		);
		console.error(`MCP endpoint: http://localhost:${info.port}/mcp`);
	});
} else {
	const transport = new StdioServerTransport();
	await mcpServer.connect(transport);
}
