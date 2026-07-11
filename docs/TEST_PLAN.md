# Test Plan — PM Tracker

## v1 Success Scenario (manual walkthrough)
1. Open the live URL — dashboard loads with project name, summary cards, risk list
2. Confirm seeded tasks appear in task list with correct status badges and owner names
3. Click "Add Task" → fill title, set status = In Progress, pick owner, set due date yesterday → submit
4. Confirm new task appears in list immediately with overdue highlight (red)
5. Click "Add Risk" → set likelihood = High, impact = High → submit
6. Confirm risk appears with ai_score ≥ 8 and review_status = unreviewed
7. Click "Refresh Summary" on dashboard → AI summary card updates with new text
8. Edit the task: change status to Done → confirm badge turns green, overdue highlight disappears
9. Delete the task → confirm it is removed from the list
10. ✅ Pass if all nine steps succeed without errors and all data persists on page refresh

## Empty State
- Create a brand-new project with no tasks → task list shows "No tasks yet. Add your first one."
- Risks section empty → shows "No risks logged."

## Error Cases
- Submit "Add Task" with blank title → inline validation error, no DB write
- Simulate network failure (DevTools offline) → error toast shown, form not cleared
- AI summary fetch fails (mock bad key) → fallback copy shown: "Summary unavailable — try refreshing."

## Loading States
- Dashboard on slow connection → skeleton cards visible, not blank white
- Task list fetching → spinner or skeleton rows shown

## Permission Check (post Sprint 3)
- Log in as User A, create a task → log out → log in as User B → task not visible
- Anonymous visitor → cannot see User A or B data (only demo project)
