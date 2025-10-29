# RealWorld React Frontend

[![React](https://img.shields.io/badge/React-18.x-61DAFB.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.x-3178C6.svg)](https://www.typescriptlang.org/)

A clean, responsive React frontend for the RealWorld app with article revision history.

## 🚀 Quick Start

1. **Clone and install**
```bash
git clone https://github.com/abd00elnagar/react-query-realworld.git
cd react-query-realworld
npm install
# or
yarn install
```

2. **Configure API URL**
   Open `src/repositories/apiClient.ts` and update the `baseURL`:
   ```typescript
   const baseURL = 'http://your-backend-url/api';
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```
- Make sure to:
  1. Assign the correct URL to the baseURL variable
  3. Verify the API is accessible at the specified URL
  4. Start the development server
```bash
npm start
# or
yarn start
```

The app will be available at `http://localhost:3000`

## Article Revision Features

### View Revision History
Navigate to an article and click "View Revisions" to see the complete history of changes.

### Revision Details
Each revision shows:
- Title and content at that point in time
- Creation timestamp
- Author information
- Changes from previous version

### Revert to Previous Version
Users can revert an article to any previous version if they have the necessary permissions.

## Security Implementation

1. Authentication
   - JWT-based authentication
   - Token stored securely in localStorage
   - Automatic token refresh handling
   - Secure header transmission

2. Authorization
   - Protected routes require authentication
   - Role-based access control for article management
   - Revision access limited to authenticated users
   - Revert functionality restricted to article owners

3. Error Handling
   - Comprehensive error messages for users
   - Network error recovery
   - Session expiration handling
   - Form validation feedback

## API Integration

### Revision Endpoints
All requests include `Authorization: Bearer <token>` header.

1. List Revisions
```typescript
GET /api/articles/{slug}/revisions
// Returns: { revisions: Revision[], count: number }
```

2. View Revision
```typescript
GET /api/articles/{slug}/revisions/{id}
// Returns: { revision: Revision }
```

3. Revert to Revision
```typescript
POST /api/articles/{slug}/revisions/{id}/revert
// Returns: { message: string, article: Article }
```

### Type Definitions
```typescript
interface Revision {
    id: number;
    article_id: number;
    title: string;
    slug: string;
    description: string;
    body: string;
    created_at: string;
    updated_at: string;
}
```

## Development Notes

1. State Management
   - React Query for server state
   - Context for auth state
   - Local state for UI components

2. Testing
```bash
npm test
# or
yarn test
```

3. Building for Production
```bash
npm run build
# or
yarn build
```

4. Code Style
   - ESLint configuration
   - Prettier for formatting
   - TypeScript strict mode enabled

## Additional Features

1. Loading States
   - Skeleton loaders for content
   - Progress indicators for actions
   - Optimistic updates for better UX

2. Error Handling
   - User-friendly error messages
   - Network error recovery
   - Form validation feedback

3. Responsive Design
   - Mobile-first approach
   - Adaptive layouts
   - Touch-friendly interfaces

We've gone to great lengths to adhere to the [TanStack Query](https://tanstack.com/query/latest/docs/react/overview) community styleguides & best practices.

For more information on how to this works with other frontends/backends, head over to the [RealWorld](https://github.com/gothinkster/realworld) repo.

# How it works

```bash
src
├─ App.tsx
├─ index.tsx
├─ react-app-env.d.ts
├─ Router.tsx # dynamic router assignment
├─ components # components
├─ constants # constants
├─ contexts # context API
├─ lib
│  ├─ routerMeta.ts # meta data of router
│  ├─ token.ts # localstorage class
│  ├─ utils # utility funcs
│  └─ hooks # custom hooks
├─ pages # page components
├─ queries # react query func
└─ repositories # api service
    └─ apiClient.ts # Axios Instance & Interceptor
```

### Making requests to the backend API

For convenience, we have a live API server running at https://conduit.productionready.io/api for the application to make requests against. You can view [the API spec here](https://api.realworld.io/api-docs/) which contains all routes & responses for the server.

The source code for the backend server (available for Node, Rails and Django) can be found in the [main RealWorld repo](https://github.com/gothinkster/realworld).

### Using Marked Up Templates

You can check the marked up [frontend spec here](https://realworld-docs.netlify.app/docs/specs/frontend-specs/templates).

# Getting Started

#### Install
```
npm i
```
#### Build
```
npm run build
```
#### Start
```
npm start
```

# Functionality overview

The example application is a social blogging site (i.e. a Medium.com clone) called "Conduit". It uses a custom API for all requests, including authentication. You can view a live demo over at [https://react-query-realworld.netlify.app](https://react-query-realworld.netlify.app)

**General functionality:**

- Authenticate users via JWT (login/signup pages + logout button on settings page)
- CRU- users (sign up & settings page - no deleting required)
- CRUD Articles
- CR-D Comments on articles (no updating required)
- GET and display paginated lists of articles
- Favorite articles
- Follow other users

**The general page breakdown looks like this:**

- Home page (URL: /#/ )
  - List of tags
  - List of articles pulled from either Feed, Global, or by Tag
  - Pagination for list of articles
- Sign in/Sign up pages (URL: /#/login, /#/register )
  - Uses JWT (store the token in localStorage)
  - Authentication can be easily switched to session/cookie based
- Settings page (URL: /#/settings )
  - Editor page to create/edit articles (URL: /#/editor, /#/editor/article-slug-here )
- Article page (URL: /#/article/article-slug-here )
  - Delete article button (only shown to article's author)
  - Render markdown from server client side
  - Comments section at bottom of page
  - Delete comment button (only shown to comment's author)
- Profile page (URL: /#/profile/:username, /#/profile/:username/favorites )
  - Show basic user info
  - List of articles populated from author's created articles or author's favorited articles

<br />

  [![Brought to you by Thinkster](https://raw.githubusercontent.com/gothinkster/realworld/master/media/end.png)](https://thinkster.io)
