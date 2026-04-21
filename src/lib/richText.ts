function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function isLikelyHtml(value: string) {
  return /<([a-z][a-z0-9]*)\b[^>]*>/i.test(value);
}

function isEmptyQuillHtml(value: string) {
  const normalized = value
    .replace(/\u200B/g, "")
    .replace(/&nbsp;/gi, "")
    .replace(/\s+/g, "")
    .toLowerCase();

  return normalized === "" || normalized === "<p><br></p>" || normalized === "<div><br></div>";
}

export function normalizeRichTextHtml(value: unknown) {
  const input = typeof value === "string" ? value.trim() : "";

  if (!input || isEmptyQuillHtml(input)) {
    return "";
  }

  if (isLikelyHtml(input)) {
    return input;
  }

  return input
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph) =>
      `<p>${escapeHtml(paragraph).replace(/\n/g, "<br>")}</p>`
    )
    .join("");
}

export function normalizeLocalizedRichText(value: unknown) {
  const input =
    typeof value === "object" && value !== null
      ? (value as Record<string, unknown>)
      : {};

  return {
    en: normalizeRichTextHtml(input.en),
    vi: normalizeRichTextHtml(input.vi),
  };
}
