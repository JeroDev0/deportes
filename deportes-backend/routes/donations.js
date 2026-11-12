const express = require("express");
const router = express.Router();
const Stripe = require("stripe");
const auth = require("../middleware/auth");
const Deportista = require("../models/Deportista");
const Donation = require("../models/Donation");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const VALID_CATEGORIES = ["nutrition", "equipment", "methodology"];
const CATEGORY_LABELS = {
  nutrition: "Nutrición",
  equipment: "Equipamiento",
  methodology: "Metodologías",
};

// Niveles de patrocinio fijos para toda la plataforma (no editables por el deportista)
const SPONSOR_TIERS = {
  social_media: { field: "socialMedia", amount: 50, totalSlots: 8, label: "Placement en Redes Sociales" },
  jersey: { field: "jersey", amount: 200, totalSlots: 3, label: "Placement en Camiseta" },
};

// ==================== ACTUALIZAR METAS DE NECESIDADES (solo el propio deportista) ====================
router.put("/needs/:id", auth, async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      return res.status(403).json({ error: "No autorizado para editar este perfil" });
    }

    const { category, description, goalAmount } = req.body;
    if (!VALID_CATEGORIES.includes(category)) {
      return res.status(400).json({ error: "Categoría no válida" });
    }

    const update = {};
    if (description !== undefined) update[`needs.${category}.description`] = String(description).slice(0, 300);
    if (goalAmount !== undefined) {
      const numeric = Math.max(0, Number(goalAmount) || 0);
      update[`needs.${category}.goalAmount`] = numeric;
    }

    const athlete = await Deportista.findByIdAndUpdate(
      req.params.id,
      { $set: update },
      { new: true, runValidators: true }
    ).select("needs");

    if (!athlete) return res.status(404).json({ error: "Deportista no encontrado" });

    res.json(athlete.needs);
  } catch (err) {
    console.error("❌ Error actualizando necesidades:", err);
    res.status(500).json({ error: "Error al actualizar necesidades" });
  }
});

// ==================== CREAR SESIÓN DE PAGO (Stripe Checkout) ====================
router.post("/checkout-session", async (req, res) => {
  try {
    const { athleteId, donationType, category, tier, amount, donorName, donorEmail } = req.body;
    const type = donationType === "sponsor" ? "sponsor" : "need";

    if (!athleteId) {
      return res.status(400).json({ error: "athleteId es requerido" });
    }

    const athlete = await Deportista.findById(athleteId).select("name lastName sponsorSlots");
    if (!athlete) return res.status(404).json({ error: "Deportista no encontrado" });

    const athleteName = `${athlete.name} ${athlete.lastName || ""}`.trim();
    let productName, productDescription, unitAmountCents, metadataExtra;

    if (type === "need") {
      if (!category || !VALID_CATEGORIES.includes(category)) {
        return res.status(400).json({ error: "Categoría no válida" });
      }
      const numericAmount = Number(amount);
      if (!numericAmount || numericAmount < 1) {
        return res.status(400).json({ error: "El monto debe ser al menos 1" });
      }
      productName = `Donación · ${CATEGORY_LABELS[category]} · ${athleteName}`;
      productDescription = "BKME Sports compra lo necesario y se lo entrega directamente al deportista.";
      unitAmountCents = Math.round(numericAmount * 100);
      metadataExtra = { category };
    } else {
      if (!tier || !["open", "social_media", "jersey"].includes(tier)) {
        return res.status(400).json({ error: "Nivel de patrocinio no válido" });
      }

      if (tier === "open") {
        const numericAmount = Number(amount);
        if (!numericAmount || numericAmount < 1) {
          return res.status(400).json({ error: "El monto debe ser al menos 1" });
        }
        productName = `Sponsor sin retorno · ${athleteName}`;
        unitAmountCents = Math.round(numericAmount * 100);
      } else {
        const tierConfig = SPONSOR_TIERS[tier];
        const taken = athlete.sponsorSlots?.[tierConfig.field]?.taken || 0;
        if (taken >= tierConfig.totalSlots) {
          return res.status(400).json({ error: "Este nivel de patrocinio ya no tiene cupos disponibles" });
        }
        productName = `${tierConfig.label} · ${athleteName}`;
        unitAmountCents = tierConfig.amount * 100;
      }
      productDescription = "Patrocinio directo al deportista a través de BKME Sports.";
      metadataExtra = { tier };
    }

    const frontendUrl = process.env.FRONTEND_URL || "https://deportes-directory.netlify.app";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: donorEmail || undefined,
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: { name: productName, description: productDescription },
            unit_amount: unitAmountCents,
          },
          quantity: 1,
        },
      ],
      metadata: {
        athleteId: String(athleteId),
        donationType: type,
        donorName: donorName || "",
        ...metadataExtra,
      },
      success_url: `${frontendUrl}/profile/${athleteId}?donation=success`,
      cancel_url: `${frontendUrl}/profile/${athleteId}?donation=cancelled`,
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("❌ Error creando sesión de donación:", err);
    res.status(500).json({ error: "Error al crear la sesión de pago", details: err.message });
  }
});

// ==================== WEBHOOK DE STRIPE ====================
// NOTA: necesita el body crudo (raw). El middleware correspondiente se registra en app.js
// antes de express.json(), exclusivamente para esta ruta.
router.post("/webhook", async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("❌ Firma de webhook inválida:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const { athleteId, donationType, category, tier, donorName } = session.metadata || {};
    const amount = (session.amount_total || 0) / 100;
    const donorEmail = session.customer_details?.email || "";

    try {
      if (!athleteId) return res.json({ received: true });

      if (donationType === "sponsor") {
        let donationCategory = "sponsor_open";

        if (tier === "social_media" || tier === "jersey") {
          const tierConfig = SPONSOR_TIERS[tier];
          donationCategory = tier === "social_media" ? "sponsor_social_media" : "sponsor_jersey";
          await Deportista.findOneAndUpdate(
            { _id: athleteId, [`sponsorSlots.${tierConfig.field}.taken`]: { $lt: tierConfig.totalSlots } },
            { $inc: { [`sponsorSlots.${tierConfig.field}.taken`]: 1 } }
          );
        }

        await Donation.create({
          athlete: athleteId,
          category: donationCategory,
          amount,
          currency: session.currency || "eur",
          donorName: donorName || "",
          donorEmail,
          stripeSessionId: session.id,
          status: "completed",
        });

        console.log(`✅ Patrocinio registrado: ${amount}€ (${tier || "open"}) para deportista ${athleteId}`);
      } else if (category && VALID_CATEGORIES.includes(category)) {
        await Deportista.findByIdAndUpdate(athleteId, {
          $inc: { [`needs.${category}.raisedAmount`]: amount },
        });

        await Donation.create({
          athlete: athleteId,
          category,
          amount,
          currency: session.currency || "eur",
          donorName: donorName || "",
          donorEmail,
          stripeSessionId: session.id,
          status: "completed",
        });

        console.log(`✅ Donación registrada: ${amount}€ (${category}) para deportista ${athleteId}`);
      }
    } catch (err) {
      console.error("❌ Error procesando donación confirmada:", err);
    }
  }

  res.json({ received: true });
});

module.exports = router;
