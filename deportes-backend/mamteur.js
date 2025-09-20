require("dotenv").config();
const mongoose = require("mongoose");
const Deportista = require("./models/Deportista");

async function addLevelField() {
  await mongoose.connect(process.env.MONGO_URI);

  const result = await Deportista.updateMany(
    { level: { $exists: false } },
    { $set: { level: "amateur" } }
  );

  console.log(`Documentos actualizados: ${result.modifiedCount}`);

  await mongoose.disconnect();
}

addLevelField().catch((err) => {
  console.error("Error en actualización:", err);
  process.exit(1);
});