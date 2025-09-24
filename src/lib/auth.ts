import { Client, Account } from "appwrite";

function assertAuthEnv(): void {
  const missing: string[] = [];
  if (!process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT) missing.push("NEXT_PUBLIC_APPWRITE_ENDPOINT");
  if (!process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID) missing.push("NEXT_PUBLIC_APPWRITE_PROJECT_ID");
  if (missing.length > 0) {
    throw new Error(
      `Missing required env var(s): ${missing.join(", ")}. Please set them before using auth.`
    );
  }
}

export function extractBearerToken(request: Request): string | null {
  const auth = request.headers.get("authorization") || request.headers.get("Authorization");
  if (!auth) return null;
  const [scheme, token] = auth.split(" ");
  if (!scheme || scheme.toLowerCase() !== "bearer" || !token) return null;
  return token.trim();
}

export type VerifyJWTResult = {
  valid: boolean;
  user: unknown | null;
  error: string | null;
};

export async function verifyAppwriteJWT(jwt: string | null): Promise<VerifyJWTResult> {
  assertAuthEnv();
  if (!jwt) {
    return { valid: false, user: null, error: "Missing bearer token" };
  }
  try {
    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT as string)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID as string)
      .setJWT(jwt);

    const account = new Account(client);
    const user = await account.get();
    return { valid: true, user, error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Invalid token";
    return { valid: false, user: null, error: message };
  }
}

export class StatusError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function requireAuthUser(request: Request): Promise<unknown> {
  const token = extractBearerToken(request);
  const { valid, user, error } = await verifyAppwriteJWT(token);
  if (!valid) {
    throw new StatusError(error || "Unauthorized", 401);
  }
  return user;
}
