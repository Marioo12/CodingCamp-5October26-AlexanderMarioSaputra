# Requirements Document

## Introduction

The To Do List Life Dashboard is a single-page, client-side web application that serves as a personal productivity hub. It combines a real-time clock and greeting, a Pomodoro-style focus timer, a persistent to-do list, and a quick-access link manager — all in a single HTML page with no backend server. All data is stored in the browser's Local Storage API. The application must work as a standalone web page or browser extension across Chrome, Firefox, Edge, and Safari.

## Glossary

- **Dashboard**: The single HTML page that hosts all four feature panels.
- **Task**: A user-defined to-do item with a text description and a completion state.
- **Quick_Link**: A user-defined shortcut record consisting of a display name and a URL.
- **Timer**: The Pomodoro-style countdown component within the Dashboard.
- **Local_Storage**: The browser's `localStorage` API used for all client-side data persistence.
- **Greeting_Panel**: The header section displaying the current time, date, and time-of-day greeting.
- **Task_List**: The UI component responsible for displaying, adding, editing, completing, and deleting Tasks.
- **Link_Manager**: The UI component responsible for displaying, adding, and deleting Quick_Links.

---

## Requirements

### Requirement 1: Real-Time Clock and Date Display

**User Story:** As a user, I want to see the current time and date on the Dashboard, so that I always know what time it is without switching applications.

#### Acceptance Criteria

1. THE Greeting_Panel SHALL display the current time in HH:MM:SS 24-hour format, where HH is 00–23, MM is 00–59, and SS is 00–59, with zero-padding applied to all components.
2. THE Greeting_Panel SHALL display the current date as a string composed of the full weekday name, full month name, numeric day without zero-padding, and four-digit year, in that order (e.g., "Wednesday, October 8, 2026"), reflecting the user's local system date.
3. WHEN the page is loaded, THE Greeting_Panel SHALL begin updating the clock display at an interval of exactly 1000 milliseconds without requiring user interaction, such that the displayed time advances by one second on each update.
4. IF the user's system clock is unavailable or returns an invalid date, THEN THE Greeting_Panel SHALL display a static error message indicating the time could not be retrieved, and SHALL stop update attempts until the next page load.

---

### Requirement 2: Time-of-Day Greeting

**User Story:** As a user, I want to see a personalized greeting based on the time of day, so that the Dashboard feels welcoming and contextually relevant.

#### Acceptance Criteria

1. WHEN the current hour is between 05:00 (inclusive) and 11:59 (inclusive), THE Greeting_Panel SHALL display the greeting "Good Morning".
2. WHEN the current hour is between 12:00 (inclusive) and 16:59 (inclusive), THE Greeting_Panel SHALL display the greeting "Good Afternoon".
3. WHEN the current hour is between 17:00 (inclusive) and 20:59 (inclusive), THE Greeting_Panel SHALL display the greeting "Good Evening".
4. IF the current hour is 21:00 or later, OR the current hour is 04:59 or earlier, THEN THE Greeting_Panel SHALL display the greeting "Good Night".
5. THE Greeting_Panel SHALL display exactly one greeting at any given time, such that no two greeting strings are simultaneously visible.
6. WHEN the Dashboard page loads, THE Greeting_Panel SHALL determine the current hour using the user's local device time and display the corresponding greeting.
7. WHEN the Dashboard page loads and the user's local device clock cannot be read, THE Greeting_Panel SHALL display the greeting "Good Morning" as the default.

---

### Requirement 3: Focus Timer — Default State

**User Story:** As a user, I want a Pomodoro-style focus timer pre-set to 25 minutes, so that I can immediately start a focused work session.

#### Acceptance Criteria

1. WHEN the Dashboard is loaded, THE Timer SHALL display a remaining time of 25 minutes and 00 seconds (25:00).
2. WHILE the Timer is in its idle state, THE Timer SHALL display a Start button, a Reset button, and a Change Time button, each in a visible and enabled state.
3. WHILE the Timer is in its idle state, THE Timer SHALL NOT display a Stop button.
4. IF the Dashboard is loaded while a prior timer session exists, THEN THE Timer SHALL discard the prior session state and display the default remaining time of 25 minutes and 00 seconds (25:00) in its idle state.

