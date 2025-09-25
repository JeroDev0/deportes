// add-new-fields.js - Script para agregar campos faltantes a deportistas existentes
const mongoose = require('mongoose');
require('dotenv').config();

// Usar la misma connection string que tu aplicación
const MONGODB_URI = process.env.MONGO_URI 
  || process.env.MONGODB_URI 
  || process.env.DATABASE_URL 
  || 'mongodb+srv://jerodev0:PPmdkwnBPBv410lP@clustersport.tvaz69w.mongodb.net/deportes?retryWrites=true&w=majority&appName=ClusterSport';

async function run() {
  await mongoose.connect(MONGODB_URI);
  console.log("✅ Conectado a MongoDB");

  const DeportistaSchema = new mongoose.Schema({}, { strict: false, collection: "deportistas" });
  const Deportista = mongoose.model("Deportista", DeportistaSchema);

  const docs = await Deportista.find({
    $or: [
      { postalCode: { $type: "object" } },
      { address: { $type: "object" } }
    ]
  });

  console.log(`Encontrados ${docs.length} con postalCode/address como objetos`);

  for (let doc of docs) {
    const update = {};
    if (typeof doc.postalCode === "object" && doc.postalCode !== null) {
      update.postalCode = JSON.stringify(doc.postalCode);
    }
    if (typeof doc.address === "object" && doc.address !== null) {
      update.address = JSON.stringify(doc.address);
    }
    await Deportista.updateOne({ _id: doc._id }, { $set: update });
    console.log(`✔️ Arreglado ${doc._id}`);
  }

  console.log("🏁 Migración terminada");
  await mongoose.disconnect();
}
run().catch(console.error);