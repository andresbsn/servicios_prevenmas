import nodemailer from "nodemailer";

const buildEmailHtml = ({ grouped, today, tomorrow }) => {
  const clients = Object.values(grouped);
  const tomorrowSection = [];

  const sections = clients
    .map(({ cliente, items }) => {
      const rows = items
        .map((item) => {
          if (item.proximo_vencimiento === tomorrow) {
            tomorrowSection.push({ cliente, item });
          }
          return `
            <tr>
              <td>${item.servicio_descripcion}</td>
              <td>${item.fecha_servicio}</td>
              <td>${item.proximo_vencimiento}</td>
              <td>${item.importe}</td>
              <td>${item.observacion || ""}</td>
            </tr>
          `;
        })
        .join("");

      return `
        <h3>${cliente.razon_social}</h3>
        <p>Email: ${cliente.email || "-"} | Tel: ${cliente.telefono || "-"}</p>
        <table border="1" cellpadding="6" cellspacing="0" style="border-collapse: collapse;">
          <thead>
            <tr>
              <th>Servicio</th>
              <th>Fecha servicio</th>
              <th>Próximo vencimiento</th>
              <th>Importe</th>
              <th>Observación</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      `;
    })
    .join("<br/>");

  const tomorrowRows = tomorrowSection
    .map(({ cliente, item }) => {
      return `
        <tr>
          <td>${cliente.razon_social}</td>
          <td>${item.servicio_descripcion}</td>
          <td>${item.proximo_vencimiento}</td>
          <td>${item.importe}</td>
        </tr>
      `;
    })
    .join("");

  const tomorrowBlock = tomorrowRows
    ? `
      <h2>Vencen mañana</h2>
      <table border="1" cellpadding="6" cellspacing="0" style="border-collapse: collapse;">
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Servicio</th>
            <th>Fecha</th>
            <th>Importe</th>
          </tr>
        </thead>
        <tbody>
          ${tomorrowRows}
        </tbody>
      </table>
      <br/>
    `
    : "";

  return `
    <h1>Vencimientos próximos - ${today}</h1>
    ${tomorrowBlock}
    ${sections}
  `;
};

export const sendExpiryEmail = async ({ grouped, today, tomorrow }) => {
  const toList = (process.env.NOTIFY_EMAIL_TO || "").split(",").map((item) => item.trim()).filter(Boolean);
  if (!toList.length) {
    throw new Error("NOTIFY_EMAIL_TO requerido");
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  const html = buildEmailHtml({ grouped, today, tomorrow });

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: toList,
    subject: `Vencimientos próximos - ${today}`,
    html
  });

  if (process.env.SEND_TO_CLIENT === "true") {
    const clientEmails = Object.values(grouped)
      .map(({ cliente }) => cliente.email)
      .filter(Boolean);
    const uniqueEmails = Array.from(new Set(clientEmails));
    if (uniqueEmails.length) {
      await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: uniqueEmails,
        subject: `Vencimientos próximos - ${today}`,
        html
      });
    }
  }
};
