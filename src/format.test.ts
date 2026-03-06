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
	it("デバイス一覧をテーブル形式でフォーマットする", () => {
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

		assert.ok(result.includes("# デバイス一覧（2件）"));
		assert.ok(result.includes("| リビング照明 | Color Bulb | turnOn, turnOff |"));
		assert.ok(result.includes("| エアコン | Air Conditioner | setAll |"));
	});

	it("空配列では0件と表示する", () => {
		const result = formatDeviceList([]);
		assert.ok(result.includes("# デバイス一覧（0件）"));
	});
});

describe("formatDeviceStatus", () => {
	it("ステータスを箇条書きでフォーマットする", () => {
		const result = formatDeviceStatus("リビング照明", {
			power: "on",
			brightness: 80,
		});

		assert.ok(result.includes("# デバイスステータス: リビング照明"));
		assert.ok(result.includes('- **power**: "on"'));
		assert.ok(result.includes("- **brightness**: 80"));
	});
});

describe("formatCommandResult", () => {
	it("コマンド実行結果をフォーマットする", () => {
		const result = formatCommandResult("リビング照明", "turnOn", {
			items: [],
		});

		assert.ok(result.includes("# コマンド実行結果"));
		assert.ok(result.includes("「リビング照明」に `turnOn` を送信しました。"));
		assert.ok(result.includes("- **items**: []"));
	});

	it("空のレスポンスでは箇条書きを出力しない", () => {
		const result = formatCommandResult("リビング照明", "turnOn", {});

		assert.ok(result.includes("# コマンド実行結果"));
		assert.ok(!result.includes("- **"));
	});
});

describe("formatSceneList", () => {
	it("シーン一覧をテーブル形式でフォーマットする", () => {
		const result = formatSceneList([
			{ name: "おやすみ" },
			{ name: "おはよう" },
		]);

		assert.ok(result.includes("# シーン一覧（2件）"));
		assert.ok(result.includes("| おやすみ |"));
		assert.ok(result.includes("| おはよう |"));
	});
});

describe("formatSceneResult", () => {
	it("シーン実行結果をフォーマットする", () => {
		const result = formatSceneResult("おやすみ");
		assert.ok(result.includes("# シーン実行結果"));
		assert.ok(result.includes("「おやすみ」を実行しました。"));
	});
});
