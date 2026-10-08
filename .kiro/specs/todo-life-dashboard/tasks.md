# Implementation Plan: To Do List Life Dashboard

## Overview

Implement the complete single-page productivity dashboard as three static files (`Index.html`, `css/Style.css`, `js/main.js`). Tasks are ordered so each step produces working, runnable code that the next step extends. No build system, no framework, no test setup — open `Index.html` directly in a browser after each step to verify progress.

---

## Tasks

- [ ] 1. Write the HTML skeleton (`Index.html`)
  - [ ] 1.1 Author the complete HTML document structure
    - Create `<!DOCTYPE html>` with `lang="en"`, `<meta charset>`, `<meta viewport>`, and `<title>My Page`
    - Add `<link rel="stylesheet" href="css/Style.css">` in `<head>` — no inline `<style>` blocks
    - Write `<header id="header">` containing: `<button id="theme-toggle">`, `<div id="greeting">`, `<div id="clock">`, `<div id="Current_date">`
    - Write `<main id="main-row">` with two children: `<div id="timer-section">` and `<div id="task-section">`
    - Inside `#timer-section`: `<h2>Focus Timer</h2>`, `<div id="Timer_display">25:00</div>`, `<div id="timer-controls">` with buttons `#Start-btn`, `#Stop-btn` (add class `hidden`), `#Reset-btn`, `#Change-time-btn`
    - After `#main-row` (still inside `<body>`), write the Change-Time modal: `<div id="time-modal-overlay" class="hidden">` > `<div id="time-modal">` containing `<h3>`, `<label>`, `<input type="number" id="custom-minutes">`, and `<div id="time-modal-actions">` with buttons `#time-modal-confirm` and `#time-modal-cancel`
    - Inside `#task-section`: `<h2>Task List</h2>`, `<div id="task-input-row">` with `<input id="task-input" maxlength="500">` and `<button id="add-task-btn">`, `<ul id="task-list">`
    - Write `<footer id="links-section">` with `<h2>Quick Links</h2>`, `<div id="link-input-row">` containing `<input id="link-name-input">`, `<input type="url" id="link-url-input">`, `<button id="add-link-btn">`, and `<div id="link-list">`
    - Add `<script src="js/main.js"></script>` as the last element before `</body>` — no inline `<script>` blocks
    - _Requirements: 18.4, 18.5, 3.1, 3.2, 3.3, 7.1, 12.1, 16.1_

