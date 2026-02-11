import type { CommandInfo } from "./types.js";

/**
 * デバイスタイプごとの利用可能コマンド定義。
 * list_devices のレスポンスに含めることで、LLM が一度の呼び出しで
 * 次に何ができるかを把握できるようにする。
 */
const DEVICE_COMMANDS: Record<string, CommandInfo[]> = {
	Bot: [
		{ command: "turnOn", description: "スイッチON" },
		{ command: "turnOff", description: "スイッチOFF" },
		{ command: "press", description: "ボタンを押す" },
	],
	Curtain: [
		{ command: "turnOn", description: "カーテンを開ける" },
		{ command: "turnOff", description: "カーテンを閉める" },
		{
			command: "setPosition",
			description: "位置を設定",
			parameter: "index,mode,position (0=開, 100=閉)",
		},
	],
	"Curtain 3": [
		{ command: "turnOn", description: "カーテンを開ける" },
		{ command: "turnOff", description: "カーテンを閉める" },
		{
			command: "setPosition",
			description: "位置を設定",
			parameter: "index,mode,position (0=開, 100=閉)",
		},
	],
	Lock: [
		{ command: "lock", description: "施錠" },
		{ command: "unlock", description: "解錠" },
	],
	"Lock Pro": [
		{ command: "lock", description: "施錠" },
		{ command: "unlock", description: "解錠" },
	],
	"Lock Ultra": [
		{ command: "lock", description: "施錠" },
		{ command: "unlock", description: "解錠" },
	],
	"Plug Mini (US)": [
		{ command: "turnOn", description: "電源ON" },
		{ command: "turnOff", description: "電源OFF" },
		{ command: "toggle", description: "電源切替" },
	],
	"Plug Mini (JP)": [
		{ command: "turnOn", description: "電源ON" },
		{ command: "turnOff", description: "電源OFF" },
		{ command: "toggle", description: "電源切替" },
	],
	"Color Bulb": [
		{ command: "turnOn", description: "点灯" },
		{ command: "turnOff", description: "消灯" },
		{ command: "toggle", description: "点灯/消灯を切替" },
		{
			command: "setBrightness",
			description: "明るさ設定",
			parameter: "1〜100",
		},
		{
			command: "setColor",
			description: "色設定",
			parameter: '"R:G:B" (各0〜255)',
		},
		{
			command: "setColorTemperature",
			description: "色温度設定",
			parameter: "2700〜6500",
		},
	],
	"Strip Light": [
		{ command: "turnOn", description: "点灯" },
		{ command: "turnOff", description: "消灯" },
		{ command: "toggle", description: "点灯/消灯を切替" },
		{
			command: "setBrightness",
			description: "明るさ設定",
			parameter: "1〜100",
		},
		{
			command: "setColor",
			description: "色設定",
			parameter: '"R:G:B" (各0〜255)',
		},
	],
	"Ceiling Light": [
		{ command: "turnOn", description: "点灯" },
		{ command: "turnOff", description: "消灯" },
		{ command: "toggle", description: "点灯/消灯を切替" },
		{
			command: "setBrightness",
			description: "明るさ設定",
			parameter: "1〜100",
		},
		{
			command: "setColorTemperature",
			description: "色温度設定",
			parameter: "2700〜6500",
		},
	],
	"Ceiling Light Pro": [
		{ command: "turnOn", description: "点灯" },
		{ command: "turnOff", description: "消灯" },
		{ command: "toggle", description: "点灯/消灯を切替" },
		{
			command: "setBrightness",
			description: "明るさ設定",
			parameter: "1〜100",
		},
		{
			command: "setColorTemperature",
			description: "色温度設定",
			parameter: "2700〜6500",
		},
	],
	Humidifier: [
		{ command: "turnOn", description: "加湿ON" },
		{ command: "turnOff", description: "加湿OFF" },
		{
			command: "setMode",
			description: "モード設定",
			parameter: "auto / 101 / 102 / 103 / {0〜100}",
		},
	],
	"Robot Vacuum Cleaner S1": [
		{ command: "start", description: "清掃開始" },
		{ command: "stop", description: "清掃停止" },
		{ command: "dock", description: "充電ドックに戻る" },
	],
	"Robot Vacuum Cleaner S1 Plus": [
		{ command: "start", description: "清掃開始" },
		{ command: "stop", description: "清掃停止" },
		{ command: "dock", description: "充電ドックに戻る" },
	],
	"K10+": [
		{ command: "start", description: "清掃開始" },
		{ command: "stop", description: "清掃停止" },
		{ command: "dock", description: "充電ドックに戻る" },
	],
	"K10+ Pro": [
		{ command: "start", description: "清掃開始" },
		{ command: "stop", description: "清掃停止" },
		{ command: "dock", description: "充電ドックに戻る" },
	],
	Fan: [
		{ command: "turnOn", description: "電源ON" },
		{ command: "turnOff", description: "電源OFF" },
		{
			command: "setAllStatus",
			description: "状態一括設定",
			parameter: "power,fanMode,fanSpeed,shakeRange",
		},
	],
	"Blind Tilt": [
		{ command: "turnOn", description: "開く" },
		{ command: "turnOff", description: "閉じる" },
		{
			command: "setPosition",
			description: "角度設定",
			parameter: "direction;position (position: 0=閉, 100=開)",
		},
	],
	"Battery Circulator Fan": [
		{ command: "turnOn", description: "電源ON" },
		{ command: "turnOff", description: "電源OFF" },
	],
	"Roller Shade": [
		{ command: "turnOn", description: "開ける" },
		{ command: "turnOff", description: "閉める" },
		{
			command: "setPosition",
			description: "位置を設定",
			parameter: "0〜100 (0=開, 100=閉)",
		},
	],
};

