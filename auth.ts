import { generateKey, validateJWT } from "./utils/jwt.ts";

export async function validateAuth(req: Request) {
  try {
    const secret = Deno.env.get("JWT_KEY");

    if (!secret) {
      throw new Error("Env vars");
    }

    const authorization = req.headers.get("Authorization");

    if (authorization === null) {
      return Response.json(
        { status: 401, message: "Unauthorized" },
        { status: 401, statusText: "Unauthorized" }
      );
    }

    const key = await generateKey(secret);

    if (!(await validateJWT(key, authorization.split(" ")[1]))) {
      return Response.json(
        { status: 401, message: "Bad JWT" },
        { status: 401, statusText: "Unauthorized" }
      );
    }
  } catch (error) {
    throw new Error(error.message);
  }
}
