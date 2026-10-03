/* =========================================================
   UNIDASH
   Pure HTML + CSS + JavaScript
   LocalStorage based academic dashboard
========================================================= */


/* ================= DATA ================= */

const defaultAssignments = [
    {
        id: 1,
        title: "C Programming Project",
        subject: "Programming",
        deadline: "2026-10-02",
        status: "Pending"
    },
    {
        id: 2,
        title: "Mathematics Problem Set",
        subject: "Mathematics",
        deadline: "2026-10-05",
        status: "Pending"
    },
    {
        id: 3,
        title: "Data Structures Report",
        subject: "Data Structures",
        deadline: "2026-10-08",
        status: "Completed"
    }
];

const defaultSubjects = [
    {
        id: 1,
        name: "Programming",
        code: "CS101",
        teacher: "Computer Science",
        grade: 92,
        credits: 6
    },
    {
        id: 2,
        name: "Mathematics",
        code: "MATH101",
        teacher: "Core Mathematics",
        grade: 87,
        credits: 5
    },
    {
        id: 3,
        name: "Data Structures",
        code: "CS102",
        teacher: "Computer Science",
        grade: 90,
        credits: 6
    }
];

const defaultExams = [
    {
        id: 1,
        title: "Programming Midterm",
        subject: "Programming",
        date: "2026-10-14",
        time: "10:00"
    },
    {
        id: 2,
        title: "Mathematics Exam",
        subject: "Mathematics",
        date: "2026-10-20",
        time: "13:00"
    }
];

const defaultNotes = [
    {
        id: 1,
        title: "Pointers in C",
        subject: "Programming",
        content: "Important concepts about pointers, memory addresses and references.",
        tags: ["C", "Programming"]
    },
    {
        id: 2,
        title: "Binary Numbers",
        subject: "Mathematics",
        content: "Binary conversion, decimal conversion and hexadecimal relationships.",
        tags: ["Math", "Revision"]
    }
];


/* ================= HELPERS ================= */

function getUsers() {
    return JSON.parse(localStorage.getItem("unidash_users")) || [];
}

function saveUsers(users) {
    localStorage.setItem("unidash_users", JSON.stringify(users));
}

function getCurrentUser() {
    return JSON.parse(localStorage.getItem("unidash_current_user"));
}

function saveCurrentUser(user) {
    localStorage.setItem(
        "unidash_current_user",
        JSON.stringify(user)
    );
}

function userKey(type) {

    const user = getCurrentUser();

    if (!user) return null;

    return `unidash_${type}_${user.email}`;
}

function getData(type, fallback = []) {

    const key = userKey(type);

    if (!key) return fallback;

    const saved = localStorage.getItem(key);

    if (!saved) {
        localStorage.setItem(key, JSON.stringify(fallback));
        return fallback;
    }

    return JSON.parse(saved);
}

function saveData(type, data) {

    const key = userKey(type);

    if (!key) return;

    localStorage.setItem(key, JSON.stringify(data));
}


/* ================= AUTH ELEMENTS ================= */

const authPage = document.getElementById("authPage");
const app = document.getElementById("app");

const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");

const authTabs = document.querySelectorAll(".auth-tab");


/* ================= AUTH TABS ================= */

authTabs.forEach(tab => {

    tab.addEventListener("click", () => {

        authTabs.forEach(t => t.classList.remove("active"));

        tab.classList.add("active");

        const form = tab.dataset.form;

        loginForm.classList.toggle(
            "active",
            form === "login"
        );

        signupForm.classList.toggle(
            "active",
            form === "signup"
        );
    });

});


/* ================= PASSWORD TOGGLE ================= */

document.querySelectorAll(".password-toggle").forEach(button => {

    button.addEventListener("click", () => {

        const target = document.getElementById(
            button.dataset.target
        );

        target.type =
            target.type === "password"
                ? "text"
                : "password";
    });

});


/* ================= SIGNUP ================= */

