import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { SwitchBotClient } from "../client.js";
import type { DeviceRegistry } from "../device-registry.js";
import { formatSceneList, formatSceneResult } from "../format.js";
import { sanitize } from "../sanitize.js";

export function registerSceneTools(
	server: McpServer,
	client: SwitchBotClient,
	registry: DeviceRegistry,
) {
	server.registerTool(
		"list_scenes",
		{
			description:
				'List all SwitchBot scenes. Scenes are pre-configured automations that can control multiple devices at once. Example response: [{"name": "おやすみ"}, {"name": "おはよう"}]',
		},
		async () => {
			const scenes = await registry.listScenes();

			return {
				content: [
					{
						type: "text" as const,
						text: formatSceneList(scenes),
					},
				],
			};
		},
	);

	server.registerTool(
		"execute_scene",
		{
			description:
				'Execute a SwitchBot scene by name. Use list_scenes first to see available scenes. Example: execute_scene({ sceneName: "おやすみ" })',
			inputSchema: {
				sceneName: z
					.string()
					.describe("シーン名（list_scenes で確認した名前を使用）"),
			},
		},
		async (args) => {
			const sceneName = sanitize(args.sceneName);
			const scene = await registry.resolveScene(sceneName);
			await client.executeScene(scene.sceneId);

			return {
				content: [
					{
						type: "text" as const,
						text: formatSceneResult(scene.sceneName),
					},
				],
			};
		},
	);
}
