# AI Coding Assistant SOP — Backend Development Protocol (FitnessTrainingSystem)

This document serves as the Standard Operating Procedure (SOP) for any AI coding assistant modifying, expanding, or debugging the **FitnessTrainingSystem** backend.

**Instruction to the AI:** You must read, understand, and strictly adhere to the guidelines and workflows defined in this document when executing tasks on this codebase.

---

## 🏛️ 1. Architectural Rules (Clean Architecture — Onion Model)

The backend follows **Clean Architecture (Onion Architecture)** with strict inward-only dependency flow:

$$\text{Domain} \longleftarrow \text{Application} \longleftarrow \text{Infrastructure} \longleftarrow \text{WebApi}$$

| Layer | Project | Depends On | Responsibility |
|-------|---------|------------|----------------|
| **Domain** | `FitnessTrainingSystem.Domain` | _Nothing_ (zero external references) | Core enterprise logic: Entities, Enums, Exceptions, Value Objects, base classes (`Common/`) |
| **Application** | `FitnessTrainingSystem.Application` | `FitnessTrainingSystem.Domain` | Business logic: CQRS (MediatR), FluentValidation, DTOs, Interfaces, Pipeline Behaviours, Mappings |
| **Infrastructure** | `FitnessTrainingSystem.Infrastructure` | `FitnessTrainingSystem.Application` | Implementation of interfaces: EF Core `ApplicationDbContext`, Identity services, external integrations, `DependencyInjection.cs` |
| **WebApi** | `FitnessTrainingSystem.WebApi` | `FitnessTrainingSystem.Infrastructure` + `FitnessTrainingSystem.Application` | Presentation entry point: Controllers, Middleware, `Program.cs`, OpenAPI, app configuration |

### Critical Architecture Constraints

1. **`Domain` and `Application` must NEVER reference `Infrastructure` or `WebApi`.**
2. All cross-layer communication flows through **interfaces** defined in `Application/Common/Interfaces/` and **implemented** in `Infrastructure/`.
3. `ApplicationDbContext` in `Infrastructure/Persistence/` auto-discovers entity configurations via `modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly)`.

---

## 🛠️ 2. Technology Stack & Package Versions

| Category | Technology | Version / Package |
|----------|-----------|-------------------|
| Runtime | .NET / ASP.NET Core Web API | **9.0** |
| Database Provider | MySQL via Pomelo | `Pomelo.EntityFrameworkCore.MySql` **9.0.0** |
| Design-Time Migrations | EF Core Tools | `Microsoft.EntityFrameworkCore.Tools` **9.0.0** |
| Design-Time Migrations | EF Core Design | `Microsoft.EntityFrameworkCore.Design` **9.0.0** |
| OpenAPI | ASP.NET Core OpenAPI | `Microsoft.AspNetCore.OpenApi` **9.0.14** |
| CQRS / Mediator | MediatR | `MediatR` **14.1.0** |
| Validation | FluentValidation + DI | `FluentValidation.DependencyInjectionExtensions` **12.1.1** |
| Authentication | ASP.NET Core Identity & JWT | _(to be added)_ |
| MySQL Server | Target version | **8.0.36** (hardcoded in `DependencyInjection.cs`) |

### Connection String

Defined in `appsettings.json` and `appsettings.Development.json` under the key `ConnectionStrings:DefaultConnection`:
```
Server=localhost;Database=fitness_training_db;User=root;Password=your_password;
```

> **Note:** Each developer must override this with their own local credentials. Never commit real passwords.

---

## 📂 3. Repository Layout & File Placements

The solution root is `backend/` and the solution file is `FitnessTrainingSystem.sln`.

```
backend/
├── FitnessTrainingSystem.sln
├── AI_Workflow_BackEnd.md          ← This file
├── README.md
└── src/
    ├── FitnessTrainingSystem.Domain/
    │   ├── FitnessTrainingSystem.Domain.csproj
    │   ├── Common/                 ← Base classes, Value Objects (e.g. AuditableEntity)
    │   ├── Entities/               ← Domain entity classes
    │   ├── Enums/                  ← Domain enumerations
    │   └── Exceptions/             ← Domain-specific exception classes
    │
    ├── FitnessTrainingSystem.Application/
    │   ├── FitnessTrainingSystem.Application.csproj
    │   ├── Common/
    │   │   ├── Behaviours/         ← MediatR pipeline behaviours (e.g. ValidationBehaviour)
    │   │   ├── Interfaces/         ← Abstractions (IApplicationDbContext, ITokenService, etc.)
    │   │   └── Mappings/           ← AutoMapper / manual mapping profiles
    │   ├── DTOs/                   ← Shared Data Transfer Objects
    │   └── Features/               ← CQRS feature slices (vertical slicing)
    │       ├── Auth/               ← Authentication / Authorization commands & queries
    │       ├── Exercises/          ← Exercise management
    │       ├── Memberships/        ← Membership & subscription management
    │       ├── Nutrition/          ← Nutrition plan management
    │       ├── Schedules/          ← Training schedule management
    │       └── Users/              ← User profile management
    │
    ├── FitnessTrainingSystem.Infrastructure/
    │   ├── FitnessTrainingSystem.Infrastructure.csproj
    │   ├── DependencyInjection.cs  ← Extension method: AddInfrastructureServices()
    │   ├── Identity/               ← ASP.NET Identity implementation
    │   ├── Migrations/             ← EF Core migration files
    │   ├── Persistence/
    │   │   └── ApplicationDbContext.cs
    │   └── Services/               ← Concrete implementations of Application interfaces
    │
    └── FitnessTrainingSystem.WebApi/
        ├── FitnessTrainingSystem.WebApi.csproj
        ├── Program.cs              ← App entry point & middleware pipeline
        ├── Controllers/            ← REST API endpoint controllers
        ├── Middleware/              ← Custom middleware (error handling, logging, etc.)
        ├── Properties/
        ├── appsettings.json
        └── appsettings.Development.json
```

