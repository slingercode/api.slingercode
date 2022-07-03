import { std } from "./deps.ts";

const { serve } = std;

serve(() =>
  Response.json(
    { message: "Hello world!" },
    {
      headers: {
        "Content-type": "application/json; charset=utf-8",
      },
    }
  )
);