- [ ] 2. Write the CSS stylesheet (`css/Style.css`)
  - [ ] 2.1 Define CSS custom properties and reset
    - Declare `:root` with all light-mode variables: `--bg-page`, `--bg-card`, `--bg-task-item`, `--border-task`, `--hover-task`, `--text-main`, `--text-muted`, `--input-border`, `--link-card-bg`, `--link-card-border`, `--link-card-hover`, `--link-color`, `--shadow`
    - Declare `body.dark` with all dark-mode overrides for every variable above
    - Write universal reset: `*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }`
    - Style `body`: `font-family`, `background: var(--bg-page)`, `color: var(--text-main)`, `transition: background 0.3s, color 0.3s`, `display: flex`, `flex-direction: column`, `min-height: 100vh`, `gap: 16px`, `padding: 20px`
    - _Requirements: 16.2, 16.3, 18.4_
  - [ ] 2.2 Style the header and Greeting Panel
    - `#header`: `background: var(--bg-card)`, `border-radius: 14px`, `padding: 28px 24px`, `text-align: center`, `position: relative`, `box-shadow`
    - `#theme-toggle`: `position: absolute`, `top: 16px`, `right: 16px`, styled as a small pill button
    - `#greeting`: `font-size: 1.2rem`, `font-weight: 500`, `margin-bottom: 6px`
    - `#clock`: `font-size: 4rem`, `font-weight: 700`, `letter-spacing: 4px`
    - `#Current_date`: `font-size: 0.95rem`, `opacity: 0.65`
    - _Requirements: 16.1, 1.1_
  - [ ] 2.3 Style the Focus Timer panel and Change-Time modal
    - `#main-row`: `display: grid`, `grid-template-columns: 300px 1fr`, `gap: 16px`, `flex: 1`
    - `#timer-section`: card styles, `display: flex`, `flex-direction: column`, `align-items: center`, `justify-content: center`
    - `#Timer_display`: `font-size: 3.8rem`, `font-weight: 700`, `letter-spacing: 6px`, `margin-bottom: 24px`
    - `#timer-controls`: `display: flex`, `gap: 10px`; individual button colors — `#Start-btn` green, `#Stop-btn` red, `#Reset-btn` blue, `#Change-time-btn` orange
    - `.hidden`: `display: none !important`
    - `#time-modal-overlay`: `position: fixed`, `inset: 0`, `background: rgba(0,0,0,0.45)`, `display: flex`, `align-items: center`, `justify-content: center`, `z-index: 1000`
    - `#time-modal`: card styles, `min-width: 260px`, `text-align: center`, `gap: 14px`
    - `#custom-minutes`: full-width, centered text, `border-color: #ff9800` on focus
    - `#time-modal-confirm` (green), `#time-modal-cancel` (neutral)
    - `.modal-error`: `color: #d32f2f`, `font-size: 0.82rem`, `margin-top: 4px`
    - _Requirements: 3.2, 3.3, 6.1, 17.1_
  - [ ] 2.4 Style the Task List panel
    - `#task-section`: card styles, `display: flex`, `flex-direction: column`, `overflow: hidden`
    - `#task-input-row`: `display: flex`, `gap: 8px`, `margin-bottom: 16px`
    - `#task-input`: flex-grow input, styled with `border-color: #4caf50` on focus
    - `#add-task-btn`: green pill button
    - `#task-list`: `list-style: none`, `display: flex`, `flex-direction: column`, `gap: 8px`, `overflow-y: auto`
    - `.task-item`: flex row, `background: var(--bg-task-item)`, `border-radius: 8px`, `padding: 10px 12px`
    - `.task-checkbox`: styled checkbox, `accent-color: #4caf50`
    - `.task-label`: `flex: 1`, `word-break: break-word`
    - `.task-item.task-done .task-label`: `text-decoration: line-through`, `color: #aaa`
    - `.task-edit-input`: inline edit input with green border
    - `.edit-btn` (orange), `.save-btn` (green), `.delete-btn` (red)
    - `.empty-state`: muted, centered text for the empty list message
    - `.error-msg`: `color: #d32f2f`, `font-size: 0.82rem`, `margin-top: 4px`
    - _Requirements: 8.3, 9.1, 10.1, 10.4_
  - [ ] 2.5 Style the Quick Links panel
    - `#links-section`: card styles, `flex-shrink: 0`
    - `#link-input-row`: `display: flex`, `gap: 8px`, `flex-wrap: wrap`
    - `#link-name-input`, `#link-url-input`: `flex: 1`, `min-width: 140px`, styled inputs with blue focus border
    - `#add-link-btn`: blue pill button
    - `#link-list`: `display: flex`, `flex-wrap: wrap`, `gap: 10px`
    - `.link-card`: `display: flex`, `align-items: center`, `gap: 6px`, `background: var(--link-card-bg)`, `border: 1px solid var(--link-card-border)`, `border-radius: 8px`
    - `.link-anchor`: `color: var(--link-color)`, `text-decoration: none`, `overflow: hidden`, `text-overflow: ellipsis`, `white-space: nowrap`, `max-width: 200px`
    - `.link-delete-btn`: ghost button, `color: #aaa`, red on hover
    - _Requirements: 12.1, 13.1, 13.3, 14.1_
  - [ ] 2.6 Add responsive media query
    - `@media (max-width: 700px)`: set `#main-row` to `grid-template-columns: 1fr` (single column stack)
    - Reduce `#clock` `font-size` to `2.8rem` for narrow viewports
    - Ensure all buttons and inputs have `min-height: 44px` and `min-width: 44px` at ≤ 700 px for tap target compliance
    - _Requirements: 17.1, 17.2, 17.3, 17.4_

