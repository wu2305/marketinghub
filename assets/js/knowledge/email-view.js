(function () {
  const id = new URLSearchParams(location.search).get("id") || "",
    fallback = {
      "email-report-weekly-performance": {
        id: "email-report-weekly-performance",
        type: "Email Reports",
        title: "Weekly Marketing Performance",
        summary: "Weekly executive summary of channel delivery, conversion and ROI.",
        owner: "Emily Wang",
        status: "Enable",
        created: "Aug 10, 2026",
        updated: "Yesterday",
        emailSubject: "Weekly Marketing Performance | Executive Summary",
        recipients: "Emily Wang, Sophie Taylor, Daniel Chen",
        schedule: "Every Monday · 09:00",
        sections: "Executive Summary, KPI Overview, Channel Insights",
        relatedReport: "Marketing Executive Dashboard",
        lastSent: "Aug 31, 2026",
      },
      "email-report-campaign-alert": {
        id: "email-report-campaign-alert",
        type: "Email Reports",
        title: "Campaign Performance Alert",
        summary: "Daily exception report for campaigns outside governed performance thresholds.",
        owner: "Campaign Operations",
        status: "Enable",
        created: "Aug 14, 2026",
        updated: "2 days ago",
        emailSubject: "Campaign Performance Alert | Action Required",
        recipients: "Olivia Zhang, Ethan Li, Mia Chen",
        schedule: "Daily · 08:30",
        sections: "Exception Summary, Impacted Campaigns, Recommended Actions",
        relatedReport: "Campaign Performance",
        lastSent: "Sep 1, 2026",
      },
      "email-report-monthly-customer": {
        id: "email-report-monthly-customer",
        type: "Email Reports",
        title: "Monthly Customer Growth Review",
        summary: "Monthly customer acquisition, activation and retention review.",
        owner: "Customer Analytics",
        status: "Disable",
        created: "Aug 18, 2026",
        updated: "1 week ago",
        emailSubject: "Monthly Customer Growth Review",
        recipients: "Sophia Huang, Lucas Zhou, Chloe Wu",
        schedule: "First business day · 10:00",
        sections: "Growth Summary, Funnel Movement, Retention Insights",
        relatedReport: "Customer 360",
        lastSent: "Aug 1, 2026",
      },
    },
    item =
      (window.marketingKnowledgeAssets || []).find(
        (x) => x.id === id && x.type === "Email Reports",
      ) || fallback[id],
    view = document.querySelector("#viewPage");
  if (!item || !view) return;
  const esc = (v) =>
    String(v || "").replace(
      /[&<>"']/g,
      (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c],
    );
  const field = (label, value, extra = "") =>
    `<div class="er-field ${extra}"><label>${label}</label><div class="er-readonly">${esc(value)}</div></div>`;
  document.querySelector(".v20-view-title-breadcrumb")?.setAttribute("hidden", "");
  const statusLabel =
    item.status === "Enable" ? "Enabled" : item.status === "Disable" ? "Disabled" : item.status;
  const statusClass = item.status === "Disable" ? " is-disabled" : "";
  view.innerHTML = `<div class="er-detail"><nav class="er-breadcrumb"><a href="../../index.html">Home</a><span>/</span><a href="knowledge.html">AI Interpreter</a><span>/</span><a href="knowledge.html">Knowledge Management</a><span>/</span><a href="knowledge.html?type=Email%20Reports">Email Reports</a><span>/</span><b>${esc(item.title)}</b></nav><header class="er-head"><h1>${esc(item.title)}</h1><span class="er-state${statusClass}">${esc(statusLabel)}</span></header><div class="er-detail-grid">
 <section class="er-card"><header class="er-card-head"><span>1</span><strong>Basic Information</strong><small>Report identity and purpose</small></header><div class="er-card-body"><div class="er-fields">${field("Report Name", item.title)}${field("Email Subject", item.emailSubject, "span-2")}${field("Status", statusLabel)}${field("Description", item.summary, "span-2")}${field("Related Report", item.relatedReport, "span-2")}</div></div></section>
 <section class="er-card"><header class="er-card-head"><span>2</span><strong>Delivery Settings</strong><small>Recipients and delivery schedule</small></header><div class="er-card-body"><div class="er-fields">${field("Recipients", item.recipients, "span-2")}${field("CC", "Grace Liu, Michael Zhao")}${field("Frequency", item.schedule.split(" · ")[0])}${field("Send Time", item.schedule.split(" · ")[1] || "09:00")}${field("Time Zone", "Asia/Shanghai")}${field("Last Sent", item.lastSent)}${field("Next Run", "Next scheduled delivery")}</div></div></section>
 <section class="er-card"><header class="er-card-head"><span>3</span><strong>Email Content</strong><small>Configured sections included in the email</small></header><div class="er-card-body"><div class="er-content-list">${item.sections
   .split(", ")
   .map(
     (s, i) =>
       `<article class="er-content-item"><strong>${i + 1}. ${esc(s)}</strong><p>${i === 0 ? "AI-generated overview of material performance changes and business impact." : i === 1 ? "Governed metrics with period comparison and threshold indicators." : "Key findings with recommended follow-up actions."}</p></article>`,
   )
   .join("")}</div></div></section>
 <section class="er-card"><header class="er-card-head"><span>4</span><strong>Execution Information</strong><small>Ownership and run history</small></header><div class="er-card-body"><div class="er-fields">${field("Creator", item.owner)}${field("Created", item.created)}${field("Updated", item.updated)}${field("Last Sent", item.lastSent)}</div></div></section>
 </div></div>`;
})();

