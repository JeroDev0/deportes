require('dotenv').config();
const mongoose = require('mongoose');
const Deportista = require('./models/Deportista');

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Conectado a MongoDB');

    const nuevoDeportista = {
      name: "Diana",
      lastName: "Dessaulles",
      location: "Flensburg",
      age: 23,
      sport: "Bmx",
      photo: "https://res.cloudinary.com/dx9l2xf44/image/upload/v1753157737/20._BMX_Mujer_24_a%C3%B1os_Colombiana_Cat-Elite_Clara_i1ctdo.webp",
      experience: [
        "Gimnasta artística desde los 7 años.",
        "Entrenadora de gimnasia para niños."
      ],
      recognitions: [
        "Premio a la mejor entrenadora 2024."
      ],
      skills: [
        "Flexibilidad",
        "Coordinación",
        "Paciencia",
        "Motivación"
      ],
      certifications: [
        "Certificado de entrenadora de gimnasia"
      ],
      isApproved: false,
      about: "BMX y entrenadora dedicada a la formación de nuevos talentos.",
      city: "Flensburg",
      country: "Alemania",
      gender: "femenino",
      phone: "+491234567895",
      email: "diana.dessaulles@demo.com",
      registrationDate: new Date("2025-06-26T11:40:00.000Z"),
      profileType: "atleta",
      password: "demo1234"
    };

    await Deportista.create(nuevoDeportista);
    console.log('Deportista agregado correctamente!');
    mongoose.disconnect();
  })
  .catch(err => {
    console.error('Error:', err);
    mongoose.disconnect();
  });
