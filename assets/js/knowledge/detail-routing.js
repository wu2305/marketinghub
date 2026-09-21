(function () {
  const data = window.knowledgeFieldMapping,
    id = new URLSearchParams(location.search).get("id");
  if (!data || !id) return;
  const asset = (window.marketingKnowledgeAssets || []).find((x) => x.id === id);
  const type = asset?.type || (id.startsWith("email-report-") ? "Email Reports" : "");
  if (data.types.includes(type))
    location.replace(
      `knowledge.html?type=${encodeURIComponent(type)}&detail=${encodeURIComponent(id)}`,
    );
})();
