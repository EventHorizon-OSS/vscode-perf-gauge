<!--
Sync Impact Report
Version change: 3.2.0 -> 3.3.0
Modified principles:
- V. Tested VS Code Integration (added coverage and parameterized testing requirements)
Modified sections: Development Workflow and Quality Gates
Added sections: none
Removed sections: none
Follow-up TODOs: none
-->

# VS Code Performance Gauge Constitution

## Core Principles

### I. Accurate, Explicit Metrics
Every displayed measurement MUST state whether it describes the host or a process, identify
its unit and scope, and come from a documented source. Readings MUST come only from the host
environment where the extension's metric collector executes. That environment may be Windows,
macOS, Linux, a devcontainer, or a Codespace. The extension MUST NOT fall back to collecting
metrics or processes from the VS Code UI client device or another host. The panel MUST identify
the collector environment and MUST NOT present container-scoped readings as whole-machine
values. Collection MUST distinguish unavailable or unsupported readings from zero; the panel
MUST mark values stale rather than present them as current. Process resource readings MUST
specify the resource definition and ranking basis. This keeps the gauges and process list
trustworthy across supported hosts and execution environments.

### II. Localhost-Only Operation and Privacy
The extension's sole monitoring target MUST be the current localhost: the environment where
its metric collector executes, including a devcontainer or Codespace. The extension, its
webviews, dependencies, and helper processes MUST NOT initiate connections to any destination
outside that localhost. Any network connection they initiate MUST terminate on that
environment's loopback interface. Telemetry, external APIs, remote monitoring endpoints, and
runtime downloads of scripts, fonts, or other assets MUST NOT be used, even with user opt-in.

Host metrics, process names, and process identifiers MUST remain in memory for the active
monitoring session and MUST NOT be persisted or exported. Displaying these readings through
VS Code's existing extension-to-panel messaging is permitted, including its platform-managed
transport for desktop or web clients attached to a devcontainer or Codespace. This permission
MUST NOT authorize an extension-initiated non-localhost connection or collection from the UI
client device. Collection MUST be limited to fields needed for displayed functionality.
Keeping collection and connectivity local prevents this monitoring tool from becoming a
network client or a data-export mechanism.

### III. Bounded, Responsive Monitoring
Collection MUST use asynchronous APIs and bounded sampling and process enumeration. It MUST NOT
perform unbounded or long-running synchronous work on the extension host, and panel rendering
MUST remain responsive. Refresh cadence and process-list size MUST have explicit safe limits.
Closing the monitoring UI or deactivating the extension MUST release timers, subscriptions,
and other collection resources. This prevents monitoring from degrading the host being observed.

### IV. Transparent, Accessible Gauges
The extension MUST open its monitoring UI in a separate VS Code panel. The panel MUST contain
vertically stacked blocks called dashboards. Each dashboard MUST group tiles by metric or
resource type and arrange its tiles horizontally; for example, multiple CPU tiles belong to
a single CPU dashboard. A tile is an individual metric display within its dashboard. This
panel-to-dashboard-to-tile hierarchy MUST be consistent across supported clients.

The panel MUST provide visible dashboard and tile labels and metric units and expose equivalent
names and values to keyboard and assistive technology users. It MUST distinguish missing,
stale, and unsupported readings and show when the last successful refresh occurred. Each
process entry MUST identify the process and the metric values attributed to it; processes
that exit during collection MUST NOT make the view fail. Clear grouping, labels, and statuses
prevent misleading displays and make the panel usable.

### V. Tested VS Code Integration
VS Code API access and platform-specific collectors MUST be isolated behind testable boundaries.
Each behavior change MUST have automated tests at the narrowest appropriate level. Unit tests
MUST cover normalization, aggregation or ordering, and unavailable, empty, or error cases for
changed collection logic; integration tests MUST cover affected extension-host behavior and
panel lifecycle. Bug fixes MUST add regression coverage or explain why automated coverage is
not feasible.

Unit tests MUST achieve at least 95% coverage independently for lines, statements, functions,
and branches across application and library source code under `src/`, including files not
imported by tests. Integration test execution MUST NOT count toward this unit-test threshold.
All unit tests MUST be parameterized, with each test definition executed against at least two
distinct parameter sets with explicit expected outcomes. Duplicate cases MUST NOT count as
distinct parameter sets. Each tested behavior MUST include positive cases for valid inputs
or successful operation and negative cases for invalid inputs, failures, or unavailable data.
Tests reduce regressions across VS Code and host variations; coverage and varied cases help
expose untested paths rather than only demonstrating successful execution.

## Technical and Product Constraints

- The extension MUST use the repository's TypeScript, Node.js, and VS Code API toolchain and
  support the minimum VS Code version declared in `package.json`. New runtime dependencies MUST
  be justified by concrete requirements.
- Application code MUST remain under `src/`; unit tests under `tests_unit/` MUST mirror `src/`;
  extension-host integration tests MUST remain under `tests_integration/`.
- Extension configuration MUST be exposed through the standard VS Code Settings UI at both
  User and Workspace levels. Settings MUST be declared through `contributes.configuration`
  with types, defaults, descriptions, and appropriate validation constraints.
