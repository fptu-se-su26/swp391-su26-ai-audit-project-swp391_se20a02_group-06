# KYNEX Backend — C# Clean Architecture

This is the backend for the KYNEX project, built with C# .NET 9.0 using **Clean Architecture** (Onion Architecture). The design ensures that the core business logic remains independent of external databases, UI frameworks, or third-party services.

---

## 🛠️ Technology Stack

- **Framework:** .NET 9.0 (ASP.NET Core Web API)
- **Database ORM:** Entity Framework Core
- **Database Provider:** SQL Server
- **Patterns & Logic:** CQRS with MediatR (Mediator Pattern)
- **Validation:** FluentValidation
- **Authentication:** JWT Bearer (JSON Web Token) with ASP.NET Core Identity

---

## 🏛️ Clean Architecture Structure

```text
backend/
├── AIAudit.sln
└── src/
    ├── AIAudit.Domain/
    │   ├── Common/             # Core base classes (e.g., BaseEntity)
    │   ├── Entities/           # Core domain entity models (User, PT, Exercise, Membership, etc.)
    │   ├── Enums/              # Domain-specific enumerations (Roles, PackageTypes)
    │   └── Exceptions/         # Custom domain-level exceptions
    │
    ├── AIAudit.Application/    # Use cases, depends ONLY on Domain
    │   ├── Common/             # Behaviours (logging/validation), interfaces, mappings
    │   ├── DTOs/               # Data Transfer Objects
    │   └── Features/           # CQRS slices (Auth, Users, Memberships, Exercises, Schedules, Nutrition)
    │
    ├── AIAudit.Infrastructure/ # Database/Services, depends on Application
    │   ├── Identity/           # JWT, Identity services implementation
    │   ├── Persistence/        # EF Core DbContext, Configurations, Migrations
    │   └── Services/           # Email, AI Integrations, Payment implementation
    │
    └── AIAudit.WebApi/         # Presentation Layer (HTTP entry point), depends on Infrastructure & Application
        ├── Controllers/        # REST Endpoints
        ├── Middleware/         # Custom HTTP pipeline middlewares (Global Exception Handling)
        ├── Program.cs          # Web entry point & Dependency Injection container
        └── appsettings.json    # Application configuration (Connection Strings, JWT keys)
```

### Dependency Rules
Clean Architecture flows inwards. Inner circles cannot know about outer circles:
$$\text{Domain} \longleftarrow \text{Application} \longleftarrow \text{Infrastructure} \longleftarrow \text{WebApi}$$

---

## 🚀 Getting Started

### Prerequisites
- **.NET SDK:** .NET 9.0 SDK or later
- **Database:** SQL Server (LocalDB or Docker instance)

### 1. Build the Solution
Run the build command from the `backend/` root folder:
```bash
dotnet build
```

### 2. Run the Web API
To start the developer server:
```bash
dotnet run --project src/AIAudit.WebApi/AIAudit.WebApi.csproj
```
Once running, you can access:
- **API URL:** `https://localhost:5001` or `http://localhost:5000`
- **Swagger Documentation:** `https://localhost:5001/swagger` (if configured/installed) or `https://localhost:5001/openapi/v1.json`

### 3. Add Entity Framework Migrations
To add a migration after modifying domain entities (run from `backend/` folder):
```bash
dotnet ef migrations add InitialCreate --project src/AIAudit.Infrastructure/ --startup-project src/AIAudit.WebApi/
```

### 4. Update the Database
To apply migrations to your database instance:
```bash
dotnet ef database update --project src/AIAudit.Infrastructure/ --startup-project src/AIAudit.WebApi/
```