signupForm.addEventListener("submit", e => {

    e.preventDefault();

    const name =
        document.getElementById("signupName").value.trim();

    const email =
        document.getElementById("signupEmail").value.trim().toLowerCase();

    const password =
        document.getElementById("signupPassword").value;

    const university =
        document.getElementById("signupUniversity").value.trim();


    if (password.length < 6) {

        showToast(
            "Password must contain at least 6 characters."
        );

        return;
    }


    const users = getUsers();

    const exists = users.some(
        user => user.email === email
    );

    if (exists) {

        showToast(
            "An account with this email already exists."
        );

        return;
    }


    const user = {
        id: Date.now(),
        name,
        email,
        password,
        university
    };

    users.push(user);

    saveUsers(users);

    saveCurrentUser({
        id: user.id,
        name: user.name,
        email: user.email,
        university: user.university
    });


    initializeUserData();

    showApp();

    showToast("Account created successfully!");
});


/* ================= LOGIN ================= */

loginForm.addEventListener("submit", e => {

    e.preventDefault();

    const email =
        document.getElementById("loginEmail")
        .value
        .trim()
        .toLowerCase();

    const password =
        document.getElementById("loginPassword").value;


    const users = getUsers();

    const user = users.find(
        u =>
            u.email === email &&
            u.password === password
    );


    if (!user) {

        showToast(
            "Invalid email or password."
        );

        return;
    }


    saveCurrentUser({
        id: user.id,
        name: user.name,
        email: user.email,
        university: user.university
    });


    initializeUserData();

    showApp();

    showToast("Welcome back!");
});


/* ================= DEMO LOGIN ================= */

document.getElementById("demoLogin")
    .addEventListener("click", () => {

        const demoEmail = "demo@unidash.app";

        const users = getUsers();

        let demo = users.find(
            user => user.email === demoEmail
        );


        if (!demo) {

            demo = {
                id: 999999,
                name: "Alex Student",
                email: demoEmail,
                password: "123456",
                university: "UniDash University"
            };

            users.push(demo);

            saveUsers(users);
        }


        saveCurrentUser({
            id: demo.id,
            name: demo.name,
            email: demo.email,
            university: demo.university
        });


        initializeUserData();

        showApp();

        showToast("Demo account loaded!");
    });


/* ================= INITIALIZE USER ================= */

function initializeUserData() {

    getData(
        "subjects",
        defaultSubjects
    );

    getData(
        "assignments",
        defaultAssignments
    );

    getData(
        "exams",
        defaultExams
    );

    getData(
        "notes",
        defaultNotes
    );
}


/* ================= SHOW APP ================= */

function showApp() {

    authPage.classList.add("hidden");

    app.classList.remove("hidden");

    updateUserUI();

    renderAll();

}


/* ================= USER UI ================= */

function updateUserUI() {

    const user = getCurrentUser();

    if (!user) return;


    const initial =
        user.name
            .charAt(0)
            .toUpperCase();


    document.getElementById(
        "welcomeName"
    ).textContent = user.name.split(" ")[0];


    document.getElementById(
        "sidebarName"
    ).textContent = user.name;


    document.getElementById(
        "sidebarUniversity"
    ).textContent = user.university;


    document.getElementById(
        "sidebarAvatar"
    ).textContent = initial;


    document.getElementById(
        "topAvatar"
    ).textContent = initial;
}


/* ================= LOGOUT ================= */

document.getElementById("logoutBtn")
    .addEventListener("click", () => {

        localStorage.removeItem(
            "unidash_current_user"
        );

        app.classList.add("hidden");

        authPage.classList.remove("hidden");

        showToast("You have been logged out.");
    });


/* ================= NAVIGATION ================= */

const navItems =
    document.querySelectorAll(".nav-item[data-page]");

const pages =
    document.querySelectorAll(".page");

const pageTitle =
    document.getElementById("pageTitle");


navItems.forEach(item => {

    item.addEventListener("click", () => {

        const page =
            item.dataset.page;

        navigate(page);
    });

});


document.querySelectorAll(
    "[data-page-target]"
).forEach(button => {

    button.addEventListener("click", () => {

        navigate(
            button.dataset.pageTarget
        );
    });

});


function navigate(page) {

    navItems.forEach(item => {

        item.classList.toggle(
            "active",
            item.dataset.page === page
        );

    });


    pages.forEach(p => {

        p.classList.toggle(
            "active",
            p.id === page
        );

    });


    const titles = {

        dashboard: "Dashboard",
        subjects: "Subjects",
        assignments: "Assignments",
        exams: "Exams",
        notes: "Study Notes",
        analytics: "Analytics",
        calendar: "Calendar"
    };


    pageTitle.textContent =
        titles[page] || "Dashboard";


    document
        .querySelector(".sidebar")
        .classList.remove("open");
}


