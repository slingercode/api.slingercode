export async function getTweets(ids: string[]) {
  try {
    const expansions =
      "author_id,attachments.media_keys,referenced_tweets.id,referenced_tweets.id.author_id";
    const tweetFields =
      "attachments,author_id,public_metrics,created_at,id,in_reply_to_user_id,referenced_tweets,text";
    const userFields =
      "id,name,profile_image_url,protected,url,username,verified";
    const mediaFields =
      "duration_ms,height,media_key,preview_image_url,type,url,width,public_metrics";

    const response = await fetch(
      `https://api.twitter.com/2/tweets?ids=${ids}&expansions=${expansions}&tweet.fields=${tweetFields}&user.fields=${userFields}&media.fields=${mediaFields}`,
      {
        headers: {
          Authorization: `Bearer ${Deno.env.get("TWITTER_KEY")}`,
        },
      }
    );

    const {
      status = 200,
      detail = "",
      data: tweets = [],
      errors = [],
    } = await response.json();

    if (status !== 200) {
      throw new Error(`${status} - ${detail}`);
    }

    return {
      status,
      tweets,
      errors,
    };
  } catch (error) {
    return {
      status: 500,
      message: error.message || "Server error",
    };
  }
}
