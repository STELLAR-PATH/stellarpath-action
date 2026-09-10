# StellarPath Repository Navigator Action

[![CI](https://github.com/STELLAR-PATH/stellarpath-action/actions/workflows/test.yml/badge.svg)](https://github.com/STELLAR-PATH/stellarpath-action/actions)

Automates repository structure analysis, Soroban contract discovery, and PR navigation reports.

## Usage

*Note: This action automatically downloads and runs the `stellarpath-cli` binary release under the hood to perform deterministic AST-backed scans.*

Create a workflow file `.github/workflows/stellarpath.yml` in your repository.

```yaml
name: StellarPath Scan

on:
  pull_request:
    branches: [main]

jobs:
  scan:
    runs-on: ubuntu-latest
    permissions:
      pull-requests: write
      contents: read
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Run StellarPath Navigator
        uses: STELLAR-PATH/stellarpath-action@v1
        with:
          path: '.'
          format: 'markdown'
          post-comment: 'true'
          github-token: ${{ secrets.GITHUB_TOKEN }}
```

### Inputs

- `path`: Path to scan (default: `.`)
- `format`: Output format (`markdown`, `json`, `terminal`) (default: `markdown`)
- `post-comment`: Post summary as PR comment (default: `true`)
- `github-token`: GitHub token for PR comments (default: `${{ github.token }}`)
- `version`: StellarPath CLI version tag to download (default: `latest`)

### Outputs

- `archetype`: Detected project archetype
- `report`: Raw scan output
