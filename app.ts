import { std, dotenv } from "./deps.ts";
import { getTweets } from "./lib/twitter.ts";
import { validateAuth } from "./auth.ts";

await dotenv.config({ export: true });

function GET() {
  return Response.json({ todo: "SSR" });
}

function NO_SUPPORTED() {
  return Response.json("No supported");
}

async function POST(req: Request) {
  try {
    const response = await validateAuth(req);

    if (response) {
      return response;
    }

    let ids: string[] = [];

    if (req.body) {
      ids = await req.json();
    }

    const { status, message, tweets, errors } = await getTweets(ids);

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

function handler(req: Request) {
  switch (req.method) {
    case "GET":
      return GET();

    case "POST":
      return POST(req);

    default:
      return NO_SUPPORTED();
  }
}

std.serve(handler);
