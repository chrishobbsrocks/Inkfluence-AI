# Sprint 18: Platform Management and Publishing

## Overview

| Field | Value |
|-------|-------|
| Sprint | 18 |
| Title | Platform Management and Publishing |
| Epic | 8 - Publishing Hub |
| Status | Planning |
| Created | 2026-02-13 |
| Started | - |
| Completed | - |

## Goal

Build the publishing platform management UI with platform connections, format-specific exports, and publication status tracking.

## Background

The final feature of the Core Product. Users connect publishing platforms (KDP, Apple Books, Google Play, Kobo), select which platforms to publish to, and trigger format-specific exports. For MVP, "publishing" means generating platform-optimized files and tracking manual submission status — not direct API integration (these platforms don't offer public submission APIs).

## Requirements

### Functional Requirements

- [ ] Platform list showing connection status (Connected/Not connected)
- [ ] Platform cards: logo placeholder, name, status, checkbox (for connected) or Connect button
- [ ] "Add platform" card (dashed border)
- [ ] Platform connection flow (store credentials/account info)
- [ ] "Publish to All Selected" button in header
- [ ] Checkbox selection for which platforms to publish to
- [ ] Format-specific export generation when "publishing"
- [ ] Publication status tracking per platform (Draft, Submitted, Published, Rejected)
- [ ] Platform-specific formatting guidelines shown

### Non-Functional Requirements

- [ ] Platform credentials stored securely (encrypted)
- [ ] Clear indication this is export + manual submission for MVP

## Dependencies

- **Sprints**: Sprint 17 (metadata must be complete), Sprint 14 (export engine)
- **External**: None

## Scope

### In Scope

- Platform management UI
- Platform connection storage
- "Publish" action (generates platform-optimized exports + guides)
- Status tracking per platform
- Integration with export engine

### Out of Scope

- Direct API publishing to KDP/Apple/Google (no public APIs)
- Automated submission
- Real-time publishing status from platforms

## Technical Approach

### Reference: Wireframe PublishScreen platform section (lines 625-651)

### Platform Model
```
publishing_platforms: id, book_id, platform_name, platform_code, status (draft|submitted|published|rejected), connected (boolean), submitted_at, published_at, notes
```

### "Publish" Flow
1. User selects platforms
2. Click "Publish to All Selected"
3. System generates format-specific files:
   - KDP: PDF interior + separate cover PDF + metadata file
   - Apple Books: EPUB + metadata
   - Google Play: EPUB + metadata
   - Kobo: EPUB + metadata
4. Files packaged as ZIP per platform
5. Download links provided
6. Platform status set to "Submitted" with timestamp
7. User manually uploads to each platform

### Platform Guidelines
Show brief instructions for manual upload:
- KDP: "Upload at kdp.amazon.com → Your Bookshelf → Create New"
- Apple Books: "Upload at itunesconnect.apple.com → Books"
- Etc.

## Tasks

### Phase 2: Implementation
- [ ] Add publishing_platforms table and migrate
- [ ] Create PlatformList component (cards with connection state)
- [ ] Create PlatformCard component (logo, name, status, checkbox/connect)
- [ ] Create AddPlatform component (dashed border CTA)
- [ ] Implement platform connection storage
- [ ] Implement "Publish" action (triggers exports per platform)
- [ ] Create platform-specific export bundles (ZIP files)
- [ ] Implement status tracking (update status per platform)
- [ ] Create PublishingStatus component (status badges per platform)
- [ ] Add platform-specific upload guidelines
- [ ] Wire "Publish to All Selected" button

## Acceptance Criteria

- [ ] Platform cards show for KDP, Apple Books, Google Play, Kobo
- [ ] Connected platforms show checkbox, unconnected show "Connect" button
- [ ] "Add platform" card visible with dashed border
- [ ] "Publish to All Selected" generates platform-specific exports
- [ ] Downloads provided for each platform's files
- [ ] Status tracking updates per platform
- [ ] Platform guidelines shown for manual upload
- [ ] UI matches wireframe platform section (lines 625-651)
- [ ] This completes the Core Product — all P1 features functional

## Notes

Wireframe reference: PublishScreen platform section, lines 625-651.
This is the CAPSTONE sprint. When this is done, Inkfluence AI Core Product is feature-complete.
