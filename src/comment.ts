import * as core from '@actions/core';
import * as github from '@actions/github';

const TAG = '<!-- stellarpath-action-report -->';

export async function postPrComment(token: string, markdownBody: string): Promise<void> {
  const context = github.context;
  if (context.eventName !== 'pull_request') {
    core.info('Not running in a pull_request event. Skipping PR comment.');
    return;
  }

  const pullRequest = context.payload.pull_request;
  if (!pullRequest) {
    core.info('Pull request data not found in context payload. Skipping PR comment.');
    return;
  }

  const octokit = github.getOctokit(token);
  const owner = context.repo.owner;
  const repo = context.repo.repo;
  const issue_number = pullRequest.number;

  const fullBody = `${markdownBody}\n\n${TAG}`;

  // Find existing comment
  const comments = await octokit.rest.issues.listComments({
    owner,
    repo,
    issue_number,
  });

  const existingComment = comments.data.find(comment => comment.body?.includes(TAG));

  if (existingComment) {
    core.info(`Updating existing comment (ID: ${existingComment.id})`);
    await octokit.rest.issues.updateComment({
      owner,
      repo,
      comment_id: existingComment.id,
      body: fullBody,
    });
  } else {
    core.info('Creating new PR comment');
    await octokit.rest.issues.createComment({
      owner,
      repo,
      issue_number,
      body: fullBody,
    });
  }
}
