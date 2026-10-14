(function () {
    "use strict";

    // Border under the nav once the page is scrolled
    var nav = document.getElementById("nav");

    if (nav) {
        var onScroll = function () {
            nav.classList.toggle("scrolled", window.scrollY > 10);
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();
    }

    // Fade elements in as they enter the viewport
    var revealed = document.querySelectorAll(".reveal");

    if ("IntersectionObserver" in window) {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });

        revealed.forEach(function (el) { observer.observe(el); });
    } else {
        revealed.forEach(function (el) { el.classList.add("visible"); });
    }

    // Highlight the nav link for the section in view
    var links = document.querySelectorAll(".nav-links a");

    if (links.length && "IntersectionObserver" in window) {
        var sectionObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                links.forEach(function (link) {
                    link.classList.toggle(
                        "active",
                        link.getAttribute("href") === "#" + entry.target.id
                    );
                });
            });
        }, { rootMargin: "-45% 0px -50% 0px" });

        document.querySelectorAll("main section[id]").forEach(function (section) {
            sectionObserver.observe(section);
        });
    }

    // Contact form: send through FormSubmit without leaving the page
    var form = document.getElementById("contact-form");
    var status = document.getElementById("form-status");

    if (form) {
        form.addEventListener("submit", async function (event) {
            event.preventDefault();

            var button = form.querySelector("button[type=submit]");
            button.disabled = true;
            status.className = "form-status";
            status.textContent = "Sending…";

            try {
                var response = await fetch(
                    "https://formsubmit.co/ajax/salihuyar3836@gmail.com",
                    {
                        method: "POST",
                        headers: { "Accept": "application/json" },
                        body: new FormData(form)
                    }
                );

                if (!response.ok) throw new Error("HTTP " + response.status);

                form.reset();
                status.classList.add("ok");
                status.textContent = "Message sent! I will get back to you soon.";
            } catch (error) {
                console.error(error);
                status.classList.add("err");
                status.textContent = "Failed to send message. Please try again later.";
            } finally {
                button.disabled = false;
            }
        });
    }
})();
