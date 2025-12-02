let currentMode = "ideas";

const modeButtons = document.querySelectorAll(".mode-btn");
const promptInput = document.getElementById("promptInput");
const runBtn = document.getElementById("runBtn");
const responseBox = document.getElementById("responseBox");

// Switch modes
modeButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
        modeButtons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        currentMode = btn.dataset.mode;

        if (currentMode === "ideas") {
            promptInput.placeholder =
                "Example: I want to make more money but don't know what to focus on.";
        } else if (currentMode === "tasks") {
            promptInput.placeholder =
                "Example: Build a portfolio and get my first remote job.";
        } else if (currentMode === "code") {
            promptInput.placeholder =
                "Example: Make a landing page with a hero, features, and CTA in HTML/CSS.";
        }
    });
});

// Handle click
runBtn.addEventListener("click", async () => {
    const prompt = promptInput.value.trim();
    if (!prompt) {
        responseBox.innerHTML =
            "<p class='placeholder'>Type something first so I can help you.</p>";
        return;
    }

    runBtn.disabled = true;
    runBtn.textContent = "Thinking...";
    responseBox.innerHTML = "<p class='placeholder'>1nes AI is thinking...</p>";

    try {
        // FINAL FIX — CORRECT NETLIFY FUNCTION URL
        const res = await fetch("/.netlify/functions/ai", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ prompt, mode: currentMode }),
        });

        const data = await res.json();

        responseBox.innerHTML = data.ai
            ? data.ai.replace(/\n/g, "<br>")
            : "<p>No response from backend.</p>";

    } catch (err) {
        console.error(err);
        responseBox.innerHTML =
            "<p>Error talking to AI backend. Check deploy logs.</p>";
    }

    runBtn.disabled = false;
    runBtn.textContent = "Ask 1nes AI";
});
