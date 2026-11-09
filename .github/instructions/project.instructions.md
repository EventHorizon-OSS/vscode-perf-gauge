---
description: "Use when implementing or reviewing changes in vscode-perf-gauge. Covers project structure, focused changes, testing, and documentation."
---

# Project Instructions

- This project is a Visual Studio Code extension built with TypeScript and Node.js.
- Keep all application and library source code under `src/`.
- Keep all unit tests under `tests/`, mirroring the corresponding `src/` directory structure and file names. For example, tests for `src/features/example.ts` belong in `tests/features/example.test.ts`.
- Keep changes focused and follow the repository's existing structure and conventions.
- Preserve the extension's existing behavior and user experience when changing implementation.
- Add or update tests for behavior changes, and run the relevant checks available in the repository.
- Update the README when a change affects setup, usage, or other user-facing behavior.
- Avoid adding dependencies unless they are necessary for the change.
