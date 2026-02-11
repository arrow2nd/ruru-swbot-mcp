import type { SwitchBotClient } from "./client.js";
import { getCommandsForDevice } from "./commands.js";
import type {
	DeviceSummary,
	ResolvedDevice,
	ResolvedScene,
	SceneSummary,
} from "./types.js";

export class DeviceRegistry {
	private client: SwitchBotClient;
	private devices: ResolvedDevice[] = [];
	private scenes: ResolvedScene[] = [];
	private initialized = false;

	constructor(client: SwitchBotClient) {
		this.client = client;
	}

	/** API からデバイス・シーン一覧を取得してキャッシュを更新 */
	async refresh(): Promise<void> {
		const [devicesBody, scenesBody] = await Promise.all([
			this.client.getDevices(),
			this.client.getScenes(),
		]);

		this.devices = [
			...devicesBody.deviceList.map((d) => ({
				deviceId: d.deviceId,
				deviceName: d.deviceName,
				deviceType: d.deviceType,
				isInfrared: false,
			})),
			...devicesBody.infraredRemoteList.map((d) => ({
				deviceId: d.deviceId,
				deviceName: d.deviceName,
				deviceType: d.remoteType,
				isInfrared: true,
			})),
		];

		this.scenes = scenesBody.map((s) => ({
			sceneId: s.sceneId,
			sceneName: s.sceneName,
		}));

		this.initialized = true;
	}

	/** 初回アクセス時に自動フェッチ */
	private async ensureInitialized(): Promise<void> {
		if (!this.initialized) {
			await this.refresh();
		}
	}

	/**
	 * デバイス名から内部情報を解決する。
	 * 完全一致 → 大文字小文字無視 → 部分一致 の順で検索。
	 * 一致しない場合はデバイス名候補を含むエラーを投げる。
	 */
	async resolveDevice(name: string): Promise<ResolvedDevice> {
		await this.ensureInitialized();
		return resolveByName(this.devices, name, (d) => d.deviceName, "デバイス");
	}

	/**
	 * シーン名から内部情報を解決する。
	 * 完全一致 → 大文字小文字無視 → 部分一致 の順で検索。
	 */
	async resolveScene(name: string): Promise<ResolvedScene> {
		await this.ensureInitialized();
		return resolveByName(this.scenes, name, (s) => s.sceneName, "シーン");
	}

	/** ID を含まないデバイス一覧を返す（キャッシュを更新してから返す） */
	async listDevices(): Promise<DeviceSummary[]> {
		await this.refresh();
		return this.devices.map((d) => ({
			name: d.deviceName,
			type: d.deviceType,
			commands: getCommandsForDevice(d.deviceType, d.isInfrared),
		}));
	}

	/** ID を含まないシーン一覧を返す（キャッシュを更新してから返す） */
	async listScenes(): Promise<SceneSummary[]> {
		await this.refresh();
		return this.scenes.map((s) => ({
			name: s.sceneName,
		}));
	}
}

/**
 * 名前解決の汎用関数。
 * 完全一致 → 大文字小文字無視 → 部分一致 の順で検索する。
 */
function resolveByName<T>(
	items: T[],
	name: string,
	getName: (item: T) => string,
	label: string,
): T {
	// 完全一致
	const exact = items.find((item) => getName(item) === name);
	if (exact) {
		return exact;
	}

	// 大文字小文字無視
	const lower = name.toLowerCase();
	const caseInsensitive = items.find(
		(item) => getName(item).toLowerCase() === lower,
	);
	if (caseInsensitive) {
		return caseInsensitive;
	}

	// 部分一致
	const partial = items.filter((item) =>
		getName(item).toLowerCase().includes(lower),
	);
	if (partial.length === 1) {
		return partial[0];
	}

	// 複数の部分一致がある場合は曖昧エラー
	if (partial.length > 1) {
		const candidates = partial.map((item) => getName(item)).join(", ");
		throw new Error(
			`「${name}」に一致する${label}が複数あります: ${candidates}`,
		);
	}

	// 一致なし
	const allNames = items.map((item) => getName(item)).join(", ");
	throw new Error(
		`${label}「${name}」が見つかりません。利用可能な${label}: ${allNames}`,
	);
}
