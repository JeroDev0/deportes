const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT),
  secure: process.env.EMAIL_SECURE === "true",
  requireTLS: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Verificar conexión al iniciar
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Error al conectar con el servidor de email:", error);
  } else {
    console.log("✅ Servidor de email listo para enviar correos");
  }
});

const sendPasswordResetEmail = async (email, resetToken, userName) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

  const mailOptions = {
    from: `"IBKME Support" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Recuperación de contraseña - IBKME",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333;">Recuperación de contraseña</h2>
        <p>Hola ${userName || ""},</p>
        <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta.</p>
        <p>Haz clic en el siguiente botón para crear una nueva contraseña:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" 
             style="background-color: #4CAF50; color: white; padding: 14px 28px; 
                    text-decoration: none; border-radius: 5px; font-size: 16px;">
            Restablecer contraseña
          </a>
        </div>
        <p style="color: #666; font-size: 14px;">
          Este enlace expirará en <strong>1 hora</strong>.
        </p>
        <p style="color: #666; font-size: 14px;">
          Si no solicitaste este cambio, puedes ignorar este correo. Tu contraseña no cambiará.
        </p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="color: #999; font-size: 12px;">IBKME - support@ibkme.com</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendPasswordResetEmail };