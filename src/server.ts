import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { SwitchBotClient } from "./client.js";
import { DeviceRegistry } from "./device-registry.js";
import { registerStatusResources } from "./resources/status.js";
import { registerDeviceTools } from "./tools/devices.js";
import { registerSceneTools } from "./tools/scenes.js";

export function createMcpServer(client: SwitchBotClient): McpServer {
	const server = new McpServer({
		name: "ruru-swbot-mcp",
		version: "1.1.3",
	});

	const registry = new DeviceRegistry(client);

	// Tools
	registerDeviceTools(server, client, registry);
	registerSceneTools(server, client, registry);

	// Resources
	registerStatusResources(server, registry);

	return server;
}
