# Search Specification

## Purpose

Defines the full-text search experience of the documentation site: where the search index comes from, what it covers, how a reader reaches results, and how the search interface behaves in each published locale.

## Requirements

### Requirement: Self-Hosted Search

The site SHALL provide full-text search that is served entirely from the site's own static output. Search MUST NOT depend on a third-party search service, an API key, or any runtime backend.

#### Scenario: Site is deployed as static files

- **WHEN** the built site is served from a static host with no backend
- **THEN** search works for the reader without any external service being contacted

### Requirement: Search Available From Every Page

The site SHALL expose a search entry point in the site chrome on every page, opening a search dialog in place without navigating away.

#### Scenario: Reader searches from a documentation page

- **WHEN** a reader activates the search control from any page
- **THEN** a search dialog opens over the current page and accepts a query

### Requirement: Index Covers Published Documentation Pages

The search index SHALL be built from the site's published documentation pages at build time, so that a newly added page becomes findable once the site is rebuilt, with no separate indexing step.

#### Scenario: Contributor adds a page and rebuilds

- **WHEN** a contributor adds a documentation page and the site is rebuilt and deployed
- **THEN** searching for text from that page returns a result leading to it

#### Scenario: Reader selects a result

- **WHEN** a reader selects a result in the search dialog
- **THEN** the site navigates to the corresponding page

### Requirement: Localized Search Interface

The search control and dialog SHALL present their labels, the empty-results message, and the keyboard hints in the language of the locale the reader is browsing.

#### Scenario: Reader searches in French

- **WHEN** a reader on a French page opens search and enters a query with no matches
- **THEN** the search button label, the no-results message, the reset control, and the navigate/select hints are shown in French
