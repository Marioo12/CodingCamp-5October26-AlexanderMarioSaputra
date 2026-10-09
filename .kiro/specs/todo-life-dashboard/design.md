# Design Document

## Overview

The To Do List Life Dashboard is a single-page, client-side web application delivered as three static files: `Index.html`, `css/Style.css`, and `js/main.js`. It requires no build step, no framework, and no server — a user can open the HTML file directly in a browser or serve it from any static host.

The application is organized around four functional panels rendered inside a single HTML document:

1. **Greeting Panel** — displays a live HH:MM:SS clock, the current date, and a time-of-day greeting.
2. **Focus Timer** — a Pomodoro-style countdown with configurable duration (1–120 min), start/stop/reset controls, and a modal for changing the duration.
3. **Task List** — a persistent to-do list with add, edit (inline), complete (checkbox), and delete capabilities.
4. **Quick Links** — a persistent shortcut panel where users add named URLs that open in a new tab.

Two cross-cutting concerns apply across all panels:

- **Light / Dark mode** — toggled by a single button; preference is persisted in `localStorage`.
- **Responsive layout** — two-column grid above 700 px, single-column stack at or below 700 px.

All persistent state is stored exclusively in `localStorage` using three independent keys. There is no network I/O.

---

## Architecture

### High-Level Structure

```
Index.html
 ├── <head>  ← links Style.css
 └── <body>
      ├── <header #header>          ← Greeting Panel (clock, date, greeting, theme toggle)
      ├── <main #main-row>          ← CSS Grid (timer | tasks)
      │    ├── <div #timer-section> ← Focus Timer + Change-Time Modal (overlay)
      │    └── <div #task-section>  ← Task List
      └── <footer #links-section>   ← Quick Links
           └── <script src="js/main.js">
```

### Data Flow

```
User action
    │
    ▼
DOM event listener (in main.js)
    │
    ▼
State mutation (in-memory JS objects / variables)
    │
    ├──► localStorage.setItem(...)   ← persists change
    │
    └──► renderAll() / renderTimer() ← re-renders affected panel
              │
              ▼
           DOM update (innerHTML / createElement)
```

State is held in-memory inside each module-level closure. The page is never reloaded to apply changes; all updates are incremental DOM writes.

### Module Breakdown (within `main.js`)

`main.js` is a single file but is divided into clearly separated, self-contained function groups:

| Group | Entry-point function | Responsibility |
|---|---|---|
| Greeting | `showGreeting()` | Derives time-of-day, writes `#greeting` |
| Clock | `showTime()` | Formats HH:MM:SS, writes `#clock` |
| Date | `showDate()` | Formats long date, writes `#Current_date` |
| Focus Timer | `showTimer()` | Encapsulates all timer state and controls |
| Quick Links | `initQuickLinks()` | Manages link CRUD and render |
| Task List | `initTaskList()` | Manages task CRUD and render |
| Theme | `initThemeToggle()` | Reads/writes localStorage theme key |

Initialization at page load:

```js
showGreeting();
showDate();
showTime();
showTimer();
initQuickLinks();
initTaskList();
initThemeToggle();
setInterval(showTime, 1000);
```

The `setInterval` for `showTime` is the only recurring background job. All other logic is purely event-driven.

---

## Components and Interfaces

### 1. Greeting Panel

**DOM elements:** `#greeting`, `#clock`, `#Current_date`, `#theme-toggle`  
**Functions:** `showGreeting()`, `showTime()`, `showDate()`, `initThemeToggle()`

#### Greeting logic (Requirement 2)

```
hour ∈ [1, 11]  → "Good Morning"
hour ∈ [12, 16] → "Good Afternoon"
hour ∈ [17, 20] → "Good Evening"
hour ∈ [21,23] ∪ [0,4] → "Good Night"
```

The greeting is computed once on page load from `new Date().getHours()`. It is not updated during the session (only the clock ticks — the greeting would change naturally on the next page load or if the user crosses a threshold mid-session; Requirement 2 does not mandate live re-evaluation, only correct computation on load).

#### Clock format (Requirement 1)

Each of HH, MM, SS is zero-padded with `String(n).padStart(2, "0")`. The clock updates every 1 000 ms via `setInterval`.

**Error guard (Requirements 1.4, 2.7):** Before reading `new Date()`, the code checks whether `Date.now()` produces a finite number. If not, `#clock` shows a static error string, the interval is cleared, and `#greeting` falls back to `"Good Morning"`.

