import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { sanitize } from "./sanitize.js";

describe("sanitize", () => {
	it("XMLタグを除去する", () => {
		assert.strictEqual(sanitize("<command>turnOn</command>"), "turnOn");
	});

	it("自己閉じタグを除去する", () => {
		assert.strictEqual(sanitize("turnOn<br/>"), "turnOn");
	});

	it("タグなし入力はそのまま返す", () => {
		assert.strictEqual(sanitize("turnOn"), "turnOn");
	});

	it("前後の空白を trim する", () => {
		assert.strictEqual(sanitize("  turnOn  "), "turnOn");
	});

	it("タグ除去後の前後空白も trim する", () => {
		assert.strictEqual(sanitize(" <tag> turnOn </tag> "), "turnOn");
	});
});
