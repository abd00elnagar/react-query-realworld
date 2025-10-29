# Changelog

## [1.0.0] - 2025-10-29

### Major Updates Overview

1. Authentication System Enhancement
   - **Problem**: Incompatible JWT token format with Laravel backend
   - **Solution**: Updated authentication to use `Bearer` token scheme
   - **Key Changes**:
     - Changed `Authorization` header from `Token <jwt>` to `Bearer <jwt>`
     - Implemented proper token validation and error handling
     - Added cross-tab synchronization for auth state
     - Automatic token cleanup on 401/403 responses
     - Improved error handling for network and auth failures

2. Article Revision System
   - **Problem**: No way to track or revert article changes
   - **Solution**: Implemented comprehensive revision system
   - **Features**:
     - View complete version history for articles
     - Compare different revisions
     - Restore previous versions
     - Automatic revision creation on updates
   - **UI/UX Improvements**:
     - Intuitive interface for browsing revisions
     - Clear visual diff between versions
     - Confirmation steps for reverting changes

3. Error Handling System
   - **Problem**: Inconsistent error handling and user feedback
   - **Solution**: Implemented comprehensive error handling system
   - **Components**:
     - `ServerErrorAlert` for displaying API errors
     - Error normalization utility for consistent error messages
     - Proper handling of 4xx vs 5xx errors
   - **Features**:
     - User-friendly error messages for common issues
     - Detailed error reporting in development
     - Graceful handling of network errors
     - Consistent error display across all forms and actions
   - Improved error responses:
     - User-friendly 4xx error messages
     - Generic 5xx error handling
     - Form validation feedback
     - Network error handling

4. Performance & Stability
   - Optimized database queries
   - Improved state management
   - Better handling of concurrent requests
   - Reduced unnecessary re-renders

### Technical Details

#### Authentication Flow
- Token storage in localStorage with `ACCESS_TOKEN_KEY`
- Automatic token refresh handling
- Protected route implementation
- Session persistence across page refreshes

#### API Improvements
- Standardized response formats
- Proper HTTP status codes
- Consistent error payloads
- Rate limiting and throttling

#### Frontend Architecture
- React Query for data fetching and caching
- Optimistic updates for better UX
- Form handling with validation
- Responsive design improvements

### Bug Fixes
- Fixed issues with user profile updates
- Resolved article favoriting inconsistencies
- Addressed comment system edge cases
- Fixed tag handling in article forms

### Security
- Updated dependencies with security fixes
- Improved input validation
- Better XSS protection
- CSRF protection for forms

### Documentation
- Updated API documentation
- Added inline code documentation
- Improved error messages
- Added usage examples

### 1. Authentication System Enhancements
Hey! We've completely rebuilt the authentication system. Here's everything you need to know:

#### Core Changes
1. Authentication Header Update:
   - Changed from `Token jwt` to `Bearer jwt`
   - Improved standards compliance
   - Better third-party tool compatibility

2. Token Storage:
   - Location: LocalStorage
   - Key: `ACCESS_TOKEN_KEY`
   - Cross-tab synchronization
   - Automatic expiration handling

3. Protected Routes:
   - Loading states
   - Proper redirection
   - State preservation
   - Deep linking support

#### New Features
- JWT token validation with expiration checks
- Cross-tab synchronization
- Automatic cleanup of invalid tokens
- Smart navigation after auth actions
- Query cache management
- Protected route improvements

#### Technical Implementation

1. Context Setup (`UserContextProvider.tsx`):
User context provider setup with type-safe context and proper children prop handling.

2. API Client Auth Update (`apiClient.ts`):
API client configuration with request/response interceptors for JWT token handling and authentication error management.

3. Token Management (`token.ts`):
Token management class handling JWT storage, validation, and cross-tab synchronization through localStorage events.

4. Protected Route Implementation (`ProtectedRoute.tsx`):
Protected route component that checks authentication status and redirects to login when necessary, with support for loading states and route protection based on authentication status.

5. Login Hook Implementation (`useIsLoginContext.tsx`):
Custom hook for managing authentication state, providing login/logout functionality, and handling cross-tab synchronization of authentication state.

2. Auth Context (`useIsLoginContext.tsx`):
Authentication context hook that manages login state, token validation, and cleanup. Handles token verification, automatic logout on invalid tokens, and query cache clearing.

6. Query Client Configuration (`queryClient.ts`):
Query client configuration with optimized caching strategies, authentication error handling, and retry logic for failed requests.

7. Usage Examples:

Login Flow:
  user: {
### 2. Error Handling System
Hey! We've built a comprehensive error handling system. Here's the technical details:

#### API Client Error Handling
API client interceptor that handles authentication errors globally. Automatically logs out users on 401/403/429 responses and redirects to login when not on auth pages.

#### Error Components
Error alert component that displays server errors in a user-friendly way. Handles different error formats and provides actionable feedback to users.

### 3. Profile and Settings System
#### Technical Implementation
1. Profile Updates:
Settings form component that handles user profile updates. Manages form state, form submission with React Query's useMutation, and automatically refreshes user data on successful updates.

### 4. Article Revision System UI
Hey! We've added a complete UI for managing article revisions. Here's the technical breakdown:

#### Component Structure
1. RevisionList Component:
Revision list component that displays article history and handles revision restoration. Fetches revision data using React Query and provides a clean interface for viewing and reverting to previous versions of articles.

2. RevisionDetailPage:
Revision detail page component that displays a specific version of an article. Handles data fetching for individual revisions and provides navigation back to the revision list.
- Solution: Implemented protected route components that verify authentication status before rendering revision-related pages
- Benefit: Improved security and access control

### What's Changed
- Better security:
  - Updated how we handle your login tokens
  - Fixed issues with logging out
- Under the hood:
  - Added IDs to articles
  - Added support for article history
- Made navigation easier
- Made buttons easier to find and use

### Fixes
- Fixed profile display:
  - Better handling when information is missing
  - Fixed profile links
- Fixed settings page:
  - Better handling of updates
  - Fixed issues with empty fields
  - Smarter handling of unchanged information
- Made errors easier to understand:
  - Added friendly error messages
  - Better error displays
  - Added helpful error alerts
  - More consistent error handling

### User Experience Improvements
- **Responsive Design**:
  - Optimized for all screen sizes
  - Improved mobile navigation
  - Better touch targets for mobile users
- **Performance**:
  - Reduced unnecessary re-renders
  - Optimized image loading
  - Better state management
- **Accessibility**:
  - Keyboard navigation support
  - Proper ARIA labels
  - Better focus management
- **UI/UX**:
  - Consistent button styles
  - Smooth transitions and animations
  - Clear loading and empty states
  - Better form validation feedback

### Technical Improvements
- **Code Quality**:
  - Better TypeScript integration
  - Improved type safety
  - Consistent code style with ESLint/Prettier
- **State Management**:
  - Optimized React Query usage
  - Better cache invalidation
  - Efficient data fetching strategies
- **API Integration**:
  - Strongly typed API clients
  - Better error handling
  - Request/response interceptors
- **Build & Tooling**:
  - Optimized production builds
  - Better development tooling
  - Improved bundle size