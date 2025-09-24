"use client";

import { Client, Account } from "appwrite";

function createAppwriteClient() {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT as string)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID as string);
  return { client, account: new Account(client) };
}

async function getJWT(): Promise<string | null> {
  const { account } = createAppwriteClient();
  try {
    const res = await account.createJWT();
    return res.jwt;
  } catch {
    return null;
  }
}

async function apiFetch(path: string, init: RequestInit = {}): Promise<any> {
  const jwt = await getJWT();
  const headers = new Headers(init.headers || {});
  if (jwt) headers.set("authorization", `Bearer ${jwt}`);
  headers.set("content-type", headers.get("content-type") || "application/json");
  const res = await fetch(path, { ...init, headers });
  const isJson = (res.headers.get("content-type") || "").includes("application/json");
  const body = isJson ? await res.json() : await res.text();
  if (!res.ok) {
    const message = isJson && (body as any)?.error ? (body as any).error : `HTTP ${res.status}`;
    throw new Error(message);
  }
  return body;
}

export const api = {
  session: () => apiFetch("/api/auth/session"),
  institutions: (country: string) => apiFetch(`/api/gocardless/institutions?country=${encodeURIComponent(country)}`),
  createAgreement: (payload: Record<string, unknown>) => apiFetch("/api/gocardless/agreements", { method: "POST", body: JSON.stringify(payload) }),
  createRequisition: (payload: Record<string, unknown>) => apiFetch("/api/gocardless/requisitions", { method: "POST", body: JSON.stringify(payload) }),
  requisition: (id: string) => apiFetch(`/api/gocardless/requisitions/${encodeURIComponent(id)}`),
  account: (accountId: string) => apiFetch(`/api/gocardless/accounts/${encodeURIComponent(accountId)}`),
  transactions: (accountId: string, params: Record<string, string> = {}) => {
    const usp = new URLSearchParams(params);
    return apiFetch(`/api/gocardless/accounts/${encodeURIComponent(accountId)}/transactions?${usp.toString()}`);
  },
} as const;
