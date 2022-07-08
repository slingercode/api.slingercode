import { crypto, encode, decode } from "../deps.ts";

const encoder = (d: string) => new TextEncoder().encode(d);

export const generateKey = async (key: string) =>
  await crypto.subtle.importKey(
    "raw",
    encoder(key),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );

export const generateJWT = async (key: CryptoKey, data: { user: string }) => {
  const header = encode(encoder(JSON.stringify({ alg: "HS256", typ: "JWT" })));
  const payload = encode(encoder(JSON.stringify(data)));

  const signature = encode(
    new Uint8Array(
      await crypto.subtle.sign(
        { name: "HMAC" },
        key,
        encoder(`${header}.${payload}`)
      )
    )
  );

  return `${header}.${payload}.${signature}`;
};

export const validateJWT = async (key: CryptoKey, jwt: string) => {
  const segments = jwt.split(".");

  if (segments.length !== 3) {
    return false;
  }

  const data = encoder(`${segments[0]}.${segments[1]}`);

  return await crypto.subtle.verify(
    { name: "HMAC" },
    key,
    decode(segments[2]),
    data
  );
};
