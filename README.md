# ruru-swbot-mcp

SwitchBot API の MCP サーバー。デバイスを名前で操作できる設計なので、AIがIDを間違えて操作を失敗するリスクがあんまりなかったりします。

## インストール

```bash
npm install -g ruru-swbot-mcp
```

## 環境変数

[SwitchBot アプリの設定](https://support.switch-bot.com/hc/ja/articles/12822710195351)からトークンとシークレットを取得し、設定してください。

| 変数名 | 説明 |
| --- | --- |
| `SWITCHBOT_TOKEN` | SwitchBot API トークン |
| `SWITCHBOT_SECRET` | SwitchBot API シークレット |

## MCP 設定

### Claude Code

```bash
claude mcp add switchbot -- npx ruru-swbot-mcp
```

### Claude Desktop

```json
{
  "mcpServers": {
    "switchbot": {
      "command": "npx",
      "args": ["ruru-swbot-mcp"],
      "env": {
        "SWITCHBOT_TOKEN": "<your-token>",
        "SWITCHBOT_SECRET": "<your-secret>"
      }
    }
  }
}
```

## リソース

| リソース名 | URI | 説明 |
| --- | --- | --- |
| `device_statuses` | `switchbot://devices/status` | 全物理デバイスの現在の状態（温度・湿度・電源など） |

## ツール

| ツール名 | 説明 |
| --- | --- |
| `list_devices` | デバイス一覧を取得（名前・タイプ・利用可能コマンド） |
| `get_device_status` | デバイスの現在の状態を取得 |
| `control_device` | デバイスにコマンドを送信 |
| `list_scenes` | シーン一覧を取得 |
| `execute_scene` | シーンを実行 |

### 使い方の例

```
1. list_devices でデバイス一覧を確認
2. get_device_status({ deviceName: "リビング照明" }) で状態を取得
3. control_device({ deviceName: "リビング照明", command: "turnOn" }) で操作
```

