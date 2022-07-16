import { ResponseTweet } from "../types/tweet.ts";

const tweetMetadata = new Map<string, string[]>([
  [
    "expansions",
    [
      "author_id",
      "referenced_tweets.id",
      "attachments.media_keys",
      "referenced_tweets.id.author_id",
    ],
  ],
  [
    "tweet.fields",
    [
      "id",
      "text",
      "author_id",
      "created_at",
      "attachments",
      "public_metrics",
      "referenced_tweets",
    ],
  ],
  [
    "user.fields",
    ["id", "url", "name", "username", "verified", "profile_image_url"],
  ],
  [
    "media.fields",
    [
      "url",
      "type",
      "width",
      "height",
      "media_key",
      "duration_ms",
      "public_metrics",
      "preview_image_url",
    ],
  ],
]);

export async function getTweets(ids: string[]) {
  try {
    const queryParams = [...tweetMetadata]
      .map((opc) => `${opc[0]}=${opc[1].join(",")}`)
      .join("&");

    const response = await fetch(
      `https://api.twitter.com/2/tweets?ids=${ids}&${queryParams}`,
      {
        headers: {
          Authorization: `Bearer ${Deno.env.get("TWITTER_KEY")}`,
        },
      }
    );

    const {
      status = 200,
      detail = "",
      data = [],
      errors = [],
      includes: { media = [], users = [], tweets = [] },
    }: ResponseTweet = await response.json();

    if (status !== 200) {
      throw new Error(`${status} - ${detail}`);
    }

    const getAuthor = (authorId: string) => {
      const author = users.find((author) => author.id === authorId);

      return {
        ...author,
        url: `https://twitter.com/${author.username}`,
      };
    };

    const textFormat = (text: string) => {
      const removeLinks = text.replace(/https:\/\/[\n\S]+/g, "");
      const lt = removeLinks.replace("&lt;", "<");
      const gt = lt.replace("&gt;", ">");

      return gt.trim();
    };

    const getMedia = (mediaId: string) =>
      media.find((media) => media.media_key === mediaId);

    const getPostUrl = (username: string, id: string) =>
      `https://twitter.com/${username}/status/${id}`;

    const getReferencedTweet = (tweetId: string) => {
      const tweet = tweets.find((_tweet) => _tweet.id === tweetId);

      return {
        id: tweet.id,
        url: getPostUrl(getAuthor(tweet.author_id).username, tweet.id),
        author: getAuthor(tweet.author_id),
        text: textFormat(tweet.text),
        created_at: tweet.created_at,
        public_metrics: tweet.public_metrics,
      };
    };

    return {
      status,
      errors,
      tweets: data.map((tweet) => ({
        id: tweet.id,
        url: getPostUrl(getAuthor(tweet.author_id).username, tweet.id),
        author: getAuthor(tweet.author_id),
        text: textFormat(tweet.text),
        created_at: tweet.created_at,
        public_metrics: tweet.public_metrics,
        referenced_tweets: (tweet.referenced_tweets || []).map((_tweet: any) =>
          getReferencedTweet(_tweet.id)
        ),
        media: (tweet.attachments?.media_keys || []).map((key: any) =>
          getMedia(key)
        ),
      })),
    };
  } catch (error) {
    return {
      status: 500,
      message: error.message || "Server error",
    };
  }
}