- [ ] 3. Implement Greeting Panel JS (greeting, clock, date)
  - [ ] 3.1 Write `showGreeting()` in `js/main.js`
    - Read `new Date().getHours()`; map to greeting string: hours 5–11 → `"Good Morning! ☀️"`, 12–16 → `"Good Afternoon! 🌤️"`, 17–20 → `"Good Evening! 🌆"`, else → `"Good Night! 🌙"`
    - Write result to `document.getElementById("greeting").innerHTML`
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_
  - [ ] 3.2 Write `showTime()` in `js/main.js`
    - Obtain `new Date()`, extract hours/minutes/seconds, zero-pad each with `String(n).padStart(2, "0")`
    - Write `"HH:MM:SS"` to `document.getElementById("clock").innerHTML`
    - _Requirements: 1.1, 1.3_
  - [ ] 3.3 Write `showDate()` in `js/main.js`
    - Call `new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })`
    - Write result to `document.getElementById("Current_date").innerHTML`
    - _Requirements: 1.2_

- [ ] 4. Implement Focus Timer JS (`showTimer()`)
  - [ ] 4.1 Write the `showTimer()` closure with internal state
    - Declare `let pomodoroMinutes = 25`, `let timeLeft = pomodoroMinutes * 60`, `let timerId = null`
    - Cache all DOM element references: `#Start-btn`, `#Stop-btn`, `#Reset-btn`, `#Change-time-btn`, `#Timer_display`, `#time-modal-overlay`, `#time-modal-confirm`, `#time-modal-cancel`, `#custom-minutes`
    - Implement `renderTimer()`: compute `Math.floor(timeLeft / 60)` and `timeLeft % 60`, zero-pad both, write `"MM:SS"` to `#Timer_display`
    - Implement `setRunningState(running)`: when `true` add `.hidden` to Start, remove from Stop; when `false` reverse
    - _Requirements: 3.1, 3.2, 3.3, 4.2, 4.4_
  - [ ] 4.2 Wire Start, Stop, and Reset buttons
    - `startBtn.onclick`: guard against double-start (`if (timerId) return`), call `setRunningState(true)`, start `setInterval` that decrements `timeLeft`, calls `renderTimer()`, and on reaching 0 clears interval and calls `setRunningState(false)` — satisfying Requirement 4.5
    - `stopBtn.onclick`: clear interval, set `timerId = null`, call `setRunningState(false)`
    - `resetBtn.onclick`: clear any running interval, `timeLeft = pomodoroMinutes * 60`, call `setRunningState(false)`, call `renderTimer()`
    - Call `renderTimer()` once at the end of `showTimer()` to paint the initial `25:00`
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 5.1, 5.2, 5.3, 5.4_
  - [ ] 4.3 Implement the Change-Time modal
    - `changeTimeBtn.onclick` → `openModal()`: set `minutesInput.value = pomodoroMinutes`, remove `.hidden` from overlay, call `minutesInput.focus()` and `minutesInput.select()`
    - `closeModal()`: add `.hidden` to overlay; remove any `.modal-error` injected previously
    - `applyNewTime()`: parse `parseInt(minutesInput.value, 10)`; if result is not an integer or < 1 or > 120, inject `<span class="modal-error">` inside `#time-modal` with the message "Please enter a whole number between 1 and 120", leave modal open, return early; otherwise stop any running timer, update `pomodoroMinutes` and `timeLeft`, call `renderTimer()`, call `closeModal()`
    - Bind `confirmBtn.onclick = applyNewTime`, `cancelBtn.onclick = closeModal`
    - `overlay` click listener: close when `e.target === overlay`
    - `minutesInput` keydown: `Enter` → `applyNewTime()`, `Escape` → `closeModal()`
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7_

