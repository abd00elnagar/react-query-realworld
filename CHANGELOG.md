# Changelog

## [1.0.0] - 2025-10-29

### 1. Authentication Updates (2b751ee4)
- Updated Authorization header to use Bearer scheme
- Implemented JWT token handling for new auth provider
- Updated API client configuration
- Enhanced error handling for auth requests

### 2. Error Handling & UI Improvements (53472838)
- Added comprehensive error handling system
- Implemented ServerErrorAlert component
- Enhanced form validation feedback
- Added loading states to authentication flows
- Improved user feedback for API errors

### 3. Settings & Profile Optimizations (91d4a008)
- Enhanced settings form validation
- Improved profile data handling
- Added partial update support
- Implemented proper error handling for settings updates
- Enhanced user profile state management

### 4. Article Revision System UI (8c33da47)
### Added
- Article revision management UI
  - Created `RevisionList` component with:
    - List view of all revisions
    - Date formatting utilities
    - Loading and empty states
    - Revision actions (view, revert)
  - Added `RevisionDetailPage` component with:
    - Detailed revision view
    - Metadata display
    - Code presentation
    - Revert functionality
  - Created `ArticleRevisionsPage` container
  - Added new routes:
    - `/article/:slug/revisions`
    - `/article/:slug/revisions/:revisionId`

### Changed
- API client changes:
  - Updated Authorization header from `Token <jwt>` to `Bearer <jwt>`
  - Fixed token removal on HTTP 429
  - Enhanced error handling for network issues
- Updated TypeScript interfaces:
  - Added `id` field to `IArticle` interface
  - Added revision-related types
- Enhanced router configuration with new revision routes
- Updated article page button layout for better UX

### Fixed
- Profile item rendering:
  - Added guard for undefined user data
  - Fixed profile NavLink path
- Settings update flow:
  - Improved payload handling for partial updates
  - Fixed validation issues with empty fields
  - Better handling of unchanged values
- Error handling improvements:
  - Added `getFriendlyError` utility
  - Enhanced error boundary rendering
  - Added `ServerErrorAlert` component
  - Implemented consistent error handling across forms/actions

### UI/UX Improvements
- Added responsive design for all revision components
- Implemented animated transitions and loading states
- Created consistent button styles
- Added mobile-optimized layouts
- Enhanced accessibility with keyboard navigation
- Improved empty and loading state designs

### Technical Improvements
- Added CSS modules for revision components
- Enhanced TypeScript type safety
- Improved API client integration
- Added comprehensive error handling
- Enhanced performance with proper React Query integration