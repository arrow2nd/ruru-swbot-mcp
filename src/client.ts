import { createHmac, randomUUID } from "node:crypto";
import type {
	ApiResponse,
	CommandRequest,
	DevicesBody,
	ScenesBody,
} from "./types.js";

const BASE_URL = "https://api.switch-bot.com";

export class SwitchBotClient {
	private token: string;
	private secret: string;

	constructor(token: string, secret: string) {
		this.token = token;
		this.secret = secret;
	}

	/** HMAC-SHA256 認証ヘッダーを生成 */
	private createHeaders(): Record<string, string> {
		const t = Date.now().toString();
		const nonce = randomUUID();
		const stringToSign = `${this.token}${t}${nonce}`;

		const sign = createHmac("sha256", this.secret)
			.update(stringToSign)
			.digest("base64");

		return {
			Authorization: this.token,
			sign,
			t,
			nonce,
			"Content-Type": "application/json",
		};
	}

	private async request<T>(
		method: "GET" | "POST",
		path: string,
		body?: unknown,
	): Promise<T> {
		const res = await fetch(`${BASE_URL}${path}`, {
			method,
			headers: this.createHeaders(),
			body: body ? JSON.stringify(body) : undefined,
		});

		if (!res.ok) {
			throw new Error(`SwitchBot API error: ${res.status} ${res.statusText}`);
		}

		const data = (await res.json()) as ApiResponse<T>;

		if (data.statusCode !== 100) {
			throw new Error(
				`SwitchBot API error: ${data.statusCode} ${data.message}`,
			);
		}

		return data.body;
	}

	/** デバイス一覧を取得 */
	async getDevices(): Promise<DevicesBody> {
		return this.request<DevicesBody>("GET", "/v1.1/devices");
	}

	/** デバイスのステータスを取得 */
	async getDeviceStatus(deviceId: string): Promise<Record<string, unknown>> {
		return this.request<Record<string, unknown>>(
			"GET",
			`/v1.1/devices/${deviceId}/status`,
		);
	}

	/** デバイスにコマンドを送信 */
	async sendCommand(
		deviceId: string,
		command: string,
		parameter?: string,
		commandType?: "command" | "customize",
	): Promise<Record<string, unknown>> {
		const body: CommandRequest = {
			command,
			parameter: parameter ?? "default",
			commandType: commandType ?? "command",
		};

		return this.request<Record<string, unknown>>(
			"POST",
			`/v1.1/devices/${deviceId}/commands`,
			body,
		);
	}

	/** シーン一覧を取得 */
	async getScenes(): Promise<ScenesBody> {
		return this.request<ScenesBody>("GET", "/v1.1/scenes");
	}

	/** シーンを実行 */
	async executeScene(sceneId: string): Promise<Record<string, unknown>> {
		return this.request<Record<string, unknown>>(
			"POST",
			`/v1.1/scenes/${sceneId}/execute`,
		);
	}
}