### File Placement Rules

When adding new features, place files **strictly** according to these rules:

| What | Where | Naming Convention |
|------|-------|-------------------|
| Entity class | `src/FitnessTrainingSystem.Domain/Entities/<EntityName>.cs` | PascalCase, singular noun |
| Enum | `src/FitnessTrainingSystem.Domain/Enums/<EnumName>.cs` | PascalCase, singular noun |
| Domain Exception | `src/FitnessTrainingSystem.Domain/Exceptions/<ExceptionName>Exception.cs` | Suffixed with `Exception` |
| Base / Value Object | `src/FitnessTrainingSystem.Domain/Common/<Name>.cs` | — |
| Interface | `src/FitnessTrainingSystem.Application/Common/Interfaces/I<Name>.cs` | Prefixed with `I` |
| Pipeline Behaviour | `src/FitnessTrainingSystem.Application/Common/Behaviours/<Name>Behaviour.cs` | Suffixed with `Behaviour` |
| Mapping Profile | `src/FitnessTrainingSystem.Application/Common/Mappings/<Name>Profile.cs` | Suffixed with `Profile` |
| Shared DTO | `src/FitnessTrainingSystem.Application/DTOs/<DtoName>Dto.cs` | Suffixed with `Dto` |
| CQRS Query | `src/FitnessTrainingSystem.Application/Features/<Feature>/Queries/<QueryName>/<QueryName>Query.cs` | — |
| CQRS Query Handler | `src/FitnessTrainingSystem.Application/Features/<Feature>/Queries/<QueryName>/<QueryName>QueryHandler.cs` | — |
| CQRS Command | `src/FitnessTrainingSystem.Application/Features/<Feature>/Commands/<CommandName>/<CommandName>Command.cs` | — |
| CQRS Command Handler | `src/FitnessTrainingSystem.Application/Features/<Feature>/Commands/<CommandName>/<CommandName>CommandHandler.cs` | — |
| FluentValidation Validator | Same folder as the Command/Query it validates | `<CommandName>Validator.cs` |
| Feature-specific DTO | Same folder as the Command/Query or under `Features/<Feature>/DTOs/` | Suffixed with `Dto` |
| EF Entity Configuration | `src/FitnessTrainingSystem.Infrastructure/Persistence/Configurations/<EntityName>Configuration.cs` | — |
| Service Implementation | `src/FitnessTrainingSystem.Infrastructure/Services/<ServiceName>.cs` | — |
| DI Registration | `src/FitnessTrainingSystem.Infrastructure/DependencyInjection.cs` (extend `AddInfrastructureServices`) | — |
| Controller | `src/FitnessTrainingSystem.WebApi/Controllers/<PluralResource>Controller.cs` | Plural resource name |
| Middleware | `src/FitnessTrainingSystem.WebApi/Middleware/<Name>Middleware.cs` | Suffixed with `Middleware` |

### Existing Feature Modules

The following vertical feature slices are already scaffolded under `Application/Features/`:

| Module | Purpose |
|--------|---------|
| `Auth` | User authentication, login, registration, token refresh |
| `Exercises` | CRUD for exercises, exercise categories |
| `Memberships` | Membership plans, user subscriptions |
| `Nutrition` | Nutrition plans, meal tracking |
| `Schedules` | Training schedules, session management |
| `Users` | User profile management, role-based queries |

---

## 🚀 4. Step-by-Step Implementation Workflow for AI

When asked to implement a new feature or modify the database schema, follow this precise order:

### Step 1: Define Entities & Enums (Domain Layer)

- Write Domain models inside `FitnessTrainingSystem.Domain/Entities/`.
- Write enums inside `FitnessTrainingSystem.Domain/Enums/`.
- If a base class is needed (e.g. `AuditableEntity` with `CreatedAt`, `UpdatedAt`), place it in `FitnessTrainingSystem.Domain/Common/`.
- Ensure all model properties are **strongly typed** (use enums instead of magic strings, use `DateOnly`/`TimeOnly` where appropriate).
- **Do NOT** add any NuGet references or `using` statements pointing to Infrastructure or WebApi projects.