---

### Requirement 4: Focus Timer — Start and Stop

**User Story:** As a user, I want to start and stop the countdown timer, so that I can pause a focus session without losing my remaining time.

#### Acceptance Criteria

1. WHEN the user activates the Start button, THE Timer SHALL begin counting down from the current remaining time at a rate of one second per second.
2. WHILE the Timer is running, THE Timer SHALL hide the Start button and display a Stop button.
3. WHEN the user activates the Stop button, THE Timer SHALL pause the countdown and retain the current remaining time.
4. WHILE the Timer is paused, THE Timer SHALL hide the Stop button and display the Start button.
5. WHEN the remaining time reaches 00:00, THE Timer SHALL stop the countdown automatically, display 00:00, and display the Start button.

---

### Requirement 5: Focus Timer — Reset

**User Story:** As a user, I want to reset the timer to its configured duration, so that I can start a new focus session without manually navigating away.

#### Acceptance Criteria

1. WHEN the user activates the Reset button, THE Timer SHALL stop any active countdown within 100 milliseconds.
2. WHEN the user activates the Reset button, THE Timer SHALL set the remaining time back to the currently configured Pomodoro duration, displayed in MM:SS format matching the configured value exactly.
3. WHEN the user activates the Reset button, THE Timer SHALL return to the idle state with the Start button visible and the Stop button hidden.
4. IF the Reset button is activated while the Timer is already in the idle state, THEN THE Timer SHALL remain in the idle state with the remaining time unchanged.
5. IF the currently configured Pomodoro duration is unavailable at the time of reset, THEN THE Timer SHALL display an error indicating the configuration could not be read and retain the last valid displayed time.

---

### Requirement 6: Focus Timer — Custom Duration

**User Story:** As a user, I want to change the timer duration to a value between 1 and 120 minutes, so that I can adapt the session length to different types of work.

#### Acceptance Criteria

1. WHEN the user activates the Change Time button, THE Timer SHALL display a modal dialog containing a numeric input field pre-filled with the currently configured session duration in minutes, with focus placed on the numeric input field, and a Set button and a Cancel button.
2. WHEN the user confirms a new duration value that is a whole number between 1 and 120 (inclusive), THE Timer SHALL set the remaining time to the new duration and close the modal dialog.
3. WHEN the user confirms a new duration value outside the range 1–120 or provides a non-numeric value, THE Timer SHALL reject the input, keep the current duration unchanged, and display an inline error message within the modal dialog indicating the valid range, while keeping the modal open and the input editable.
4. WHEN the user activates the Cancel button in the modal dialog, THE Timer SHALL close the modal dialog without changing the current duration.
5. WHEN the user confirms a new duration while the Timer is running, THE Timer SHALL stop the active countdown before applying the new duration and display the new full duration in the timer display.
6. WHEN the user presses the Enter key while the numeric input field is focused, THE Timer SHALL treat the action as activating the Set button.
7. WHEN the user presses the Escape key while the modal dialog is open, THE Timer SHALL treat the action as activating the Cancel button.

---

### Requirement 7: Task List — Add Tasks

**User Story:** As a user, I want to add new tasks to my to-do list, so that I can track what I need to accomplish.

#### Acceptance Criteria

1. THE Task_List SHALL provide a text input field with a maximum length of 500 characters and an Add Task button for creating new Tasks.
2. WHEN the user submits a non-empty text value via the Add Task button or the Enter key, THE Task_List SHALL append a new Task with the provided text trimmed of leading and trailing whitespace and a completion state of false.
3. WHEN a new Task is successfully added, THE Task_List SHALL clear the text input field and return focus to it.
4. IF the user attempts to submit an empty or whitespace-only text value, THEN THE Task_List SHALL ignore the submission and SHALL NOT create a new Task.
5. WHEN a Task is added, THE Task_List SHALL persist the updated task collection to Local_Storage immediately.
6. IF the text input value reaches the 500-character maximum length, THEN THE Task_List SHALL prevent additional character input and SHALL display an error message indicating the character limit has been reached.
7. IF persisting the updated task collection to Local_Storage fails, THEN THE Task_List SHALL display an error message indicating the task could not be saved and SHALL retain the newly added Task in the current session's displayed list.

