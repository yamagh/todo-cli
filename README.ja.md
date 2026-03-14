# todo-cli

AIエージェントによる自律的なタスク管理とコンテキスト管理を実現する、最小構成の CLI ツール。

## 概要

AIエージェントが「作業のまとまり（ワークスペース）」を意識し、長時間の開発やリサーチを行う際に発生する「コンテキスト汚染」を防ぐために設計されています。AIによるパースが容易なJSON形式でのデータ管理と、人間が直感的に操作できるコマンド体系を備えています。

## インストール

```bash
npm install -g @yamagh/todo-cli
```

*(または、本リポジトリ内で `npm link` を実行してグローバルコマンドとして登録してください)*

## コマンド一覧

### ワークスペース管理 (Workspace)

作業単位を切り替えることで、関連性のないタスクを分離します。

* `todo ws list` : ワークスペースの一覧を表示。
* `todo ws create <name>` : 新しいワークスペースを作成。
* `todo ws switch <name>` : 作業対象のワークスペースを切り替え。
* `todo ws remove <name>` : ワークスペースと紐づくタスクを削除。

### タスク管理 (Task)

* `todo add "<description>"` : タスクを追加。
* `todo list [--status <pending|done|blocked>]` : タスク一覧を表示。
* `todo update <id> --status <status>` : タスクの状態を更新。
* `todo remove <id>` : タスクを削除。

### 計画・実行支援 (Logic)

* `todo priority <id> <level>` : 優先度を設定（※実装上は数値で管理しています。例: 100や0など）。
* `todo note <id> "<message>"` : タスクに補足情報を追記。
* `todo next` : 次に処理すべき（優先度が高く未完了の）タスクを取得。

## データ保存先

データはユーザーのホームディレクトリ配下に格納されます。

* `~/.todo-cli/active_workspace` : 現在選択中のワークスペース名
* `~/.todo-cli/workspaces/<name>.json` : 各ワークスペースのタスクデータ

## AIエージェントへの組み込み方

AIエージェントのシステムプロンプトに以下を推奨します：

1. 作業開始時に `todo ws switch <feature-name>` を実行すること。
2. 完了したステップは `todo update <id> --status done` で確実に状態を反映すること。
3. 複雑な作業は `todo note` を活用し、コンテキストを外部化すること。
