document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("scenarioEditForm");
  const runPreviewBtn = document.getElementById("runPreviewBtn");
  const previewContent = document.getElementById("previewContent");
  const previewOutput = document.getElementById("previewOutput");
  const previewQuestion = document.getElementById("previewQuestion");

  // Get scenario from URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  const scenarioId = urlParams.get("id");
  const scenario = scenarioId ? scenarioLibraryData.find((s) => s.id === scenarioId) : null;

  const assignValue = (id, value) => {
    const field = document.getElementById(id);
    if (field) field.value = value == null ? "" : value;
  };

  // If editing existing scenario, populate fields that exist on this page.
  if (scenario) {
    assignValue("scenarioName", scenario.name);
    assignValue("scenarioCategory", scenario.category);
    assignValue("scenarioPurpose", scenario.purpose);
    assignValue("scenarioScope", scenario.scope);
    assignValue("scenarioOwner", scenario.owner);
    const editReport = document.getElementById("editReport");
    if (editReport) editReport.value = "Invest City Strategy Analysis";
    assignValue("editLogic", scenario.logic);
    assignValue("editOutput", scenario.output);
    if (previewQuestion) previewQuestion.value = scenario.previewQuestion || "";
    if (previewOutput) previewOutput.textContent = scenario.previewOutput || "";
    document.title = `Tapestry Marketing Portal | Edit ${scenario.name}`;
  }

  const editReport = document.getElementById("editReport");
  const editReportLink = document.getElementById("editReportLink");
  const reportLinks = {
    "Invest City Strategy Analysis": "../pages/reports.html?project=city&dashboard=0",
    "City Analysis Dashboard": "../pages/reports.html?project=city&dashboard=1",
    "4P Executive Overview": "../pages/reports.html?project=fourp&dashboard=0",
    "Promotion Lift Analysis": "../pages/reports.html?project=fourp&dashboard=1",
    "Customer Daily Pulse": "../pages/reports.html?project=customer&dashboard=0",
    "Customer Funnel Watch": "../pages/reports.html?project=customer&dashboard=1",
    "Audience Build Overview": "../pages/reports.html?project=abo&dashboard=0",
    "Campaign Quality Watch": "../pages/reports.html?project=abo&dashboard=1",
    "Rednote Media Tracking": "../pages/reports.html?project=rednote&dashboard=0",
    "Creative Quality Monitor": "../pages/reports.html?project=rednote&dashboard=1",
    "OTT / OLV Exposure Tracking": "../pages/reports.html?project=ottolv&dashboard=0",
    "Source Integrity Monitor": "../pages/reports.html?project=ottolv&dashboard=1",
  };
  if (editReport && editReportLink) {
    const syncReportLink = () => {
      const href = reportLinks[editReport.value] || "#";
      editReportLink.href = href;
      editReportLink.textContent = editReport.value ? `Open ${editReport.value}` : "Open report";
      editReportLink.hidden = !editReport.value;
    };
    editReport.addEventListener("change", syncReportLink);
    syncReportLink();
  }

  // Run preview
  runPreviewBtn.addEventListener("click", () => {
    previewContent.hidden = false;
    const question = previewQuestion.value.trim();
    if (!question) {
      previewOutput.textContent = "Please enter an example question first.";
      return;
    }

    // Simulate preview generation
    previewOutput.textContent = `Generating preview for: "${question}"\n\n## Analysis Result\n\nBased on the linked report and uploaded reference materials, the AI would:\n\n1. **Read Materials**: Review the linked report and uploaded documents or screenshots\n2. **Validate Scope**: Check the analysis request, timing, and business coverage\n3. **Execute Logic**: ${document.getElementById("editLogic").value || "Run analysis logic"}\n4. **Generate Output**: ${document.getElementById("editOutput").value || "Produce structured output"}\n\n---\n\n*This is a simulated preview. In production, this would execute the actual scenario against live data.*`;
  });

  // Form submission
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const fields = [
      { id: "scenarioName", label: "Scenario Name" },
      { id: "scenarioCategory", label: "Category" },
      { id: "scenarioPurpose", label: "Purpose" },
      { id: "scenarioScope", label: "Scope" },
      { id: "scenarioOwner", label: "Owner" },
      { id: "editReport", label: "Report" },
    ];

    const showError = (input) => {
      if (!input) return false;
      if ((input.value || "").trim()) {
        clearError(input);
        return false;
      }
      input.classList.add("field-error");
      let err = input.parentElement.querySelector(".field-error-msg");
      if (!err) {
        err = document.createElement("span");
        err.className = "field-error-msg";
        err.textContent = "Cannot be empty";
        input.insertAdjacentElement("afterend", err);
      }
      err.hidden = false;
      return true;
    };

    const clearError = (input) => {
      if (!input) return;
      input.classList.remove("field-error");
      const err = input.parentElement.querySelector(".field-error-msg");
      if (err) err.hidden = true;
    };

    let firstInvalid = null;
    fields.forEach((f) => {
      const input = document.getElementById(f.id);
      if (showError(input) && !firstInvalid) firstInvalid = input;
    });

    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }

    // Simulate submission
    alert("Scenario submitted for review successfully!");
    window.location.href = "scenario-library.html";
  });
});
