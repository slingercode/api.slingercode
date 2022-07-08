import { std, dotenv } from "./deps.ts";
import { getTweets } from "./lib/twitter.ts";
import { validateAuth } from "./auth.ts";

await dotenv.config({ export: true });

async function handler(req: Request) {
  try {
    const response = await validateAuth(req);

    if (response) {
      return response;
    }

    const { status, message, tweets, errors } = await getTweets([
      "234",
      "45235",
      "345",
    ]);

    return Response.json({
      status,
      message: message || "",
      tweets,
      errors: errors || [],
    });
  } catch (error) {
    return Response.json(
      { status: 500, message: error.message },
      { status: 500, statusText: "Server error" }
    );
  }
}

std.serve(handler);
