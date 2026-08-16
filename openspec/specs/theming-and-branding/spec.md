# Theming And Branding Specification

## Purpose

Defines the visual identity and shared metadata of the documentation site: the branded chrome and assets, the reader-selectable colour scheme, and the title, description, and social preview metadata every page carries.

## Requirements

### Requirement: Branded Site Chrome

The site SHALL present the Danet identity consistently across every page, showing the project logo in the navigation bar and a site favicon in the browser tab.

#### Scenario: Reader loads any page

- **WHEN** a reader loads any page of the site
- **THEN** the Danet logo is shown in the navigation bar and the browser tab shows the site favicon

### Requirement: Brand Accent Colour

The site SHALL apply a project accent colour on top of the base documentation theme, used for interactive and highlighted elements, rather than the theme's stock accent.

#### Scenario: Reader views an accented element

- **WHEN** a reader views a link, an active navigation entry, or a primary call-to-action button
- **THEN** it is rendered in the project's accent colour

### Requirement: Reader-Selectable Colour Scheme

The site SHALL offer light and dark appearances and SHALL let the reader switch between them from the site chrome.

#### Scenario: Reader toggles appearance

- **WHEN** a reader activates the appearance switch in the navigation bar
- **THEN** the site re-renders in the other colour scheme and all content remains legible

### Requirement: Site Title And Description Metadata

Every page SHALL carry the site title and a one-line site description written in the page's own locale.

#### Scenario: Page metadata is inspected

- **WHEN** a page is loaded in any published locale
- **THEN** its document title includes the site name and its description is the locale's own description text

### Requirement: Social Preview Metadata

Every page SHALL carry Open Graph and Twitter card metadata declaring the site's canonical documentation URL, title, and locale-appropriate description, so shared links render a preview.

#### Scenario: A documentation link is shared

- **WHEN** a link to a page is pasted into a social or chat client that reads link metadata
- **THEN** the preview shows the site title and the page locale's description, pointing at the canonical documentation domain

### Requirement: Static Branding Assets Served From The Site Root

Branding and illustration assets SHALL be addressable at stable root-relative URLs on the published site, so pages and configuration can reference them with a leading-slash path.

#### Scenario: A page references the logo

- **WHEN** a page or the site configuration references a branding asset by a root-relative path
- **THEN** the asset resolves on the published site at that exact path
