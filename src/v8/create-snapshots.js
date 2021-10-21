const childProcess = require('child_process');
const vm = require('vm');
const { resolve } = require('path');
const fs = require('fs-extra');
const electronLink = require('electron-link');
const { syncAndRun } = require('@thlorenz/electron-mksnapshot');

const excludedModules = {};

async function main() {
  const baseDirPath = resolve(__dirname, '../../');
  const cachePath = resolve(baseDirPath, 'cache');

  fs.removeSync(cachePath);

  console.log('Creating a linked script..');
  const result = await electronLink({
    baseDirPath: baseDirPath,
    mainPath: resolve(__dirname, 'target.js'),
    cachePath: `${baseDirPath}/cache`,
    shouldExcludeModule: modulePath => excludedModules.hasOwnProperty(modulePath)
  });

  const snapshotScriptPath = `${baseDirPath}/cache/snapshot.js`;
  fs.writeFileSync(snapshotScriptPath, result.snapshotScript);

  // Verify if we will be able to use this in `mksnapshot`
  vm.runInNewContext(result.snapshotScript, undefined, { filename: snapshotScriptPath, displayErrors: true });

  const outputBlobPath = resolve(baseDirPath, 'node_modules', 'electron', 'dist');
  console.log(`Generating startup blob in "${outputBlobPath}"`);
  // childProcess.execFileSync(resolve(baseDirPath, 'node_modules', '.bin', 'mksnapshot' + (process.platform === 'win32' ? '.cmd' : '')), [snapshotScriptPath, '--output_dir', outputBlobPath]);
  
  // 通过 @thlorenz/electron-mksnapshot 定制 mksnapshot 版本号
  const args = [snapshotScriptPath, '--output_dir', outputBlobPath];
  const VERSION = '15.3.0';
  const { version, snapshotBlobFile, v8ContextFile } = await syncAndRun(VERSION, args);
  console.log(version, snapshotBlobFile, v8ContextFile);
}

main().catch(err => console.error(err));
