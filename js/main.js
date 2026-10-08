// ─── Greeting ───────────────────────────────────────────────────────────────
function showGreeting() {
    const hour = new Date().getHours();
    let greeting;

    if (hour >= 1 && hour < 12) {
        greeting = "Good Morning! ☀️";
    } else if (hour >= 12 && hour < 17) {
        greeting = "Good Afternoon! 🌤️";
    } else if (hour >= 17 && hour < 21) {
        greeting = "Good Evening! 🌆";
    } else {
        greeting = "Good Night! 🌙";
    }

    document.getElementById("greeting").innerHTML = greeting;
}

// ─── Clock ───────────────────────────────────────────────────────────────────
function showTime() {
    const time = new Date();
    let hour = time.getHours();
    let min  = time.getMinutes();
    let sec  = time.getSeconds();

    hour = hour < 10 ? "0" + hour : hour;
    min  = min  < 10 ? "0" + min  : min;
    sec  = sec  < 10 ? "0" + sec  : sec;

    document.getElementById("clock").innerHTML = `${hour}:${min}:${sec}`;
}

// ─── Date ────────────────────────────────────────────────────────────────────
function showDate() {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById("Current_date").innerHTML =
        new Date().toLocaleDateString('en-US', options);
}

// ─── Countdown Timer ─────────────────────────────────────────────────────────
function showTimer() {
    let pomodoroMinutes = 25;
    let timeLeft = pomodoroMinutes * 60;
    let timerId  = null;

    const startBtn      = document.getElementById("Start-btn");
    const stopBtn       = document.getElementById("Stop-btn");
    const resetBtn      = document.getElementById("Reset-btn");
    const changeTimeBtn = document.getElementById("Change-time-btn");
    const overlay       = document.getElementById("time-modal-overlay");
    const confirmBtn    = document.getElementById("time-modal-confirm");
    const cancelBtn     = document.getElementById("time-modal-cancel");
    const minutesInput  = document.getElementById("custom-minutes");

    function renderTimer() {
        const mins = String(Math.floor(timeLeft / 60)).padStart(2, "0");
        const secs = String(timeLeft % 60).padStart(2, "0");
        document.getElementById("Timer_display").textContent = `${mins}:${secs}`;
    }

    function setRunningState(running) {
        if (running) {
            startBtn.classList.add("hidden");
            stopBtn.classList.remove("hidden");
        } else {
            startBtn.classList.remove("hidden");
            stopBtn.classList.add("hidden");
        }
    }

    startBtn.onclick = () => {
        if (timerId) return;
        setRunningState(true);
        timerId = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                renderTimer();
            } else {
                clearInterval(timerId);
                timerId = null;
                setRunningState(false);
            }
        }, 1000);
    };

    stopBtn.onclick = () => {
        if (timerId) {
            clearInterval(timerId);
            timerId = null;
        }
        setRunningState(false);
    };

    resetBtn.onclick = () => {
        if (timerId) {
            clearInterval(timerId);
            timerId = null;
        }
        setRunningState(false);
        timeLeft = pomodoroMinutes * 60;
        renderTimer();
    };

    // ── Change Time Modal ─────────────────────────────────────────────────────
    function openModal() {
        minutesInput.value = pomodoroMinutes;
        overlay.classList.remove("hidden");
        minutesInput.focus();
        minutesInput.select();
    }

    function closeModal() {
        overlay.classList.add("hidden");
    }

    function applyNewTime() {
        const val = parseInt(minutesInput.value, 10);
        if (!val || val < 1 || val > 120) return;

        // Stop any running timer first
        if (timerId) {
            clearInterval(timerId);
            timerId = null;
            setRunningState(false);
        }

        pomodoroMinutes = val;
        timeLeft = pomodoroMinutes * 60;
        renderTimer();
        closeModal();
    }

    changeTimeBtn.onclick = openModal;
    confirmBtn.onclick    = applyNewTime;
    cancelBtn.onclick     = closeModal;

    // Close modal when clicking outside the box
    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) closeModal();
    });

    // Confirm with Enter key
    minutesInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter")  applyNewTime();
        if (e.key === "Escape") closeModal();
    });

    renderTimer();
}

// ─── Quick Links ─────────────────────────────────────────────────────────────
const LINKS_STORAGE_KEY = "quickLinks";

function loadLinks() {
    try {
        return JSON.parse(localStorage.getItem(LINKS_STORAGE_KEY)) || [];
    } catch {
        return [];
    }
}

function saveLinks(links) {
    localStorage.setItem(LINKS_STORAGE_KEY, JSON.stringify(links));
}

