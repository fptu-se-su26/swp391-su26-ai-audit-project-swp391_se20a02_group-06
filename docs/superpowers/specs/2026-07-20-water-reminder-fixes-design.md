# Water Reminder — Bug Fix Design

## Bug 1: Nutrition data persists across account switch

**Problem:** SWR cache key `/nutrition/daily?date=...` doesn't include user ID. When User A's data is cached and User B logs in, SWR shows stale data from User A until re-fetch completes.

**Fix (Nutrition.tsx):**
```tsx
const { user } = useAuthStore()
// Key includes user.id — when user changes, key changes → cache miss → fresh fetch
const { data: summary } = useSWR(
    user?.id ? `/nutrition/daily?date=${todayStr}` : null, fetcher
)
const { data: foods } = useSWR(
    user?.id ? '/foods' : null, fetcher
)
```

## Bug 2: Auto-reminder not working + wrong time display

**Problem A:** Backend background service scans every 30 minutes; user may not wait long enough. Hardcoded 08:00/22:00 instead of user's configured times.

**Fix (WaterReminderBackgroundService.cs):**
- Reduce scan interval: 30 min → 5 min
- Use `member.WaterReminderStartTime` / `member.WaterReminderEndTime` (already fixed in earlier edit)
- Add `_logger.LogInformation` on each scan cycle to verify execution

**Problem B:** Frontend `getNextReminderTime` always shows `now+1`, unrelated to actual dynamic interval.

**Fix (NotificationContext.tsx):**
- Change `getNextReminderTime` signature: accept `remaining: number, startTime: string, endTime: string`
- Calculate interval based on remaining glasses and remaining hours:
  ```
  hoursLeft = (endMinutes - nowMinutes) / 60
  intervalMinutes = hoursLeft / remaining * 60
  nextTime = now + intervalMinutes
  ```
- Update `drinkWaterFromNotification` to pass `waterTargetGlasses` from API response

## Bug 3: Test notification not real-time

**Problem:** SignalR connection may fail (WebSocket closed, background tab, token expiry). Notification saved to DB but frontend doesn't receive real-time push.

**Fix (NotificationContext.tsx):**
- Track SignalR connection state: `'connected' | 'disconnected' | 'reconnecting'`
- Add polling fallback: if connection !== 'connected', fetch `GET /notifications` every 30s
- On `onreconnected`: immediately re-fetch to catch missed notifications
- On `onclose`: set disconnected → polling activates
- Add console.log for connection state changes to aid debugging

## Files Changed

| File | Change |
|------|--------|
| `frontend/src/pages/member/Nutrition.tsx` | SWR key → include user.id |
| `frontend/src/context/NotificationContext.tsx` | getNextReminderTime dynamic calc; polling fallback; connection monitor |
| `backend/.../WaterReminderBackgroundService.cs` | Scan 5 min; use user config; more logs |
