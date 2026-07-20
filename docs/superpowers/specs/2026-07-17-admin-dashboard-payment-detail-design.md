# Admin Dashboard & Payment Detail — Design Spec

## 1. Overview

Two independent but complementary features:
- **A. Admin Dashboard** — replace hardcoded/stale data with real analytics from DB, add charts and insights.
- **B. Payment Detail Modal** — add a detail view when admin clicks the "View" button on a payment row.

---

## 2. A — Admin Dashboard

### 2.1 BE: New `GET /api/admin/dashboard`

Add a new controller instead of modifying the existing user-centric `DashboardController`.

**New endpoint:** `AdminDashboardController.GetDashboard()` — `[Authorize(Roles = "Admin")]`

**Return type:** `AdminDashboardDto`

#### AdminDashboardDto

| Field | Type | Source |
|---|---|---|
| `totalUsers` | int | `COUNT(*) FROM users` |
| `newUsersThisMonth` | int | Users where `created_at` >= first day of current month |
| `activeSubscriptions` | int | `MembershipSubscriptions` where `Status == "ACTIVE"` and `EndDate >= now` |
| `expiredSubscriptions` | int | `MembershipSubscriptions` where `Status == "EXPIRED"` or (`Status == "ACTIVE"` and `EndDate < now`) |
| `subscriptionRate` | double | `(activeSubscriptions / totalUsers) * 100` |
| `totalRevenue` | decimal | `SUM(amount) FROM payments WHERE status == "SUCCESS"` |
| `revenueThisMonth` | decimal | Same filtered by `paid_at` >= first day of current month |
| `monthlyRevenue` | `List<MonthlyValueDto>` | Last 12 months, `GROUP BY YEAR(paid_at), MONTH(paid_at)` |
| `monthlyNewUsers` | `List<MonthlyCountDto>` | Last 12 months, `GROUP BY YEAR(created_at), MONTH(created_at)` |
| `topPackages` | `List<PackageStatDto>` | Top 5 packages by payment count, joined via orders |
| `recentPayments` | `List<PaymentDto>` | Last 10 payments from the existing payments query |

#### Supporting DTOs

```csharp
public class MonthlyValueDto {
    public string Month { get; set; }  // "2026-01"
    public decimal Amount { get; set; }
}

public class MonthlyCountDto {
    public string Month { get; set; }
    public int Count { get; set; }
}

public class PackageStatDto {
    public string PackageName { get; set; }
    public int Count { get; set; }
    public decimal Revenue { get; set; }
}
```

### 2.2 FE: AdminDashboard rewrite

**File:** `frontend/src/pages/admin/AdminDashboard.tsx`

**Layout (keep existing AdminLayout wrapper + style):**
```
┌──────────────────────────────────────────────────┐
│  Payments & Revenue                      [Export] │
├──────────────────────────────────────────────────┤
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐│
│ │Total │ │Active│ │Expire│ │Revenue│ │NewUsrs│ │Active ││
│ │Users │ │Subs  │ │Subs  │ │Month │ │Month  │ │Rate % ││
│ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘│
├──────────────────────────────────────────────────────┤
│  Revenue (12 months)                    User Growth   │
│  ┌─────────────────────┐              ┌────────────┐ │
│  │   Bar Chart         │              │ Line Chart │ │
│  │                     │              │            │ │
│  └─────────────────────┘              └────────────┘ │
├──────────────────────┬───────────────────────────────┤
│  Top Packages        │   Recent Payments             │
│  ┌────────────────┐  │   ┌─────────────────────────┐ │
│  │ 1. Gym 1M - 20 │  │   │ User - Amount - Status │ │
│  │ 2. Shred  - 15 │  │   │ ...                     │ │
│  └────────────────┘  │   └─────────────────────────┘ │
└──────────────────────┴───────────────────────────────┘
```

**Chart library:** use `recharts` (`npm install recharts`)

- `BarChart` for Monthly Revenue (red bars)
- `LineChart` for Monthly New Users (red line)
- Style: transparent background, dark grid lines, white/red text, consistent with `#141720` / `#E03030` theme

**Data flow:** The dashboard calls `GET /api/admin/dashboard` once, receives all data. No separate API calls for individual stats.

**Role handling:** Keep existing logic for admin vs PT. If role is PT, show PT-focused dashboard (existing).

---

## 3. B — Payment Detail Modal

### 3.1 FE: Add payment detail state + modal to AdminPayments.tsx

**State:**
```tsx
const [selectedPayment, setSelectedPayment] = useState<any>(null)
```

**Modal content:** When `selectedPayment` is set, show a Chakra `Modal` with:

- **Order Code** — monospace font
- **Transaction Code** — monospace font
- **User:** name + email
- **Package:** name
- **Amount:** VND formatted
- **Payment Method:** e.g. "PayOs"
- **Status:** colored badge
- **Paid At:** formatted date
- **Close button**

**Trigger:** The existing "View" button gets `onClick={() => setSelectedPayment(t)}`

### 3.2 BE: No changes needed — `GET /api/payments` already returns full data

The `PaymentDto` already contains all fields needed for the detail modal.

---

## 4. Files Changed

### New files:
- `backend/src/FitnessTrainingSystem.WebApi/Controllers/AdminDashboardController.cs`
- `backend/src/FitnessTrainingSystem.Application/DTOs/Dashboard/AdminDashboardDto.cs`
- `backend/src/FitnessTrainingSystem.Application/DTOs/Dashboard/MonthlyValueDto.cs`
- `backend/src/FitnessTrainingSystem.Application/DTOs/Dashboard/MonthlyCountDto.cs`
- `backend/src/FitnessTrainingSystem.Application/DTOs/Dashboard/PackageStatDto.cs`

### Modified files:
- `frontend/src/pages/admin/AdminDashboard.tsx` — full rewrite of admin section
- `frontend/src/pages/admin/AdminPayments.tsx` — add modal
- (optional) `frontend/package.json` — add `recharts`

---

## 5. Acceptance Criteria

1. Admin dashboard shows real revenue (total + this month) fetched from DB.
2. Revenue chart bar shows last 12 months data.
3. User growth line chart shows new users per month.
4. Top packages table ranks by purchase count.
5. Recent payments section shows last 10 payments.
6. Stat cards (6) show correct counts from DB.
7. Clicking "View" in Payments opens a modal with full transaction details.
8. All styles match existing dark theme (`#141720`, `#E03030`, `#1e2028`, etc.).
9. Admin role required; PT sees their existing dashboard unchanged.
