import { Context, Status } from "https://deno.land/x/oak/mod.ts";
import { validateJwt } from "https://deno.land/x/djwt/validate.ts";

/**
 * Creamos una configuración predeterminada
 */
export const JwtConfig = {
  header: "Authorization",
  schema: "Bearer",
  secretKey: Deno.env.get("SECRET") || "",
  expirationTime: 60000,
  type: "JWT",
  alg: "HS256",
};

export async function jwtAuth(
  ctx: Context<Record<string, any>>,
  next: () => Promise<void>
) {
  // Obtenga el token de la solicitud
  const token = ctx.request.headers
    .get(JwtConfig.header)
    ?.replace(`${JwtConfig.schema} `, "");

  // rechazar solicitud si no se proporcionó el token
  if (!token) {
    ctx.response.status = Status.Unauthorized;
    ctx.response.body = { message: "Unauthorized" };
    return;
  }

  // verificar la validez del token
  if (!(await validateJwt(token, JwtConfig.secretKey, { isThrowing: false }))) {
    ctx.response.status = Status.Unauthorized;
    ctx.response.body = { message: "Wrong Token" };
    return;
  }

  // JWT es correcto, así que continúe y llame a la ruta privada
  next();
}
