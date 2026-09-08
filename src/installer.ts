import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as io from '@actions/io';
import * as path from 'path';

export async function ensureBinary(version: string): Promise<string> {
  try {
    const stellarPath = await io.which('stellar_path', false);
    if (stellarPath) {
      core.info(`Found stellar_path binary at ${stellarPath}`);
      return stellarPath;
    }

    const stellarpath = await io.which('stellarpath', false);
    if (stellarpath) {
      core.info(`Found stellarpath binary at ${stellarpath}`);
      return stellarpath;
    }

    core.info('Binary not found in PATH. Attempting to build from source via cargo...');
    
    const repoUrl = 'https://github.com/STELLAR-PATH/stellarpath-cli';
    const tmpDir = process.env['RUNNER_TEMP'] || '/tmp';
    const cloneDir = path.join(tmpDir, 'stellarpath-cli');

    await exec.exec('rm', ['-rf', cloneDir]);
    core.info(`Cloning ${repoUrl} into ${cloneDir}...`);
    await exec.exec('git', ['clone', repoUrl, cloneDir]);

    core.info('Building via cargo install...');
    await exec.exec('cargo', ['install', '--path', '.'], { cwd: cloneDir });

    const installedPath = await io.which('stellar_path', false) || await io.which('stellarpath', false);
    if (installedPath) {
      core.info(`Successfully built and found binary at ${installedPath}`);
      return installedPath;
    }

    const cargoBin = path.join(process.env['HOME'] || '~', '.cargo', 'bin');
    const directPath1 = path.join(cargoBin, 'stellar_path');
    const directPath2 = path.join(cargoBin, 'stellarpath');
    
    try {
      await io.which(directPath1, true);
      return directPath1;
    } catch {
      try {
        await io.which(directPath2, true);
        return directPath2;
      } catch {
        throw new Error(`Failed to find installed binary in ${cargoBin}.`);
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      core.error(`Failed to ensure stellarpath binary: ${error.message}`);
    } else {
      core.error(`Failed to ensure stellarpath binary: ${String(error)}`);
    }
    throw error;
  }
}
