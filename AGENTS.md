# OpenChat — Agent Instructions

## 1. Project Overview

OpenChat is a local-first AI chat application with:

* **web:** Next.js 16, React 19, TypeScript 7, Tailwind CSS 4, shadcn/ui
* **api:** FastAPI, Python 3.13
* **Python tooling:** uv, Ruff, pytest
* **Local AI:** Ollama running at `localhost:11434`
* **Local model:** `gemma3:4b`
* **Cloud AI fallback:** OpenAI, Anthropic, or Gemini APIs
* **web directory:** `web/`
* **api directory:** `api/`

The application should prefer local AI through Ollama and use cloud AI providers only when configured/required.

---

## 2. Project Structure

Follow the existing project structure. Do not create unnecessary new folders or restructure the project without a clear reason.

Expected structure:

```text
OpenChat/
├── web/
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── public/
│   └── ...
│
├── api/
│   ├── app/
│   ├── tests/
│   └── ...
│
├── .env.example
├── .gitignore
├── AGENTS.md
└── README.md
```

Before creating a new file:

1. Check whether an existing file already provides the required functionality.
2. Reuse existing utilities/components where possible.
3. Follow the existing naming and folder conventions.

---

# 3. Development Commands

## web

Start the development server:

```bash
cd web
npm run dev
```

Default port:

```text
http://localhost:3000
```

Install a web dependency:

```bash
cd web
npm install <package_name>
```

Build web:

```bash
cd web
npm run build
```

Run production server:

```bash
cd web
npm run start
```

If linting is configured:

```bash
cd web
npm run lint
```

---

## api

Start the development server:

```bash
cd api
uv run fastapi dev
```

Default port:

```text
http://localhost:8000
```

Install a api dependency:

```bash
cd api
uv add <package_name>
```

Install dependencies after cloning the repository:

```bash
cd api
uv sync
```

Run tests:

```bash
cd api
pytest
```

Run Ruff:

```bash
cd api
ruff check .
```

Format Python code:

```bash
cd api
ruff format .
```

---

# 4. AI / Model Architecture

OpenChat supports multiple AI providers.

### Local AI

Ollama runs locally:

```text
http://localhost:11434
```

Default local model:

```text
qwen3.5:2b
```

The application should use Ollama as the primary/local provider whenever it is available.

### Cloud AI

Supported fallback providers may include:

* OpenAI
* Anthropic
* Gemini

Cloud providers must be configurable through environment variables.

Do not hard-code:

* API keys
* model API credentials
* provider secrets
* private URLs
* tokens

---

# 5. Environment Variables

Never commit `.env` files or API keys.

Use:

```text
.env.example
```

for documenting required environment variables.

Example:

```env
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=qwen3.5:2b

OPENAI_API_KEY=
ANTHROPIC_API_KEY=
GEMINI_API_KEY=
```

The actual `.env` file must remain ignored by Git.

If a new environment variable is required:

1. Add it to `.env.example`.
2. Document what it does.
3. Update the application configuration.
4. Never add the real secret value to Git.

---

# 6. web Rules

Use:

* Next.js
* React
* TypeScript
* Tailwind CSS
* shadcn/ui

Prefer existing shadcn/ui components before creating custom equivalents.

### Components

Create reusable components when UI functionality is used in multiple places.

Avoid:

* giant components
* duplicated UI logic
* unnecessary state
* unnecessary client components

Use `"use client"` only when the component actually requires client-side functionality.

Prefer server components where appropriate.

### TypeScript

Use strong typing.

Avoid:

```ts
any
```

unless there is a documented reason.

Prefer explicit interfaces/types for:

* API responses
* chat messages
* AI providers
* model configuration
* application state

Do not suppress TypeScript errors without understanding and fixing the underlying issue.

---

# 7. api Rules

Use FastAPI for api APIs.

Keep responsibilities separated:

```text
API routes
    ↓
Services
    ↓
AI/provider integrations
    ↓
External/local APIs
```

Do not put large amounts of business logic directly inside route handlers.

Use Pydantic models for request/response validation.

api code should be:

* typed
* testable
* modular
* asynchronous where appropriate

Use Python 3.13-compatible syntax and libraries.

---

# 8. API Rules

When adding or modifying an API:

1. Check whether an existing endpoint already provides the required functionality.
2. Follow existing naming conventions.
3. Define request/response schemas.
4. Handle validation errors properly.
5. Handle provider/API failures gracefully.
6. Do not expose API keys or sensitive configuration in responses.
7. Add or update tests.

web API calls should use the existing API utility/service pattern instead of duplicating request logic throughout components.

---

# 9. AI Provider Rules

AI providers should be abstracted behind a common interface where practical.

For example:

```text
Chat Request
     │
     ▼
AI Provider Interface
     │
 ┌───┼─────────────┐
 ▼   ▼             ▼
Ollama OpenAI   Anthropic/Gemini
```

The UI should not contain provider-specific implementation details.

Provider-specific logic belongs in the api/service layer.

Handle:

* connection failures
* unavailable models
* invalid API keys
* rate limits
* timeouts
* malformed responses

without crashing the application.

---