---

### 2. Focus Timer

**DOM elements:** `#Timer_display`, `#Start-btn`, `#Stop-btn`, `#Reset-btn`, `#Change-time-btn`, `#time-modal-overlay`, `#time-modal`, `#custom-minutes`, `#time-modal-confirm`, `#time-modal-cancel`  
**Function:** `showTimer()` (closure owns all state)

#### Internal state

| Variable | Type | Meaning |
|---|---|---|
| `pomodoroMinutes` | `number` | Configured session length (default 25) |
| `timeLeft` | `number` | Remaining seconds in current countdown |
| `timerId` | `number \| null` | Return value of `setInterval`; `null` when idle |

#### State machine

```
         start btn
IDLE ──────────────► RUNNING
  ▲                     │
  │  stop btn / expire  │
  └─────────────────────┘
  ▲
  │  reset btn (from any state)
  └──────────────────────────── RUNNING or IDLE → IDLE
```

- **IDLE:** `timerId === null`, Start btn visible, Stop btn hidden.
- **RUNNING:** `timerId !== null`, Stop btn visible, Start btn hidden.
- **Reset:** always clears interval, sets `timeLeft = pomodoroMinutes * 60`, returns to IDLE.
- **Expire:** when `timeLeft` reaches 0 inside the interval callback, `clearInterval` is called, state becomes IDLE (Requirement 4.5).

#### Change-Time Modal (Requirement 6)

The modal is an overlay `<div>` toggled via the `.hidden` CSS class.

- Opens with the current `pomodoroMinutes` pre-filled.
- Validates: integer, 1 ≤ value ≤ 120 (Requirement 6.3 — show inline error, keep modal open).
- On confirm: stops any running timer, applies new duration, closes modal.
- On cancel / Escape / backdrop click: closes modal, no change.
- Enter key in input fires confirm action (Requirement 6.6).

---

### 3. Task List

**DOM elements:** `#task-input`, `#add-task-btn`, `#task-list`  
**Function:** `initTaskList()` (closure; no module-level state except `STORAGE_KEY`)

#### Task object shape

```js
{ text: string, done: boolean }
```

Tasks are stored as a JSON array in `localStorage["tasks"]`.

#### Operations

| Operation | Trigger | Behavior |
|---|---|---|
| Add | Click "Add Task" or Enter in `#task-input` | Trim text; reject if empty/whitespace; push to array; save; re-render; clear & focus input |
| Complete | Checkbox change | Toggle `done`; save; re-render |
| Edit | Click "Edit" | Replace label + edit-btn with inline `<input>` + save-btn; focus input |
| Save edit | Click "Save" or Enter | Trim; reject if empty; update `tasks[i].text`; save; re-render |
| Cancel edit | Escape in inline input | Re-render (discards unsaved changes) |
| Delete | Click "Delete" | Splice index; save; re-render |

#### Empty state (Requirement 10.4)

When `tasks.length === 0` after a render, a `<li class="empty-state">` element is injected with the message "No tasks yet. Add one above!".

#### Character limit (Requirement 7.6)

`#task-input` carries `maxlength="500"`. When the limit is reached the `input` event fires and an error message appears below the input field.

---

### 4. Quick Links

**DOM elements:** `#link-name-input`, `#link-url-input`, `#add-link-btn`, `#link-list`  
**Function:** `initQuickLinks()` (closure)

#### Link object shape

```js
{ name: string, url: string }
```

Links are stored as a JSON array in `localStorage["quickLinks"]`.

#### Validation rules (Requirement 12)

| Field | Rule |
|---|---|
| `name` | 1–50 characters (trimmed) |
| `url` | 1–2048 characters, must begin with `http://` or `https://` |
| Collection size | Maximum 50 items |

On validation failure an inline error message is displayed adjacent to the invalid field.

#### Link rendering (Requirements 13, 14)

Each link card renders as:
```html
<div class="link-card">
  <a href="{url}" target="_blank" rel="noopener noreferrer" class="link-anchor">{name}</a>
  <button class="link-delete-btn" aria-label="Remove {name}">×</button>
</div>
```

Name is clamped to 50 characters via CSS `text-overflow: ellipsis` (the stored value remains full length; only display is truncated).

---

### 5. Theme Toggle

**DOM element:** `#theme-toggle`  
**Function:** `initThemeToggle()`

