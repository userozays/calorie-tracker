import { supabaseConfigured } from "./supabase";

/*
 * Every failure the UI shows is an AppError with a Turkish message that says what to do next
 * (FR-022). Database functions raise stable codes (contracts/database-api.md); they are mapped
 * here, in one place.
 */
export class AppError extends Error {
  constructor(
    message: string,
    readonly code: string,
  ) {
    super(message);
  }
}

const MESSAGES: Record<string, string> = {
  network: "İnternet bağlantısı yok gibi görünüyor. Bağlantını kontrol edip tekrar dene.",
  not_configured: "Uygulamanın sunucu ayarları eksik. Geliştiriciye haber ver.",
  plan_below_floor: "Bu plan güvenli günlük kalori sınırının altında kalıyor.",
  plan_macros_mismatch: "Makrolar kaloriyle tutmuyor. Değerleri yeniden ayarla.",
  meal_not_found: "Bu öğün bulunamadı. Silinmiş olabilir.",
  unknown_food: "Bu yemek veritabanında bulunamadı.",
  unexpected: "Bir şeyler ters gitti. Tekrar dene.",
};

/** Turns anything thrown by Supabase, fetch or a schema into an AppError. */
export function toAppError(err: unknown): AppError {
  if (err instanceof AppError) return err;
  if (!supabaseConfigured) return new AppError(MESSAGES.not_configured, "not_configured");
  const message = err instanceof Error ? err.message : typeof err === "object" && err && "message" in err ? String(err.message) : "";
  const code = Object.keys(MESSAGES).find((c) => message.includes(c));
  if (code) return new AppError(MESSAGES[code], code);
  if (/network|fetch|timeout/i.test(message)) return new AppError(MESSAGES.network, "network");
  return new AppError(MESSAGES.unexpected, "unexpected");
}
