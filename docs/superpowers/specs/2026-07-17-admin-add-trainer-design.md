# Admin Add Trainer Feature

## Overview
Admin can create new PT (Personal Trainer) accounts from the Admin PTs management page via a modal form.

## Backend

### New DTO: `CreatePtRequestDto`
Path: `Application/DTOs/PTs/CreatePtRequestDto.cs`
- `Fullname` (string, required)
- `Email` (string, required)
- `Password` (string, required)
- `Phone` (string?, optional)
- `ExperienceYears` (int?, optional)

### Interface: `IPtService`
Add method: `Task<PtDto> CreateAsync(CreatePtRequestDto dto)`

### Service: `PtService.CreateAsync`
1. Check duplicate email → throw if exists
2. Create `User` with `RoleId = 2` (PT), hash password via BCrypt
3. If `ExperienceYears` provided, create linked `PtProfile`
4. Return `PtDto`

### Controller: `PtController`
Add `[HttpPost]` → calls `_ptService.CreateAsync`

### Auth: `[Authorize]` with role Admin (roleId 1) on the new endpoint

## Frontend

### File: `AdminPTs.tsx`
- Import `useDisclosure` from Chakra UI
- Add `AddTrainerModal` component (inline or same file)
- "Add Trainer" button: `onClick={onOpen}`
- Modal form fields: Fullname, Email, Password, Phone, Experience Years
- Submit: `POST /api/pt` via `apiClient`, then `mutate()` to refresh list
- Toast: success / error

## Flow
Admin clicks "Add Trainer" → modal opens → fills form → submit → POST /api/pt → backend creates User + PtProfile → returns PtDto → frontend shows success toast → list refreshes