- On load: reads `localStorage["theme"]`. If `"dark"`, adds `.dark` class to `<body>` and sets button icon to ☀️. Otherwise defaults to light mode.
- On click: toggles `.dark` class; updates icon; writes `"dark"` or `"light"` to `localStorage["theme"]`.
- If `localStorage` is unavailable: defaults silently to light mode (Requirement 16.6).

---

## Data Models

### LocalStorage Keys

| Key | Type | Description |
|---|---|---|
| `"tasks"` | `JSON string → Task[]` | Ordered array of task objects |
| `"quickLinks"` | `JSON string → Link[]` | Ordered array of link objects |
| `"theme"` | `string` (`"light"` \| `"dark"`) | Current color-scheme preference |

### Task Schema

```ts
interface Task {
  text: string;   // 1–500 chars, trimmed; never empty or whitespace-only
  done: boolean;  // false = incomplete, true = complete
}
```

**Invariants:**
- `text` is always trimmed (no leading/trailing whitespace).
- `text.length >= 1` (empty tasks are never persisted).
- `done` is always a boolean (never `undefined` or `null`).
- The array is ordered by insertion time (index 0 = oldest).

### Link Schema

```ts
interface Link {
  name: string;  // 1–50 chars, trimmed
  url:  string;  // 1–2048 chars, starts with "http://" or "https://"
}
```

**Invariants:**
- `name.length >= 1 && name.length <= 50`.
- `url` passes `url.startsWith("http://") || url.startsWith("https://")`.
- Collection length never exceeds 50.
- Ordering is preserved (FIFO append; no sort applied).

### Theme Schema

A plain string. Valid values: `"light"` | `"dark"`. Any other value (including absent key) is treated as `"light"`.

### Read / Write Helpers

```js
// Tasks
function loadTasks()        // → Task[]     (returns [] on parse error)
function saveTasks(tasks)   // Task[] → void (wraps in try/catch for quota errors)

// Links
function loadLinks()        // → Link[]     (returns [] on parse error)
function saveLinks(links)   // Link[] → void

// Theme
localStorage.getItem("theme")   // read
localStorage.setItem("theme", value)  // write
```

All read helpers guard with `try/catch` and return `[]` on any `JSON.parse` error, satisfying Requirements 11.3 and 15.3.

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Task addition grows the list by exactly one

*For any* task list state and any valid (non-empty, non-whitespace-only) task description string, calling the add-task operation shall produce a task list whose length is exactly one greater than before, with the new last element having `text` equal to the trimmed input and `done` equal to `false`.

**Validates: Requirements 7.2, 7.5**

---

### Property 2: Whitespace-only and empty inputs are always rejected

*For any* string composed entirely of whitespace characters (spaces, tabs, newlines) or the empty string, attempting to add it as a task shall leave the task list unchanged, and `localStorage` shall not be updated.

**Validates: Requirements 7.4**

---

### Property 3: Task collection LocalStorage round-trip is lossless

*For any* array of valid task objects, serializing with `saveTasks` and then deserializing with `loadTasks` shall produce an array that is deep-equal to the original, preserving every `text` and `done` field in order.

**Validates: Requirements 7.5, 11.1, 11.4**

---

### Property 4: Task completion toggle is its own inverse

*For any* task and any initial `done` value, toggling the completion state twice shall return the task to its original `done` value — making toggle an involution.

**Validates: Requirements 8.2, 8.4**

---

### Property 5: Task checkbox rendering reflects stored state

*For any* array of task objects (with arbitrary `done` values), after calling `renderAll()`, every rendered checkbox's `checked` property shall equal the corresponding task's `done` field, and every task with `done === true` shall have the strikethrough style applied.

**Validates: Requirements 8.1, 8.3**

---

### Property 6: Task deletion reduces the list by exactly one

*For any* non-empty task array and any valid index `i` within that array, after deleting the task at index `i`, the resulting array shall have length decreased by exactly one and shall not contain the deleted task at any position.

**Validates: Requirements 10.2, 10.3**

---

### Property 7: Malformed LocalStorage data is safely discarded

*For any* string that is not valid JSON representing a `Task[]` array (including arbitrary malformed strings, non-array JSON, and objects with wrong field types), calling `loadTasks()` or `loadLinks()` shall return an empty array `[]` without throwing a runtime error.

**Validates: Requirements 11.3, 15.3**

---

### Property 8: Link addition grows the collection by exactly one

