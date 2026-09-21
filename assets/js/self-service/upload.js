(function () {
  var form = document.getElementById("dataUploadForm");
  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var data = {};
      var fields = form.querySelectorAll("input[name]");
      fields.forEach(function (field) {
        data[field.name] = field.value.trim();
      });
      if (window.console && console.log) console.log("[Data Upload Submit]", data);

      var btn = form.querySelector(".submit-btn");
      if (btn) {
        var original = btn.textContent;
        btn.disabled = true;
        btn.textContent = "Submitted";
        window.setTimeout(function () {
          btn.disabled = false;
          btn.textContent = original;
        }, 1500);
      }
    });
  }

  /* ── Bulk Import Modal ── */
  var modal = document.getElementById("bulkImportModal");
  var openBtn = document.getElementById("bulkImportBtn");
  var dropzone = document.getElementById("bulkImportDropzone");
  var fileInput = document.getElementById("bulkImportFile");

  if (!modal || !openBtn) return;

  function openModal() {
    modal.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = "";
  }

  openBtn.addEventListener("click", function (event) {
    event.preventDefault();
    openModal();
  });

  modal.addEventListener("click", function (event) {
    var t = event.target;
    if (t.matches("[data-close]") || t.closest("[data-close]")) {
      closeModal();
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && !modal.hidden) closeModal();
  });

  if (dropzone && fileInput) {
    dropzone.addEventListener("click", function () {
      fileInput.click();
    });
    dropzone.addEventListener("dragover", function (event) {
      event.preventDefault();
      dropzone.style.borderColor = "var(--workspace-yellow)";
      dropzone.style.background = "#fffbeb";
    });
    dropzone.addEventListener("dragleave", function () {
      dropzone.style.borderColor = "";
      dropzone.style.background = "";
    });
    dropzone.addEventListener("drop", function (event) {
      event.preventDefault();
      dropzone.style.borderColor = "";
      dropzone.style.background = "";
      if (event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) {
        fileInput.files = event.dataTransfer.files;
      }
    });
    fileInput.addEventListener("change", function () {
      if (fileInput.files && fileInput.files[0]) {
        var hint = dropzone.querySelector(".bulk-import-dropzone-hint");
        if (hint) hint.textContent = "Selected: " + fileInput.files[0].name;
      }
    });
  }
})();
