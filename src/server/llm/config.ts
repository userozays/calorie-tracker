/** Local Ollama server used by the quick bar's food matcher and, optionally, label reading. */
export const LLM_URL = (process.env.LOCAL_LLM_URL || "http://localhost:11434").replace(/\/+$/, "");
export const LLM_MODEL = process.env.LOCAL_LLM_MODEL || "llama3.2";
/**
 * Optional Ollama vision model for reading nutrition labels (e.g. "qwen2.5vl:7b"). Unset: labels
 * are read with OCR + the rule-based parser only.
 */
export const VISION_MODEL = process.env.LOCAL_VISION_MODEL?.trim() || null;
