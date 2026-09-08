import * as core from '@actions/core';
import { ensureBinary } from './installer';
import { runStellarPath } from './runner';
import { postPrComment } from './comment';

async function run(): Promise<void> {
  try {
    const pathInput = core.getInput('path');
    const format = core.getInput('format');
    const postComment = core.getInput('post-comment') === 'true';
    const githubToken = core.getInput('github-token');
    const version = core.getInput('version');

    core.info(`Ensuring stellarpath binary (version: ${version})...`);
    const binaryPath = await ensureBinary(version);

    core.info(`Running scan on path: ${pathInput} with format: ${format}...`);
    const { exitCode, stdout, stderr } = await runStellarPath(binaryPath, pathInput, format);

    if (exitCode !== 0) {
      core.setFailed(`stellarpath scan failed with exit code ${exitCode}. Error: ${stderr}`);
      return;
    }

    core.setOutput('report', stdout);
    
    let archetype = 'unknown';
    if (format === 'json') {
      try {
        const parsed = JSON.parse(stdout);
        if (parsed.archetype) {
          archetype = parsed.archetype;
        }
      } catch (e) {
        // ignore parsing error
      }
    }
    core.setOutput('archetype', archetype);

    if (postComment && githubToken) {
      core.info('Posting report as PR comment...');
      await postPrComment(githubToken, stdout);
    }
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    } else {
      core.setFailed(String(error));
    }
  }
}

run();