function initQuickLinks() {
    const addBtn = document.getElementById("add-link-btn");
    const nameInput = document.getElementById("link-name-input");
    const urlInput = document.getElementById("link-url-input");
    const linkList = document.getElementById("link-list");

    function renderAll() {
        linkList.innerHTML = "";
        loadLinks().forEach((link, index) => renderLink(link, index));
    }

    function renderLink(link, index) {
        const card = document.createElement("div");
        card.className = "link-card";

        const anchor = document.createElement("a");
        anchor.href = link.url;
        anchor.target = "_blank";
        anchor.rel = "noopener noreferrer";
        anchor.className = "link-anchor";
        anchor.textContent = link.name;

        const deleteBtn = document.createElement("button");
        deleteBtn.className = "link-delete-btn";
        deleteBtn.textContent = "×";
        deleteBtn.title = "Remove link";
        deleteBtn.addEventListener("click", (e) => {
            e.preventDefault();
            const links = loadLinks();
            links.splice(index, 1);
            saveLinks(links);
            renderAll();
        });

        card.appendChild(anchor);
        card.appendChild(deleteBtn);
        linkList.appendChild(card);
    }

    function addLink() {
        const name = nameInput.value.trim();
        const url = urlInput.value.trim();

        if (!name || !url) return;

        const links = loadLinks();
        links.push({ name, url });
        saveLinks(links);
        renderAll();

        nameInput.value = "";
        urlInput.value = "";
        nameInput.focus();
    }

    addBtn.addEventListener("click", addLink);

    nameInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") urlInput.focus();
    });

    urlInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") addLink();
    });

    renderAll();
}

// ─── Task List ───────────────────────────────────────────────────────────────
const STORAGE_KEY = "tasks";

function loadTasks() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
        return [];
    }
}

function saveTasks(tasks) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function initTaskList() {
    const addBtn    = document.getElementById("add-task-btn");
    const taskInput = document.getElementById("task-input");
    const taskList  = document.getElementById("task-list");

    // ── Render all tasks from storage ────────────────────────────────────────
    function renderAll() {
        taskList.innerHTML = "";
        loadTasks().forEach((task, index) => renderTask(task, index));
    }

    // ── Render a single task row ──────────────────────────────────────────────
    function renderTask(task, index) {
        const li = document.createElement("li");
        li.className = "task-item" + (task.done ? " task-done" : "");

        // Checkbox
        const checkbox    = document.createElement("input");
        checkbox.type     = "checkbox";
        checkbox.className = "task-checkbox";
        checkbox.checked  = task.done;
        checkbox.setAttribute("aria-label", "Mark task as done");
        checkbox.addEventListener("change", () => {
            const tasks = loadTasks();
            tasks[index].done = checkbox.checked;
            saveTasks(tasks);
            renderAll();
        });

        // Label (shown when not editing)
        const label       = document.createElement("span");
        label.className   = "task-label";
        label.textContent = task.text;

        // Edit button
        const editBtn       = document.createElement("button");
        editBtn.className   = "edit-btn";
        editBtn.textContent = "Edit";
        editBtn.addEventListener("click", () => {
            // Swap label for an input field
            const editInput   = document.createElement("input");
            editInput.type    = "text";
            editInput.className = "task-edit-input";
            editInput.value   = task.text;

            const saveBtn       = document.createElement("button");
            saveBtn.className   = "save-btn";
            saveBtn.textContent = "Save";

            function commitEdit() {
                const newText = editInput.value.trim();
                if (!newText) return;
                const tasks = loadTasks();
                tasks[index].text = newText;
                saveTasks(tasks);
                renderAll();
            }

            saveBtn.addEventListener("click", commitEdit);
            editInput.addEventListener("keydown", (e) => {
                if (e.key === "Enter") commitEdit();
                if (e.key === "Escape") renderAll(); // cancel
            });

            // Replace label & edit button with inline editor
            li.replaceChild(editInput, label);
            li.replaceChild(saveBtn, editBtn);
            editInput.focus();
        });

        // Delete button
        const deleteBtn       = document.createElement("button");
        deleteBtn.className   = "delete-btn";
        deleteBtn.textContent = "Delete";
        deleteBtn.addEventListener("click", () => {
            const tasks = loadTasks();
            tasks.splice(index, 1);
            saveTasks(tasks);
            renderAll();
        });

        li.appendChild(checkbox);
        li.appendChild(label);
        li.appendChild(editBtn);
        li.appendChild(deleteBtn);
        taskList.appendChild(li);
    }

    // ── Add a new task ────────────────────────────────────────────────────────
    function addTask() {
        const text = taskInput.value.trim();
        if (!text) return;

        const tasks = loadTasks();

        // Prevent duplicate tasks (case-insensitive check)
        const isDuplicate = tasks.some(
            (task) => task.text.toLowerCase() === text.toLowerCase()
        );
        if (isDuplicate) {
            taskInput.classList.add("input-error");
            taskInput.placeholder = "Task already exists!";
            setTimeout(() => {
                taskInput.classList.remove("input-error");
                taskInput.placeholder = "";
            }, 2000);
            return;
        }

        tasks.push({ text, done: false });
        saveTasks(tasks);
        renderAll();

        taskInput.value = "";
        taskInput.focus();
    }

    addBtn.addEventListener("click", addTask);
    taskInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") addTask();
    });

    // Initial render from storage
    renderAll();
}

// ─── Light / Dark Mode Toggle ────────────────────────────────────────────────
function initThemeToggle() {
    const btn = document.getElementById("theme-toggle");
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
        document.body.classList.add("dark");
        btn.textContent = "☀️";
    }
    btn.addEventListener("click", () => {
        const isDark = document.body.classList.toggle("dark");
        btn.textContent = isDark ? "☀️" : "🌙";
        localStorage.setItem("theme", isDark ? "dark" : "light");
    });
}

// ─── Run on load ─────────────────────────────────────────────────────────────
showGreeting();
showDate();
showTime();
showTimer();
initQuickLinks();
initTaskList();
initThemeToggle();

setInterval(showTime, 1000);
