require('./sourcemap-register.js');/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 246:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.postPrComment = postPrComment;
const core = __nccwpck_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@actions/core'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const github = __nccwpck_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@actions/github'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const TAG = '<!-- stellarpath-action-report -->';
async function postPrComment(token, markdownBody) {
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
    }
    else {
        core.info('Creating new PR comment');
        await octokit.rest.issues.createComment({
            owner,
            repo,
            issue_number,
            body: fullBody,
        });
    }
}


/***/ }),

/***/ 651:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ensureBinary = ensureBinary;
const core = __nccwpck_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@actions/core'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const exec = __nccwpck_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@actions/exec'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const io = __nccwpck_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@actions/io'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const path = __nccwpck_require__(928);
async function ensureBinary(version) {
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
        }
        catch {
            try {
                await io.which(directPath2, true);
                return directPath2;
            }
            catch {
                throw new Error(`Failed to find installed binary in ${cargoBin}.`);
            }
        }
    }
    catch (error) {
        if (error instanceof Error) {
            core.error(`Failed to ensure stellarpath binary: ${error.message}`);
        }
        else {
            core.error(`Failed to ensure stellarpath binary: ${String(error)}`);
        }
        throw error;
    }
}


/***/ }),

/***/ 813:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.runStellarPath = runStellarPath;
const exec = __nccwpck_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@actions/exec'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
async function runStellarPath(binaryPath, scanPath, format) {
    let stdout = '';
    let stderr = '';
    const options = {
        listeners: {
            stdout: (data) => {
                stdout += data.toString();
            },
            stderr: (data) => {
                stderr += data.toString();
            }
        },
        ignoreReturnCode: true
    };
    const exitCode = await exec.exec(binaryPath, ['scan', scanPath, '--format', format], options);
    return { exitCode, stdout, stderr };
}


/***/ }),

/***/ 928:
/***/ ((module) => {

module.exports = require("path");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/asset-relocator-loader */
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it uses a non-standard name for the exports (exports).
(() => {
var exports = __webpack_exports__;

Object.defineProperty(exports, "__esModule", ({ value: true }));
const core = __nccwpck_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@actions/core'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const installer_1 = __nccwpck_require__(651);
const runner_1 = __nccwpck_require__(813);
const comment_1 = __nccwpck_require__(246);
async function run() {
    try {
        const pathInput = core.getInput('path');
        const format = core.getInput('format');
        const postComment = core.getInput('post-comment') === 'true';
        const githubToken = core.getInput('github-token');
        const version = core.getInput('version');
        core.info(`Ensuring stellarpath binary (version: ${version})...`);
        const binaryPath = await (0, installer_1.ensureBinary)(version);
        core.info(`Running scan on path: ${pathInput} with format: ${format}...`);
        const { exitCode, stdout, stderr } = await (0, runner_1.runStellarPath)(binaryPath, pathInput, format);
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
            }
            catch (e) {
                // ignore parsing error
            }
        }
        core.setOutput('archetype', archetype);
        if (postComment && githubToken) {
            core.info('Posting report as PR comment...');
            await (0, comment_1.postPrComment)(githubToken, stdout);
        }
    }
    catch (error) {
        if (error instanceof Error) {
            core.setFailed(error.message);
        }
        else {
            core.setFailed(String(error));
        }
    }
}
run();

})();

module.exports = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=index.js.map