*For any* link collection containing fewer than 50 entries and any valid `{ name, url }` pair (name 1–50 chars, URL 1–2048 chars starting with `http://` or `https://`), calling the add-link operation shall produce a collection whose length is exactly one greater, with the new entry appended at the end in the correct position.

**Validates: Requirements 12.2, 12.5**

---

### Property 9: Invalid link submissions are always rejected

*For any* link submission where the URL does not begin with `"http://"` or `"https://"`, or the name is empty or exceeds 50 characters, or the URL exceeds 2048 characters, or the collection already contains 50 entries, the link collection shall remain unchanged and no write to `localStorage` shall occur.

**Validates: Requirements 12.4, 12.6**

---

### Property 10: Link collection LocalStorage round-trip is lossless

*For any* array of valid link objects, serializing with `saveLinks` and then deserializing with `loadLinks` shall produce an array that is deep-equal to the original, preserving every `name` and `url` field in order.

**Validates: Requirements 15.1, 15.4**

---

### Property 11: Greeting function is total and correct across all hours

*For any* integer hour in [0, 23], the `getGreeting(hour)` pure function shall return exactly one of the four greeting strings, and the string returned shall be the uniquely correct greeting for that hour per the boundary partition defined in Requirements 2.1–2.4: hours 5–11 → `"Good Morning"`, hours 12–16 → `"Good Afternoon"`, hours 17–20 → `"Good Evening"`, hours 0–4 and 21–23 → `"Good Night"`.

**Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5**

---

### Property 12: Timer display format is always valid MM:SS

*For any* non-negative integer `timeLeft` in seconds in the range [0, 7200] (covering 0 to 120 minutes), the `renderTimerDisplay(timeLeft)` pure function shall return a string matching `^[0-9]{2}:[0-9]{2}$` where the minutes component equals `Math.floor(timeLeft / 60)` zero-padded to two digits and the seconds component equals `timeLeft % 60` zero-padded to two digits.

**Validates: Requirements 1.1, 3.1, 5.2**

---

## Error Handling

### Strategy

All error conditions are handled defensively at the point of I/O or validation. Errors are surfaced to the user via transient inline messages injected adjacent to the relevant UI element; they never throw uncaught exceptions to the console in production flow.

### Per-component error handling

#### Clock / Date (Requirements 1.4, 2.7)
```js
function isClock valid() {
  return isFinite(Date.now());
}
```
If `Date.now()` is not finite on page load:
- `#clock` is set to the static string `"Time unavailable"`.
- `setInterval` is not started.
- `#greeting` defaults to `"Good Morning"`.

#### LocalStorage unavailability
`localStorage` access is wrapped in `try/catch` in all read and write helpers. If `localStorage.setItem` throws (quota exceeded or private-browsing restriction):
- The in-memory state continues to function for the current session.
- An error banner `<div class="error-msg">` is injected near the triggering panel.
- The previously persisted state in `localStorage` is not corrupted.

#### Task persistence failures (Requirements 7.7, 8.5, 9.3, 11.5)
- **Add failure:** task is shown in the list for the current session but the error message clarifies it was not saved.
- **Complete/edit failure:** the change is reverted in the DOM and `done`/`text` is restored to the prior value (Requirements 8.5, 9.3).
- **Quota exceeded on write:** error message shown; prior `localStorage` value is preserved.

#### Link persistence failures (Requirements 12.5, 14.4, 15.5)
- **Add failure:** the link is NOT appended to the displayed collection (Requirement 12.5 — stricter than tasks).
- **Delete failure:** the deleted link is restored to its prior position in the panel (Requirement 14.4).

#### Timer — invalid custom duration (Requirement 6.3)
- The `applyNewTime()` function validates `val` before applying it.
- If invalid: an `<span class="modal-error">` message is injected inside `#time-modal`; the modal stays open; `pomodoroMinutes` and `timeLeft` are unchanged.

#### URL safety (Requirement 13.4)
Before navigating, each link anchor's `href` is validated at render time. If a stored URL does not begin with `http://` or `https://`, the anchor's `href` is replaced with `#` and a click handler shows an error message instead of navigating.

### Error message styling
All error messages share a `.error-msg` CSS class: `color: #d32f2f`, `font-size: 0.82rem`, `margin-top: 4px`. They are removed on the next successful operation in the same panel.

---

## Testing Strategy

### Overview

The testing approach uses two complementary layers:

