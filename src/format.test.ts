import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
	formatCommandResult,
	formatDeviceList,
	formatDeviceStatus,
	formatSceneList,
	formatSceneResult,
} from "./format.js";

describe("formatDeviceList", () => {
	it("デバイス一覧をYAML形式でフォーマットする", () => {
		const result = formatDeviceList([
			{
				name: "リビング照明",
				type: "Color Bulb",
				commands: [
					{ command: "turnOn", description: "Turn on" },
					{ command: "turnOff", description: "Turn off" },
				],
			},
			{
				name: "エアコン",
				type: "Air Conditioner",
				commands: [{ command: "setAll", description: "Set all" }],
			},
		]);

		assert.equal(
			result,
			[
				"devices:",
				'  - name: "リビング照明"',
				'    type: "Color Bulb"',
				'    commands: "turnOn, turnOff"',
				'  - name: "エアコン"',
				'    type: "Air Conditioner"',
				'    commands: "setAll"',
			].join("\n"),
		);
	});

	it("空配列ではdevicesキーのみ出力する", () => {
		const result = formatDeviceList([]);
		assert.equal(result, "devices:");
	});
});

describe("formatDeviceStatus", () => {
	it("ステータスをYAML形式でフォーマットする", () => {
		const result = formatDeviceStatus("リビング照明", {
			power: "on",
			brightness: 80,
		});

		assert.equal(
			result,
			[
				'device: "リビング照明"',
				"status:",
				'  power: "on"',
				"  brightness: 80",
			].join("\n"),
		);
	});
});

describe("formatCommandResult", () => {
	it("コマンド実行結果をYAML形式でフォーマットする", () => {
		const result = formatCommandResult("リビング照明", "turnOn", {
			items: [],
		});

		assert.equal(
			result,
			[
				'device: "リビング照明"',
				'command: "turnOn"',
				"result:",
				"  items: []",
			].join("\n"),
		);
	});

	it("空のレスポンスではresult: okを出力する", () => {
		const result = formatCommandResult("リビング照明", "turnOn", {});

		assert.equal(
			result,
			['device: "リビング照明"', 'command: "turnOn"', "result: ok"].join(
				"\n",
			),
		);
	});
});

describe("formatSceneList", () => {
	it("シーン一覧をYAML形式でフォーマットする", () => {
		const result = formatSceneList([
			{ name: "おやすみ" },
			{ name: "おはよう" },
		]);

		assert.equal(
			result,
			["scenes:", '  - "おやすみ"', '  - "おはよう"'].join("\n"),
		);
	});
});

describe("formatSceneResult", () => {
	it("シーン実行結果をYAML形式でフォーマットする", () => {
		const result = formatSceneResult("おやすみ");
		assert.equal(result, 'scene: "おやすみ"\nresult: executed');
	});
});
