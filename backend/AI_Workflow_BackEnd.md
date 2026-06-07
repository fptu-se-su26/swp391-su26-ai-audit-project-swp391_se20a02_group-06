# AI Coding Assistant SOP — Backend Development Protocol

This document serves as the Standard Operating Procedure (SOP) for any AI coding assistant modifying, expanding, or debugging the KYNEX backend. 

**Instruction to the AI:** You must read, understand, and strictly adhere to the guidelines and workflows defined in this document when executing tasks on this codebase.

---

## 🏛️ 1. Architectural Rules (Clean Architecture)

The backend is built using .NET 9.0 following **Clean Architecture (Onion Architecture)** principles. Dependencies flow strictly inward:

$$\text{Domain} \longleftarrow \text{Application} \longleftarrow \text{Infrastructure} \longleftarrow \text{WebApi}$$

*   **Domain Layer (`AIAudit.Domain`):** Contains core enterprise logic, Entities, Enums, Exceptions, and Value Objects. It must have **zero** external references or dependencies on other projects/databases.
*   **Application Layer (`AIAudit.Application`):** Contains business logic (CQRS Commands/Queries, Request Handlers, DTOs, Validators, and interfaces). Depends only on `Domain`.
*   **Infrastructure Layer (`AIAudit.Infrastructure`):** Implements interfaces defined in the Application layer (e.g., database context, external APIs, security services). Depends on `Application`.
*   **WebApi Layer (`AIAudit.WebApi`):** The presentation entry point (Controllers, Middleware, OpenAPI configuration). Depends on `Infrastructure` and `Application`.

---

## 🛠️ 2. Technology Stack & Packages

*   **Runtime:** .NET 9.0 (ASP.NET Core Web API)
*   **Database Provider:** MySQL (using `Pomelo.EntityFrameworkCore.MySql`)
*   **Design-Time Migrations:** `Microsoft.EntityFrameworkCore.Design` and `Microsoft.EntityFrameworkCore.Tools`
*   **CQRS Pattern:** MediatR (Mediator Pattern)
*   **Validation:** FluentValidation
*   **Authentication:** ASP.NET Core Identity & JWT Tokens

---

## 📂 3. Repository Layout & File Placements

When adding new features, place files strictly according to this structure:

### Domain
*   **Entities:** `src/AIAudit.Domain/Entities/<EntityName>.cs`
*   **Enums:** `src/AIAudit.Domain/Enums/<EnumName>.cs`

### Application
*   **Common Interfaces:** `src/AIAudit.Application/Common/Interfaces/`
*   **CQRS Slices:** Place features in `src/AIAudit.Application/Features/<FeatureName>/`
    *   **Queries:** `.../Queries/<QueryName>/<QueryName>Query.cs` and `.../Queries/<QueryName>/<QueryName>QueryHandler.cs`
    *   **Commands:** `.../Commands/<CommandName>/<CommandName>Command.cs` and `.../Commands/<CommandName>/<CommandName>CommandHandler.cs`
    *   **Validators:** Place FluentValidation classes in the same folder as their respective Command/Query.
    *   **DTOs:** `src/AIAudit.Application/DTOs/` or inside the feature directory.

### Infrastructure
*   **Entity Configurations:** Place EF configurations mapping entities in `src/AIAudit.Infrastructure/Persistence/Configurations/<EntityName>Configuration.cs`.
*   **Dependency Registration:** Register all infrastructure services in `src/AIAudit.Infrastructure/DependencyInjection.cs`.

### WebApi
*   **Controllers:** Place REST Endpoints in `src/AIAudit.WebApi/Controllers/<ControllerName>Controller.cs`.
*   **Middleware:** Place custom middleware in `src/AIAudit.WebApi/Middleware/`.

---

## 🚀 4. Step-by-Step Implementation Workflow for AI

When asked to implement a new feature or modify the database schema, follow this precise order:

### Step 1: Define Entities & Enums
Write your Domain models inside `AIAudit.Domain/Entities` and enums in `AIAudit.Domain/Enums`. Ensure model attributes are strongly typed.

### Step 2: Define Abstractions (If needed)
Create or update core abstractions (e.g., repository interfaces or database context interfaces) inside `AIAudit.Application/Common/Interfaces`.

### Step 3: Map Database Configurations
1. Define a mapping configuration implementing `IEntityTypeConfiguration<T>` in `AIAudit.Infrastructure/Persistence/Configurations/`.
2. Reference the entity DbSet inside `ApplicationDbContext`.

### Step 4: Write CQRS Command/Query Slice
1. Create request DTOs, commands, or queries.
2. Implement validation rules using FluentValidation.
3. Write request handler business logic in `AIAudit.Application/Features/`.

### Step 5: Expose Controllers
Create or edit controllers in `AIAudit.WebApi/Controllers/` to invoke the commands or queries using MediatR.

### Step 6: Create & Apply Database Migrations
Always perform migrations from the `backend/` root folder:

```bash
# 1. Build the solution to ensure no compilation errors
dotnet build

# 2. Add the EF Migration
dotnet ef migrations add <MigrationName> --project src/AIAudit.Infrastructure/ --startup-project src/AIAudit.WebApi/

# 3. Apply the Migration to the database (if local environment is ready)
dotnet ef database update --project src/AIAudit.Infrastructure/ --startup-project src/AIAudit.WebApi/
```

---

## 🔍 5. Verification Checkpoints

Before completing any task, verify the following:
1.  **Build Check:** Run `dotnet build` and ensure there are no compilation errors or warnings.
2.  **Architecture Check:** Check that no reference to `AIAudit.Infrastructure` or `AIAudit.WebApi` exists in `AIAudit.Domain` or `AIAudit.Application`.
3.  **Nullable Reference Types:** Adhere to C# nullable annotations (`#nullable enable`). Avoid using `!` suppression where possible; use appropriate null-checks or fallback values.
