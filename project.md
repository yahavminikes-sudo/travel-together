title: Connect Share Hub Clone - Travel Together Monorepo
description: |
  Build a full-stack social sharing app matching the UI of the updated `connect-share-hub` frontend, with Node.js/Express backend per code standards.
  Deployed as a monorepo in the `travel-together` directory with separate `frontend/` and `backend/` folders.
  Split work into two parallel developer missions: Frontend (Dev A) and Backend (Dev B).
  Frontend uses React + Vite + TypeScript + Bootstrap 5.3.3 + react-bootstrap (to match updated lovable UI exactly).
  Backend follows Node/Express/MongoDB standards with JWT auth, Mongoose models, REST API, and Gemini vector search for RAG-powered semantic search.
  Testing: Jest for unit tests and Supertest for integration/API testing with TDD approach.
owners:
  - name: Dev A
    role: Frontend Lead - UI & Client Logic
  - name: Dev B
    role: Backend Lead - API & Database

tasks:

  - id: 1
    title: Scaffold frontend app shell
    owner: Dev A
    files:
      - travel-together/frontend/package.json
      - travel-together/frontend/tsconfig.json
      - travel-together/frontend/vite.config.ts
      - travel-together/frontend/src/main.tsx
      - travel-together/frontend/src/App.tsx
      - travel-together/frontend/src/index.css
    description: |
      Create the React Vite TypeScript frontend app. Use Bootstrap 5.3.3 + react-bootstrap 2.10.5 for styling to match the updated `connect-share-hub`.
      Wire routing, providers, and global styles per lovable reference.

  - id: 2
    title: Create shared TypeScript types
    owner: Dev A
    files:
      - travel-together/shared/types.ts
    description: |
      Define and document all shared TypeScript interfaces for User, Post, Comment, Auth, and Gemini vector search types.
      This is the contract used by both frontend and backend. Must be completed first.

  - id: 3
    title: Build shared UI components
    owner: Dev A
    files:
      - travel-together/frontend/src/components/Navbar.tsx
      - travel-together/frontend/src/components/PostCard.tsx
      - travel-together/frontend/src/components/LikeButton.tsx
      - travel-together/frontend/src/components/NavLink.tsx
      - travel-together/frontend/src/components/ui/CustomButton.tsx
      - travel-together/frontend/src/components/ui/CustomCard.tsx
      - travel-together/frontend/src/components/ui/CustomInput.tsx
      - travel-together/frontend/src/components/ui/CustomLabel.tsx
      - travel-together/frontend/src/components/ui/CustomAvatar.tsx
    description: |
      Implement reusable UI components using react-bootstrap and Bootstrap styling to visually match the updated `connect-share-hub`.

  - id: 4
    title: Create frontend pages and forms
    owner: Dev A
    files:
      - travel-together/frontend/src/pages/Index.tsx
      - travel-together/frontend/src/pages/PostDetail.tsx
      - travel-together/frontend/src/pages/Profile.tsx
      - travel-together/frontend/src/pages/Login.tsx
      - travel-together/frontend/src/pages/Register.tsx
      - travel-together/frontend/src/pages/CreatePost.tsx
      - travel-together/frontend/src/pages/EditPost.tsx
      - travel-together/frontend/src/pages/Comments.tsx
      - travel-together/frontend/src/pages/MyPosts.tsx
      - travel-together/frontend/src/pages/NotFound.tsx
    description: |
      Build all page layouts and forms using React Hook Form + Zod for validation. Use functional components, useState, and custom hooks for data fetching with Axios and AbortController.

  - id: 5
    title: Scaffold backend app
    owner: Dev B
    files:
      - travel-together/backend/package.json
      - travel-together/backend/tsconfig.json
      - travel-together/backend/server.ts
      - travel-together/backend/app.ts
      - travel-together/backend/.env
      - travel-together/backend/.testenv
    description: |
      Set up Node.js Express TypeScript backend with MongoDB connection. Use JWT for auth, bcrypt for hashing.

  - id: 6
    title: Implement backend models and auth
    owner: Dev B
    files:
      - travel-together/backend/src/models/User.ts
      - travel-together/backend/src/models/Post.ts
      - travel-together/backend/src/models/Comment.ts
      - travel-together/backend/src/common/authenticate.ts
      - travel-together/backend/src/services/authService.ts
    description: |
      Define Mongoose schemas with strong typing. Implement JWT auth with refresh token rotation, password hashing with bcrypt.

  - id: 7
    title: Build backend controllers and routes
    owner: Dev B
    files:
      - travel-together/backend/src/controllers/authController.ts
      - travel-together/backend/src/controllers/postController.ts
      - travel-together/backend/src/controllers/commentController.ts
      - travel-together/backend/src/controllers/userController.ts
      - travel-together/backend/src/routes/auth.ts
      - travel-together/backend/src/routes/posts.ts
      - travel-together/backend/src/routes/comments.ts
      - travel-together/backend/src/routes/users.ts
    description: |
      Use BaseController pattern for CRUD. Implement RESTful endpoints with proper HTTP verbs and error handling.

  - id: 8
    title: Implement backend services
    owner: Dev B
    files:
      - travel-together/backend/src/services/postService.ts
      - travel-together/backend/src/services/commentService.ts
      - travel-together/backend/src/services/userService.ts
    description: |
      Implement business logic in services using async/await. Build service methods for auth, posts, comments, and users.

  - id: 9
    title: Add backend tests
    owner: Dev B
    files:
      - travel-together/backend/src/tests/auth.test.ts
      - travel-together/backend/src/tests/post.test.ts
      - travel-together/backend/src/tests/comment.test.ts
    description: |
      Write Jest + Supertest tests for API endpoints using TDD approach. Run tests sequentially with dedicated test database.
      Check code coverage and use beforeAll/afterAll hooks to manage test lifecycle. Achieve >80% code coverage.

  - id: 10
    title: Implement Gemini vector search and RAG
    owner: Dev B
    files:
      - travel-together/backend/src/models/Embedding.ts
      - travel-together/backend/src/services/embeddingService.ts
      - travel-together/backend/src/services/ragService.ts
      - travel-together/backend/src/controllers/searchController.ts
      - travel-together/backend/src/routes/search.ts
      - travel-together/backend/src/utils/chunkText.ts
      - travel-together/backend/src/config/gemini.ts
    description: |
      Implement text chunking, Gemini embeddings for vector search, and RAG (Retrieval-Augmented Generation) pipeline.
      Store embeddings in MongoDB with vector indexing. Retrieve top-K results and augment prompts for semantic search.

  - id: 11
    title: Integrate frontend with backend
    owner: Dev A
    files:
      - travel-together/frontend/src/services/api.ts
      - travel-together/frontend/src/services/apiClient.ts
      - travel-together/frontend/src/hooks/usePosts.ts
      - travel-together/frontend/src/hooks/useAuth.ts
      - travel-together/frontend/src/hooks/useSearch.ts
      - travel-together/frontend/src/contexts/AuthContext.tsx
    description: |
      Connect frontend to backend API using a shared Axios apiClient service. Implement custom hooks for data fetching with AbortController.
      Add search integration with vector search backend.

