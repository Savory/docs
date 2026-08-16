# Content Organization Specification

## Purpose

Defines the contract a contributor must satisfy for a documentation page to appear on the site in the right place: where content files live, how directories become navigation groups, and how page and section metadata controls naming, ordering, and initial expansion.

## Requirements

### Requirement: Content Tree Drives Navigation Structure

The site SHALL derive its navigation structure from the documentation content tree, with no hand-maintained navigation list. A page placed in a section directory SHALL appear inside that section's navigation group and SHALL be served at the URL matching its path within the content tree.

#### Scenario: Contributor adds a page to an existing section

- **WHEN** a contributor adds a Markdown page under an existing section directory and rebuilds the site
- **THEN** the page appears in that section's sidebar group and is served at the path derived from its location, without any navigation or configuration file being edited

#### Scenario: Contributor adds a top-level page

- **WHEN** a contributor adds a Markdown page directly at the root of the content tree
- **THEN** the page appears as a standalone sidebar entry at the top level rather than inside a group

### Requirement: Page Metadata Controls Label And Position

A page SHALL declare its navigation label and its position within its section through front matter. The declared label SHALL be used as the sidebar text.

#### Scenario: Page declares a label

- **WHEN** a page's front matter sets a label
- **THEN** the sidebar shows that label for the page instead of a name derived from the file name

#### Scenario: Page omits a label

- **WHEN** a page's front matter does not set a label
- **THEN** the sidebar shows a name derived from the file name, capitalised and with hyphens rendered as spaces

### Requirement: Descending Ordering Within A Section

Pages within a section SHALL be ordered by their declared order value in descending order, so that a higher value appears higher in the sidebar. A page that declares no order value SHALL sort below pages that do.

#### Scenario: Contributor inserts a page between two others

- **WHEN** a contributor gives a new page an order value between the values of two sibling pages
- **THEN** the new page appears between those two pages in the sidebar

#### Scenario: Page declares no order

- **WHEN** a page in a section carries no order value
- **THEN** it is placed after all sibling pages that declare one

### Requirement: Section Metadata Controls Group Label, Position And Expansion

Each section directory SHALL carry a section metadata file declaring the group's position among the other sections and whether the group starts expanded, and MAY declare a display label. Sections SHALL be ordered by that position in descending order. When no label is declared, the group SHALL be named after the directory with its first letter capitalised.

#### Scenario: Section declares a custom label

- **WHEN** a section's metadata declares a label
- **THEN** the sidebar group is titled with that label rather than the directory name

#### Scenario: Section is marked collapsed

- **WHEN** a section's metadata marks the group as not expanded
- **THEN** the group is rendered collapsed on first load and the reader can expand it

### Requirement: Home Page Excluded From The Sidebar

The landing page of a locale SHALL NOT appear as a sidebar entry, and non-Markdown files in the content tree SHALL NOT produce sidebar entries.

#### Scenario: Sidebar is generated for a locale

- **WHEN** the sidebar for a locale is generated from that locale's content tree
- **THEN** the locale's landing page and any section metadata files are absent from the sidebar, while every other Markdown page is present
