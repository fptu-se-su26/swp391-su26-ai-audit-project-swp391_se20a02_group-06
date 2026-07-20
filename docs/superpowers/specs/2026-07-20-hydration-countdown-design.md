# Hydration Countdown + Notification Clear — Design Spec

## 1. Clear notifications after drink + Clear All

**NotificationContext.tsx:**
- `drinkWaterFromNotification`: after `markRead`, also `setNotifications(prev => prev.filter(n => n.id !== notificationId))`
- `handleClearAll`: calls `markAllAsRead` → `setNotifications([])`
- Expose `clearAll` in context

**NotificationBell.tsx:**
- Add "Clear All" button at bottom of notification dropdown
- Calls `clearAll()` from context

## 2. Hydration Countdown Timer

**Nutrition.tsx — new component `HydrationCountdown`**

Displays below HydrationTracker:
```
⏱ Next glass in: 14:32
[progress bar ████████████░░░░░░░░░]
```

**Calculation:**
```
remaining = target - current
hoursLeft = (endTimeMin - nowMin) / 60
intervalMs = (hoursLeft / remaining) * 3600 * 1000    (if remaining > 0)
endTime = Date.now() + intervalMs
```

**Countdown tick (setInterval 1s):**
```
remainingMs = endTime - Date.now()
minutes = Math.floor(remainingMs / 60000)
seconds = Math.floor((remainingMs % 60000) / 1000)
display = `${minutes}:${String(seconds).padStart(2, '0')}`
progress = 1 - (remainingMs / intervalMs)
```

**On countdown reaches 0:**
- Toast: "Time to drink water! 🥛"
- Auto-call `logWater(todayStr, 1)` or create notification
- Reset timer for next glass

**On manual glass click (`handleLogWater`):**
- On success, recalculate `intervalMs` and `endTime` based on new remaining count
- Timer resets immediately

**Data source:** `summary?.waterReminderStartTime`, `summary?.waterReminderEndTime`, `summary?.waterConsumedGlasses`, `summary?.waterTargetGlasses`

## Files Changed

| File | Change |
|------|--------|
| `frontend/src/context/NotificationContext.tsx` | `drinkWaterFromNotification` remove from list; add `clearAll` |
| `frontend/src/components/shared/Header/NotificationBell.tsx` | Add "Clear All" button |
| `frontend/src/pages/member/Nutrition.tsx` | Add `HydrationCountdown` under HydrationTracker |
| `frontend/src/features/nutrition/components/NutritionWidgets.tsx` | New `HydrationCountdown` component |
