# Internationalization Specification

## Purpose

Defines how the documentation site serves more than one language: which locales are published, how translated pages are addressed, how a reader switches between them, and how partial translation coverage is handled without producing broken navigation.

## Requirements

### Requirement: English Root Locale And Prefixed Translations

The site SHALL serve English as the root locale at the site root and SHALL serve each additional published locale under a path prefix matching its language code. French SHALL be published under a French prefix.

#### Scenario: Reader opens the site root

- **WHEN** a reader loads a path with no locale prefix
- **THEN** the English version of that page is served

#### Scenario: Reader opens a French path

- **WHEN** a reader loads a path beginning with the French locale prefix
- **THEN** the French version of that page is served

### Requirement: Locale Switching

The site SHALL let a reader switch between the published locales from the site chrome, and each locale SHALL be presented under its own language name.

#### Scenario: Reader switches language

- **WHEN** a reader opens the language menu in the top navigation
- **THEN** entries for "English" and "Français" are offered, and selecting one navigates to that locale

### Requirement: Mirrored Translation Structure

A translated page SHALL live at the same section and page path as its English counterpart, below that locale's prefix, so that the two versions share a structure and a translated page inherits the same navigation placement rules as the English original.

#### Scenario: Contributor translates an existing page

- **WHEN** a contributor adds a translated page at the mirrored path under a locale's subtree, with its own label and order metadata
- **THEN** the page is served under that locale's prefix at the mirrored URL and appears in that locale's sidebar in the corresponding section

### Requirement: Locale-Scoped Navigation

Each locale's navigation SHALL be built only from that locale's own content, and translated subtrees SHALL NOT leak into the root locale's navigation.

#### Scenario: Reader browses the English sidebar

- **WHEN** the English sidebar is rendered
- **THEN** no translated subtree appears as a section, and no entry links into a prefixed locale

### Requirement: Partial Translation Coverage

The site SHALL tolerate a locale that translates only part of the documentation. Pages missing from a locale SHALL simply be absent from that locale's navigation rather than producing an entry that leads nowhere.

#### Scenario: An English page has no translation

- **WHEN** a page exists only in the English tree
- **THEN** it is listed in the English sidebar and is absent from the other locales' sidebars, and no locale's navigation contains an entry for a page it does not have

### Requirement: Localized Site Chrome

Each published locale SHALL present its site chrome in that locale's language, including the top navigation entry names, the page-level suggest-changes link text, and the site description used for metadata.

#### Scenario: Reader browses in French

- **WHEN** a reader is on a French page
- **THEN** the navigation entries, the suggest-changes link, and the site description are rendered in French
