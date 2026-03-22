import type { DeviceSummary, SceneSummary } from "./types.js";

/** 値をYAMLスカラーに変換 */
function yamlValue(value: unknown): string {
	if (value === null || value === undefined) {
		return "null";
	}
	if (typeof value === "number" || typeof value === "boolean") {
		return String(value);
	}
	if (typeof value === "string") {
		return `"${value.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
	}
	// 配列・オブジェクトはJSONフロー形式で表現
	return JSON.stringify(value);
}

/** デバイス一覧をYAMLにフォーマット */
export function formatDeviceList(devices: DeviceSummary[]): string {
	const lines = ["devices:"];

	for (const d of devices) {
		const commands = d.commands.map((c) => c.command).join(", ");
		lines.push(`  - name: ${yamlValue(d.name)}`);
		lines.push(`    type: ${yamlValue(d.type)}`);
		lines.push(`    commands: ${yamlValue(commands)}`);
	}

	return lines.join("\n");
}

/** デバイスステータスをYAMLにフォーマット */
export function formatDeviceStatus(
	deviceName: string,
	status: Record<string, unknown>,
): string {
	const lines = [`device: ${yamlValue(deviceName)}`, "status:"];

	for (const [key, value] of Object.entries(status)) {
		lines.push(`  ${key}: ${yamlValue(value)}`);
	}

	return lines.join("\n");
}

/** コマンド実行結果をYAMLにフォーマット */
export function formatCommandResult(
	deviceName: string,
	command: string,
	result: Record<string, unknown>,
): string {
	const lines = [
		`device: ${yamlValue(deviceName)}`,
		`command: ${yamlValue(command)}`,
	];

	const entries = Object.entries(result);
	if (entries.length > 0) {
		lines.push("result:");
		for (const [key, value] of entries) {
			lines.push(`  ${key}: ${yamlValue(value)}`);
		}
	} else {
		lines.push("result: ok");
	}

	return lines.join("\n");
}

/** シーン一覧をYAMLにフォーマット */
export function formatSceneList(scenes: SceneSummary[]): string {
	const lines = ["scenes:"];

	for (const s of scenes) {
		lines.push(`  - ${yamlValue(s.name)}`);
	}

	return lines.join("\n");
}

/** シーン実行結果をYAMLにフォーマット */
export function formatSceneResult(sceneName: string): string {
	return `scene: ${yamlValue(sceneName)}\nresult: executed`;
}
