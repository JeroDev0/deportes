const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendPasswordResetEmail = async (email, resetToken, userName) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

  await resend.emails.send({
    from: "IBKME Support <support@ibkme.com>",
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
          Si no solicitaste este cambio, puedes ignorar este correo.
        </p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="color: #999; font-size: 12px;">IBKME - support@ibkme.com</p>
      </div>
    `,
  });

  console.log(`✅ Email de recuperación enviado a: ${email}`);
};

module.exports = { sendPasswordResetEmail };