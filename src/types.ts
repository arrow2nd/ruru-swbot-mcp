// SwitchBot API レスポンスの共通ラッパー
export type ApiResponse<T> = {
	statusCode: number;
	message: string;
	body: T;
};

// GET /v1.1/devices レスポンス
export type DevicesBody = {
	deviceList: PhysicalDevice[];
	infraredRemoteList: InfraredDevice[];
};

export type PhysicalDevice = {
	deviceId: string;
	deviceName: string;
	deviceType: string;
	enableCloudService: boolean;
	hubDeviceId: string;
};

export type InfraredDevice = {
	deviceId: string;
	deviceName: string;
	remoteType: string;
	hubDeviceId: string;
};

// GET /v1.1/scenes レスポンス
export type ScenesBody = Scene[];

export type Scene = {
	sceneId: string;
	sceneName: string;
};

// POST /v1.1/devices/{deviceId}/commands リクエスト
export type CommandRequest = {
	command: string;
	parameter?: string;
	commandType?: "command" | "customize";
};

// ツール層で使用する ID なしのデバイス情報
export type DeviceSummary = {
	name: string;
	type: string;
	commands: CommandInfo[];
};

// ツール層で使用する ID なしのシーン情報
export type SceneSummary = {
	name: string;
};

// コマンド定義
export type CommandInfo = {
	command: string;
	description: string;
	parameter?: string;
};

// レジストリ内部で使用するデバイス情報（ID を含む）
export type ResolvedDevice = {
	deviceId: string;
	deviceName: string;
	deviceType: string;
	isInfrared: boolean;
};

// レジストリ内部で使用するシーン情報（ID を含む）
export type ResolvedScene = {
	sceneId: string;
	sceneName: string;
};
