import { FlashcardDeck } from '../types';

export const starterDecks: FlashcardDeck[] = [
  {
    id: 'face-name-recall',
    title: 'Asociación de Caras y Nombres',
    description: 'Practica la asociación de nombres, rostros y datos personales para apoyar la memoria social y cognitiva.',
    category: 'Apoyo Social',
    icon: 'Users',
    cards: [
      {
        id: 'fn-1',
        frontText: '¿Cómo se llama esta persona?\n🧓🏼\n- Tu vecina entrañable\n- Tiene un perro labrador negro llamado Charlie',
        backText: 'Evelyn\n\nVecina\n"A Evelyn siempre le encanta la jardinería y suele regalar tomates frescos de su huerto."',
        frontHint: 'Su nombre empieza por "Ev"',
        backHint: 'Evelyn',
        emoji: '🧓🏼'
      },
      {
        id: 'fn-2',
        frontText: '¿Cómo se llama esta persona?\n👨🏽‍⚕️\n- El doctor Patel\n- Tu médico de cabecera\n- Siempre lleva un reloj plateado',
        backText: 'Doctor Patel\n\nMédico de Familia\n"Su consulta está en la calle Mayor. La próxima revisión es en agosto."',
        frontHint: 'Empieza por P',
        backHint: 'Doctor Patel',
        emoji: '👨🏽‍⚕️'
      },
      {
        id: 'fn-3',
        frontText: '¿Cómo se llama esta persona?\n👩🏻‍🦰\n- Sara\n- Tu sobrina\n- Le vuelve loca pintar con acuarelas',
        backText: 'Sara\n\nFamiliar\n"Sara vive en Segovia y canta de maravilla en un coro local."',
        frontHint: 'Empieza por S',
        backHint: 'Sara',
        emoji: '👩🏻‍🦰'
      },
      {
        id: 'fn-4',
        frontText: '¿Cómo se llama esta persona?\n👱🏼‍♂️\n- Mateo\n- Tu nieto\n- Juega al fútbol en el equipo del barrio',
        backText: 'Mateo\n\nFamiliar\n"Le encantan las galletas con pepitas de chocolate y está estudiando Historia."',
        frontHint: 'Empieza por M',
        backHint: 'Mateo',
        emoji: '👱🏼‍♂️'
      }
    ]
  },
  {
    id: 'everyday-helpers',
    title: 'Ayudas para la Rutina Diaria',
    description: 'Recordatorios prácticos y de ubicación de objetos cotidianos de casa.',
    category: 'Vida Diaria',
    icon: 'Home',
    cards: [
      {
        id: 'eh-1',
        frontText: '¿Dónde deben estar guardadas siempre las llaves de casa?',
        backText: 'En el cuenco de madera que está sobre la mesa de la entrada de la casa.',
        frontHint: 'Cerca de la puerta de salida',
        backHint: 'En el cuenco del recibidor',
        emoji: '🔑'
      },
      {
        id: 'eh-2',
        frontText: '¿Cuándo me toca tomar la medicación de la mañana?',
        backText: 'Justo después de desayunar, acompañada de un buen vaso de agua limpia.',
        frontHint: 'Relacionado con una comida de la mañana',
        backHint: 'Justo después del desayuno',
        emoji: '💊'
      },
      {
        id: 'eh-3',
        frontText: '¿Qué 3 cosas debo comprobar obligatoriamente antes de salir de casa?',
        backText: '1. Que los fuegos de la cocina y el horno estén apagados.\n2. Que las luces de las habitaciones estén apagadas.\n3. Que la puerta principal esté cerrada con llave.',
        frontHint: 'Cocina, Luces y Puertas',
        backHint: 'Apagado, Apagado, Cerrada con llave',
        emoji: '🚪'
      },
      {
        id: 'eh-4',
        frontText: '¿Cuál es mi número de teléfono de emergencia?',
        backText: 'El 112 (Servicio Oficial de Emergencias) o llamar a mi cuidador/familiar al 600 000 000.',
        frontHint: 'Tres dígitos universales de emergencias',
        backHint: '112 o cuidador',
        emoji: '📞'
      }
    ]
  },
  {
    id: 'cognitive-categories',
    title: 'Asociaciones de Palabras',
    description: 'Mantén la mente ágil con ejercicios de agrupación de palabras habituales.',
    category: 'Activación Mental',
    icon: 'Sparkles',
    cards: [
      {
        id: 'cc-1',
        frontText: '¿Qué categoría une a estas tres palabras: \n🍎 Manzana, 🍌 Plátano, 🍇 Uva',
        backText: 'FRUTAS',
        frontHint: 'Alimentos dulces y naturales de árboles o plantas',
        backHint: 'Frutas',
        emoji: '🍎'
      },
      {
        id: 'cc-2',
        frontText: '¿Qué categoría une a estas tres palabras: \n🔨 Martillo, 🪚 Sierra, 🔧 Llave inglesa',
        backText: 'HERRAMIENTAS',
        frontHint: 'Objetos que utilizas para hacer apaños, brocolaje o arreglar cosas',
        backHint: 'Herramientas',
        emoji: '🔨'
      },
      {
        id: 'cc-3',
        frontText: '¿Qué categoría une a estas tres palabras: \n🎻 Violín, 🥁 Tambor, 🎺 Trompeta',
        backText: 'INSTRUMENTOS MUSICALES',
        frontHint: 'Objetos con los que se toca música o hermosas melodías',
        backHint: 'Instrumentos de música',
        emoji: '🎻'
      },
      {
        id: 'cc-4',
        frontText: '¿Qué categoría une a estas tres palabras: \n🌲 Pino, 🍁 Arce, 🌴 Palmera',
        backText: 'ÁRBOLES',
        frontHint: 'Tipos de plantas gigantes, leñosas y con tronco',
        backHint: 'Árboles',
        emoji: '🌲'
      }
    ]
  }
];
