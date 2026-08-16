# Site Build And Deploy Specification

## Purpose

Defines how the documentation site is developed, built into a deployable static bundle, previewed, and published, including the guarantees a contributor can rely on when running the site locally and the behaviour of the build with respect to broken links and static assets.

## Requirements

### Requirement: Local Development Server With Live Reload

The project SHALL provide a single command that serves the documentation locally and reflects edits to content, navigation metadata, and configuration without a manual restart.

#### Scenario: Contributor edits a page while the dev server runs

- **WHEN** a contributor saves a change to a documentation page while the local development server is running
- **THEN** the open page updates to show the change without the contributor restarting the server

#### Scenario: Contributor adds a page while the dev server runs

- **WHEN** a contributor adds a new page with navigation front matter while the development server is running
- **THEN** the page becomes reachable and appears in the sidebar at the position its metadata dictates

### Requirement: Static Production Build

The project SHALL provide a single command that produces a self-contained static site from the content tree, requiring no server-side runtime to host.

#### Scenario: Contributor builds the site

- **WHEN** a contributor runs the production build command
- **THEN** a static output directory is produced containing an HTML page for every documentation page in every published locale, plus its assets

### Requirement: Static Assets Included In The Build Output

The production build SHALL place the project's static assets at the root of the build output, so that root-relative asset references resolve on the deployed site exactly as they do in local development.

#### Scenario: Built site is served

- **WHEN** the production build output is served and a page requests a branding asset by its root-relative path
- **THEN** the asset is found at that path in the build output

### Requirement: Build Tolerates Dead Links

The build SHALL NOT fail because a page links to a target that cannot be resolved; unresolved links SHALL be published as written.

#### Scenario: A page links to a page that does not exist

- **WHEN** the production build runs over content containing an unresolvable internal link
- **THEN** the build completes successfully and produces the full site

### Requirement: Local Preview Of The Production Build

The project SHALL provide a command that serves the production build locally, so a contributor can verify the deployable output before publishing.

#### Scenario: Contributor verifies a build

- **WHEN** a contributor runs the preview command after a production build
- **THEN** the built static site is served locally and behaves as it will when deployed

### Requirement: Build Output Is Not Tracked

Generated build output and installed dependencies SHALL NOT be committed to the repository; the site SHALL be reproducible from the tracked sources plus a dependency install.

#### Scenario: Contributor clones the repository

- **WHEN** a contributor clones the repository and installs dependencies
- **THEN** the production build command reproduces the full site without any generated artefact being present in version control

### Requirement: Published Site And Usage Measurement

The site SHALL be published at the project's canonical documentation domain, and its pages SHALL report a page view to a privacy-friendly analytics counter loaded asynchronously so it never blocks rendering.

#### Scenario: Reader loads a published page

- **WHEN** a reader loads a page on the published documentation site
- **THEN** the page renders without waiting on the analytics counter, and a page view is reported to the project's analytics endpoint