- [ ] 5. Implement Task List JS (`initTaskList()`)
  - [ ] 5.1 Write `loadTasks()` / `saveTasks()` helpers and task rendering
    - `const STORAGE_KEY = "tasks"`
    - `loadTasks()`: `try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch { return []; }`
    - `saveTasks(tasks)`: wrapped in `try/catch`; on `QuotaExceededError` display `.error-msg` near `#task-section` reading "Storage quota exceeded — changes not saved."
    - `renderAll()`: clear `#task-list`; iterate `loadTasks()` calling `renderTask(task, index)`; if array is empty, inject `<li class="empty-state">No tasks yet. Add one above!</li>`
    - `renderTask(task, index)`: create `<li class="task-item">` (add `task-done` if `task.done`); append checkbox, label, edit button, delete button — matching the DOM shape described in the design
    - _Requirements: 7.5, 8.1, 8.3, 10.4, 11.1, 11.2, 11.3, 11.4_
  - [ ] 5.2 Implement Add, Complete, and Delete operations
    - `addTask()`: read and `.trim()` `#task-input.value`; ignore if empty; call `saveTasks([...loadTasks(), { text, done: false }])`; call `renderAll()`; clear input and return focus
    - Bind `addBtn.onclick = addTask` and `taskInput` `keydown` Enter → `addTask()`
    - `maxlength="500"` is on the input already; add `input` event listener: when `value.length === 500` inject `.error-msg` "Character limit (500) reached." below the input row; remove it when `value.length < 500`
    - Checkbox `change` handler inside `renderTask`: toggle `task.done`, save, re-render — within 200 ms (Requirement 8.6)
    - Delete button `click` handler: splice the task at `index` from the array, save, re-render
    - _Requirements: 7.2, 7.3, 7.4, 7.5, 7.6, 8.2, 8.4, 10.2, 10.3_
  - [ ] 5.3 Implement inline Edit / Save / Cancel
    - Edit button `click`: create `<input class="task-edit-input" type="text" maxlength="500">` pre-filled with `task.text`; create Save button; replace label with input and edit button with save button; call `input.focus()`; call `renderAll()` on any other task currently in edit mode to exit it
    - `commitEdit()`: trim inline input value; if empty return (no-op); update `tasks[index].text`; call `saveTasks`; call `renderAll()`
    - Save button `click` → `commitEdit()`
    - Inline input `keydown`: `Enter` → `commitEdit()`, `Escape` → `renderAll()` (discard)
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6_

- [ ] 6. Implement Quick Links JS (`initQuickLinks()`)
  - [ ] 6.1 Write `loadLinks()` / `saveLinks()` helpers and link rendering
    - `const LINKS_STORAGE_KEY = "quickLinks"`
    - `loadLinks()`: same try/catch pattern as `loadTasks()`, returns `[]` on error
    - `saveLinks(links)`: wrapped in try/catch; on failure display `.error-msg` near `#links-section`
    - `renderAll()`: clear `#link-list`; iterate `loadLinks()` calling `renderLink(link, index)`
    - `renderLink(link, index)`: create `.link-card` div; create `<a href="{url}" target="_blank" rel="noopener noreferrer" class="link-anchor">`; at render time validate that `link.url` starts with `"http://"` or `"https://"` — if not, set `href="#"` and attach a click handler that shows an inline error instead of navigating; create `.link-delete-btn` button with `aria-label="Remove {name}"` and `×` text; wire delete click handler
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 14.1, 15.1, 15.2, 15.3_
  - [ ] 6.2 Implement Add and Delete operations with validation
    - `addLink()`: trim `nameInput.value` and `urlInput.value`; validate name 1–50 chars, URL 1–2048 chars starting with `"http://"` or `"https://"`; check `loadLinks().length < 50`; on any failure display appropriate `.error-msg` next to the offending field and return early without appending; on success call `saveLinks([...loadLinks(), { name, url }])` inside a try/catch — if `saveLinks` throws do NOT append link (Requirement 12.5); otherwise call `renderAll()`, clear both inputs, return focus to name input within 100 ms
    - Bind `addBtn.onclick = addLink` and `urlInput` `keydown` Enter → `addLink()`; name input `keydown` Enter → `urlInput.focus()`
    - Delete click handler (inside `renderLink`): splice `links[index]`, attempt `saveLinks` inside try/catch; if write fails display `.error-msg` and restore the deleted link at its original position (Requirement 14.4)
    - Clear any existing `.error-msg` elements at the start of each `addLink()` call
    - _Requirements: 12.2, 12.3, 12.4, 12.5, 12.6, 14.2, 14.3, 14.4_

- [ ] 7. Implement Theme Toggle JS (`initThemeToggle()`)
  - [ ] 7.1 Write `initThemeToggle()` with load-time and click-time behavior
    - On function entry: read `localStorage.getItem("theme")`; if value is `"dark"` add class `"dark"` to `document.body` and set `btn.textContent = "☀️"`; otherwise (including absent or invalid values) leave body class unchanged and set `btn.textContent = "🌙"`; wrap localStorage read in try/catch and silently default to light mode if unavailable (Requirement 16.6)
    - `btn.addEventListener("click", ...)`: toggle `"dark"` class on `document.body`; update icon; call `localStorage.setItem("theme", isDark ? "dark" : "light")` inside try/catch (silent failure acceptable per Requirement 16.6)
    - The `.dark` class must be applied before any page content is painted — `initThemeToggle()` must be called before any rendering functions in the initialization block
    - _Requirements: 16.1, 16.2, 16.3, 16.4, 16.5, 16.6_

