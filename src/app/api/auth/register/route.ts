import { registerUser } from "@/server/accounts";
import { startSession, toPublicUser } from "@/server/auth";
import { apiError, readJson } from "@/server/http";
import { clientIp, rateLimited } from "@/server/rateLimit";
import { credentialsSchema } from "@/types/auth";

/** POST /api/auth/register { username, password }: creates the account and signs it in. */
export async function POST(request: Request) {
  if (rateLimited(`register:${clientIp(request)}`, 10, 60 * 60 * 1000)) {
    return apiError("Bu ağdan çok fazla kayıt denemesi yapıldı. Daha sonra tekrar deneyin.", 429);
  }
  const body = await readJson(request, credentialsSchema);
  if (!body.ok) return body.response;

  const user = await registerUser(body.data);
  if (user === "taken") return apiError("Bu kullanıcı adı alınmış.", 409);

  await startSession(user.id);
  return Response.json({ user: toPublicUser(user) }, { status: 201 });
}
