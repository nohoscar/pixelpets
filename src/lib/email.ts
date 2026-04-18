// Email sending via Resend API
// Docs: https://resend.com/docs/api-reference/emails/send-email
// Free tier: 100 emails/day, 3000/month

const RESEND_API = "https://api.resend.com/emails";

interface SendEmailParams {
  to: string;
  licenseKey: string;
  resendApiKey: string;
  fromEmail?: string;
}

export async function sendLicenseEmail({
  to,
  licenseKey,
  resendApiKey,
  fromEmail = "PixelPets <onboarding@resend.dev>",
}: SendEmailParams): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch(RESEND_API, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [to],
        subject: "🐾 Tu licencia de PixelPets Desktop",
        html: buildEmailHtml(licenseKey, to),
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      return { success: false, error: `Resend API error ${res.status}: ${body}` };
    }

    return { success: true };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

function buildEmailHtml(licenseKey: string, email: string): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/></head>
<body style="margin:0;padding:0;background:#0a0a14;color:#f0f0ff;font-family:'Space Grotesk',system-ui,sans-serif;">
  <div style="max-width:520px;margin:0 auto;padding:40px 24px;">
    <div style="text-align:center;margin-bottom:32px;">
      <span style="font-size:48px;">🐾</span>
      <h1 style="font-size:24px;color:#7af5b0;margin:12px 0 4px;">¡Gracias por comprar PixelPets!</h1>
      <p style="font-size:13px;color:#888;margin:0;">Tu mascotita te espera</p>
    </div>

    <div style="background:#1a1a2e;border:1px solid rgba(122,245,176,0.3);border-radius:12px;padding:24px;margin-bottom:24px;">
      <p style="font-size:11px;color:#ff7aa8;margin:0 0 8px;font-weight:bold;letter-spacing:0.05em;">TU CLAVE DE LICENCIA</p>
      <div style="background:#0d0d1a;border:1px solid rgba(122,245,176,0.2);border-radius:8px;padding:16px;text-align:center;">
        <code style="font-size:20px;color:#ff7aa8;letter-spacing:0.1em;font-weight:bold;">${licenseKey}</code>
      </div>
      <p style="font-size:11px;color:#666;margin:12px 0 0;">Guarda este código. Lo necesitas para activar la app.</p>
    </div>

    <div style="background:#1a1a2e;border:1px solid rgba(122,245,176,0.15);border-radius:12px;padding:24px;margin-bottom:24px;">
      <p style="font-size:11px;color:#7af5b0;margin:0 0 12px;font-weight:bold;letter-spacing:0.05em;">DESCARGAS</p>
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);">
            <span style="font-size:18px;">🪟</span>
            <span style="color:#f0f0ff;font-size:13px;margin-left:8px;">Windows x64</span>
          </td>
          <td style="text-align:right;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);">
            <span style="color:#888;font-size:11px;">.zip ~85MB</span>
          </td>
        </tr>
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);">
            <span style="font-size:18px;">🍎</span>
            <span style="color:#f0f0ff;font-size:13px;margin-left:8px;">macOS x64</span>
          </td>
          <td style="text-align:right;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);">
            <span style="color:#888;font-size:11px;">.zip ~80MB</span>
          </td>
        </tr>
        <tr>
          <td style="padding:8px 0;">
            <span style="font-size:18px;">🐧</span>
            <span style="color:#f0f0ff;font-size:13px;margin-left:8px;">Linux x64</span>
          </td>
          <td style="text-align:right;padding:8px 0;">
            <span style="color:#888;font-size:11px;">.tar.gz ~85MB</span>
          </td>
        </tr>
      </table>
      <p style="font-size:11px;color:#666;margin:12px 0 0;">Los links de descarga están en tu página de confirmación.</p>
    </div>

    <div style="background:#1a1a2e;border:1px solid rgba(122,245,176,0.15);border-radius:12px;padding:24px;margin-bottom:24px;">
      <p style="font-size:11px;color:#7af5b0;margin:0 0 12px;font-weight:bold;">CÓMO ACTIVAR</p>
      <ol style="margin:0;padding-left:20px;color:#ccc;font-size:12px;line-height:1.8;">
        <li>Descarga e instala PixelPets para tu sistema</li>
        <li>Abre la app y pega tu clave de licencia</li>
        <li>¡Tu mascotita aparecerá en tu escritorio!</li>
      </ol>
    </div>

    <div style="text-align:center;padding-top:16px;border-top:1px solid rgba(255,255,255,0.05);">
      <p style="font-size:11px;color:#666;margin:0;">
        Email registrado: ${email}<br/>
        ¿Problemas? → <span style="color:#7af5b0;">hello@pixelpets.app</span>
      </p>
      <p style="font-size:10px;color:#444;margin:12px 0 0;">
        © PixelPets · Pago único · Sin suscripciones · Updates de por vida
      </p>
    </div>
  </div>
</body>
</html>`;
}
