import { config } from "https://deno.land/std@0.146.0/dotenv/mod.ts";

import { generateJWT, generateKey, validateJWT } from "../utils/jwt.ts";

await config({ export: true });

/**
 * Generates a JWT in order to use the API
 * --user <SOME_EMAIL>
 */
async function script() {
  try {
    const index = Deno.args.findIndex((arg) => arg === "--user");

    if (index === -1) {
      throw new Error("User information missed, try --user <SOME_EMAIL>");
    }

    const secret = Deno.env.get("JWT_KEY");

    if (secret) {
      const user = Deno.args[index + 1];
      const key = await generateKey(secret);
      const jwt = await generateJWT(key, { user });
      const isValid = await validateJWT(key, jwt);

      console.log(`JWT: ${jwt}`);
      console.log("Is valid", isValid);
    } else {
      throw new Error("Unable to read env var");
    }
  } catch (error) {
    console.log(error.message);
  }
}

await script();