---

### Requirement 8: Task List — Complete Tasks

**User Story:** As a user, I want to mark tasks as done, so that I can track my progress through a work session.

#### Acceptance Criteria

1. THE Task_List SHALL render each Task with a checkbox control that reflects the Task's current completion state.
2. WHEN the user toggles the checkbox of a Task, THE Task_List SHALL update that Task's completion state to the opposite boolean value.
3. WHEN a Task's completion state is true, THE Task_List SHALL render the Task's text with a strikethrough style to distinguish it visually from incomplete Tasks.
4. WHEN a Task's completion state is updated, THE Task_List SHALL persist the updated task collection to Local_Storage within 100 milliseconds.
5. IF Local_Storage is unavailable when persisting a completion state change, THEN THE Task_List SHALL display an error message indicating the change could not be saved and SHALL revert the checkbox to its prior state.
6. WHEN the user toggles a Task's checkbox, THE Task_List SHALL update the checkbox state and apply or remove the strikethrough style within 200 milliseconds.

---

### Requirement 9: Task List — Edit Tasks

**User Story:** As a user, I want to edit the text of an existing task, so that I can correct mistakes or update task details.

#### Acceptance Criteria

1. THE Task_List SHALL render each Task with an Edit button.
2. WHEN the user activates the Edit button on a Task, THE Task_List SHALL replace the Task's text label with an inline text input pre-filled with the current task text and accepting a maximum of 500 characters, replace the Edit button with a Save button, move focus to the inline text input, and exit edit mode on any other Task currently being edited by restoring that Task's original text without persisting any change.
3. WHEN the user activates the Save button on a Task being edited, THE Task_List SHALL update the Task's text to the trimmed value of the inline input, exit edit mode, and persist the change to Local_Storage immediately; IF the Local_Storage write fails, THEN THE Task_List SHALL revert the Task's displayed text to the value it held before the save action was attempted and display an error message indicating the save could not be completed.
4. IF the user attempts to save a Task with an empty or whitespace-only text value, THEN THE Task_List SHALL ignore the save action and SHALL NOT update the Task's text.
5. WHEN the user presses the Enter key while the inline edit input is focused, THE Task_List SHALL treat the action as activating the Save button.
6. WHEN the user presses the Escape key while the inline edit input is focused, THE Task_List SHALL cancel the edit and restore the Task's text to the value it held when edit mode was entered, without persisting any change.

---

### Requirement 10: Task List — Delete Tasks

**User Story:** As a user, I want to delete tasks I no longer need, so that my list stays relevant and uncluttered.

#### Acceptance Criteria

1. THE Task_List SHALL render each Task with a Delete button visible alongside the task content.
2. WHEN the user activates the Delete button on a Task, THE Task_List SHALL immediately remove that Task from the rendered list without requiring a confirmation step, and the removed Task SHALL no longer appear in any subsequent renders.
3. WHEN a Task is deleted, THE Task_List SHALL update Local_Storage to reflect the removal before the next user interaction is accepted, such that the deleted Task is absent from Local_Storage upon inspection after deletion.
4. WHEN the user deletes the last remaining Task, THE Task_List SHALL display an empty-state message indicating that no tasks exist.

---

### Requirement 11: Task List — Persistence

**User Story:** As a user, I want my tasks to be saved between browser sessions, so that I do not lose my list when I close or refresh the page.

#### Acceptance Criteria

