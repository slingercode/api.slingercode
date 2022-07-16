// deno-lint-ignore-file no-explicit-any

export type ResponseTweet = {
  status: number;
  detail: string;
  data: any[];
  errors: any[];
  includes: {
    media: any[];
    users: any[];
    tweets: any[];
  };
};
