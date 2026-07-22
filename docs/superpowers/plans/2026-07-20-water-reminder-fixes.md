# Water Reminder Bug Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix 3 bugs: stale SWR cache on account switch, auto-reminder timing, and missing real-time notification delivery.

**Architecture:** SWR key includes user ID to isolate cache per-user; backend background service scans every 5 min with dynamic interval; frontend adds SignalR connection monitor + polling fallback.

**Tech Stack:** React + SWR, ASP.NET Core BackgroundService + SignalR

---

### Task 1: SWR cache key scoped to user ID

**Files:**
- Modify: `frontend/src/pages/member/Nutrition.tsx:52-56`

**Interfaces:**
- Consumes: `useAuthStore` (already imported)
- Produces: SWR keys `user?.id ? '/nutrition/daily?date=X' : null` and `user?.id ? '/foods' : null`

- [ ] **Step 1: Add userId to SWR key**

Edit `Nutrition.tsx`:

Line 52-56: change both `useSWR` calls:
```tsx
const { user } = useAuthStore()
// ...
const { data: foods } = useSWR(user?.id ? '/foods' : null, fetcher)
const { data: summary, mutate: refreshSummary } = useSWR(user?.id ? `/nutrition/daily?date=${todayStr}` : null, fetcher)
```

`useAuthStore` is already imported at the top of the file.

- [ ] **Step 2: Verify TypeScript**

```bash
cd frontend && npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add frontend/src/pages/member/Nutrition.tsx
git commit -m "fix: scope SWR cache key to user ID"
```

---

### Task 2: Auto-reminder scan interval + dynamic next-reminder calculation

**Files:**
- Modify: `backend/.../BackgroundServices/WaterReminderBackgroundService.cs:44`
- Modify: `frontend/src/context/NotificationContext.tsx:159-201`

**Interfaces:**
- Backend: `WaterReminderBackgroundService` now scans every 5 min, uses user's configured times
- Frontend: `getNextReminderTime(remaining, startTime, endTime)` returns calculated next time
- Frontend: `drinkWaterFromNotification` passes `waterTargetGlasses` to `getNextReminderTime`

- [ ] **Step 1: Reduce scan interval to 5 minutes**

In `WaterReminderBackgroundService.cs` line 44:
```csharp
await Task.Delay(TimeSpan.FromMinutes(5), stoppingToken);
```

Also add logger at start of each cycle:
```csharp
_logger.LogInformation("Water reminder scan cycle started at {Time}", DateTime.Now);
```

- [ ] **Step 2: Build backend**

```bash
cd backend && dotnet build src/FitnessTrainingSystem.WebApi
```
Expected: 0 errors.

- [ ] **Step 3: Update `getNextReminderTime` signature and logic**

In `NotificationContext.tsx`, replace current `getNextReminderTime` (lines 159-175):
```tsx
const getNextReminderTime = (remaining: number, startTime?: string, endTime?: string): string => {
    const now = new Date()
    const start = startTime || '07:00'
    const end = endTime || '22:00'
    const [startH, startM] = start.split(':').map(Number)
    const [endH, endM] = end.split(':').map(Number)
    const startMin = startH * 60 + startM
    const endMin = endH * 60 + endM
    const nowMin = now.getHours() * 60 + now.getMinutes()

    if (nowMin >= endMin) return `Tomorrow ${start}`
    if (nowMin < startMin) return `Today ${start}`
    if (remaining <= 0) return `Done for today!`

    // Dynamic interval: spread remaining glasses across remaining hours
    const hoursLeft = (endMin - nowMin) / 60
    const intervalMinutes = Math.round((hoursLeft / remaining) * 60)
    const nextReminder = new Date(now.getTime() + intervalMinutes * 60000)
    const nextH = String(nextReminder.getHours()).padStart(2, '0')
    const nextM = String(nextReminder.getMinutes()).padStart(2, '0')
    return `${nextH}:${nextM}`
}
```

- [ ] **Step 4: Update `drinkWaterFromNotification` caller**

Update the call site in `drinkWaterFromNotification` (around line 187-191):
```tsx
const waterConsumedGlasses = result?.waterConsumedGlasses ?? 0
const waterTargetGlasses = result?.waterTargetGlasses ?? 8
const remaining = Math.max(0, waterTargetGlasses - waterConsumedGlasses)
const nextTime = getNextReminderTime(remaining, result?.waterReminderStartTime, result?.waterReminderEndTime)
const nextMsg = nextTime.startsWith('Tomorrow') || nextTime.startsWith('Today')
    ? `Next reminder: ${nextTime}`
    : `Next reminder at ~${nextTime}`
```

- [ ] **Step 5: Verify TypeScript**

```bash
cd frontend && npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add frontend/src/context/NotificationContext.tsx
git commit -m "fix: dynamic next-reminder calculation based on remaining glasses"
```

---

### Task 3: SignalR connection monitor + polling fallback

**Files:**
- Modify: `frontend/src/context/NotificationContext.tsx` (add connection state + polling)

- [ ] **Step 1: Add connectionState state + helpers**

After line 36 (`const [connection, setConnection] = useState...`):
```tsx
const [connectionState, setConnectionState] = useState<'connected' | 'disconnected' | 'reconnecting'>('disconnected')
```

- [ ] **Step 2: Wire connection state to SignalR events**

Inside `startConnection` (after `await connection.start()`), add:
```tsx
setConnectionState('connected')

connection.onreconnecting(() => {
    console.log('SignalR reconnecting...')
    setConnectionState('reconnecting')
})
connection.onreconnected(() => {
    console.log('SignalR reconnected.')
    setConnectionState('connected')
    fetchNotifications()
})
connection.onclose(() => {
    console.log('SignalR disconnected.')
    setConnectionState('disconnected')
})
```

Also log success: change `console.log('SignalR Notification Hub connected successfully.')` to include state.

- [ ] **Step 3: Add polling fallback useEffect**

After the connection useEffect (after line 128), add:
```tsx
// Polling fallback: fetch every 30s when SignalR is not connected
useEffect(() => {
    if (!isAuthenticated) return
    if (connectionState === 'connected') return

    const intervalId = setInterval(() => {
        fetchNotifications()
    }, 30000)

    return () => clearInterval(intervalId)
}, [isAuthenticated, connectionState])
```

- [ ] **Step 4: Verify TypeScript**

```bash
cd frontend && npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/context/NotificationContext.tsx
git commit -m "fix: add SignalR connection monitor and polling fallback"
```

---

### Task 4: Restart backend and verify

- [ ] **Step 1: Kill old backend process**

```bash
Get-Process -Name "FitnessTrainingSystem.WebApi" -ErrorAction SilentlyContinue | Stop-Process -Force
```

- [ ] **Step 2: Start backend**

```bash
cd backend && Start-Process powershell -ArgumentList "-NoExit -Command dotnet run --project src/FitnessTrainingSystem.WebApi --urls http://localhost:5007"
```
