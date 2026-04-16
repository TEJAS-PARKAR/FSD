function loadProfileHighlights() {
    const message = document.getElementById("profile-message");
    const highlights = [
        "Strong in DSA, problem solving, and core computer science.",
        "Experienced with C++, Python, Java, SQL, and Power BI.",
        "Interested in AI, language technology, and full-stack development.",
        "Active in competitive programming and technical leadership roles."
    ];

    const highlight = highlights[Math.floor(Math.random() * highlights.length)];
    message.textContent = highlight;
}

function handleContactSubmit(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const status = document.getElementById("form-status");
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());
    const savedMessages = JSON.parse(localStorage.getItem("portfolioMessages") || "[]");

    savedMessages.push({
        ...payload,
        savedAt: new Date().toLocaleString()
    });

    localStorage.setItem("portfolioMessages", JSON.stringify(savedMessages));

    form.reset();
    status.textContent = "Message saved in this browser using JavaScript.";
}

document.addEventListener("DOMContentLoaded", () => {
    loadProfileHighlights();

    const contactForm = document.getElementById("contact-form");
    contactForm.addEventListener("submit", handleContactSubmit);
});
