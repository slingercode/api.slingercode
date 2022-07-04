import { std, dotenv } from "./deps.ts";
import { getTweets } from "./lib/twitter.ts";

const { serve } = std;
const { config } = dotenv;

config({ export: true });

serve(async () => {
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
});