- **Property-based tests (PBT):** verify universal correctness properties across randomized inputs, implemented with [fast-check](https://fast-check.dev/) — a mature, actively maintained property-based testing library for JavaScript/TypeScript.
- **Example-based unit tests:** verify specific behaviors, edge cases, and integration points using [Vitest](https://vitest.dev/) (runs in Node; no browser required for pure logic tests).

Because the application is a vanilla JS file with no module system, the testable pure-logic functions (task/link CRUD helpers, greeting derivation, timer formatting, serialization) are extracted by `require`-ing or `import`-ing a CommonJS/ESM-compatible wrapper, or by testing them in a jsdom environment.

### Property-Based Tests

Each property test must run a **minimum of 100 iterations**.  
Each test is tagged with a comment in the format:  
`// Feature: todo-life-dashboard, Property {N}: {property_text}`

| Property | Test description |
|---|---|
| P1 | Adding a valid task grows the list by 1; new item has correct trimmed text and `done: false` |
| P2 | Any empty or whitespace-only string is rejected; list and `localStorage` are unchanged |
| P3 | `saveTasks(arr)` → `loadTasks()` deep-equals `arr` for any valid task array |
| P4 | Toggling `done` twice returns original value — toggle is an involution |
| P5 | `renderAll()` with any task array: every checkbox `checked` matches `done`; strikethrough applied iff `done === true` |
| P6 | Deleting task at any valid index reduces list length by 1 and removes that task |
| P7 | Any non-`Task[]` JSON (malformed, wrong type, etc.) fed to `localStorage` → `loadTasks()` returns `[]` with no error |
| P8 | Adding a valid link to a sub-50 collection grows it by 1; new entry is last |
| P9 | Any invalid link (bad URL prefix, name/URL out of bounds, collection full) is rejected |
| P10 | `saveLinks(arr)` → `loadLinks()` deep-equals `arr` for any valid link array |
| P11 | `getGreeting(hour)` returns exactly one correct string for every integer hour in [0, 23] |
| P12 | `renderTimerDisplay(timeLeft)` produces valid `MM:SS` for any `timeLeft` in [0, 7200] |

### Example-Based Unit Tests

Focus areas:
- **Timer state machine:** idle → running → paused → idle transitions; expire at 0; reset from running state.
- **Modal validation:** boundary values for custom duration (0, 1, 120, 121, non-numeric).
- **Task edge cases:** 500-character limit enforcement; edit cancel restores original text; deleting last task shows empty state.
- **Link edge cases:** exactly-50-link collection rejects a 51st; URL with `http://` and `https://` both accepted; `ftp://` rejected.
- **Persistence guard:** `loadTasks()` / `loadLinks()` return `[]` when `localStorage` holds malformed JSON; no exception thrown.
- **Theme:** reading `"dark"` from `localStorage` applies `.dark` class; missing key defaults to light.
- **Responsive:** CSS media query at 700 px (verified manually / with browser DevTools; not automatable in Vitest without a full browser).

### Test Configuration

```js
// vitest.config.js
export default {
  test: {
    environment: 'jsdom',
    globals: true,
  }
};
```

```js
// fast-check property test example
import fc from 'fast-check';
import { addTask, loadTasks, saveTasks } from './taskHelpers.js';

// Feature: todo-life-dashboard, Property 1: Task addition grows the list by exactly one
test('P1: adding valid task grows list', () => {
  fc.assert(
    fc.property(
      fc.array(validTaskArb),        // arbitrary existing task list
      fc.string({ minLength: 1 }).filter(s => s.trim().length > 0), // valid description
      (existingTasks, description) => {
        saveTasks(existingTasks);
        addTask(description);
        const result = loadTasks();
        return (
          result.length === existingTasks.length + 1 &&
          result[result.length - 1].text === description.trim() &&
          result[result.length - 1].done === false
        );
      }
    ),
    { numRuns: 100 }
  );
});
```

---

### What PBT Does NOT Cover

The following aspects are excluded from property-based testing per the guidelines:

- **UI rendering and layout** (the Greeting Panel's visual appearance, timer display styling, responsive breakpoints) — use snapshot tests or manual browser verification.
- **`localStorage` quota behavior** — environment-dependent; test with mocks in example-based tests.
- **Cross-browser compatibility** — verified manually in Chrome, Firefox, Edge, and Safari.
- **Accessibility** (ARIA labels, keyboard navigation) — verified manually with assistive technologies.
