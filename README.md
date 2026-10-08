<div align="center">

# `stellarpath-action`

**Automated Pull Request Security Gatekeeper for Soroban**

[![Stellar Ecosystem](https://img.shields.io/badge/Stellar-Soroban-7B3FE4?style=for-the-badge&logo=stellar)](https://stellar.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

</div>

## 📖 Overview

`stellarpath-action` is a native GitHub Action that integrates `stellarpath-cli` directly into your CI/CD pipeline. It executes deterministic AST lint checks on every pull request, preventing security regressions and storage collisions from being merged into your main branch.

## ✨ Key Features

- **Inline PR Annotations**: Comments directly on lines of code that contain security vulnerabilities or Soroban anti-patterns.
- **Zero-Warning Verification**: Blocks PRs from merging if critical severity issues are detected.
- **SARIF Diagnostics**: Uploads results to GitHub Advanced Security natively.
- **Fast Execution**: Downloads pre-compiled `stellarpath-cli` binaries for instant checks.

## 🚀 Usage in Your Repository

Add the following workflow file to your Soroban contract repository (e.g., `.github/workflows/stellarpath.yml`):

```yaml
name: Soroban Security Audit

on:
  pull_request:
    branches: [ "main" ]

jobs:
  analyze:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4
        
      - name: Run STELLAR-PATH Linting
        uses: STELLAR-PATH/stellarpath-action@v1
        with:
          target-directory: './contracts'
          fail-on-warnings: true
```

## 🤝 Contributing & Reviewers

**For Contributors:**
- Install dependencies with `npm install`.
- The main action logic is in `src/main.ts`.
- Before committing, you must compile the action using `npm run build` or `npm run package` to update the `dist/` folder, as GitHub Actions runs the packaged JavaScript.

**For Reviewers:**
- Verify that changes to `action.yml` inputs align with the TypeScript definitions.
- Ensure any CLI version bumps are reflected securely via sha256 checksums if downloading binaries.

---
<div align="center">
  <sub>Part of the <a href="https://github.com/STELLAR-PATH">STELLAR-PATH</a> Toolchain. Built for the Soroban ecosystem.</sub>
</div>
