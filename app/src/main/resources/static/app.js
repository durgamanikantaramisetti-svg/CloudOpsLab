"use strict";

const $ = (id) => document.getElementById(id);

function setApiStatus(healthy, message) {
    $("apiMetric").textContent = healthy ? "Online" : "Offline";
    $("apiCaption").textContent = message;

    $("apiDot").style.background = healthy ? "#45d6a0" : "#ff7185";

    const badge = $("healthBadge");
    badge.textContent = healthy ? "Healthy" : "Unavailable";
    badge.className = healthy ? "badge success" : "badge error";
}

function setLastUpdated() {
    $("lastUpdated").textContent =
        "Last checked: " + new Date().toLocaleTimeString();
}

async function checkHealth() {
    $("healthResponse").textContent = "Checking backend...";
    $("responseCode").textContent = "Pending";
    $("healthBadge").textContent = "Checking";
    $("healthBadge").className = "badge pending";

    try {
        const response = await fetch("/health", {
            method: "GET",
            headers: { "Accept": "text/plain, application/json" },
            cache: "no-store"
        });

        const body = await response.text();

        $("responseCode").textContent = response.status;
        $("healthResponse").textContent = body || "(empty response)";

        if (!response.ok) {
            throw new Error("Health endpoint returned HTTP " + response.status);
        }

        setApiStatus(true, "Backend responded successfully");
    } catch (error) {
        $("responseCode").textContent = "Error";
        $("healthResponse").textContent =
            "Could not connect to /health.\n" +
            "Check that the Spring Boot application is running.\n\n" +
            "Details: " + error.message;

        setApiStatus(false, "Unable to reach backend");
    } finally {
        setLastUpdated();
    }
}

async function loadStudents() {
    const list = $("studentsList");
    const message = $("studentsMessage");

    list.innerHTML = '<p class="empty-state">Loading student records...</p>';
    message.textContent = "";

    try {
        const response = await fetch("/students", {
            headers: { "Accept": "application/json" },
            cache: "no-store"
        });

        if (!response.ok) {
            throw new Error("Students endpoint returned HTTP " + response.status);
        }

        const students = await response.json();

        if (!Array.isArray(students)) {
            throw new Error("Expected the API to return a JSON array.");
        }

        $("studentMetric").textContent = students.length;
        list.replaceChildren();

        if (students.length === 0) {
            list.innerHTML = '<p class="empty-state">No student records found.</p>';
            message.textContent = "The API returned an empty list.";
            return;
        }

        students.forEach((student, index) => {
            const card = document.createElement("article");
            card.className = "student-card";

            const number = document.createElement("span");
            number.textContent = "RECORD " + String(index + 1).padStart(2, "0");

            const name = document.createElement("strong");
            name.textContent = typeof student === "string"
                ? student
                : JSON.stringify(student);

            card.append(number, name);
            list.append(card);
        });

        message.textContent = "Successfully loaded " + students.length + " record(s).";
        setLastUpdated();
    } catch (error) {
        $("studentMetric").textContent = "—";
        list.replaceChildren();

        const errorCard = document.createElement("p");
        errorCard.className = "empty-state";
        errorCard.textContent =
            "Unable to load students. Check that the backend is running and /students is available.";

        list.append(errorCard);
        message.textContent = error.message;
    }
}


async function loadBuildInfo() {
    const metric = $("buildMetric");
    const caption = $("buildCaption");
    if (!metric || !caption) return;

    try {
        const response = await fetch("/build-info", { cache: "no-store" });
        if (!response.ok) throw new Error("HTTP " + response.status);

        const info = await response.json();
        metric.textContent = info.buildNumber === "local"
            ? "Local build"
            : "#" + info.buildNumber;

        caption.textContent = info.commit && info.commit !== "unknown"
            ? "Commit: " + info.commit.substring(0, 7)
            : "Commit information unavailable";
    } catch (error) {
        metric.textContent = "Unavailable";
        caption.textContent = "Could not load build information";
    }
}

function setupNavigation() {
    const links = document.querySelectorAll(".nav-link");

    function updateActiveLink() {
        const current = window.location.hash || "#overview";

        links.forEach((link) => {
            link.classList.toggle("active", link.getAttribute("href") === current);
        });
    }

    links.forEach((link) => {
        link.addEventListener("click", () => {
            links.forEach((item) => item.classList.remove("active"));
            link.classList.add("active");
        });
    });

    window.addEventListener("hashchange", updateActiveLink);
    updateActiveLink();
}

function setupCopyButtons() {
    document.querySelectorAll("[data-copy]").forEach((button) => {
        button.addEventListener("click", async () => {
            const endpoint = button.dataset.copy;

            try {
                await navigator.clipboard.writeText(endpoint);
                button.textContent = "Copied!";
            } catch {
                button.textContent = endpoint;
            }

            window.setTimeout(() => {
                button.textContent = "Copy";
            }, 1500);
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    $("refreshButton").addEventListener("click", async () => {
        await Promise.all([checkHealth(), loadStudents(), loadBuildInfo()]);
    });

    $("healthButton").addEventListener("click", checkHealth);
    $("studentsButton").addEventListener("click", loadStudents);

    setupNavigation();
    setupCopyButtons();

    checkHealth();
    loadStudents();
    loadBuildInfo();
});
