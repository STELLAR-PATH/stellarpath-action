<div align="center">

<h1>🛡️ <code>stellarpath-action</code> 🛡️</h1>
<h3>Automated Pull Request Security Gatekeeper for Soroban</h3>

[![Stellar Ecosystem](https://img.shields.io/badge/Stellar-Soroban-7B3FE4?style=for-the-badge&logo=stellar)](https://stellar.org)
[![Rust 2021](https://img.shields.io/badge/Rust-2021-DEA584?style=for-the-badge&logo=rust)](https://www.rust-lang.org)
[![Drips Stellar Wave](https://img.shields.io/badge/Drips-Stellar%20Wave%20Participant-00D395?style=for-the-badge)](https://drips.network)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

</div>

---

## 📖 1. Executive Summary

`stellarpath-action` is the native GitHub Action deployment of the `stellarpath-cli` AST analyzer. It operates as an impenetrable continuous integration gatekeeper, automatically auditing incoming pull requests for Soroban smart contract repositories.

Following the operational standards of elite protocols like **StellarCanary**, this action directly intercepts security anti-patterns (DataKey collisions, unwrap abuses, TTL mismanagement) by failing CI checks and injecting contextual code review comments directly onto the offending lines in the GitHub PR UI.

---

## 🏗️ 2. Execution Architecture

1. **Environment Provisioning**: Downloads the pre-compiled `stellarpath-cli` Rust binary optimized for the GitHub Actions `ubuntu-latest` runner.
2. **AST Scanning**: Executes `stellarpath scan --format sarif` against the designated contract directory.
3. **Diagnostic Aggregation**: Parses the output payload and maps AST line numbers to GitHub Pull Request diff indices.
4. **Enforcement**: Submits inline review comments and terminates with an exit code `1` if strict mode is enabled.

```text
       +-------------------------------------------------------------+
       |               stellarpath-action (GitHub Action)            |
       |  * Pull Request AST auditing & automated review comments    |
       |  * Zero-warning verification rules                          |
       |  * SARIF / JSON diagnostic reporting                        |
       +-------------------------------------------------------------+
```

---

## 🚀 3. Implementation Matrix

To integrate this gatekeeper, define a new workflow file at `.github/workflows/stellarpath-security.yml`.

### Example A: Strict Enforcement (Production)
```yaml
name: "Soroban Security Audit"
on:
  pull_request:
    branches: [ "main", "release/*" ]

jobs:
  analyze:
    name: "AST Security Scan"
    runs-on: ubuntu-latest
    steps:
      - name: "Checkout code"
        uses: actions/checkout@v4
        
      - name: "Execute STELLAR-PATH"
        uses: STELLAR-PATH/stellarpath-action@v1
        with:
          target-directory: './contracts'
          fail-on-warnings: true
          inline-comments: true
```

### Example B: Matrix Build with GitHub Advanced Security
```yaml
jobs:
  analyze:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: STELLAR-PATH/stellarpath-action@v1
        with:
          target-directory: './contracts'
          output-format: 'sarif'
          output-file: 'stellarpath-results.sarif'
          
      - name: "Upload SARIF Diagnostics"
        uses: github/codeql-action/upload-sarif@v3
        with:
          sarif_file: stellarpath-results.sarif
```

---

## ⚙️ 4. Input Configuration Specifications

| Input Key | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `target-directory` | `string` | `./` | The root directory containing Soroban Rust contracts. |
| `fail-on-warnings` | `boolean`| `false` | If `true`, the action returns exit code `1` upon any detection. |
| `inline-comments` | `boolean`| `true` | If `true`, publishes GitHub PR review comments on affected lines. |
| `output-format` | `string` | `terminal` | The output telemetry format (`terminal`, `json`, `sarif`). |
| `output-file` | `string` | `""` | File path to write diagnostic outputs (required for SARIF uploads). |
| `cli-version` | `string` | `latest` | Locks the exact version of `stellarpath-cli` to download. |

---

## 🛡️ 5. SARIF Native Integration

When `output-format` is set to `sarif`, `stellarpath-action` serializes the AST diagnostic outputs into the Static Analysis Results Interchange Format (SARIF). 

When uploaded via the CodeQL action, this populates the **GitHub Security tab** natively, allowing project maintainers to track DataKey collision risks and TTL management issues as persistent security alerts across the repository lifecycle.

---

## ⚡ 6. Runner Environment & Caching Strategies

`stellarpath-action` is aggressively optimized to keep CI durations as low as possible. 

**Binary Caching:** Instead of compiling the Rust engine on the runner (which could take 2-4 minutes), the action leverages `@actions/tool-cache` to instantly download and cache the pre-compiled Ubuntu binary of `stellarpath-cli`.

**Runner Agnostic:** While primarily tested on `ubuntu-latest`, the underlying JavaScript executes entirely within the cross-platform Node.js container sandbox native to GitHub Actions. This allows it to run smoothly on `macos-latest` or `windows-latest` runners without relying on bash script polyfills.

---

## 🎛️ 7. Customizing Lint Thresholds & Telemetry

Security needs vary by project. By supplying a `stellarpath.toml` in your target directory, you can instruct `stellarpath-action` to adjust its telemetry.

For example, during a hackathon, you might want inline PR comments but no hard CI failures for missing TTLs. You can downgrade `e0002_missing_ttl` to a warning level, ensuring the action provides guidance without blocking deployment velocity. The action will dynamically read this TOML and adjust the GitHub Checks API outcome accordingly.

---
<div align="center">
  <sub>Part of the <b>STELLAR-PATH</b> Toolchain. Built for the Soroban ecosystem.</sub>
</div>