1. WHEN the Dashboard is loaded, THE Task_List SHALL read the task collection from Local_Storage and render all previously saved Tasks, completing the full render within 300 milliseconds.
2. IF no task data exists in Local_Storage, THEN THE Task_List SHALL render an empty list state without errors and without displaying any task items.
3. IF the data retrieved from Local_Storage is malformed or unparseable, THEN THE Task_List SHALL discard the stored value, treat the task collection as empty, and SHALL NOT throw a runtime error.
4. WHEN a Task is added, edited, or deleted, THE Task_List SHALL write the updated task collection to Local_Storage before the next user interaction is accepted.
5. WHEN the task collection is written to Local_Storage and the available storage quota has been exceeded, THE Task_List SHALL display an error message indicating that the save failed and SHALL retain the previous successfully saved state in Local_Storage.

---

### Requirement 12: Quick Links — Add Links

**User Story:** As a user, I want to add named quick-access links to my favorite websites, so that I can open them with one click from the Dashboard.

#### Acceptance Criteria

1. THE Link_Manager SHALL provide a name text input accepting 1–50 characters, a URL text input accepting 1–2048 characters, and an Add button for creating new Quick_Links.
2. WHEN the user submits a name of 1–50 characters and a URL of 1–2048 characters beginning with "http://" or "https://" via the Add button or the Enter key in the URL input, THE Link_Manager SHALL append a new Quick_Link with the provided name and URL.
3. WHEN a Quick_Link is successfully added, THE Link_Manager SHALL clear both input fields and return focus to the name input within 100 milliseconds.
4. IF the user attempts to submit with an empty name, an empty URL, a name exceeding 50 characters, or a URL that does not begin with "http://" or "https://", THEN THE Link_Manager SHALL ignore the submission, SHALL NOT create a new Quick_Link, and SHALL display an inline error message indicating which field is invalid.
5. WHEN a Quick_Link is added, THE Link_Manager SHALL persist the updated link collection to Local_Storage immediately, and IF the Local_Storage write fails, THEN THE Link_Manager SHALL display an error message indicating the link could not be saved and SHALL NOT append the Quick_Link to the displayed collection.
6. THE Link_Manager SHALL support a collection of up to 50 Quick_Links, and IF the user attempts to add a link when 50 Quick_Links already exist, THEN THE Link_Manager SHALL ignore the submission and SHALL display an error message indicating the maximum number of links has been reached.

---

### Requirement 13: Quick Links — Open Links

**User Story:** As a user, I want to click a quick link to open the associated website, so that I can navigate to my most-used sites without typing their URLs.

#### Acceptance Criteria

1. THE Link_Manager SHALL render each Quick_Link as a clickable element displaying the Quick_Link's name, truncated to 50 characters if the name exceeds that length.
2. WHEN the user activates a Quick_Link via mouse click or keyboard Enter/Space while the element is focused, THE Dashboard SHALL open the associated URL in a new browser tab.
3. THE Link_Manager SHALL render Quick_Link elements with the `rel="noopener noreferrer"` attribute to prevent opener-based security vulnerabilities.
4. IF the URL associated with a Quick_Link is empty or does not begin with "http://" or "https://", THEN THE Link_Manager SHALL NOT navigate the user and SHALL display an error message indicating the link is invalid.

---

### Requirement 14: Quick Links — Delete Links

**User Story:** As a user, I want to remove quick links I no longer use, so that my link panel stays clean and relevant.

#### Acceptance Criteria

1. THE Link_Manager SHALL render each Quick_Link with a delete control that has an accessible label identifying the Quick_Link it targets.
2. WHEN the user activates the delete control on a Quick_Link, THE Link_Manager SHALL immediately remove that Quick_Link from the panel without requiring additional confirmation.
3. WHEN a Quick_Link is deleted, THE Link_Manager SHALL update Local_Storage to reflect the removal within 500 milliseconds of the deletion.
4. IF the Local_Storage write fails after a Quick_Link is deleted, THEN THE Link_Manager SHALL display an error message indicating that the change could not be saved, and restore the deleted Quick_Link to its previous position in the panel.

---

### Requirement 15: Quick Links — Persistence

**User Story:** As a user, I want my quick links to be saved between browser sessions, so that I do not need to re-enter them every time I open the Dashboard.

#### Acceptance Criteria

