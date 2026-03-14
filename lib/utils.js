const fs = require('fs');
const path = require('path');
const os = require('os');
const writeFileAtomicSync = require('write-file-atomic').sync;
const writeFileAtomic = require('write-file-atomic');

const TODO_DIR = path.join(os.homedir(), '.todo-cli');
const WS_DIR = path.join(TODO_DIR, 'workspaces');
const ACTIVE_WS_FILE = path.join(TODO_DIR, 'active_workspace');

/**
 * Initializes the necessary directories for the CLI.
 */
function initDir() {
  if (!fs.existsSync(WS_DIR)) {
    fs.mkdirSync(WS_DIR, { recursive: true });
  }
}

/**
 * Outputs the result of a command in JSON format to stdout/stderr.
 * @param {boolean} success - Whether the command was successful.
 * @param {Object} [data={}] - The data to output on success.
 * @param {string|null} [error=null] - The error message to output on failure.
 */
function outputJson(success, data = {}, error = null) {
  const result = { success };
  if (data) {
    result.data = data;
  }
  if (error) {
    result.error = error;
  }
  
  if (success) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.error(JSON.stringify(result, null, 2));
  }
}

/**
 * Gets the current active workspace name.
 * @returns {string|null} The active workspace name or null if not set.
 */
function getActiveWorkspace() {
  if (fs.existsSync(ACTIVE_WS_FILE)) {
    return fs.readFileSync(ACTIVE_WS_FILE, 'utf-8').trim();
  }
  return null;
}

/**
 * Sets the active workspace.
 * @param {string} name - The name of the workspace to set as active.
 */
function setActiveWorkspace(name) {
  initDir();
  fs.writeFileSync(ACTIVE_WS_FILE, name, 'utf-8');
}

/**
 * Removes the active workspace tracking if it matches the specified name, or entirely.
 * @param {string} [name] - Optional name. If provided, only removes if it matches.
 */
function clearActiveWorkspace(name) {
  if (fs.existsSync(ACTIVE_WS_FILE)) {
    const current = fs.readFileSync(ACTIVE_WS_FILE, 'utf-8').trim();
    if (!name || current === name) {
      fs.unlinkSync(ACTIVE_WS_FILE);
    }
  }
}

module.exports = {
  TODO_DIR,
  WS_DIR,
  ACTIVE_WS_FILE,
  initDir,
  outputJson,
  writeFileAtomic,
  writeFileAtomicSync,
  getActiveWorkspace,
  setActiveWorkspace,
  clearActiveWorkspace
};
