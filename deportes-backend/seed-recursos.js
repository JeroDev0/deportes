require("dotenv").config();
const mongoose = require("mongoose");
const Recurso = require("./models/Recurso");

const recursos = [
  {
    titulo: "Box Breathing: La técnica de respiración de los Navy SEALs para el control del estrés",
    categoria: "respiracion_foco",
    descripcionBreve:
      "Aprende la técnica de respiración en caja usada por fuerzas especiales y atletas de élite para reducir el estrés y recuperar el foco en menos de 3 minutos antes de competir.",
    contenido: `¿Qué es el Box Breathing?

El Box Breathing (respiración en caja o respiración 4-4-4-4) es una técnica de control respiratorio utilizada por los Navy SEALs, cirujanos de trauma y atletas olímpicos para regular el sistema nervioso autónomo bajo presión extrema. Su nombre viene de la forma de un cuadrado: cuatro lados, cuatro tiempos iguales.

Cuando estás nervioso antes de una competencia, tu cuerpo activa el sistema nervioso simpático (modo "lucha o huida"): corazón acelerado, músculos tensos, pensamientos dispersos. El Box Breathing activa el sistema nervioso parasimpático (modo "calma y enfoque") en cuestión de minutos.

¿Cómo se hace?

1. Siéntate o mantente de pie con la espalda recta. Cierra los ojos si puedes.
2. EXHALA completamente por la boca, vaciando los pulmones.
3. INHALA por la nariz contando lentamente hasta 4.
4. AGUANTA el aire contando hasta 4 (no te tenses, solo sostén).
5. EXHALA por la boca contando hasta 4, vaciando completamente.
6. AGUANTA sin aire contando hasta 4.
7. Repite el ciclo entre 4 y 6 veces.

El ciclo completo dura aproximadamente 1 minuto. Con 3-4 ciclos (3-4 minutos) el efecto es notable.

¿Cuándo usarla?

→ 5-10 minutos antes de una competencia o partido importante
→ En el vestuario cuando sientes que los nervios te superan
→ En un tiempo muerto o pausa del juego
→ Antes de dormir si el estrés del entrenamiento te mantiene despierto
→ Después de una derrota o error importante para recuperar la calma

¿Qué pasa en tu cuerpo?

Cuando alargas la exhalación y controlas el ritmo respiratorio, estimulas el nervio vago, que es el "freno" del sistema nervioso. Esto reduce el cortisol (hormona del estrés), baja la frecuencia cardíaca y mejora la oxigenación del cerebro. El resultado es un estado de alerta tranquila: concentrado pero relajado.

Evidencia científica

Estudios publicados en el Journal of Clinical Psychology y la revista Frontiers in Human Neuroscience demuestran que la respiración diafragmática controlada reduce los marcadores de estrés en un 44% en sesiones de 5 minutos. El Dr. Andrew Huberman (Stanford University) la menciona como una de las herramientas más eficaces para el control del estado mental sin necesidad de equipamiento ni tiempo extra.

Consejo para deportistas

Practica esta técnica ANTES de necesitarla. Si la entrenas en momentos tranquilos (antes de dormir, en el vestuario tras el entrenamiento), tu sistema nervioso aprende el patrón y lo ejecuta más rápido cuando hay presión real. Como cualquier habilidad técnica, la respiración controlada se entrena.`,
    tipo: "ejercicio",
    tiempoEstimado: "5 Min",
    intensidad: "bajo",
    triggerCondiciones: ["estres_alto", "motivacion_baja"],
    activo: true,
  },
  {
    titulo: "Ritmo Circadiano y Rendimiento Deportivo: Cómo el sueño decide si ganas o pierdes",
    categoria: "optimizacion_sueno",
    descripcionBreve:
      "Tu reloj biológico interno controla fuerza muscular, tiempo de reacción y recuperación. Aprende cómo sincronizarlo para rendir al máximo y recuperarte más rápido.",
    contenido: `El sueño no es un lujo, es entrenamiento

Cuando duermes mal, no solo te sientes cansado: tu fuerza muscular cae hasta un 10%, tu tiempo de reacción se alarga, tu sistema inmune se debilita y el riesgo de lesiones aumenta un 60%. Esto no es una estimación: está documentado en estudios con atletas universitarios y profesionales.

El ritmo circadiano es el reloj biológico de 24 horas que regula cuándo tu cuerpo libera hormonas, cuándo repara tejido muscular y cuándo procesa la memoria motriz. Sincronizarlo con tus horarios de entrenamiento y competencia es tan importante como la dieta o el programa de fuerza.

¿Qué le pasa a tu cuerpo mientras duermes?

• Sueño profundo (fases 3-4): Liberas hormona de crecimiento (HGH), que repara fibras musculares dañadas por el entrenamiento. Sin sueño profundo, no hay recuperación muscular real.
• Sueño REM: Consolidas la memoria motriz. Los movimientos técnicos que practicaste se automatizan durante el REM. Cortar el sueño reduce esta consolidación.
• En total, 7-9 horas es el rango óptimo para deportistas. Por debajo de 6 horas consecutivas, el rendimiento cae de forma medible.

Protocolo de optimización del sueño para deportistas

1. Mantén un horario fijo. Acuéstate y levántate a la misma hora todos los días, incluso fines de semana. Tu reloj circadiano responde a la consistencia, no a "recuperar horas perdidas" el domingo.

2. Luz solar por la mañana. Los primeros 30 minutos después de despertarte, exponte a luz natural (sin gafas de sol). Esto reinicia el reloj biológico y mejora la calidad del sueño esa noche.

3. Corta la luz azul 1 hora antes. Las pantallas (móvil, TV, tablet) emiten luz azul que suprime la melatonina. Pon el modo nocturno o usa gafas de bloqueo azul desde 1 hora antes de acostarte.

4. Temperatura de la habitación: 18-20°C. La caída de temperatura corporal es la señal que usa el cerebro para entrar en sueño profundo. Una habitación fría ayuda a ese proceso.

5. Cena ligera 2-3 horas antes. Digerir una comida pesada eleva la temperatura interna y fragmenta el sueño.

6. Evita el alcohol. Aunque parece que "ayuda a dormir", el alcohol suprime el sueño REM, que es donde ocurre la recuperación técnica y neurológica.

El problema de los viajes y el jet lag

Los deportistas que viajan frecuentemente entre zonas horarias deben re-sincronizar su reloj circadiano. La regla general es 1 día de adaptación por cada hora de diferencia horaria. Para minimizarlo:
→ Ajusta tu horario de sueño 2-3 días antes del viaje
→ A la llegada, exponte a luz natural según la hora local, no tu zona de origen
→ Evita las siestas largas (más de 20 minutos) el primer día

¿Cuánto importa realmente?

Un estudio de la Universidad de Stanford con el equipo de baloncesto midió el rendimiento antes y después de extender el sueño a 10 horas durante 5 a 7 semanas. Resultado: la velocidad de sprint mejoró un 5%, el porcentaje de tiros libres aumentó un 9% y el tiempo de reacción mejoró notablemente. Sin cambios en el programa de entrenamiento. Solo más sueño.`,
    tipo: "articulo",
    tiempoEstimado: "8 Min",
    intensidad: "bajo",
    triggerCondiciones: ["sueno_malo"],
    activo: true,
  },
  {
    titulo: "Reframing: Cómo transformar una derrota en información útil",
    categoria: "fortaleza_mental",
    descripcionBreve:
      "La reestructuración cognitiva es la técnica psicológica más validada para manejar el fracaso, la presión y las rachas negativas. Aprende a usarla en 3 pasos concretos.",
    contenido: `¿Qué es el Reframing?

El reframing (reestructuración cognitiva) es una técnica de la Terapia Cognitivo-Conductual (TCC) que consiste en identificar un pensamiento automático negativo y reemplazarlo por una interpretación más precisa, útil y orientada al aprendizaje. No se trata de pensar positivo de forma irreal. Se trata de pensar con más precisión.

Un ejemplo directo:

→ Pensamiento automático: "Fallé el penalti más importante del partido. Soy un fracasado."
→ Reframing: "Fallé un penalti en una situación de alta presión. Eso me da información sobre mi rutina previa al disparo. Voy a trabajar eso en entrenamiento."

El primer pensamiento te paraliza. El segundo te da dirección.

¿Por qué funciona?

Nuestro cerebro, bajo estrés, tiende a sobregeneralizar: un error se convierte en "siempre fallo", una derrota en "no sirvo para esto". Este patrón se llama distorsión cognitiva y es automático, no es una señal de debilidad. El reframing interrumpe ese ciclo antes de que se instale.

Los 3 pasos del Reframing para deportistas

PASO 1: Identifica el pensamiento exacto
No digas "me sentí mal". Escribe o di en voz alta el pensamiento específico:
"No debería haber jugado. Soy el peor del equipo."
"Nunca voy a mejorar en este movimiento."
"Con este nivel nunca voy a tener patrocinadores."

PASO 2: Ponlo a prueba con preguntas
• ¿Es este pensamiento 100% verdadero o es una interpretación?
• ¿Qué evidencia tengo a favor y en contra?
• ¿Le diría esto mismo a un compañero de equipo que cometió el mismo error?
• ¿Este pensamiento me ayuda a mejorar o me frena?

PASO 3: Construye la versión más útil
No inventes una versión irreal ("¡Soy el mejor!"). Busca la versión honesta y orientada a la acción:
"Hoy rendí por debajo de mi nivel. Identifico dos aspectos específicos a mejorar."
"Este movimiento me cuesta más que otros. Necesito más repeticiones deliberadas."
"Mi visibilidad está creciendo. Seguir siendo consistente es lo que atrae oportunidades."

Aplicaciones específicas en el deporte

RACHAS NEGATIVAS: En lugar de "estoy en crisis", prueba "estoy en una fase de ajuste". Las rachas negativas en el deporte son predecibles estadísticamente. No indican el futuro.

LESIONES: En lugar de "perdí toda mi preparación", prueba "tengo tiempo para trabajar aspectos que normalmente descuido: técnica, táctica, fuerza complementaria".

CRÍTICA DEL ENTRENADOR: En lugar de "me está atacando", prueba "me está dando información que puedo usar o descartar con criterio".

COMPARACIÓN CON OTROS: En lugar de "ese atleta es mejor que yo", prueba "ese atleta tiene más experiencia en ese aspecto. ¿Qué puedo aprender de cómo lo trabaja?"

Lo que dice la ciencia

Un meta-análisis de 27 estudios publicado en Psychological Bulletin demostró que las intervenciones cognitivo-conductuales mejoran el rendimiento deportivo en un 33% comparado con grupos de control, con efectos especialmente marcados en deportes de precisión y situaciones de alta presión. El reframing no es charla motivacional: es una habilidad técnica que se entrena.

Ejercicio para hoy

Escribe el último pensamiento negativo que tuviste sobre tu rendimiento deportivo. Aplica los 3 pasos. No necesitas que el resultado sea perfecto. Solo necesitas que sea más útil que el pensamiento original.`,
    tipo: "articulo",
    tiempoEstimado: "10 Min",
    intensidad: "bajo",
    triggerCondiciones: ["motivacion_baja", "estres_alto"],
    activo: true,
  },
  {
    titulo: "Recuperación Activa: El entrenamiento invisible que separa a los buenos de los mejores",
    categoria: "recuperacion",
    descripcionBreve:
      "La recuperación no es no hacer nada. Es un proceso activo y deliberado. Aprende los protocolos que usan los atletas de élite para recuperarse más rápido y rendir más.",
    contenido: `El error más común en el entrenamiento

La mayoría de los deportistas saben cómo entrenar. Pocos saben cómo recuperarse. Y sin embargo, la adaptación al entrenamiento ocurre durante la recuperación, no durante el esfuerzo. Entrenas para crear el estímulo. Descansas para que el cuerpo responda.

Los atletas que más progresan no son necesariamente los que más entrenan. Son los que mejor gestionan la relación entre carga y recuperación.

¿Qué es la recuperación activa?

La recuperación activa es cualquier actividad de baja intensidad realizada después de un esfuerzo intenso, con el objetivo de acelerar la eliminación de lactato, reducir la inflamación muscular y mantener el flujo sanguíneo sin añadir fatiga. Es diferente al descanso pasivo (quedarte quieto) porque acelera activamente los procesos de recuperación.

Protocolo de recuperación activa post-esfuerzo (0-24 horas)

INMEDIATAMENTE después (0-30 minutos):
→ 10-15 minutos de movimiento suave: caminar, bicicleta estática a baja resistencia, nado tranquilo. El objetivo es mantener el corazón en 100-120 ppm para acelerar la eliminación de lactato.
→ Hidratación: 500-750 ml de agua con electrolitos en los primeros 30 minutos. El sudor elimina sodio, potasio y magnesio, no solo agua.
→ Ventana nutricional: consume proteínas (20-40g) y carbohidratos en los primeros 45 minutos. Esto activa la síntesis proteica muscular cuando el cuerpo es más receptivo.

PRIMERAS 6 HORAS:
→ Elevación de piernas o compresión si hay trabajo de tren inferior intenso.
→ Ducha de contraste: 30 segundos frío / 30 segundos caliente, repite 4-6 veces. Finaliza con frío. Esto activa el sistema circulatorio y reduce la inflamación.
→ Come una comida completa dentro de las primeras 2 horas.

DURANTE LAS PRIMERAS 24 HORAS:
→ Sueño: prioridad máxima. 8-9 horas si el esfuerzo fue muy intenso.
→ Movilidad suave: 15-20 minutos de estiramientos dinámicos o yoga de baja intensidad. Evita los estiramientos estáticos intensos en las primeras 12 horas post-esfuerzo intenso.
→ Caminar: incluso 20-30 minutos de caminata suave mejoran la circulación y reducen el DOMS (dolor muscular tardío).

Recuperación mental: el componente olvidado

El cuerpo se recupera del estrés físico. El sistema nervioso central (SNC) también necesita recuperarse del estrés cognitivo y emocional. Señales de que tu SNC está fatigado (no solo tus músculos):
• Te irritas fácilmente por cosas pequeñas
• Tu motivación para entrenar cae sin razón aparente
• El sueño es interrumpido aunque estés físicamente cansado
• Tu concentración en el entrenamiento es baja incluso con piernas descansadas

Para recuperar el SNC:
→ Actividades sin pantallas ni decisiones complejas: paseos en naturaleza, música, conversaciones sin presión
→ Mindfulness o meditación de 10 minutos (incluso sin experiencia previa, el simple acto de sentarse en silencio ayuda)
→ Reducir temporalmente las demandas externas: redes sociales, noticias, decisiones importantes

Herramientas de monitoreo

Los mejores indicadores subjetivos de recuperación son los que mides en el check-in diario:
• Calidad del sueño de la noche anterior
• Nivel de fatiga muscular
• Estado de ánimo general
• Motivación para entrenar

Si tres o más de estos están bajos dos días consecutivos, es señal de que necesitas ajustar la carga o priorizar la recuperación antes de añadir más volumen.

La regla del 80/20 de la recuperación

El 80% de tu recuperación depende de tres factores que no cuestan dinero: sueño de calidad, hidratación adecuada y nutrición en el momento correcto. El 20% restante son herramientas complementarias (baños de hielo, compresión neumática, masajes). Domina el 80% antes de invertir en el 20%.

Los atletas de élite no tienen resultados extraordinarios porque tienen más recursos. Los tienen porque aplican consistentemente lo básico mejor que nadie.`,
    tipo: "articulo",
    tiempoEstimado: "12 Min",
    intensidad: "bajo",
    triggerCondiciones: ["fatiga_alta", "sueno_malo"],
    activo: true,
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Conectado a MongoDB");

    // Eliminar recursos existentes con los mismos títulos para evitar duplicados
    for (const r of recursos) {
      await Recurso.deleteOne({ titulo: r.titulo });
    }

    const insertados = await Recurso.insertMany(recursos);
    console.log(`✅ ${insertados.length} recursos insertados correctamente:`);
    insertados.forEach((r) => console.log(`   → [${r.categoria}] ${r.titulo}`));

    await mongoose.disconnect();
    console.log("✅ Listo. Puedes ver los recursos en la Biblioteca.");
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
}

seed();
