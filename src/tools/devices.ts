import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { SwitchBotClient } from "../client.js";
import { isBuiltinIrCommand } from "../commands.js";
import type { DeviceRegistry } from "../device-registry.js";

export function registerDeviceTools(
	server: McpServer,
	client: SwitchBotClient,
	registry: DeviceRegistry,
) {
	server.registerTool(
		"list_devices",
		{
			description:
				'List all SwitchBot devices with their names, types, and available commands. Use this first to see what devices you can control. Example response: [{"name": "リビング照明", "type": "Color Bulb", "commands": [{"command": "turnOn", ...}]}]',
		},
		async () => {
			const devices = await registry.listDevices();

			return {
				content: [
					{
						type: "text" as const,
						text: JSON.stringify(devices, null, 2),
					},
				],
			};
		},
	);

	server.registerTool(
		"get_device_status",
		{
			description:
				'Get the current status of a SwitchBot device by name. Returns power state, temperature, humidity, etc. depending on device type. Example: get_device_status({ deviceName: "リビング照明" })',
			inputSchema: {
				deviceName: z
					.string()
					.describe("デバイス名（list_devices で確認した名前を使用）"),
			},
		},
		async (args) => {
			const device = await registry.resolveDevice(args.deviceName);

			// 赤外線リモコンはステータス取得非対応
			if (device.isInfrared) {
				return {
					content: [
						{
							type: "text" as const,
							text: `赤外線リモコンデバイス「${device.deviceName}」はステータス取得に対応していません。control_device でコマンドを送信してください。`,
						},
					],
				};
			}

			const status = await client.getDeviceStatus(device.deviceId);

			// ID をレスポンスから除外
			const { deviceId, ...statusWithoutId } = status;

			return {
				content: [
					{
						type: "text" as const,
						text: JSON.stringify(statusWithoutId, null, 2),
					},
				],
			};
		},
	);

	server.registerTool(
		"control_device",
		{
			description:
				'Send a command to a SwitchBot device by name. Use list_devices first to see available commands for each device. Examples: control_device({ deviceName: "リビング照明", command: "turnOn" }), control_device({ deviceName: "リビング照明", command: "setBrightness", parameter: "50" }), control_device({ deviceName: "リビング照明", command: "setColor", parameter: "255:0:0" })',
			inputSchema: {
				deviceName: z
					.string()
					.describe("デバイス名（list_devices で確認した名前を使用）"),
				command: z
					.string()
					.describe(
						"実行するコマンド（list_devices で確認したコマンド名を使用）",
					),
				parameter: z
					.string()
					.optional()
					.describe("コマンドのパラメータ（必要な場合のみ）"),
			},
		},
		async (args) => {
			const device = await registry.resolveDevice(args.deviceName);

			// 赤外線リモコンのカスタムボタンのみ commandType: "customize" を使用
			const isCustom =
				device.isInfrared &&
				!isBuiltinIrCommand(device.deviceType, args.command);
			const commandType = isCustom ? "customize" : "command";

			const result = await client.sendCommand(
				device.deviceId,
				args.command,
				args.parameter,
				commandType,
			);

			return {
				content: [
					{
						type: "text" as const,
						text: JSON.stringify(result, null, 2),
					},
				],
			};
		},
	);
}