// 赤外線リモコンのデフォルトコマンド
const IR_REMOTE_COMMANDS: Record<string, CommandInfo[]> = {
	"Air Conditioner": [
		{ command: "turnOn", description: "電源ON" },
		{ command: "turnOff", description: "電源OFF" },
		{
			command: "setAll",
			description:
				"温度・モード・風速の一括設定。電源の ON/OFF は turnOn/turnOff を使うこと",
			parameter:
				'例: "26,1,1,on" — temperature,mode(0=manual/1=auto),fanSpeed(1=auto/2=low/3=medium/4=high),powerState(on固定)',
		},
	],
	TV: [
		{ command: "turnOn", description: "電源ON" },
		{ command: "turnOff", description: "電源OFF" },
		{
			command: "SetChannel",
			description: "チャンネル設定",
			parameter: "チャンネル番号",
		},
		{
			command: "volumeAdd",
			description: "音量を上げる",
		},
		{
			command: "volumeSub",
			description: "音量を下げる",
		},
	],
	Light: [
		{ command: "turnOn", description: "点灯" },
		{ command: "turnOff", description: "消灯" },
		{
			command: "brightnessUp",
			description: "明るくする",
		},
		{
			command: "brightnessDown",
			description: "暗くする",
		},
	],
	Fan: [
		{ command: "turnOn", description: "電源ON" },
		{ command: "turnOff", description: "電源OFF" },
		{ command: "swing", description: "首振り切替" },
		{ command: "lowSpeed", description: "低速" },
		{ command: "middleSpeed", description: "中速" },
		{ command: "highSpeed", description: "高速" },
	],
};

/** デバイスタイプに対応するコマンド一覧を返す */
export function getCommandsForDevice(
	deviceType: string,
	isInfrared: boolean,
): CommandInfo[] {
	if (isInfrared) {
		return IR_REMOTE_COMMANDS[deviceType] ?? [];
	}
	return DEVICE_COMMANDS[deviceType] ?? [];
}

/** 赤外線リモコンの組み込みコマンドかどうかを判定する */
export function isBuiltinIrCommand(
	deviceType: string,
	command: string,
): boolean {
	const commands = IR_REMOTE_COMMANDS[deviceType];
	if (!commands) {
		return false;
	}
	return commands.some((c) => c.command === command);
}
