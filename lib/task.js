const fs = require('fs');
const path = require('path');
const { 
  WS_DIR, 
  outputJson, 
  writeFileAtomicSync, 
  getActiveWorkspace 
} = require('./utils');

/**
 * Retrieves the currently active workspace info and data.
 * @returns {Object} { name, wsPath, data }
 */
function getActiveWorkspaceInfo() {
  const activeName = getActiveWorkspace();
  if (!activeName) {
    outputJson(false, null, "No active workspace. Use 'todo ws switch <name>' first.");
    process.exit(1);
  }

  const wsPath = path.join(WS_DIR, `${activeName}.json`);
  if (!fs.existsSync(wsPath)) {
    outputJson(false, null, `Active workspace '${activeName}' data file not found.`);
    process.exit(1);
  }

  try {
    const data = JSON.parse(fs.readFileSync(wsPath, 'utf-8'));
    return { name: activeName, wsPath, data };
  } catch (err) {
    outputJson(false, null, `Failed to read workspace '${activeName}': ${err.message}`);
    process.exit(1);
  }
}

/**
 * Saves the workspace data transactionally.
 * @param {string} wsPath - Path to the workspace file.
 * @param {Object} data - Workspace data object.
 */
function saveWorkspace(wsPath, data) {
  try {
    writeFileAtomicSync(wsPath, JSON.stringify(data, null, 2));
  } catch (err) {
    outputJson(false, null, `Failed to save workspace data: ${err.message}`);
    process.exit(1);
  }
}

function addTask(description) {
  const { name, wsPath, data } = getActiveWorkspaceInfo();
  
  const newTask = {
    id: data.nextId++,
    description,
    status: 'pending',
    priority: 0,
    notes: [],
    createdAt: new Date().toISOString()
  };
  
  data.tasks.push(newTask);
  saveWorkspace(wsPath, data);
  
  outputJson(true, { task: newTask, workspace: name, message: `Task ${newTask.id} added.` });
}

function listTasks(statusFilter) {
  const { name, data } = getActiveWorkspaceInfo();
  let tasks = data.tasks;
  
  if (statusFilter) {
    tasks = tasks.filter(t => t.status === statusFilter);
  }
  
  outputJson(true, { workspace: name, count: tasks.length, tasks });
}

function updateTaskStatus(id, status) {
  const validStatuses = ['pending', 'done', 'blocked'];
  if (!validStatuses.includes(status)) {
    outputJson(false, null, `Invalid status '${status}'. Must be one of: ${validStatuses.join(', ')}`);
    process.exit(1);
  }

  const { name, wsPath, data } = getActiveWorkspaceInfo();
  const taskId = parseInt(id, 10);
  const task = data.tasks.find(t => t.id === taskId);
  
  if (!task) {
    outputJson(false, null, `Task with ID ${taskId} not found in workspace '${name}'.`);
    process.exit(1);
  }

  task.status = status;
  task.updatedAt = new Date().toISOString();
  saveWorkspace(wsPath, data);
  
  outputJson(true, { task, message: `Task ${taskId} status updated to '${status}'.` });
}

function removeTask(id) {
  const { name, wsPath, data } = getActiveWorkspaceInfo();
  const taskId = parseInt(id, 10);
  const taskIndex = data.tasks.findIndex(t => t.id === taskId);
  
  if (taskIndex === -1) {
    outputJson(false, null, `Task with ID ${taskId} not found in workspace '${name}'.`);
    process.exit(1);
  }

  const removed = data.tasks.splice(taskIndex, 1)[0];
  saveWorkspace(wsPath, data);
  
  outputJson(true, { task: removed, message: `Task ${taskId} removed.` });
}

function setPriority(id, level) {
  const { name, wsPath, data } = getActiveWorkspaceInfo();
  const taskId = parseInt(id, 10);
  const priorityLevel = parseInt(level, 10);
  
  if (isNaN(priorityLevel)) {
    outputJson(false, null, `Priority level must be a number.`);
    process.exit(1);
  }

  const task = data.tasks.find(t => t.id === taskId);
  
  if (!task) {
    outputJson(false, null, `Task with ID ${taskId} not found in workspace '${name}'.`);
    process.exit(1);
  }

  task.priority = priorityLevel;
  task.updatedAt = new Date().toISOString();
  saveWorkspace(wsPath, data);
  
  outputJson(true, { task, message: `Task ${taskId} priority set to ${priorityLevel}.` });
}

function addNote(id, message) {
  const { name, wsPath, data } = getActiveWorkspaceInfo();
  const taskId = parseInt(id, 10);
  const task = data.tasks.find(t => t.id === taskId);
  
  if (!task) {
    outputJson(false, null, `Task with ID ${taskId} not found in workspace '${name}'.`);
    process.exit(1);
  }

  task.notes.push({
    message,
    addedAt: new Date().toISOString()
  });
  task.updatedAt = new Date().toISOString();
  saveWorkspace(wsPath, data);
  
  outputJson(true, { task, message: `Note added to task ${taskId}.` });
}

function getNextTask() {
  const { name, data } = getActiveWorkspaceInfo();
  
  // Filter only pending tasks
  const pendingTasks = data.tasks.filter(t => t.status === 'pending');
  
  if (pendingTasks.length === 0) {
    outputJson(true, { task: null, message: `No pending tasks in workspace '${name}'.` });
    return;
  }
  
  // Sort by priority descending (highest first). If equal, prioritize older tasks.
  pendingTasks.sort((a, b) => {
    if (b.priority !== a.priority) {
      return b.priority - a.priority; // Descending priority
    }
    return new Date(a.createdAt) - new Date(b.createdAt); // Ascending creation time
  });
  
  const nextTask = pendingTasks[0];
  outputJson(true, { task: nextTask });
}

module.exports = {
  addTask,
  listTasks,
  updateTaskStatus,
  removeTask,
  setPriority,
  addNote,
  getNextTask
};