/* ================= MOBILE MENU ================= */

document.getElementById("mobileMenu")
    .addEventListener("click", () => {

        document
            .querySelector(".sidebar")
            .classList.toggle("open");
    });


/* ================= DATE ================= */

function updateDate() {

    const now = new Date();

    const date =
        now.toLocaleDateString(
            "en-US",
            {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric"
            }
        );

    document.getElementById(
        "currentDate"
    ).textContent = date;
}

updateDate();


/* ================= RENDER ALL ================= */

function renderAll() {

    renderSubjects();

    renderAssignments();

    renderExams();

    renderNotes();

    renderUpcoming();

    updateAssignmentCount();
}


/* ================= SUBJECTS ================= */

function renderSubjects() {

    const subjects =
        getData(
            "subjects",
            defaultSubjects
        );

    const grid =
        document.getElementById(
            "subjectsGrid"
        );


    grid.innerHTML = subjects.map(subject => `

        <div class="subject-card">

            <div class="subject-card-top">

                <div class="big-icon">
                    ${subject.code.substring(0,2)}
                </div>

                <button
                    class="card-menu"
                    onclick="deleteSubject(${subject.id})"
                >
                    •••
                </button>

            </div>

            <h3>${escapeHTML(subject.name)}</h3>

            <p>
                ${escapeHTML(subject.teacher)}
                · ${subject.credits} credits
            </p>

            <div class="grade-large">
                ${subject.grade}%
            </div>

            <div class="grade-label">
                Current performance
            </div>

            <div class="card-progress">
                <span style="width:${subject.grade}%"></span>
            </div>

        </div>

    `).join("");
}


/* ================= ADD SUBJECT ================= */

document.getElementById("addSubjectBtn")
    .addEventListener("click", () => {

        openModal(
            "Add Subject",
            "Create a new academic subject.",
            "subject"
        );
    });


function deleteSubject(id) {

    let subjects =
        getData(
            "subjects",
            defaultSubjects
        );

    subjects =
        subjects.filter(
            subject => subject.id !== id
        );

    saveData(
        "subjects",
        subjects
    );

    renderSubjects();

    showToast("Subject deleted.");
}


/* ================= ASSIGNMENTS ================= */

function renderAssignments() {

    const assignments =
        getData(
            "assignments",
            defaultAssignments
        );

    const tbody =
        document.getElementById(
            "assignmentTable"
        );


    tbody.innerHTML = assignments.map(
        assignment => `

        <tr>

            <td>
                <strong>
                    ${escapeHTML(assignment.title)}
                </strong>
            </td>

            <td>
                ${escapeHTML(assignment.subject)}
            </td>

            <td>
                ${formatDate(assignment.deadline)}
            </td>

            <td>
                <span class="status ${
                    assignment.status.toLowerCase()
                }">
                    ${assignment.status}
                </span>
            </td>

            <td>

                ${
                    assignment.status !== "Completed"
                    ?
                    `<button
                        class="action-btn"
                        onclick="completeAssignment(${assignment.id})"
                    >
                        ✓
                    </button>`
                    :
                    ""
                }

                <button
                    class="action-btn"
                    onclick="deleteAssignment(${assignment.id})"
                >
                    ×
                </button>

            </td>

        </tr>

    `
    ).join("");
}


/* ================= ADD ASSIGNMENT ================= */

document.getElementById("addAssignmentBtn")
    .addEventListener("click", () => {

        openModal(
            "Add Assignment",
            "Create a new assignment and deadline.",
            "assignment"
        );
    });


function completeAssignment(id) {

    let assignments =
        getData(
            "assignments",
            defaultAssignments
        );

    assignments =
        assignments.map(
            assignment => {

                if (assignment.id === id) {

                    assignment.status =
                        "Completed";
                }

                return assignment;
            }
        );

    saveData(
        "assignments",
        assignments
    );

    renderAssignments();

    renderUpcoming();

    updateAssignmentCount();

    showToast(
        "Assignment marked completed."
    );
}