parallelization:
  - owner: Dev A
    responsibilities:
      - Shared types definition (priority 1)
      - Frontend UI components and pages
      - Client-side state management and forms
      - API integration and custom hooks
      - Frontend unit tests with Jest and mocked dependencies
  - owner: Dev B
    responsibilities:
      - Backend API endpoints and database models
      - Authentication and security
      - Business logic services
      - Gemini vector search and RAG implementation
      - Backend unit tests with Jest and mocked Mongoose/APIs

testing_approach:
  - framework: Jest for unit tests, Supertest for API integration tests
  - scope: Unit tests + integration tests for API endpoints
  - tdd: Write failing test first (Write a failing test -> Make the test pass -> Refactor)
  - libraries: Jest for test runner and assertions, Supertest for mocking HTTP API requests
  - environment: Run tests sequentially using --runInBand, check coverage using --coverage
  - database: Use dedicated .testenv file with separate test database, use beforeAll to initialize and afterAll to close connection
  - mocking: Mock external dependencies (LLM APIs, external services) for deterministic testing
  - coverage: Target >80% code coverage
  - frontend_tests: Custom hooks, utilities, API service, form validation
  - backend_tests: Services via unit tests, API endpoints via Supertest integration tests

integration:
  - file: travel-together/shared/types.ts
    purpose: Shared TypeScript interfaces for frontend and backend (must be created first)
  - note: Frontend uses Bootstrap 5.3.3 + react-bootstrap to match updated lovable UI
  - note: Backend follows all standards; frontend adapts for UI fidelity
  - note: Gemini vector search requires environment variable for API key (GEMINI_API_KEY)
  - note: Unit testing only; mock all external dependencies (database, HTTP, APIs)

verification:
  - criteria:
      - Frontend UI matches updated `connect-share-hub` visually using Bootstrap
      - Shared types are defined and imported by both frontend and backend
      - Frontend unit tests pass with >80% coverage (hooks, services, utilities)
      - Backend Supertest API tests pass for all endpoints (auth, posts, comments, search)
      - Auth flows navigate correctly and persist user state via JWT tokens
      - CRUD operations for posts/comments work via API with Supertest
      - Forms validate with Zod and submit successfully
      - Gemini vector embeddings are generated and stored correctly
      - Vector search retrieves semantically relevant results
      - RAG pipeline augments prompts with retrieved context
      - All backend tests follow TDD: failing test -> passing implementation -> refactor
      - No direct LLM calls from frontend; all through backend only
