import nodemailer from "nodemailer";
import config from "../config/config.js";
import __dirname from "../utils.js";
import dotenv from "dotenv";
dotenv.config({ quiet: true });

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

transporter.verify(function (error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log("Server is ready to take messages");
  }
});

const mailOptions = {
  from: "Servidor Node.js -" + process.env.GMAIL_USER,
  to: process.env.GMAIL_USER,
  subject: "Enviando correo desde Node.js",
  html: `
    <div style="text-align: center;">
        <h1>Hola Mundo</h1>
        <p>Este es un correo de prueba enviado desde Node.js usando Nodemailer y Gmail</p>
    </div>
`,
  attachments: [],
};

export const sendEmail = (req, res) => {
  try {
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log(err);
        res.status(401).send({
          error: err,
          message: "No se pudo enviar el email desde:" + process.env.GMAIL_USER,
        });
      }

      console.log("Email sent: " + info.messageId);
      res.send({ message: "Email enviado correctamente", payload: info });
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      error: error,
      message: "No se pudo enviar el email desde:" + process.env.GMAIL_USER,
    });
  }
};

const mailOptionsWithAttachments = {
  from: "Servidor Node.js -" + process.env.GMAIL_USER,
  to: process.env.GMAIL_USER,
  subject: "Enviando correo desde Node.js con adjuntos",
  html: `
    <div style="text-align: center;">
        <h1>Esto es un Test de envio de correos con Nodemailer!</h1>
        <p>Ahora usando imagenes: </p>
        <img src="cid:imagen1"/>
    </div>
`,
  attachments: [
    {
      filename: "imagen1.png",
      path: __dirname + "/public/img/r34.jpg",
      cid: "imagen1",
    },
  ],
};

export const sendEmailWithAttachments = (req, res) => {
  try {
    transporter.sendMail(mailOptionsWithAttachments, (err, info) => {
      if (err) {
        console.log(err);
        res.status(500).send({
          error: err,
          message: "No se pudo enviar el email desde:" + config.gmailAccount,
        });
      }

      console.log("Email sent: " + info.messageId);
      res.send({ message: "Email enviado correctamente", payload: info });
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      error: error,
      message: "No se pudo enviar el email desde:" + config.gmailAccount,
    });
  }
};

export const sendTicketEmail = async (userEmail, ticket) => {
  const productosHTML = ticket.products
    .map((p) => `<li>${p.title} x${p.quantity} - $${p.price}</li>`)
    .join("");

  const mailOptions = {
    from: "Servidor Node.js -" + process.env.GMAIL_USER,
    to: userEmail,
    subject: `Ticket de compra #${ticket.id}`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 10px;">
        <h2>Gracias por tu compra</h2>
        <p><b>ID Ticket:</b> ${ticket.id}</p>
        <p><b>Fecha:</b> ${ticket.purchase_datetime}</p>
        <p><b>Total:</b> $${ticket.amount}</p>
        <h3>Productos:</h3>
        <ul>${productosHTML}</ul>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Ticket enviado: " + info.messageId);
    return info;
  } catch (error) {
    console.error("Error al enviar ticket:", error);
    throw error;
  }
};