function deleteAssignment(id) {

    let assignments =
        getData(
            "assignments",
            defaultAssignments
        );

    assignments =
        assignments.filter(
            assignment => assignment.id !== id
        );

    saveData(
        "assignments",
        assignments
    );

    renderAssignments();

    renderUpcoming();

    updateAssignmentCount();

    showToast("Assignment deleted.");
}


/* ================= UPCOMING ================= */

function renderUpcoming() {

    const assignments =
        getData(
            "assignments",
            defaultAssignments
        );

    const list =
        document.getElementById(
            "upcomingList"
        );


    const pending =
        assignments
            .filter(
                assignment =>
                    assignment.status !== "Completed"
            )
            .sort(
                (a,b) =>
                    new Date(a.deadline) -
                    new Date(b.deadline)
            )
            .slice(0,3);


    if (!pending.length) {

        list.innerHTML = `
            <div class="task">
                <div class="task-icon">✓</div>
                <div class="task-details">
                    <strong>All caught up!</strong>
                    <span>No pending assignments.</span>
                </div>
            </div>
        `;

        return;
    }


    list.innerHTML =
        pending.map(
            task => `

        <div class="task">

            <div class="task-icon">
                ✓
            </div>

            <div class="task-details">

                <strong>
                    ${escapeHTML(task.title)}
                </strong>

                <span>
                    ${escapeHTML(task.subject)}
                </span>

            </div>

            <span class="deadline">
                ${formatDate(task.deadline)}
            </span>

        </div>

    `
        ).join("");
}


/* ================= COUNT ================= */

function updateAssignmentCount() {

    const assignments =
        getData(
            "assignments",
            defaultAssignments
        );

    const completed =
        assignments.filter(
            a => a.status === "Completed"
        ).length;


    document.getElementById(
        "assignmentValue"
    ).textContent =
        assignments.length;


    const card =
        document.querySelector(
            ".green.stat-card small"
        );

    if (card) {

        card.textContent =
            `${completed} completed`;
    }
}


/* ================= EXAMS ================= */

function renderExams() {

    const exams =
        getData(
            "exams",
            defaultExams
        );

    const grid =
        document.getElementById(
            "examGrid"
        );


    grid.innerHTML =
        exams.map(exam => {

            const date =
                new Date(exam.date);

            return `

                <div class="exam-card">

                    <div class="exam-date">

                        <div class="exam-day">

                            <strong>
                                ${date.getDate()}
                            </strong>

                            <span>
                                ${date.toLocaleString(
                                    "en",
                                    {month:"short"}
                                ).toUpperCase()}
                            </span>

                        </div>

                        <div class="exam-info">

                            <h3>
                                ${escapeHTML(exam.title)}
                            </h3>

                            <p>
                                ${escapeHTML(exam.subject)}
                                · ${exam.time}
                            </p>

                        </div>

                        <button
                            class="card-menu"
                            onclick="deleteExam(${exam.id})"
                        >
                            ×
                        </button>

                    </div>

                </div>

            `;
        }).join("");
}


/* ================= ADD EXAM ================= */

document.getElementById("addExamBtn")
    .addEventListener("click", () => {

        openModal(
            "Add Exam",
            "Schedule a new examination.",
            "exam"
        );
    });


function deleteExam(id) {

    let exams =
        getData(
            "exams",
            defaultExams
        );

    exams =
        exams.filter(
            exam => exam.id !== id
        );

    saveData(
        "exams",
        exams
    );

    renderExams();

    showToast("Exam deleted.");
}


/* ================= NOTES ================= */

function renderNotes() {

    const notes =
        getData(
            "notes",
            defaultNotes
        );

    const grid =
        document.getElementById(
            "notesGrid"
        );


    grid.innerHTML =
        notes.map(note => `

        <div class="note-card">

            <div class="subject-card-top">

                <div class="big-icon">
                    ▤
                </div>

                <button
                    class="card-menu"
                    onclick="deleteNote(${note.id})"
                >
                    ×
                </button>

            </div>

            <h3>
                ${escapeHTML(note.title)}
            </h3>

            <p>
                ${escapeHTML(note.content)}
            </p>

            <div class="note-tags">

                ${note.tags.map(
                    tag =>
                    `<span class="note-tag">
                        ${escapeHTML(tag)}
                    </span>`
                ).join("")}

            </div>

        </div>

    `).join("");
}


