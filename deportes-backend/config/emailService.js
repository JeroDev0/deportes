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

const sendWelcomeEmail = async (email, userName, profileType) => {
  const profileLabels = {
    atleta: "Athlete",
    scout: "Scout",
    sponsor: "Sponsor",
    club: "Club",
  };
  const label = profileLabels[profileType] || "Member";
  const dashboardUrl = `${process.env.FRONTEND_URL}/dashboard`;

  await resend.emails.send({
    from: "IBKME <support@ibkme.com>",
    to: email,
    subject: "Welcome to IBKME — Your account is ready!",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #07111c; color: #c0d4e8; border-radius: 12px; overflow: hidden;">

        <!-- Header -->
        <div style="background: #0d1f33; padding: 32px 40px; text-align: center; border-bottom: 3px solid #53fb52;">
          <h1 style="margin: 0; font-size: 28px; font-weight: 900; color: #ffffff; letter-spacing: 2px;">IBKME</h1>
          <p style="margin: 6px 0 0; color: #53fb52; font-size: 12px; letter-spacing: 3px; text-transform: uppercase;">Sport Talent Network</p>
        </div>

        <!-- Body -->
        <div style="padding: 40px;">
          <h2 style="margin: 0 0 16px; color: #53fb52; font-size: 22px; font-weight: 900; text-transform: uppercase; letter-spacing: 1px;">
            Welcome, ${userName || ""}!
          </h2>
          <p style="margin: 0 0 12px; color: #c0d4e8; line-height: 1.7;">
            Your <strong style="color: #53fb52;">${label}</strong> account has been successfully created on IBKME.
          </p>
          <p style="margin: 0 0 28px; color: #8aaccc; font-size: 14px; line-height: 1.7;">
            You can now explore the platform, complete your profile, and connect with athletes, scouts, and sponsors from around the world.
          </p>

          <!-- CTA -->
          <div style="text-align: center; margin: 32px 0;">
            <a href="${dashboardUrl}"
               style="background: #53fb52; color: #07111c; padding: 14px 36px;
                      text-decoration: none; border-radius: 30px; font-size: 14px;
                      font-weight: 900; letter-spacing: 2px; text-transform: uppercase;">
              Go to Dashboard
            </a>
          </div>

          <p style="margin: 28px 0 0; color: #4a6a8a; font-size: 13px; line-height: 1.6;">
            If you didn't create this account, please contact us immediately at
            <a href="mailto:support@ibkme.com" style="color: #53fb52;">support@ibkme.com</a>.
          </p>
        </div>

        <!-- Footer -->
        <div style="background: #0d1f33; padding: 20px 40px; text-align: center; border-top: 1px solid #1a2e45;">
          <p style="margin: 0; color: #4a6a8a; font-size: 12px; letter-spacing: 1px;">
            IBKME — support@ibkme.com
          </p>
        </div>

      </div>
    `,
  });

  console.log(`✅ Email de bienvenida enviado a: ${email}`);
};

module.exports = { sendPasswordResetEmail, sendWelcomeEmail };