(function () {
  const params = new URLSearchParams(location.search);
  if (params.get("type") !== "Data Model") {
    params.set("type", "Data Model");
    location.replace(`${location.pathname}?${params.toString()}`);
  }
})();