1. WHEN the Dashboard is loaded, THE Link_Manager SHALL read the link collection from Local_Storage and render all Quick_Links in the order they were saved, displaying each link's title and URL.
2. IF no link data exists in Local_Storage, THEN THE Link_Manager SHALL render the link panel displaying zero link items and no error message.
3. IF the data retrieved from Local_Storage is malformed or unparseable, THEN THE Link_Manager SHALL discard the stored value, treat the link collection as empty, and render the link panel displaying zero link items and no error message.
4. WHEN a Quick_Link is added or removed, THE Link_Manager SHALL write the updated link collection to Local_Storage before the operation is considered complete.
5. IF writing the updated link collection to Local_Storage fails, THEN THE Link_Manager SHALL display an error message indicating that the link could not be saved and SHALL preserve the previously stored link collection unchanged.

---

### Requirement 16: Light / Dark Mode Toggle

**User Story:** As a user, I want to switch between a light and dark color scheme, so that I can use the Dashboard comfortably in different lighting conditions.

#### Acceptance Criteria

1. THE Dashboard SHALL provide a theme toggle button visible at all times in the header area, with a visual indicator (icon or label) that reflects the currently active mode.
2. WHEN the user activates the theme toggle button while the Dashboard is in light mode, THE Dashboard SHALL switch to dark mode within 100 milliseconds and persist the "dark" preference to Local_Storage.
3. WHEN the user activates the theme toggle button while the Dashboard is in dark mode, THE Dashboard SHALL switch to light mode within 100 milliseconds and persist the "light" preference to Local_Storage.
4. WHEN the Dashboard is loaded, THE Dashboard SHALL read the theme preference from Local_Storage and apply the corresponding color scheme before any page content is painted to the screen.
5. IF no theme preference exists in Local_Storage, THEN THE Dashboard SHALL default to light mode and persist the "light" preference to Local_Storage.
6. IF Local_Storage is unavailable or the stored theme value is not "light" or "dark", THEN THE Dashboard SHALL default to light mode without throwing an error.

---

### Requirement 17: Responsive Layout

**User Story:** As a user, I want the Dashboard to be usable on both desktop and mobile screen sizes, so that I can access it from any device.

#### Acceptance Criteria

1. WHILE the viewport width is greater than 700 pixels, THE Dashboard SHALL arrange the Focus Timer and the Task List side by side in a two-column layout, with each column occupying the full available width without overflowing the viewport.
2. WHILE the viewport width is 700 pixels or less, THE Dashboard SHALL stack the Focus Timer and the Task List vertically in a single-column layout.
3. THE Dashboard SHALL NOT require horizontal scrolling at any viewport width between 320 pixels and 2560 pixels inclusive.
4. WHILE the viewport width is 700 pixels or less, THE Dashboard SHALL render all interactive controls (buttons and input fields) with a minimum tap target size of 44 by 44 CSS pixels.

---

### Requirement 18: Technical Constraints

**User Story:** As a developer, I want the project to follow strict technology and file organization rules, so that the codebase stays simple, portable, and maintainable.

#### Acceptance Criteria

1. THE Dashboard SHALL be implemented using only HTML, CSS, and Vanilla JavaScript with no external frameworks, libraries, or CDN-loaded scripts.
2. THE Dashboard SHALL use no backend server; all logic and data storage SHALL be client-side only, with no HTTP requests made to external APIs or remote endpoints.
3. THE Dashboard SHALL function correctly in the latest stable release of Chrome, Firefox, Edge, and Safari without polyfills or browser-specific workarounds, such that all acceptance criteria pass in each browser.
4. THE Dashboard SHALL use exactly one CSS file located at `css/Style.css`; no inline `<style>` blocks or additional external stylesheets SHALL be present in the HTML.
5. THE Dashboard SHALL use exactly one JavaScript file located at `js/main.js`; no inline `<script>` blocks or additional external script files SHALL be present in the HTML.
6. THE Dashboard SHALL store all persistent data exclusively via the browser's localStorage API; no cookies, sessionStorage, IndexedDB, or other client-side storage mechanisms SHALL be used for persistent data.