/* ================= ADD NOTE ================= */

document.getElementById("addNoteBtn")
    .addEventListener("click", () => {

        openModal(
            "Create Study Note",
            "Save a new note to your knowledge base.",
            "note"
        );
    });


function deleteNote(id) {

    let notes =
        getData(
            "notes",
            defaultNotes
        );

    notes =
        notes.filter(
            note => note.id !== id
        );

    saveData(
        "notes",
        notes
    );

    renderNotes();

    showToast("Note deleted.");
}


/* ================= MODAL ================= */

const modal =
    document.getElementById("modal");

const modalTitle =
    document.getElementById("modalTitle");

const modalDescription =
    document.getElementById(
        "modalDescription"
    );

const modalForm =
    document.getElementById("modalForm");


function openModal(title, description, type) {

    modalTitle.textContent = title;

    modalDescription.textContent =
        description;


    if (type === "subject") {

        modalForm.innerHTML = `

            <div class="modal-form-group">
                <label>Subject Name</label>
                <input
                    name="name"
                    required
                    placeholder="e.g. Computer Science"
                >
            </div>

            <div class="modal-form-group">
                <label>Course Code</label>
                <input
                    name="code"
                    required
                    placeholder="e.g. CS101"
                >
            </div>

            <div class="modal-form-group">
                <label>Department / Teacher</label>
                <input
                    name="teacher"
                    required
                    placeholder="e.g. Computer Science"
                >
            </div>

            <div class="modal-form-group">
                <label>Current Grade (%)</label>
                <input
                    type="number"
                    name="grade"
                    min="0"
                    max="100"
                    required
                    placeholder="90"
                >
            </div>

            <div class="modal-form-group">
                <label>Credits</label>
                <input
                    type="number"
                    name="credits"
                    min="1"
                    max="20"
                    required
                    placeholder="6"
                >
            </div>

            <button class="primary-btn modal-submit">
                Add Subject →
            </button>
        `;

    }


    if (type === "assignment") {

        modalForm.innerHTML = `

            <div class="modal-form-group">
                <label>Assignment Name</label>
                <input
                    name="title"
                    required
                    placeholder="e.g. Programming Project"
                >
            </div>

            <div class="modal-form-group">
                <label>Subject</label>
                <input
                    name="subject"
                    required
                    placeholder="e.g. Programming"
                >
            </div>

            <div class="modal-form-group">
                <label>Deadline</label>
                <input
                    type="date"
                    name="deadline"
                    required
                >
            </div>

            <button class="primary-btn modal-submit">
                Add Assignment →
            </button>
        `;
    }


    if (type === "exam") {

        modalForm.innerHTML = `

            <div class="modal-form-group">
                <label>Exam Name</label>
                <input
                    name="title"
                    required
                    placeholder="e.g. Mathematics Midterm"
                >
            </div>

            <div class="modal-form-group">
                <label>Subject</label>
                <input
                    name="subject"
                    required
                    placeholder="Mathematics"
                >
            </div>

            <div class="modal-form-group">
                <label>Date</label>
                <input
                    type="date"
                    name="date"
                    required
                >
            </div>

            <div class="modal-form-group">
                <label>Time</label>
                <input
                    type="time"
                    name="time"
                    required
                >
            </div>

            <button class="primary-btn modal-submit">
                Add Exam →
            </button>
        `;
    }


    if (type === "note") {

        modalForm.innerHTML = `

            <div class="modal-form-group">
                <label>Note Title</label>
                <input
                    name="title"
                    required
                    placeholder="e.g. Binary Numbers"
                >
            </div>

            <div class="modal-form-group">
                <label>Subject</label>
                <input
                    name="subject"
                    required
                    placeholder="Mathematics"
                >
            </div>

            <div class="modal-form-group">
                <label>Note Content</label>
                <textarea
                    name="content"
                    required
                    placeholder="Write your study notes..."
                ></textarea>
            </div>

            <div class="modal-form-group">
                <label>Tags</label>
                <input
                    name="tags"
                    placeholder="Math, Revision, Exam"
                >
            </div>

            <button class="primary-btn modal-submit">
                Save Note →
            </button>
        `;
    }


    modal.classList.add("show");


    modalForm.dataset.type = type;
}


