#!/usr/bin/env node

const { Command } = require('commander');
const workspaceManager = require('../lib/workspace');
const taskManager = require('../lib/task');
const pkg = require('../package.json');

const program = new Command();

program
  .name('todo')
  .description('AI agent task management CLI')
  .version(pkg.version);

// ----------------------------------------------------------------------
// Workspace Subcommands
// ----------------------------------------------------------------------
const wsCommand = program.command('ws').description('Workspace management');

wsCommand
  .command('list')
  .description('List all workspaces')
  .action(() => {
    workspaceManager.listWorkspaces();
  });

wsCommand
  .command('create <name>')
  .description('Create a new workspace')
  .action((name) => {
    workspaceManager.createWorkspace(name);
  });

wsCommand
  .command('switch <name>')
  .description('Switch active workspace')
  .action((name) => {
    workspaceManager.switchWorkspace(name);
  });

wsCommand
  .command('remove <name>')
  .description('Remove a workspace')
  .action((name) => {
    workspaceManager.removeWorkspace(name);
  });

// ----------------------------------------------------------------------
// Task Subcommands
// ----------------------------------------------------------------------

program
  .command('add <description>')
  .description('Add a new task to active workspace')
  .action((description) => {
    taskManager.addTask(description);
  });

program
  .command('list')
  .description('List tasks in active workspace')
  .option('-s, --status <status>', 'Filter by status (pending|done|blocked)')
  .action((options) => {
    taskManager.listTasks(options.status);
  });

program
  .command('update <id>')
  .description('Update a task status')
  .requiredOption('-s, --status <status>', 'New status (pending|done|blocked)')
  .action((id, options) => {
    taskManager.updateTaskStatus(id, options.status);
  });

program
  .command('remove <id>')
  .description('Remove a task')
  .action((id) => {
    taskManager.removeTask(id);
  });

// ----------------------------------------------------------------------
// Logic & Planning Subcommands
// ----------------------------------------------------------------------

program
  .command('priority <id> <level>')
  .description('Set task priority (higher number = higher priority)')
  .action((id, level) => {
    taskManager.setPriority(id, level);
  });

program
  .command('note <id> <message>')
  .description('Add a note to a task')
  .action((id, message) => {
    taskManager.addNote(id, message);
  });

program
  .command('next')
  .description('Get the highest priority pending task')
  .action(() => {
    taskManager.getNextTask();
  });

// If no arguments provided, show help
if (!process.argv.slice(2).length) {
  program.outputHelp();
}

program.parse(process.argv);