- [ ] 8. Wire all modules at page load
  - [ ] 8.1 Write the initialization block at the bottom of `js/main.js`
    - Call functions in this order to satisfy Requirement 16.4 (theme before paint): `initThemeToggle()`, `showGreeting()`, `showDate()`, `showTime()`, `showTimer()`, `initQuickLinks()`, `initTaskList()`
    - After all init calls, add `setInterval(showTime, 1000)` — this is the only recurring background job
    - Ensure no functions are called before they are defined (all functions declared above the init block)
    - _Requirements: 1.3, 3.4, 16.4, 18.1, 18.5_

- [ ] 9. Harden error handling across all modules
  - [ ] 9.1 Guard `showGreeting()` and `showTime()` against invalid system clock
    - At the top of the init block, before calling `showTime()` or `showGreeting()`, check `isFinite(Date.now())`
    - If the check fails: set `document.getElementById("clock").textContent = "Time unavailable"`, set `document.getElementById("greeting").textContent = "Good Morning! ☀️"`, do NOT call `setInterval(showTime, 1000)` — satisfying Requirements 1.4 and 2.7
    - _Requirements: 1.4, 2.7_
  - [ ] 9.2 Add `localStorage` failure handling to Task List write paths
    - In `saveTasks()`, catch `QuotaExceededError` and any other storage exception; display a dismissible `.error-msg` element below `#task-input-row` with the text "Could not save — storage unavailable."
    - For completion-toggle failures (Requirement 8.5): on save failure, revert the checkbox to its prior `checked` state and the `li` class to its prior state
    - For edit-save failures (Requirement 9.3): on save failure, revert `tasks[index].text` to its pre-edit value, re-render, and display the error message
    - _Requirements: 7.7, 8.5, 9.3, 11.5_
  - [ ] 9.3 Add `localStorage` failure handling to Quick Links write paths
    - In `saveLinks()`, catch storage exceptions; display `.error-msg` near `#link-input-row`
    - For add failure: do NOT append to `#link-list` — the link must not be shown if it was not persisted (Requirement 12.5)
    - For delete failure: restore the removed `.link-card` at its original position in `#link-list` and display the error message (Requirement 14.4)
    - _Requirements: 12.5, 14.4, 15.5_

- [ ] 10. Final checkpoint — verify the full dashboard in the browser
  - Open `Index.html` directly (no server needed) in Chrome, Firefox, Edge, and Safari
  - Confirm: clock ticks every second, greeting is correct for the current hour, timer counts down and resets, tasks persist across page reload, links open in new tab, dark mode persists across reload, layout stacks at ≤ 700 px viewport width
  - Ensure all tests pass, ask the user if questions arise.

---

## Notes

- No testing tasks are included per the project's NFR-1 (no test setup required).
- All tasks write, modify, or extend exactly one of the three target files (`Index.html`, `css/Style.css`, `js/main.js`).
- Tasks 1–2 establish structure and style before any JavaScript is written; tasks 3–8 are purely additive JS layers.
- Task 9 (error hardening) is a separate pass so core happy-path code can be reviewed cleanly first.
- Each task references the exact requirement clauses it satisfies; consult `requirements.md` for the full acceptance criteria text.
- The dependency graph below reflects that CSS tasks (2.x) can be done in parallel with HTML (1.1) once 1.1 is done, and JS tasks (3–8) can start after both HTML and CSS are in place.

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["2.1", "2.2", "2.3", "2.4", "2.5", "2.6"] },
    { "id": 2, "tasks": ["3.1", "3.2", "3.3", "4.1"] },
    { "id": 3, "tasks": ["4.2", "5.1", "6.1", "7.1"] },
    { "id": 4, "tasks": ["4.3", "5.2", "6.2"] },
    { "id": 5, "tasks": ["5.3"] },
    { "id": 6, "tasks": ["8.1"] },
    { "id": 7, "tasks": ["9.1", "9.2", "9.3"] }
  ]
}
```
