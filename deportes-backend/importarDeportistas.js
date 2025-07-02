require('dotenv').config();
const mongoose = require('mongoose');
const Deportista = require('./models/Deportista');
const fs = require('fs');

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Conectado a MongoDB');

    // Lee el archivo JSON
    const data = JSON.parse(fs.readFileSync('deportistasdemo.json', 'utf-8'));

    // Limpia la colección antes de importar (opcional)
    await Deportista.deleteMany({});

    // Inserta los datos
    await Deportista.insertMany(data);

    console.log('Deportistas importados correctamente!');
    mongoose.disconnect();
  })
  .catch(err => {
    console.error('Error:', err);
    mongoose.disconnect();
  });