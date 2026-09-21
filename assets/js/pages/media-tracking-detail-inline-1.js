document.querySelectorAll(".media-tracking-tab").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".media-tracking-tab").forEach((b) => {
      b.classList.remove("active");
      b.setAttribute("aria-selected", "false");
    });
    btn.classList.add("active");
    btn.setAttribute("aria-selected", "true");
  });
});
