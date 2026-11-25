export const ACCOUNT_TOKEN_MINUTES = { verify: 1440, reset: 30 };

const messages = {
  verify: {
    subject: "Confirme seu e-mail no Wisen",
    title: "Confirme seu e-mail",
    description: "Confirme este endereço para concluir a verificação da sua conta no Wisen.",
    action: "Confirmar e-mail",
    validity: `${ACCOUNT_TOKEN_MINUTES.verify / 60} horas`,
  },
  reset: {
    subject: "Redefina sua senha do Wisen",
    title: "Redefina sua senha",
    description: "Recebemos um pedido para redefinir a senha da sua conta no Wisen.",
    action: "Redefinir senha",
    validity: `${ACCOUNT_TOKEN_MINUTES.reset} minutos`,
  },
};

const colors = {
  navy: "#101a40",
  gold: "#d7bf4d",
  accent: "#f3e69a",
  background: "#f0f4f9",
  border: "#dce3ed",
  text: "#253452",
  muted: "#526584",
};

const escapeHtml = (value) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

export function accountMail(purpose, link) {
  const { subject, title, description, action, validity } = messages[purpose];
  const expiration = `Este link é válido por ${validity}.`;
  const ignore = "Se você não fez esta solicitação, pode ignorar este e-mail.";
  const text = `Wisen\n\n${title}\n\n${description}\n\n${action}: ${link.href}\n\n${expiration} ${ignore}`;
  const href = escapeHtml(link.href);
  const zuzu = escapeHtml(new URL("/tour-cliente/boas-vindas.png", link).href);

  const html = `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title} | Wisen</title>
</head>
<body style="margin:0;padding:0;background-color:${colors.background};font-family:Arial,Helvetica,sans-serif;color:${colors.text};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${colors.background};">
    <tr>
      <td align="center" style="padding:28px 12px;">
        <!--[if mso]><table role="presentation" width="560" align="center" cellpadding="0" cellspacing="0"><tr><td><![endif]-->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">
          <tr>
            <td bgcolor="${colors.navy}" style="padding:12px 24px;border-top:4px solid ${colors.gold};border-radius:16px 16px 0 0;background-color:${colors.navy};">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="color:${colors.accent};font-size:28px;line-height:36px;font-weight:700;">Wisen</td>
                  <td align="right" width="72" style="height:72px;">
                    <img src="${zuzu}" alt="" width="72" height="72" style="display:block;border:0;">
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td bgcolor="#ffffff" style="padding:28px 24px;border:1px solid ${colors.border};border-top:0;border-radius:0 0 16px 16px;background-color:#ffffff;">
              <h1 style="margin:0 0 12px;color:${colors.navy};font-size:28px;line-height:34px;">${title}</h1>
              <p style="margin:0 0 22px;font-size:16px;line-height:25px;">${description}</p>
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td bgcolor="${colors.accent}" style="border-radius:10px;background-color:${colors.accent};">
                    <a href="${href}" style="display:inline-block;border:12px solid ${colors.accent};border-right-width:20px;border-left-width:20px;border-radius:10px;color:${colors.navy};font-size:16px;line-height:22px;font-weight:700;text-decoration:none;">${action}</a>
                  </td>
                </tr>
              </table>
              <p style="margin:12px 0 0;color:${colors.muted};font-size:14px;line-height:22px;">${expiration}</p>
              <p style="margin:24px 0 0;padding-top:20px;border-top:1px solid ${colors.border};color:${colors.muted};font-size:14px;line-height:22px;">
                Se o botão não funcionar, copie e cole este endereço no navegador.<br>
                <a href="${href}" style="color:${colors.navy};text-decoration:underline;word-break:break-all;overflow-wrap:anywhere;">${href}</a>
              </p>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:16px 12px 0;color:${colors.muted};font-size:13px;line-height:20px;">${ignore}</td>
          </tr>
        </table>
        <!--[if mso]></td></tr></table><![endif]-->
      </td>
    </tr>
  </table>
</body>
</html>`;

  return { subject, text, html };
}