### Step 2: Define Abstractions (Application Layer)

- Create or update interfaces in `FitnessTrainingSystem.Application/Common/Interfaces/` (e.g. `IApplicationDbContext` with new `DbSet<T>` properties).
- If adding a new cross-cutting service (e.g. email, file storage), define the interface here.

### Step 3: Map Database Configurations (Infrastructure Layer)

1. Create an EF configuration class implementing `IEntityTypeConfiguration<T>` in `FitnessTrainingSystem.Infrastructure/Persistence/Configurations/`.
2. Add the corresponding `DbSet<TEntity>` property to `ApplicationDbContext`.
3. **No need** to manually call `modelBuilder.ApplyConfiguration(...)` — configurations are auto-discovered via `ApplyConfigurationsFromAssembly`.

### Step 4: Write CQRS Command/Query Slice (Application Layer)

1. Create a feature folder if it doesn't exist: `FitnessTrainingSystem.Application/Features/<FeatureName>/`.
2. Under that folder, create `Commands/<CommandName>/` or `Queries/<QueryName>/` sub-folders.
3. Define the request class implementing `IRequest<TResponse>` (MediatR).
4. Define the handler class implementing `IRequestHandler<TRequest, TResponse>`.
5. Add a FluentValidation validator class in the **same folder** as the request.
6. Create any necessary DTOs (in the same folder or in `Application/DTOs/` if reusable).

### Step 5: Expose Controllers (WebApi Layer)

- Create or edit controllers in `FitnessTrainingSystem.WebApi/Controllers/`.
- Inject `ISender` (from MediatR) and invoke commands/queries — **do not inject repositories or DbContext directly into controllers**.
- Use proper HTTP verbs: `[HttpGet]`, `[HttpPost]`, `[HttpPut]`, `[HttpDelete]`.
- Return appropriate status codes: `Ok()`, `Created()`, `NoContent()`, `NotFound()`, `BadRequest()`.

### Step 6: Register Services (Infrastructure Layer)

- Register any new infrastructure services in `DependencyInjection.cs` → `AddInfrastructureServices()`.
- This is where `ApplicationDbContext`, Identity, external API clients, etc. are wired up.
- The method is called from `Program.cs` via `builder.Services.AddInfrastructureServices(builder.Configuration)`.

### Step 7: Create & Apply Database Migrations

Always run from the `backend/` root folder:

```bash
# 1. Build the solution first to catch compilation errors
dotnet build

# 2. Add the EF Core Migration
dotnet ef migrations add <MigrationName> \
    --project src/FitnessTrainingSystem.Infrastructure/ \
    --startup-project src/FitnessTrainingSystem.WebApi/

# 3. Apply the Migration to the database (if local environment is ready)
dotnet ef database update \
    --project src/FitnessTrainingSystem.Infrastructure/ \
    --startup-project src/FitnessTrainingSystem.WebApi/
```

> **Note:** Migrations are stored in `src/FitnessTrainingSystem.Infrastructure/Migrations/`. The initial migration `20260528061951_InitialCreate` already exists.

---

## 🔍 5. Verification Checkpoints

Before completing any task, the AI must verify the following:

### Build Check
```bash
dotnet build
```
Ensure there are **zero** compilation errors and **zero** warnings.

### Architecture Dependency Check
Verify that **none** of these illegal references exist:
- `FitnessTrainingSystem.Domain` → must NOT reference `Application`, `Infrastructure`, or `WebApi`
- `FitnessTrainingSystem.Application` → must NOT reference `Infrastructure` or `WebApi`
- Controllers → must NOT directly inject `ApplicationDbContext` or any repository implementation

### Nullable Reference Types
- All projects have `<Nullable>enable</Nullable>` in their `.csproj`.
- Adhere to C# nullable annotations (`#nullable enable`).
- Avoid using `!` (null-forgiving operator) where possible; use appropriate null-checks or fallback values.

### Code Quality
- Every Command/Query **must** have a corresponding FluentValidation validator.
- Every Entity **must** have a corresponding `IEntityTypeConfiguration<T>` in Infrastructure.
- Every new service interface in Application **must** have an implementation registered in `DependencyInjection.cs`.
- Controller actions **must** use MediatR (`ISender`) — never call Application/Infrastructure services directly.

---

## ⚠️ 6. Common Pitfalls & Rules

1. **Do NOT add EF Core packages to the Domain or Application projects.** EF Core belongs only in Infrastructure and WebApi.
2. **Do NOT create `Configurations/` folder inside Domain or Application.** Entity configurations belong in `Infrastructure/Persistence/Configurations/`.
3. **Do NOT bypass the CQRS pattern** by writing business logic directly in controllers.
4. **Do NOT modify `Program.cs`** unless explicitly asked to (e.g. adding new middleware or a new DI registration entry point).
5. **Always check the existing feature structure** under `Application/Features/` before creating a new module — the feature may already exist as a scaffolded folder.
6. **Connection string key is `DefaultConnection`** — always use `configuration.GetConnectionString("DefaultConnection")` for database access.
