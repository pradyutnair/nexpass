"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useMemo, useState } from "react";
import { api } from "@/app/lib/api";

type Institution = {
  id: string;
  name?: string;
  bic?: string;
  [k: string]: any;
};

export default function ConnectBankDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [country, setCountry] = useState("GB");
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    setError("");
    api
      .institutions(country)
      .then((data: any) => setInstitutions(Array.isArray(data) ? data : data?.results || []))
      .catch((e: any) => setError(e.message || "Failed to load institutions"))
      .finally(() => setLoading(false));
  }, [open, country]);

  async function startFlow(inst: Institution) {
    try {
      setLoading(true);
      const agreement = await api.createAgreement({ institutionId: inst.id });
      const redirect = window.location.origin + "/dashboard";
      const req = await api.createRequisition({ redirect, institutionId: inst.id, agreementId: (agreement as any).id });
      const link = (req as any).link || (req as any).initiation_url || (req as any).url;
      if (link) {
        window.location.href = link as string;
      } else {
        throw new Error("Missing requisition link");
      }
    } catch (e: any) {
      setError(e.message || "Failed to start consent flow");
    } finally {
      setLoading(false);
    }
  }

  const countries = useMemo(() => [
    { code: "GB", name: "United Kingdom" },
    { code: "IE", name: "Ireland" },
    { code: "DE", name: "Germany" },
    { code: "FR", name: "France" },
  ], []);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 w-[90vw] max-w-xl -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-[var(--bg-elev)] p-4 border border-[var(--border)]">
          <Dialog.Title className="text-lg font-semibold mb-2">Connect your bank</Dialog.Title>
          <Dialog.Description className="text-[var(--fg-subtle)] mb-4">
            Choose your country and bank to connect securely.
          </Dialog.Description>

          <div className="flex items-center gap-3 mb-4">
            <label className="text-sm text-[var(--fg-muted)]">Country</label>
            <select
              className="rounded-md bg-[var(--bg)] border border-[var(--border)] px-2 py-1"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              disabled={loading}
            >
              {countries.map((c) => (
                <option key={c.code} value={c.code}>{c.name}</option>
              ))}
            </select>
          </div>

          {error && <div className="mb-3 text-[var(--danger)] text-sm">{error}</div>}

          <div className="max-h-[360px] overflow-auto grid grid-cols-1 md:grid-cols-2 gap-3">
            {loading ? (
              <div className="text-[var(--fg-muted)]">Loading institutions…</div>
            ) : institutions.length === 0 ? (
              <div className="text-[var(--fg-muted)]">No institutions found</div>
            ) : (
              institutions.map((inst) => (
                <button
                  key={inst.id}
                  onClick={() => startFlow(inst)}
                  className="text-left rounded-xl border border-[var(--border)] bg-[var(--bg)] hover:bg-[var(--bg-hover)] p-3"
                >
                  <div className="font-medium">{inst.name}</div>
                  <div className="text-xs text-[var(--fg-subtle)] truncate">{inst.bic || inst.id}</div>
                </button>
              ))
            )}
          </div>

          <div className="mt-4 flex justify-end">
            <Dialog.Close className="rounded-md border border-[var(--border)] px-3 py-1 hover:bg-[var(--bg-hover)]">
              Close
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