- Configuration MUST use VS Code's configuration API and standard precedence rules so that
  workspace values override user values where applicable. Settings MUST work consistently
  across supported clients and execution environments. The extension MUST document when
  changes take effect and any required reload. Settings MUST NOT permit bypassing the
  localhost-only connectivity and collection boundary or monitoring resource limits.
- The extension MUST activate and present its core panel and process view in desktop VS Code
  and VS Code for the Web, across local workspaces, devcontainers, and GitHub Codespaces.
  Collectors MUST use APIs available in the active execution environment; inaccessible metrics
  or process details MUST be reported clearly and MUST NOT prevent activation or appear as zero.
- Metrics and process inventory MUST be collected only from the environment hosting the
  collector. The extension MUST NOT collect or fall back to data from the VS Code UI client's
  device or a parent machine. The UI MUST identify the collector environment and metric scope.
- Runtime functionality MUST operate without extension-initiated external network access.
  UI assets MUST be bundled with the extension. Any localhost networking MUST validate the
  actual destination as loopback; redirects, proxies, or hostname resolution MUST NOT bypass
  this boundary. In containers, localhost MUST mean the container itself, not the parent host.
- Core monitoring MUST work on Windows, macOS, and Linux, including Ubuntu and similar
  mainstream distributions. The panel and process list MUST work on each platform; unavailable
  metrics MUST be identified explicitly rather than represented as zero or replaced with
  misleading values.
- Platform-specific metric collection MUST document supported operating systems, any required
  system interfaces, and metric semantics. It MUST report unsupported data rather than
  substitute fabricated or misleading values.
- Host and process views MUST use documented resource definitions and units. When a resource
  can be measured in multiple ways, the chosen definition MUST be identified in the UI or
  documentation.

## Development Workflow and Quality Gates

- Changes MUST include tests for changed behavior and README updates when setup, usage, supported
  platforms, execution environments, or data-handling behavior changes.
- Before merge and release, the full unit suite MUST produce a coverage report and fail if
  any of line, statement, function, or branch coverage is below 95%. Coverage configuration
  MUST NOT omit source files or executable paths merely to meet the threshold. Review MUST
  confirm that every unit test is parameterized with at least two distinct parameter sets
  and that tested behaviors include both positive and negative scenarios.
- Configuration changes MUST include tests for defaults, User and Workspace values, workspace
  override precedence, and invalid values. Validation MUST confirm that settings are available
  in the standard Settings UI at both levels and that changes take effect as documented.
  Setting names, defaults, scopes, and effects MUST be documented in the README.
- Panel layout changes MUST verify that dashboards stack vertically, tiles align horizontally
  within each dashboard, and tiles are grouped by metric or resource type. Validation MUST
  cover the separate panel and this hierarchy in both desktop and web VS Code.
- Before merging, contributors MUST run `npm run compile` and the relevant unit and integration
  test suites. `npm test` MUST pass before releases and changes that affect both test layers.
  Any required check that cannot be run MUST be explained in the pull request.
- Before release, platform support MUST be verified on Windows, macOS, and Linux (Ubuntu or a
  similar distribution) through CI or documented test results. Platform-specific changes MUST
  be tested on each affected operating system.
- Before release, activation and the core panel MUST be verified in desktop and web VS Code.
  Validation MUST also cover local workspaces, a devcontainer, and GitHub Codespaces; changes
  affecting a specific client or execution environment MUST be tested there. Remote-context
  tests MUST confirm readings come from the collector's environment, not the UI client or a
  parent machine.
- Pull requests MUST describe visible behavior changes, supported-platform and
  execution-environment impact, data-handling impact, and test evidence. Reviewers MUST verify
  applicable principles before approval.
- Changes affecting networking, dependencies, helpers, or webview resources MUST include
  evidence that no extension-initiated connections leave localhost. Tests MUST reject
  non-loopback destinations and redirects or proxy paths that could bypass the restriction
  when networking is used. Release validation MUST verify operation with extension-initiated
  external network access blocked.

## Governance

This constitution governs feature proposals, implementation, review, and releases. An exception
to a principle MUST be explicit, limited in scope, justified in the pull request, and approved
by maintainers before merge. The localhost-only connectivity and collection boundary MUST NOT
be waived through configuration, user opt-in, or a pull-request exception; changing it requires
a constitutional amendment.

Amendments MUST be proposed in a pull request that explains the rationale, affected principles,
compatibility impact, and any required migration. Maintainers MUST approve amendments before
they take effect.

The constitution uses semantic versioning. A MAJOR increment marks a backward-incompatible
governance change or removal or redefinition of a principle. A MINOR increment marks a new
principle or section, or materially expanded guidance. A PATCH increment marks clarifications
and other non-semantic refinements. Every amendment MUST update the version and last-amended
date.

Every implementation pull request MUST be reviewed for compliance with applicable principles,
including metric accuracy, localhost-only connectivity, data handling, resource bounds,
accessibility, and test evidence.
Reviewers MUST require a documented, approved exception for any deviation. Release review MUST
confirm that supported platforms, execution environments, and user-facing metric definitions
and reading sources are accurately documented.

**Version**: 3.3.0 | **Ratified**: 2026-11-09 | **Last Amended**: 2026-11-09
