// POST /api/purchase
// Generates a license key and sends it via email using Resend.
// Runs on Cloudflare Workers via TanStack Start server routes.

import { createFileRoute } from "@tanstack/react-router";
import { generateLicenseKey } from "@/lib/license";
import { sendLicenseEmail } from "@/lib/email";

export const Route = createFileRoute("/api/purchase")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json();
          const email = body?.email?.trim()?.toLowerCase();

          if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return Response.json(
              { ok: false, error: "Email inválido" },
              { status: 400 },
            );
          }

          // Generate license
          const licenseKey = generateLicenseKey();

          // Try to send email via Resend
          // The API key comes from environment variable
          const resendApiKey =
            (typeof process !== "undefined"
              ? process.env?.RESEND_API_KEY
              : undefined) || "";

          let emailSent = false;
          let emailError: string | undefined;

          if (resendApiKey) {
            const result = await sendLicenseEmail({
              to: email,
              licenseKey,
              resendApiKey,
            });
            emailSent = result.success;
            emailError = result.error;
          } else {
            emailError =
              "RESEND_API_KEY not configured — email skipped (license still generated)";
          }

          // Create a token that encodes the purchase info for the download page
          const purchaseData = JSON.stringify({
            email,
            licenseKey,
            ts: Date.now(),
          });
          const token = btoa(purchaseData)
            .replace(/\+/g, "-")
            .replace(/\//g, "_")
            .replace(/=/g, "");

          return Response.json({
            ok: true,
            token,
            licenseKey,
            emailSent,
            emailError: emailSent ? undefined : emailError,
          });
        } catch (err) {
          console.error("Purchase API error:", err);
          return Response.json(
            { ok: false, error: "Error interno del servidor" },
            { status: 500 },
          );
        }
      },
    },
  },
});
