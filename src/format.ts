import type { DeviceSummary, SceneSummary } from "./types.js";

/** デバイス一覧をMarkdownテーブルにフォーマット */
export function formatDeviceList(devices: DeviceSummary[]): string {
	const lines = [
		`# デバイス一覧（${devices.length}件）`,
		"",
		"| デバイス名 | タイプ | コマンド |",
		"|-----------|--------|--------|",
	];

	for (const d of devices) {
		const commands = d.commands.map((c) => c.command).join(", ");
		lines.push(`| ${d.name} | ${d.type} | ${commands} |`);
	}

	return lines.join("\n");
}

/** デバイスステータスをMarkdown箇条書きにフォーマット */
export function formatDeviceStatus(
	deviceName: string,
	status: Record<string, unknown>,
): string {
	const lines = [`# デバイスステータス: ${deviceName}`, ""];

	for (const [key, value] of Object.entries(status)) {
		lines.push(`- **${key}**: ${JSON.stringify(value)}`);
	}

	return lines.join("\n");
}

/** コマンド実行結果をMarkdownにフォーマット */
export function formatCommandResult(
	deviceName: string,
	command: string,
	result: Record<string, unknown>,
): string {
	const lines = [
		"# コマンド実行結果",
		"",
		`「${deviceName}」に \`${command}\` を送信しました。`,
	];

	const entries = Object.entries(result);
	if (entries.length > 0) {
		lines.push("");
		for (const [key, value] of entries) {
			lines.push(`- **${key}**: ${JSON.stringify(value)}`);
		}
	}

	return lines.join("\n");
}

/** シーン一覧をMarkdownテーブルにフォーマット */
export function formatSceneList(scenes: SceneSummary[]): string {
	const lines = [
		`# シーン一覧（${scenes.length}件）`,
		"",
		"| シーン名 |",
		"|---------|",
	];

	for (const s of scenes) {
		lines.push(`| ${s.name} |`);
	}

	return lines.join("\n");
}

/** シーン実行結果をMarkdownにフォーマット */
export function formatSceneResult(sceneName: string): string {
	return `# シーン実行結果\n\n「${sceneName}」を実行しました。`;
}
