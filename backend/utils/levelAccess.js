exports.getAllowedLevels = (level) => {
  if (level === "6-8") return ["6-8"];
  if (level === "9-10") return ["6-8", "9-10"];
  if (level === "11-12") return ["6-8", "9-10", "11-12"];
  return [];
};