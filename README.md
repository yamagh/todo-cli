# todo-cli

A minimal CLI tool that enables autonomous task and context management for AI agents.

## Overview

Designed to help AI agents maintain awareness of their "work units" (workspaces) and prevent "context pollution" during long development or research sessions. It features JSON-based data management that is easily parseable by AI, alongside an intuitive command structure for human operation.

## Installation

```bash
npm install -g @yamagh/todo-cli
```

*(Alternatively, run `npm link` within this repository to register it as a global command)*

## Commands

### Workspace Management (Workspace)

Separates unrelated tasks by switching work units.

* `todo ws list` : Display a list of workspaces.
* `todo ws create <name>` : Create a new workspace.
* `todo ws switch <name>` : Switch the active workspace.
* `todo ws remove <name>` : Remove a workspace and its associated tasks.

### Task Management (Task)

* `todo add "<description>"` : Add a new task.
* `todo list [--status <pending|done|blocked>]` : Display a list of tasks.
* `todo update <id> --status <status>` : Update a task's status.
* `todo remove <id>` : Remove a task.

### Logic & Planning Support (Logic)

* `todo priority <id> <level>` : Set priority (managed as a numeric value, e.g., 100 or 0).
* `todo note <id> "<message>"` : Add supplementary notes to a task.
* `todo next` : Get the next task to process (highest priority and pending).

## Data Storage Location

Data is stored under the user's home directory.

* `~/.todo-cli/active_workspace` : The currently selected workspace name
* `~/.todo-cli/workspaces/<name>.json` : Task data for each workspace

## How to Integrate with AI Agents

The following instructions are recommended for your AI agent's system prompt:

1. Execute `todo ws switch <feature-name>` at the start of a task.
2. Ensure completed steps are reflected by running `todo update <id> --status done`.
3. For complex work, utilize `todo note` to externalize context.
