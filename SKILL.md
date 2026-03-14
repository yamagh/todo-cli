---
name: todo-cli Operations
description: Instructions for the AI agent on how to use todo-cli to autonomously manage tasks, context, and planning.
---

# todo-cli Skill Instructions

You have access to `todo-cli`, a task management tool specifically designed for AI agents to maintain context, manage workspaces, and plan execution without suffering from context pollution.

## When to use this skill
- When starting a new development or research objective.
- When you need to break down a complex task into smaller steps and keep track of them.
- When you are switching contexts between different features or bugs.
- When you need to leave notes or externalize your context for long-running workflows.

## Environment Setup
Ensure that the `todo` command is available. It is typically installed globally via npm (`npm install -g todo-cli` or linked via `npm link`).
All outputs from `todo` commands are in JSON format. You should parse this JSON to confirm success or failure.

## Core Workflows

### 1. Starting a New Context (Workspace Management)
Always work within a dedicated workspace for a specific feature, bug, or research topic.
- **Check existing workspaces**:
  ```bash
  todo ws list
  ```
- **Create a new workspace** (this automatically switches to it):
  ```bash
  todo ws create <descriptive-workspace-name>
  ```
- **Switch to an existing workspace**:
  ```bash
  todo ws switch <workspace-name>
  ```

### 2. Task Planning and Breakdown (Task Addition)
Break your objective into actionable tasks and add them to the workspace.
- **Add a task**:
  ```bash
  todo add "Detailed description of the task"
  ```
- **Set priority**: If some tasks are blocking others, set higher priorities (e.g., 100 for high, 50 for medium, 0 for low).
  ```bash
  todo priority <task-id> <level>
  ```

### 3. Execution and State Tracking
Consistently update task statuses as you progress.
- **Get the next task to work on** (fetching the highest priority pending task):
  ```bash
  todo next
  ```
- **View all tasks and their IDs**:
  ```bash
  todo list
  ```
  *(To view only pending tasks: `todo list --status pending`)*
- **Mark a task as completed**:
  ```bash
  todo update <task-id> --status done
  ```
- **Mark a task as blocked**:
  ```bash
  todo update <task-id> --status blocked
  ```

### 4. Context Externalization
If you encounter important context, API responses, or architectural decisions that you might forget, attach them to the current task.
- **Add a note**:
  ```bash
  todo note <task-id> "Crucial context: The API requires a Bearer token in the format X."
  ```

### 5. Cleanup
When the entire feature or bug is completely resolved and the context is no longer needed.
- **Remove a workspace**:
  ```bash
  todo ws remove <workspace-name>
  ```

## Critical Rules for the Agent
1. **Always verify JSON responses**: `todo` commands output JSON. Always check the `"success"` boolean. If false, read the `"error"` message.
2. **Never mutate files manually**: Do not manually edit the JSON files in `~/.todo-cli/workspaces/`. Always use the `todo` CLI to ensure atomic writes and data integrity.
3. **Atomic Steps**: Add tasks that represent atomic, verifiable steps. Update their status immediately upon completion.
