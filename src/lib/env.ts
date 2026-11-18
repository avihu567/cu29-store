// Env values are often pasted from chats or docs with formatting attached:
//   "value"  'value'  `value`  **value**  [value](https://…)  plus spaces/newlines.
// cleanEnv() strips that wrapping so a correct value still works.

export function cleanEnv(raw: string | undefined): string {
  let v = (raw ?? "").trim();
  for (let i = 0; i < 3; i++) {
    const before = v;
    // Markdown link [text](url) → text
    const link = v.match(/^\[([^\]]*)\]\([^)]*\)$/);
    if (link) v = link[1].trim();
    // **bold** / __bold__
    const bold = v.match(/^(\*\*|__)([\s\S]*)\1$/);
    if (bold) v = bold[2].trim();
    // Matching quotes or backticks around the whole value
    const quoted = v.match(/^(["'`])([\s\S]*)\1$/);
    if (quoted) v = quoted[2].trim();
    if (v === before) break;
  }
  return v;
}

/** First http(s) URL inside a (possibly formatted) value, as an origin. */
export function cleanUrlEnv(raw: string | undefined): string | null {
  const v = cleanEnv(raw);
  if (!v) return null;
  const found = v.match(/https?:\/\/[^\s)\]"'`<>]+/i)?.[0] ?? (/^[\w.-]+\.[a-z]{2,}/i.test(v) ? `https://${v}` : null);
  if (!found) return null;
  try {
    return new URL(found).origin;
  } catch {
    return null;
  }
}
