// fix-experience-corruption.js
// Corrige el bug donde experience/recognitions tienen strings guardados como objetos {0:"E",1:"m",...}
const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGO_URI
  || process.env.MONGODB_URI
  || process.env.DATABASE_URL
  || 'mongodb+srv://jerodev0:PPmdkwnBPBv410lP@clustersport.tvaz69w.mongodb.net/deportes?retryWrites=true&w=majority&appName=ClusterSport';

// Detecta si un elemento es un objeto corrupto (tiene claves numéricas en vez de description)
function isCorrupted(item) {
  if (!item || typeof item !== 'object') return false;
  return Object.keys(item).some(k => /^\d+$/.test(k));
}

// Reconstruye el string desde las claves numéricas
function reconstruct(item) {
  const keys = Object.keys(item).filter(k => /^\d+$/.test(k)).sort((a, b) => Number(a) - Number(b));
  if (keys.length === 0) return null;
  const text = keys.map(k => item[k]).join('');
  return {
    description: text,
    startYear: item.startYear || '',
    endYear: item.endYear || '',
  };
}

async function fixCollection(collection, fieldNames) {
  const docs = await collection.find({}).toArray();
  let fixed = 0;

  for (const doc of docs) {
    let changed = false;
    const update = {};

    for (const field of fieldNames) {
      if (!Array.isArray(doc[field])) continue;

      const corrected = doc[field].map(item => {
        if (typeof item === 'string') {
          return { description: item, startYear: '', endYear: '' };
        }
        if (isCorrupted(item)) {
          const result = reconstruct(item);
          return result || { description: '', startYear: '', endYear: '' };
        }
        return item;
      }).filter(item => item && (item.description || item.startYear || item.endYear));

      const original = JSON.stringify(doc[field]);
      const correctedStr = JSON.stringify(corrected);
      if (original !== correctedStr) {
        update[field] = corrected;
        changed = true;
      }
    }

    if (changed) {
      await collection.updateOne({ _id: doc._id }, { $set: update });
      console.log(`  ✅ Corregido: ${doc.name || doc.company || doc._id}`);
      fixed++;
    }
  }
  return fixed;
}

async function run() {
  await mongoose.connect(MONGODB_URI);
  console.log('✅ Conectado a MongoDB\n');

  const db = mongoose.connection.db;

  console.log('🔧 Corrigiendo deportistas...');
  const dep = await fixCollection(db.collection('deportistas'), ['experience', 'recognitions']);
  console.log(`   → ${dep} deportistas corregidos\n`);

  console.log('🔧 Corrigiendo scouts...');
  const sc = await fixCollection(db.collection('scouts'), ['experience', 'recognitions']);
  console.log(`   → ${sc} scouts corregidos\n`);

  console.log('✅ Migración completada.');
  await mongoose.disconnect();
}

run().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