# 10. Chat Functionality

Chat-related changes should preserve:

* conversation history
* message ordering
* user/assistant roles
* loading states
* error states
* streaming behavior, if implemented
* model/provider selection
* local/cloud provider fallback behavior

Do not change the message/API contract without checking all affected web and api code.

---

# 11. Testing

**Run tests after every change.**

At minimum:

```bash
cd api
pytest
```

For api changes, also run:

```bash
ruff check .
ruff format --check .
```

For web changes, run the project's configured checks such as:

```bash
npm run lint
npm run build
```

if those scripts exist.

### Before finishing any task

Verify:

1. The code compiles/builds.
2. Tests pass.
3. Linting passes.
4. No TypeScript errors were introduced.
5. No Python errors were introduced.
6. No API keys/secrets were added.
7. Existing functionality still works.

---

# 12. Change Workflow

For every task follow this workflow:

### Step 1 — Inspect

Before modifying code:

* inspect the relevant files
* understand the existing implementation
* search for existing utilities/components/functions
* identify dependencies between web and api

### Step 2 — Plan

Determine:

* which files need changing
* whether a new file is actually necessary
* whether web and api both need changes
* what tests need to be added/updated

### Step 3 — Implement

Make the smallest clean change that solves the problem.

Do not rewrite unrelated code.

### Step 4 — Test

Run the relevant tests and checks.

### Step 5 — Fix

If tests/lint/build fail:

* identify the root cause
* fix it
* rerun the checks

Do not simply suppress errors.

### Step 6 — Review

Before completing the task, check the final diff for:

* accidental changes
* debugging code
* console logs
* unused imports
* secrets
* broken types
* unnecessary dependencies
* unrelated refactoring

---

# 13. Security Rules

Never commit:

```text
.env
.env.local
.env.production
API keys
access tokens
passwords
private credentials
```

Never expose provider API keys to the browser.

Cloud provider credentials must remain server-side.

Do not log:

* API keys
* authorization headers
* user secrets
* sensitive request data

Use environment variables for secrets.

---

# 14. Dependencies

Do not add a dependency if the functionality can reasonably be implemented using the existing stack.

Before adding a dependency:

1. Check whether an existing package already provides the functionality.
2. Check whether the dependency is actually necessary.
3. Use the project's package manager.
4. Update lockfiles appropriately.
5. Verify the application still builds/tests.

api dependencies:

```bash
uv add <package_name>
```

web dependencies:

```bash
npm install <package_name>
```

Do not manually edit dependency lockfiles unless necessary.

---

# 15. UI / UX Rules

Maintain consistency with the existing OpenChat design.

Prefer:

* existing shadcn/ui components
* existing Tailwind utilities
* reusable components
* responsive layouts
* accessible controls
* clear loading states
* clear error states

Do not introduce a completely different visual style for a small feature.

Interactive elements should have appropriate:

* hover states
* focus states
* disabled states
* loading states
* error states

---

# 16. Error Handling

Errors should be handled at the appropriate layer.

web:

* show useful user-facing messages
* avoid exposing internal stack traces
* handle loading/error/empty states

api:

* return appropriate HTTP status codes
* validate inputs
* log useful debugging information without secrets
* handle external AI provider failures

AI provider failures should not bring down the entire application.

---

# 17. Git Rules

Do not commit:

```text
.env
.env.local
node_modules/
__pycache__/
.pytest_cache/
.venv/
.next/
```

Before committing, check:

```bash
git status
git diff
```

Never commit secrets.

Keep commits focused and avoid unrelated changes.

---

# 18. Code Quality

Prefer simple, readable solutions.

Avoid:

* unnecessary abstractions
* duplicated code
* huge functions
* huge React components
* unnecessary dependencies
* premature optimization
* unrelated refactoring

Follow the conventions already present in the repository.

When existing code and these instructions conflict, inspect the repository first and preserve established patterns unless there is a clear reason to change them.

---

# 19. Documentation

When adding a significant feature:

* update relevant documentation
* update `.env.example` if new environment variables are required
* update API documentation if an endpoint changes
* update README when setup/usage changes

Do not create documentation for trivial internal changes.

---

# 20. Definition of Done

A task is considered complete only when:

* [ ] Requested functionality is implemented.
* [ ] Existing functionality is preserved.
* [ ] web builds successfully when web code changed.
* [ ] api tests pass.
* [ ] Ruff checks pass for api changes.
* [ ] TypeScript/lint checks pass where configured.
* [ ] No secrets were added.
* [ ] No unnecessary dependencies were added.
* [ ] No unrelated files were modified.
* [ ] Relevant documentation was updated.
* [ ] Final code is clean and maintainable.

---

# Important Rules

1. **Never commit `.env` or API keys.**
2. **Run tests after every change.**
3. **Inspect existing code before creating new code.**
4. **Reuse existing components and utilities.**
5. **Keep web and api responsibilities separated.**
6. **Keep AI provider logic out of UI components.**
7. **Never expose API keys to the web.**
8. **Do not suppress errors instead of fixing them.**
9. **Do not make unrelated changes.**
10. **Prefer small, testable, maintainable changes.**
