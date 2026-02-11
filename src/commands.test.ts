import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getCommandsForDevice, isBuiltinIrCommand } from "./commands.js";

describe("getCommandsForDevice", () => {
	describe("Air Conditioner (IR)", () => {
		const commands = getCommandsForDevice("Air Conditioner", true);

		it("turnOn / turnOff コマンドがある", () => {
			const names = commands.map((c) => c.command);
			assert.ok(names.includes("turnOn"));
			assert.ok(names.includes("turnOff"));
		});

		it("setAll コマンドがある", () => {
			const setAll = commands.find((c) => c.command === "setAll");
			assert.ok(setAll);
			assert.ok(setAll.parameter?.includes("temperature"));
			assert.ok(setAll.parameter?.includes("mode"));
			assert.ok(setAll.parameter?.includes("fanSpeed"));
		});

		it("setAll の description が電源操作に turnOn/turnOff を使うよう案内している", () => {
			const setAll = commands.find((c) => c.command === "setAll");
			assert.ok(setAll);
			assert.ok(setAll.description.includes("turnOn/turnOff"));
		});
	});

	it("物理デバイスのコマンドを返す", () => {
		const commands = getCommandsForDevice("Bot", false);
		const names = commands.map((c) => c.command);
		assert.ok(names.includes("turnOn"));
		assert.ok(names.includes("press"));
	});

	it("未定義のデバイスタイプでは空配列を返す", () => {
		assert.deepStrictEqual(getCommandsForDevice("Unknown", false), []);
		assert.deepStrictEqual(getCommandsForDevice("Unknown", true), []);
	});
});

describe("isBuiltinIrCommand", () => {
	it("Air Conditioner の組み込みコマンドを判定できる", () => {
		assert.ok(isBuiltinIrCommand("Air Conditioner", "turnOn"));
		assert.ok(isBuiltinIrCommand("Air Conditioner", "turnOff"));
		assert.ok(isBuiltinIrCommand("Air Conditioner", "setAll"));
	});

	it("カスタムボタンは組み込みコマンドではない", () => {
		assert.ok(!isBuiltinIrCommand("Air Conditioner", "customButton1"));
	});

	it("未定義のデバイスタイプでは false を返す", () => {
		assert.ok(!isBuiltinIrCommand("Unknown", "turnOn"));
	});
});
