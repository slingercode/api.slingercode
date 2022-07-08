import { crypto } from "../deps.ts";

export const generateUUID = () => crypto.randomUUID();
