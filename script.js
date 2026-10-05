const STORAGE_KEY = "todoTasks";


// Get tasks from Local Storage

let tasks =
    JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];


// Save tasks

function saveTasks() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(tasks)
    );

}


// Generate ID

function generateID() {

    return Date.now().toString();

}


// Display task

function createTaskHTML(task) {

    return `

        <div class="task ${task.completed ? "done" : ""}">

            <button
                class="check"
                onclick="toggleTask('${task.id}')"
            >
                ${task.completed ? "✓" : ""}
            </button>


            <div class="task-main">

                <div class="task-title">
                    ${task.title}
                </div>

                <div class="task-desc">
                    ${task.description || ""}
                </div>

            </div>


            <div class="meta">

                <span class="tag">
                    ${task.category}
                </span>

                <span class="tag">
                    ${task.priority}
                </span>

                <span class="date">
                    ${task.date || ""}
                </span>

            </div>


            <button
                class="icon-btn"
                onclick="editTask('${task.id}')"
            >
                ✎
            </button>


            <button
                class="icon-btn delete"
                onclick="deleteTask('${task.id}')"
            >
                🗑
            </button>

        </div>

    `;
}


// Render tasks

function renderTasks(element, taskArray) {

    if (!element) return;


    if (taskArray.length === 0) {

        element.innerHTML = `
            <div class="form-card">
                <p style="color:#8092ad">
                    No tasks found.
                </p>
            </div>
        `;

        return;
    }


    element.innerHTML =
        taskArray.map(createTaskHTML).join("");

}


// Toggle completed

function toggleTask(id) {

    const task =
        tasks.find(task => task.id === id);


    if (!task) return;


    task.completed =
        !task.completed;


    saveTasks();

    location.reload();

}


// Delete task

function deleteTask(id) {

    tasks =
        tasks.filter(task => task.id !== id);


    saveTasks();

    location.reload();

}


// Edit task

function editTask(id) {

    const task =
        tasks.find(task => task.id === id);


    if (!task) return;


    const newTitle =
        prompt(
            "Enter new task title:",
            task.title
        );


    if (
        newTitle &&
        newTitle.trim() !== ""
    ) {

        task.title =
            newTitle.trim();

        saveTasks();

        location.reload();

    }

}


// When page loads

document.addEventListener(
    "DOMContentLoaded",
    function () {


        /* DATE */

        const today =
            document.getElementById("today");


        if (today) {

            today.textContent =
                new Date().toLocaleDateString(
                    "en-IN",
                    {
                        day: "2-digit",
                        month: "short",
                        year: "numeric"
                    }
                );

        }


        /* STATISTICS */

        const total =
            tasks.length;


        const completed =
            tasks.filter(
                task => task.completed
            ).length;


        const pending =
            total - completed;


        const progress =
            total === 0
                ? 0
                : Math.round(
                    (completed / total) * 100
                );


        const totalElement =
            document.getElementById(
                "totalCount"
            );


        const completedElement =
            document.getElementById(
                "completedCount"
            );


        const pendingElement =
            document.getElementById(
                "pendingCount"
            );


        const progressElement =
            document.getElementById(
                "progressCount"
            );


        if (totalElement)
            totalElement.textContent = total;


        if (completedElement)
            completedElement.textContent =
                completed;


        if (pendingElement)
            pendingElement.textContent =
                pending;


        if (progressElement)
            progressElement.textContent =
                progress + "%";


        const progressBar =
            document.getElementById(
                "progressBar"
            );


        if (progressBar)
            progressBar.style.width =
                progress + "%";


        const progressText =
            document.getElementById(
                "progressText"
            );


        if (progressText)
            progressText.textContent =
                `${completed} of ${total} tasks completed`;


        /* HOME */

        const recentTasks =
            document.getElementById(
                "recentTasks"
            );


        if (recentTasks) {

            renderTasks(
                recentTasks,
                tasks.slice(-5).reverse()
            );

        }


        /* ALL TASKS */

        const allTasks =
            document.getElementById(
                "allTasks"
            );


        if (allTasks) {

            let currentFilter = "all";


            const search =
                document.getElementById(
                    "searchInput"
                );


            function displayAllTasks() {

                const searchText =
                    search.value.toLowerCase();


                let filtered =
                    tasks.filter(task => {

                        const matchesSearch =
                            task.title
                                .toLowerCase()
                                .includes(searchText);


                        const matchesFilter =

                            currentFilter === "all"

                            ||

                            (
                                currentFilter === "active"
                                &&
                                !task.completed
                            )

                            ||

                            (
                                currentFilter === "completed"
                                &&
                                task.completed
                            );


                        return (
                            matchesSearch &&
                            matchesFilter
                        );

                    });


                renderTasks(
                    allTasks,
                    filtered
                );

            }


            document
                .querySelectorAll(".filter")
                .forEach(button => {

                    button.addEventListener(
                        "click",
                        function () {

                            document
                                .querySelectorAll(".filter")
                                .forEach(btn =>
                                    btn.classList.remove(
                                        "active"
                                    )
                                );


                            this.classList.add(
                                "active"
                            );


                            currentFilter =
                                this.dataset.filter;


                            displayAllTasks();

                        }
                    );

                });


            search.addEventListener(
                "input",
                displayAllTasks
            );


            displayAllTasks();

        }


        /* ADD TASK */

        const taskForm =
            document.getElementById(
                "taskForm"
            );


        if (taskForm) {

            taskForm.addEventListener(
                "submit",
                function (event) {

                    event.preventDefault();


                    const title =
                        document.getElementById(
                            "taskTitle"
                        ).value.trim();


                    const description =
                        document.getElementById(
                            "taskDescription"
                        ).value.trim();


                    const date =
                        document.getElementById(
                            "taskDate"
                        ).value;


                    const priority =
                        document.getElementById(
                            "taskPriority"
                        ).value;


                    const category =
                        document.getElementById(
                            "taskCategory"
                        ).value;


                    const newTask = {

                        id: generateID(),

                        title: title,

                        description: description,

                        date: date,

                        priority: priority,

                        category: category,

                        completed: false

                    };


                    tasks.push(newTask);


                    saveTasks();


                    window.location.href =
                        "tasks.html";

                }
            );

        }


        /* COMPLETED PAGE */

        const completedTasks =
            document.getElementById(
                "completedTasks"
            );


        if (completedTasks) {

            const completed =
                tasks.filter(
                    task => task.completed
                );


            renderTasks(
                completedTasks,
                completed
            );

        }


        /* CLEAR COMPLETED */

        const clearCompleted =
            document.getElementById(
                "clearCompleted"
            );


        if (clearCompleted) {

            clearCompleted.addEventListener(
                "click",
                function () {

                    tasks =
                        tasks.filter(
                            task => !task.completed
                        );


                    saveTasks();

                    location.reload();

                }
            );

        }


        /* CLEAR ALL */

        const clearAll =
            document.getElementById(
                "clearAll"
            );


        if (clearAll) {

            clearAll.addEventListener(
                "click",
                function () {

                    const confirmDelete =
                        confirm(
                            "Are you sure you want to delete all tasks?"
                        );


                    if (confirmDelete) {

                        tasks = [];

                        saveTasks();

                        location.reload();

                    }

                }
            );

        }

    }
);