/* ================= MODAL SUBMIT ================= */

modalForm.addEventListener("submit", e => {

    e.preventDefault();

    const formData =
        new FormData(modalForm);

    const type =
        modalForm.dataset.type;


    if (type === "subject") {

        const subjects =
            getData(
                "subjects",
                defaultSubjects
            );

        subjects.push({

            id: Date.now(),

            name:
                formData.get("name"),

            code:
                formData.get("code"),

            teacher:
                formData.get("teacher"),

            grade:
                Number(formData.get("grade")),

            credits:
                Number(formData.get("credits"))
        });


        saveData(
            "subjects",
            subjects
        );

        renderSubjects();

        showToast("Subject added.");
    }


    if (type === "assignment") {

        const assignments =
            getData(
                "assignments",
                defaultAssignments
            );

        assignments.push({

            id: Date.now(),

            title:
                formData.get("title"),

            subject:
                formData.get("subject"),

            deadline:
                formData.get("deadline"),

            status:
                "Pending"
        });


        saveData(
            "assignments",
            assignments
        );

        renderAssignments();

        renderUpcoming();

        updateAssignmentCount();

        showToast("Assignment added.");
    }


    if (type === "exam") {

        const exams =
            getData(
                "exams",
                defaultExams
            );

        exams.push({

            id: Date.now(),

            title:
                formData.get("title"),

            subject:
                formData.get("subject"),

            date:
                formData.get("date"),

            time:
                formData.get("time")
        });


        saveData(
            "exams",
            exams
        );

        renderExams();

        showToast("Exam added.");
    }


    if (type === "note") {

        const notes =
            getData(
                "notes",
                defaultNotes
            );

        const tags =
            formData
                .get("tags")
                .split(",")
                .map(tag => tag.trim())
                .filter(Boolean);


        notes.push({

            id: Date.now(),

            title:
                formData.get("title"),

            subject:
                formData.get("subject"),

            content:
                formData.get("content"),

            tags
        });


        saveData(
            "notes",
            notes
        );

        renderNotes();

        showToast("Study note saved.");
    }


    closeModal();
});


/* ================= CLOSE MODAL ================= */

document.getElementById("modalClose")
    .addEventListener(
        "click",
        closeModal
    );


modal.addEventListener("click", e => {

    if (e.target === modal) {

        closeModal();
    }
});


function closeModal() {

    modal.classList.remove("show");

    modalForm.reset();
}


/* ================= QUICK ADD ================= */

document.getElementById("quickAdd")
    .addEventListener("click", () => {

        openModal(
            "Add Assignment",
            "Create a new academic task.",
            "assignment"
        );
    });


/* ================= THEME ================= */

document.getElementById("themeToggle")
    .addEventListener("click", () => {

        document.body.classList.toggle(
            "light"
        );

        const light =
            document.body.classList.contains(
                "light"
            );

        localStorage.setItem(
            "unidash_theme",
            light ? "light" : "dark"
        );
    });


if (
    localStorage.getItem(
        "unidash_theme"
    ) === "light"
) {

    document.body.classList.add("light");
}


/* ================= TOAST ================= */

let toastTimer;

function showToast(message) {

    const toast =
        document.getElementById("toast");

    toast.querySelector("p")
        .textContent = message;

    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer =
        setTimeout(() => {

            toast.classList.remove(
                "show"
            );

        }, 2800);
}


/* ================= FORMAT DATE ================= */

function formatDate(dateString) {

    if (!dateString) return "-";

    const date =
        new Date(dateString + "T00:00:00");

    return date.toLocaleDateString(
        "en-US",
        {
            month: "short",
            day: "numeric"
        }
    );
}


/* ================= SECURITY ================= */

function escapeHTML(value) {

    if (value === undefined || value === null) {
        return "";
    }

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


/* ================= AUTO LOGIN ================= */

(function checkSession() {

    const user =
        getCurrentUser();

    if (user) {

        initializeUserData();

        showApp();
    }

})();