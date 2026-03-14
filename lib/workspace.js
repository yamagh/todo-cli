const fs = require('fs');
const path = require('path');
const { 
  WS_DIR, 
  initDir, 
  outputJson, 
  writeFileAtomicSync, 
  getActiveWorkspace, 
  setActiveWorkspace, 
  clearActiveWorkspace 
} = require('./utils');

/**
 * Lists all existing workspaces and shows the active one.
 */
function listWorkspaces() {
  try {
    initDir();
    const files = fs.readdirSync(WS_DIR);
    const workspaces = files
      .filter(f => f.endsWith('.json'))
      .map(f => f.substring(0, f.length - 5)); // Remove .json extension
    
    const active = getActiveWorkspace();
    
    outputJson(true, { workspaces, active });
  } catch (err) {
    outputJson(false, null, err.message);
    process.exit(1);
  }
}

/**
 * Creates a new workspace and sets it as active.
 * @param {string} name - Name of the workspace to create.
 */
function createWorkspace(name) {
  try {
    initDir();
    const wsPath = path.join(WS_DIR, `${name}.json`);
    
    if (fs.existsSync(wsPath)) {
      outputJson(false, null, `Workspace '${name}' already exists.`);
      process.exit(1);
    }

    const initialData = { tasks: [], nextId: 1 };
    writeFileAtomicSync(wsPath, JSON.stringify(initialData, null, 2));
    
    // Automatically switch to the newly created workspace
    setActiveWorkspace(name);
    
    outputJson(true, { workspace: name, message: `Workspace '${name}' created and set as active.` });
  } catch (err) {
    outputJson(false, null, err.message);
    process.exit(1);
  }
}

/**
 * Switches the active workspace to the provided name.
 * @param {string} name - Name of the workspace to switch to.
 */
function switchWorkspace(name) {
  try {
    initDir();
    const wsPath = path.join(WS_DIR, `${name}.json`);
    
    if (!fs.existsSync(wsPath)) {
      outputJson(false, null, `Workspace '${name}' does not exist.`);
      process.exit(1);
    }

    setActiveWorkspace(name);
    outputJson(true, { workspace: name, message: `Switched to workspace '${name}'.` });
  } catch (err) {
    outputJson(false, null, err.message);
    process.exit(1);
  }
}

/**
 * Removes the given workspace. If it is the active one, unsets the active workspace.
 * @param {string} name - Name of the workspace to remove.
 */
function removeWorkspace(name) {
  try {
    initDir();
    const wsPath = path.join(WS_DIR, `${name}.json`);
    
    if (!fs.existsSync(wsPath)) {
      outputJson(false, null, `Workspace '${name}' does not exist.`);
      process.exit(1);
    }

    fs.unlinkSync(wsPath);
    clearActiveWorkspace(name);
    
    outputJson(true, { workspace: name, message: `Workspace '${name}' removed.` });
  } catch (err) {
    outputJson(false, null, err.message);
    process.exit(1);
  }
}

module.exports = {
  listWorkspaces,
  createWorkspace,
  switchWorkspace,
  removeWorkspace
};
