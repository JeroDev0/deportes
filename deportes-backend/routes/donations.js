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
    const { athleteId, category, amount, donorName, donorEmail } = req.body;

    if (!athleteId || !category || !amount) {
      return res.status(400).json({ error: "athleteId, category y amount son requeridos" });
    }
    if (!VALID_CATEGORIES.includes(category)) {
      return res.status(400).json({ error: "Categoría no válida" });
    }
    const numericAmount = Number(amount);
    if (!numericAmount || numericAmount < 1) {
      return res.status(400).json({ error: "El monto debe ser al menos 1" });
    }

    const athlete = await Deportista.findById(athleteId).select("name lastName");
    if (!athlete) return res.status(404).json({ error: "Deportista no encontrado" });

    const frontendUrl = process.env.FRONTEND_URL || "https://deportes-directory.netlify.app";
    const athleteName = `${athlete.name} ${athlete.lastName || ""}`.trim();

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: donorEmail || undefined,
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: `Donación · ${CATEGORY_LABELS[category]} · ${athleteName}`,
              description: "BKME Sports compra lo necesario y se lo entrega directamente al deportista.",
            },
            unit_amount: Math.round(numericAmount * 100),
          },
          quantity: 1,
        },
      ],
      metadata: {
        athleteId: String(athleteId),
        category,
        donorName: donorName || "",
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
    const { athleteId, category, donorName } = session.metadata || {};
    const amount = (session.amount_total || 0) / 100;

    try {
      if (athleteId && category && VALID_CATEGORIES.includes(category)) {
        await Deportista.findByIdAndUpdate(athleteId, {
          $inc: { [`needs.${category}.raisedAmount`]: amount },
        });

        await Donation.create({
          athlete: athleteId,
          category,
          amount,
          currency: session.currency || "eur",
          donorName: donorName || "",
          donorEmail: session.customer_details?.email || "",
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
