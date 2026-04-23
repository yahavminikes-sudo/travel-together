# Full-Stack Development Code Standards

## 1. Tech Stack Overview

- **Backend:** Node.js, Express.js, TypeScript
- **Database:** MongoDB (via Mongoose ODM)
- **Frontend:** React Web (Vite), TypeScript
- **Testing:** Jest, Supertest

---

## 2. Backend Coding Standards (Node & Express)

### Architecture & Structure

- **RESTful API:** Follow standard REST conventions for endpoints and HTTP verbs (GET, POST, PUT, DELETE).
- **Directory Structure:** - `server.ts`: Entry point. Handles DB connection and `app.listen()`.
  - `app.ts`: Setup Express, middlewares, and routers. (Can export a Promise if DB init is asynchronous).
  - `routes/`: Define API endpoints utilizing `express.Router()`.
  - `controllers/`: Handle HTTP request/response logic.
  - `services/`: Business logic, LLM orchestrations, external API calls.
  - `models/`: Mongoose schemas.
  - `common/`: Shared middlewares (e.g., authentication).
- **Base Controller Pattern:** To prevent duplicate CRUD code, use a generic `BaseController<T>` class that accepts a Mongoose Model, and extend/instantiate it for specific entities (e.g., `PostController`, `StudentController`).

### Data & Mongoose

- **Strong Typing:** Define TypeScript `interface`s for all Mongoose models (e.g., `export interface IPost { title: string; ... }`) and pass them to the schema `new mongoose.Schema<IPost>(...)`.
- **Async/Await:** Use `async/await` for all database operations inside `try/catch` blocks. Avoid callbacks.

### Authentication & Security

- **JWT (JSON Web Tokens):** Use `jsonwebtoken` for auth.
- **Refresh Token Rotation:** - Issue a short-lived `AccessToken` and a long-lived `RefreshToken`.
  - Store the `RefreshToken` in an array on the `User` document to support multi-device logins.
  - Invalidate tokens appropriately on logout or reuse detection.
- **Hashing:** Passwords must _always_ be hashed using `bcrypt` before storing.
- **Middleware:** Protect private routes using a custom `authenticate` middleware that verifies the JWT header.

---

## 3. Frontend Coding Standards (React)

### Architecture & Components

- **Initialization:** Use Vite (`npm create vite@latest`) for React setups.
- **Functional Components:** Use functional components exclusively. Do not use Class components.
- **Props:** Define component inputs strictly using `interface Props { ... }`. Prefer explicit props over relying heavily on the implicit `children` prop unless creating wrapper UI components (like Modals/Alerts).

### State Management

- Use the `useState` hook.
- **Immutability:** Treat state as immutable. Use the spread operator (`...`) to replace objects/arrays instead of mutating them directly. For highly complex/nested objects, use the `Immer` library.

### Forms & Validation

- **React Hook Form:** Use `react-hook-form` instead of controlled inputs to handle form states to optimize rendering performance.
- **Zod:** Use `zod` for schema-based validation, integrated into forms using `@hookform/resolvers/zod`.

### Styling & Layout

- **Bootstrap:** Utilize Bootstrap for core UI elements (`btn`, `list-group`, etc.).
- **Scoping CSS:** Avoid global CSS conflicts by using **CSS Modules** (`Component.module.css`) or **CSS-in-JS** (`styled-components`). Avoid inline styling (`style={{}}`).
- **Layouts:** Use **Flexbox** (`display: flex`, `flexDirection`, `flex`) to structure dynamic layouts and distribute space.

### Networking

- **Axios:** Use `axios` for HTTP requests.
- **Generic HTTP Service:** Extract base networking logic into an `HttpService<T>` class (`api-client.ts`).
- **Custom Hooks:** Abstract data-fetching logic out of UI components into Custom Hooks (e.g., `useStudents`). The hook should expose `data`, `isLoading`, and `error`.
- **AbortController:** Always use an `AbortController` in the `useEffect` cleanup function to cancel requests if the component unmounts. This also prevents duplicate network calls during React StrictMode double-rendering.

---

## 4. AI & Backend LLM Integration

### Orchestration Constraints

- **Backend-Only AI:** Never call LLM APIs directly from the React frontend. Route calls through the backend to protect tokens, enforce guardrails, and control business logic.
- **Service Layer Responsibility:** The Controller should only handle input validation (Zod) and HTTP error mapping (400, 422, 429). The `Service` layer handles Prompt Engineering, Output Validation, and LLM Orchestration.

### RAG (Retrieval-Augmented Generation) Architecture

- **Data Ingestion:** - Split text into Chunks (e.g., 800-1000 characters with 100-150 character overlap).
  - Generate Embeddings using dedicated models (e.g., `all-MiniLM`, outputting vectors like 384 or 1536 dimensions).
  - Store in a Vector DB (like MongoDB `$vectorSearch` or `pgvector`).
- **Retrieval:** When a user queries, embed the question, execute a semantic Vector Search using Cosine Similarity, and retrieve the **Top-K** candidates.
- **Augmented Prompting:** Inject the Top-K chunks into the prompt context. Instruct the LLM strictly to "answer based _only_ on the provided context."
- **Mocking:** Implement Environment-Based LLM Mocking (`LLM_MOCK_MODE`) to simulate LLM responses deterministically during testing to save costs.

---

## 5. Testing Standards

- **Test-Driven Development (TDD):** Adopt the TDD lifecycle: Write a failing test -> Make the test pass -> Refactor.
- **Libraries:** Use `Jest` for the test runner and assertions, and `supertest` for mocking HTTP API requests.
- **Environment:** - Run tests sequentially using `--runInBand`.
  - Check code coverage using `--coverage`.
  - Use a dedicated `.testenv` file to separate test databases from development databases.
- **Lifecycle Hooks:** Use `beforeAll` to initialize app variables and clean databases (`Model.deleteMany()`), and `afterAll` to close the database connection.
