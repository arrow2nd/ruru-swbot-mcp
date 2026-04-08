import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { DeviceRegistry } from "../device-registry.js";
import { formatDeviceStatuses } from "../format.js";

export function registerStatusResources(
	server: McpServer,
	registry: DeviceRegistry,
): void {
	server.registerResource(
		"device_statuses",
		"switchbot://devices/status",
		{
			description:
				"All physical SwitchBot device statuses including temperature, humidity, power state, etc.",
			mimeType: "text/yaml",
		},
		async (uri) => {
			try {
				const devices = await registry.listDeviceStatuses();

				return {
					contents: [
						{
							uri: uri.href,
							mimeType: "text/yaml",
							text: formatDeviceStatuses(devices),
						},
					],
				};
			} catch (error) {
				const message =
					error instanceof Error
						? error.message
						: "SwitchBot API との通信に失敗しました";
				return {
					contents: [{ uri: uri.href, mimeType: "text/plain", text: message }],
				};
			}
		},
	);
}
