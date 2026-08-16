# Site Navigation Specification

## Purpose

Defines how a reader moves around the Danet documentation site: the persistent top navigation bar, the per-section sidebar, the landing page entry points, links out to the project's community and legacy documentation, and the per-page link back to the source file on GitHub.

## Requirements

### Requirement: Persistent Top Navigation

The site SHALL render a top navigation bar on every page containing, at minimum, a link to the home page and a link to the documentation entry point.

#### Scenario: Reader opens any documentation page

- **WHEN** a reader loads any page of the site
- **THEN** the top navigation bar is present with a "Home" entry and a "Documentation" entry

#### Scenario: Reader enters the documentation

- **WHEN** a reader activates the "Documentation" navigation entry
- **THEN** the reader lands on the introduction welcome page

### Requirement: Landing Page Entry Points

The site SHALL present a landing page at the root of each locale that offers a primary call to action into the documentation and a secondary call to action to the framework source repository.

#### Scenario: Reader arrives at the site root

- **WHEN** a reader loads the site root
- **THEN** a hero section is shown with a "Get Started" action linking into the introduction welcome page and an action linking to the Danet GitHub repository

### Requirement: Version Navigation

The top navigation SHALL identify the documentation version the reader is currently viewing and MUST offer a link to the documentation of the previous major version, which is hosted separately.

#### Scenario: Reader looks for older documentation

- **WHEN** a reader opens the version menu in the top navigation
- **THEN** the menu is labelled for the current stable major version and contains a link to the legacy version's own documentation site

### Requirement: Community And Project Links

The site SHALL expose links to the project's community and source channels from the site chrome on every page.

#### Scenario: Reader looks for help

- **WHEN** a reader inspects the top navigation bar
- **THEN** links to the project's GitHub repository, Discord server, X/Twitter account, and GitHub Discussions are reachable without leaving the current page

### Requirement: Section Sidebar

The site SHALL render a sidebar alongside documentation pages listing the sections and pages available in the reader's current locale, so that any page in the same locale is reachable in one click from any other.

#### Scenario: Reader browses within a section

- **WHEN** a reader is on a documentation page
- **THEN** the sidebar lists the site's sections as groups, each group listing its pages, and selecting an entry navigates to that page

#### Scenario: Reader is browsing a translated locale

- **WHEN** a reader is on a page of a non-root locale
- **THEN** the sidebar lists only pages that exist in that locale, and every entry links to a page within that locale

### Requirement: Per-Page Source Edit Link

Every documentation page SHALL offer a link that takes the reader to the editable source of that exact page in the documentation repository.

#### Scenario: Reader spots a mistake

- **WHEN** a reader reaches the bottom of a documentation page and activates the suggest-changes link
- **THEN** the GitHub edit view for that page's source file opens, and the link text is written in the page's locale
