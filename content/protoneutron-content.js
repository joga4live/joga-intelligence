/**
 * JogaBit — ProtoNeutrón: contenido expandido de hábitos / Expanded habits content
 * 30 prácticas · 30 afirmaciones · 12 leyes — bilingüe ES/EN
 * Basado en Atomic Habits (James Clear) y Tiny Habits (BJ Fogg)
 *
 * Estructura / Structure:
 *   window.JOGA_CONTENT_PROTONEUTRON = {
 *     es: { practices: [{icon,num,title,desc,extra}×30], affs: [string×30], leyes: [{color,title,idea,ej}×12] },
 *     en: { practices: [{icon,num,title,desc,extra}×30], affs: [string×30], leyes: [{color,title,idea,ej}×12] }
 *   }
 */
window.JOGA_CONTENT_PROTONEUTRON = {

  /* ═══════════════════════════════════════════════════════════════
     ESPAÑOL
     ═══════════════════════════════════════════════════════════════ */
  es: {

    /* ── 30 PRÁCTICAS ── */
    practices: [
      /* 0-2: originales */
      {icon:'🔍', num:'Práctica 01', title:'Caza la señal',
       desc:'Identifica qué dispara el hábito que quieres cambiar: hora, lugar, emoción o persona.',
       extra:'Un hábito siempre tiene un gatillo. Si no ves la señal, no puedes cambiar la rutina.'},

      {icon:'🔁', num:'Práctica 02', title:'Reemplaza, no borres',
       desc:'Mantén la misma señal y la misma recompensa, pero cambia la rutina del medio.',
       extra:'No intentes eliminar un hábito: sustítuyelo por uno mejor que dé la misma satisfacción.'},

      {icon:'⛓️', num:'Práctica 03', title:'Encadena al día',
       desc:'Pega el nuevo hábito a algo que ya haces sin falta, para que el ancla lo sostenga.',
       extra:'«Después de [algo que ya hago], haré [nuevo hábito].» El 1% diario, repetido, te transforma.'},

      /* 3: Habit Stacking */
      {icon:'📚', num:'Práctica 04', title:'Apila tus hábitos',
       desc:'Conecta un hábito nuevo a uno que ya dominas, creando una secuencia automática.',
       extra:'Fórmula: «Después de [hábito actual], haré [hábito nuevo].» Ejemplo: después de servir el café, escribo 3 cosas por las que estoy agradecido. Empieza con pilas de 2; cuando sean automáticas, agrega un tercero.'},

      /* 4: Environment Design */
      {icon:'🏠', num:'Práctica 05', title:'Diseña tu entorno',
       desc:'Modifica tu espacio físico para que el buen hábito sea la opción más visible y fácil.',
       extra:'Tu entorno es el arquitecto invisible de tus hábitos. Deja la fruta al frente en la cocina, pon los libros sobre la almohada, aleja el celular del escritorio. No dependas de fuerza de voluntad: diseña el espacio para que lo correcto sea lo obvio.'},

      /* 5: Temptation Bundling */
      {icon:'🎁', num:'Práctica 06', title:'Empaqueta la tentación',
       desc:'Une algo que necesitas hacer con algo que te encanta hacer.',
       extra:'Fórmula: «Solo haré [lo que me gusta] mientras hago [lo que necesito].» Ejemplo: solo escucho mi podcast favorito mientras hago ejercicio. Tu cerebro asocia esfuerzo con placer, y el hábito difícil se vuelve atractivo.'},

      /* 6: Implementation Intentions */
      {icon:'📍', num:'Práctica 07', title:'Intención de implementación',
       desc:'Define exactamente cuándo, dónde y cómo vas a ejecutar el hábito.',
       extra:'Fórmula: «Voy a [CONDUCTA] a las [HORA] en [LUGAR].» Ejemplo: voy a meditar 5 minutos a las 7:00 AM en la silla de mi cuarto. Los estudios muestran que esto duplica la probabilidad de cumplimiento vs. decir «voy a meditar más».'},

      /* 7: Habit Tracking */
      {icon:'📊', num:'Práctica 08', title:'Rastrea tu hábito',
       desc:'Lleva un registro visual de cada día que cumples. La cadena creciente te motiva a no romperla.',
       extra:'Usa un calendario, una app, o simplemente una X en un papel. Regla clave: registra inmediatamente después de hacerlo, no al final del día. El acto de marcar se vuelve parte de la recompensa. Si fallas un día, la regla es: nunca dos seguidos.'},

      /* 8: Cue-Routine-Reward Mapping */
      {icon:'🗺️', num:'Práctica 09', title:'Mapea señal-rutina-recompensa',
       desc:'Dibuja el bucle completo de cualquier hábito para entender exactamente qué lo sostiene.',
       extra:'Toma papel y escribe: 1) ¿Qué señal lo dispara? (hora, emoción, persona, lugar, acción previa), 2) ¿Qué rutina haces?, 3) ¿Qué recompensa recibes? Una vez que ves las 3 partes, puedes intervenir en cualquiera de ellas.'},

      /* 9: Keystone Habit Identification */
      {icon:'🔑', num:'Práctica 10', title:'Encuentra tu hábito piedra angular',
       desc:'Identifica el UN hábito que, al cambiarlo, arrastra mejoras en otras áreas de tu vida.',
       extra:'Hábitos piedra angular típicos: ejercicio, sueño, meditación, orden. Cuando empiezas a hacer ejercicio, comes mejor, duermes más, tienes más energía. No intentes cambiar 10 cosas. Encuentra la pieza de dominó que tumba las demás.'},

      /* 10: Friction Reduction */
      {icon:'🧈', num:'Práctica 11', title:'Reduce la fricción',
       desc:'Elimina cada paso innecesario entre tú y el hábito que quieres construir.',
       extra:'Cuenta los pasos entre tu estado actual y la acción deseada. Cada paso es una oportunidad para abandonar. ¿Quieres correr? Duerme con la ropa deportiva. ¿Quieres leer? Deja el libro abierto en la página. Reduce los pasos a menos de 3.'},

      /* 11: Commitment Devices */
      {icon:'🔒', num:'Práctica 12', title:'Dispositivos de compromiso',
       desc:'Crea una restricción en el presente que bloquee tu yo futuro de hacer lo incorrecto.',
       extra:'Ejemplos: deja el celular en otra habitación mientras trabajas, usa bloqueadores de apps, dale dinero a un amigo que solo te lo devuelve si cumples. Un dispositivo de compromiso hace que el mal hábito sea imposible, no solo difícil.'},

      /* 12: Habit Graduation */
      {icon:'🎓', num:'Práctica 13', title:'Gradúa tu hábito',
       desc:'Cuando un micro-hábito ya es automático, sube el nivel gradualmente sin romper la cadena.',
       extra:'Escala progresiva: Semana 1-2: versión de 2 minutos. Semana 3-4: versión de 5 minutos. Mes 2: versión completa. Nunca subas más de un 10-15% a la vez. Si dejas de hacerlo, vuelve a la versión más fácil. La consistencia importa más que la intensidad.'},

      /* 13: Micro-Habits */
      {icon:'🔬', num:'Práctica 14', title:'Micro-hábitos de 2 minutos',
       desc:'Reduce cualquier hábito a una versión tan pequeña que sea imposible decir que no.',
       extra:'La regla de los 2 minutos de James Clear: «Leer 30 páginas» → «Leer una página.» «Correr 5 km» → «Ponerme los tenis.» «Estudiar para el examen» → «Abrir mis notas.» El objetivo no es el resultado, es convertirte en el tipo de persona que aparece todos los días.'},

      /* 14: Identity-Based Habits */
      {icon:'🪞', num:'Práctica 15', title:'Hábitos basados en identidad',
       desc:'No busques resultados; busca convertirte en el tipo de persona que tiene esos resultados.',
       extra:'En lugar de «quiero bajar 10 kilos», piensa «soy alguien que cuida su cuerpo». Cada acción es un voto por la persona que quieres ser. No necesitas unanimidad, solo mayoría. Pregúntate: ¿qué haría la persona en la que me quiero convertir?'},

      /* 15: Streak Maintenance */
      {icon:'🔥', num:'Práctica 16', title:'Mantén la racha viva',
       desc:'Protege tu cadena de días consecutivos como si fuera un tesoro que crece solo con constancia.',
       extra:'Regla de oro: nunca falles dos días seguidos. Un día malo no destruye la cadena; dos días seguidos crean un nuevo patrón. En días difíciles, haz la versión mínima (1 flexión, 1 página, 1 minuto). El objetivo es no romper la racha, no ser perfecto.'},

      /* 16: Habit Recovery After Breaks */
      {icon:'🩹', num:'Práctica 17', title:'Recupera tu hábito después de una pausa',
       desc:'Si rompiste la cadena, no te castigues. Vuelve con la versión mínima hoy mismo.',
       extra:'El error más grande tras fallar no es la falla, sino la espiral de culpa que te aleja más. Protocolo de recuperación: 1) Acepta sin drama, 2) Haz la versión de 2 minutos HOY, 3) No intentes compensar lo perdido, 4) Recuerda que un tropiezo no borra tu progreso anterior.'},

      /* 17: Morning Routine Design */
      {icon:'🌅', num:'Práctica 18', title:'Diseña tu rutina matutina',
       desc:'Construye una secuencia de hábitos apilados que arranque tu día con intención y claridad.',
       extra:'Plantilla: despertar → vaso de agua → 5 min meditación/respiración → 3 prioridades del día → movimiento (10 min). Clave: hazla la noche anterior (deja el vaso, la ropa, el cuaderno listos). No revises el celular en los primeros 30 minutos. Tu mañana programa tu día entero.'},

      /* 18: Evening Routine Design */
      {icon:'🌙', num:'Práctica 19', title:'Diseña tu rutina nocturna',
       desc:'Cierra el día con hábitos que preparen el mañana y calmen tu sistema nervioso.',
       extra:'Plantilla: revisar el día (1 min) → preparar mañana (ropa, mochila, prioridades) → apagar pantallas 30 min antes de dormir → leer o respirar 10 min → misma hora de acostarte ±15 min. La rutina nocturna es el arma secreta: el sueño de calidad multiplica todo lo demás.'},

      /* 19: Trigger Identification */
      {icon:'⚡', num:'Práctica 20', title:'Identifica tus disparadores',
       desc:'Descubre los 5 tipos de señales que activan tus hábitos sin que te des cuenta.',
       extra:'Las 5 señales universales: 1) Hora del día, 2) Lugar/ubicación, 3) Estado emocional, 4) Otras personas, 5) Acción inmediatamente anterior. Durante 3 días, cada vez que hagas el hábito (bueno o malo), anota cuál de las 5 señales lo activó. El patrón te va a sorprender.'},

      /* 20: Reward Substitution */
      {icon:'🎯', num:'Práctica 21', title:'Sustituye la recompensa',
       desc:'Si la recompensa del mal hábito es placer inmediato, encuentra una alternativa que dé lo mismo.',
       extra:'Tu cerebro no quiere el cigarro, quiere el alivio del estrés. No quiere las redes sociales, quiere conexión. Identifica la recompensa REAL detrás del hábito y busca una alternativa más sana que la provea: respirar profundo (alivio), llamar a alguien (conexión), caminar 5 min (energía).'},

      /* 21: Social Accountability */
      {icon:'👥', num:'Práctica 22', title:'Rendición de cuentas social',
       desc:'Comparte tu compromiso con alguien. La presión social positiva es un multiplicador de disciplina.',
       extra:'Opciones de accountability: 1) Compañero de hábitos: alguien que hace lo mismo contigo, 2) Contrato de compromiso: escríbelo y que alguien lo firme como testigo, 3) Grupo: únete o crea un grupo con la misma meta. Clave: reporta diario, no semanal. La frecuencia es la fuerza.'},

      /* 22: Habit Audits */
      {icon:'📋', num:'Práctica 23', title:'Auditoría de hábitos',
       desc:'Haz un inventario completo de tus hábitos actuales y clasifícalos como +, −, o neutro.',
       extra:'Lista todo lo que haces desde que despiertas hasta que duermes. Al lado de cada uno escribe: + (me acerca a quien quiero ser), − (me aleja), = (neutro). No juzgues; observa. El primer paso para cambiar es ver con claridad. Repite esta auditoría cada 3 meses.'},

      /* 23: 66-Day Challenge */
      {icon:'📅', num:'Práctica 24', title:'El reto de los 66 días',
       desc:'Comprométete con UN hábito por 66 días, el tiempo promedio para que se vuelva automático.',
       extra:'La investigación de Phillippa Lally (University College London) muestra que un hábito toma entre 18 y 254 días, con una media de 66. No 21, como dice el mito. Marca los 66 días en un calendario. En el día 1, escribe POR QUÉ lo haces. Léelo cada vez que quieras abandonar.'},

      /* 24: One Habit at a Time */
      {icon:'☝️', num:'Práctica 25', title:'Un hábito a la vez',
       desc:'Resiste la tentación de cambiar todo a la vez. Enfócate en UN solo hábito hasta que sea automático.',
       extra:'El ego quiere revoluciones; la ciencia dice que la fuerza de voluntad es un recurso limitado. Si intentas 5 cambios a la vez, fallas en los 5. Elige el más importante, domínalo (4-8 semanas), y luego pasa al siguiente. Velocidad = un hábito sólido cada 2 meses = 6 hábitos transformadores al año.'},

      /* 25: Dopamine Management */
      {icon:'🧠', num:'Práctica 26', title:'Gestiona tu dopamina',
       desc:'Entiende cómo la dopamina impulsa tus hábitos y aprende a usarla a tu favor.',
       extra:'La dopamina no es placer, es anticipación. Se libera ANTES de la recompensa, no durante. Por eso revisas el celular: tu cerebro anticipa algo nuevo. Truco: haz que el hábito bueno sea más atractivo (música mientras entrenas, café especial mientras estudias) y el malo, menos (elimina señales visuales).'},

      /* 26: Craving Surfing */
      {icon:'🌊', num:'Práctica 27', title:'Surfea el antojo',
       desc:'Cuando sientas el impulso de un mal hábito, no luches contra él: obsérvalo pasar como una ola.',
       extra:'Técnica de urge surfing (Alan Marlatt): 1) Nota el antojo sin juzgarlo, 2) Respira profundo 3 veces, 3) Observa dónde lo sientes en el cuerpo, 4) Dite: «esto es solo una ola, va a pasar en 10 minutos.» La intensidad del antojo SIEMPRE baja si no actúas. Aguanta 10 minutos y ganas.'},

      /* 27: Habit Scorecards */
      {icon:'📝', num:'Práctica 28', title:'Tarjeta de puntuación de hábitos',
       desc:'Puntúa cada día del 1 al 5 según qué tan bien ejecutaste tu sistema de hábitos.',
       extra:'Al final de cada día, califica: 5 = cumplí todo el sistema, 4 = fallé uno menor, 3 = hice lo mínimo, 2 = apenas aparecí, 1 = no hice nada. No busques 5 todos los días. Busca que tu promedio semanal sea ≥3.5. La puntuación crea conciencia sin culpa, y la conciencia precede al cambio.'},

      /* 28: Behavior Chains */
      {icon:'🔗', num:'Práctica 29', title:'Cadenas de comportamiento',
       desc:'Construye secuencias donde el final de un hábito es la señal del siguiente.',
       extra:'Ejemplo de cadena matutina: alarma → pies al piso → vaso de agua → 10 respiraciones → vestirme → café → revisar prioridades. Cada paso dispara el siguiente sin decidir. El poder está en que NO PIENSAS; la secuencia fluye. Diseña cadenas de 3-5 hábitos. Practica la misma secuencia 30 días antes de modificarla.'},

      /* 29: Friction Addition for Bad Habits */
      {icon:'🚧', num:'Práctica 30', title:'Añade fricción al mal hábito',
       desc:'Haz que el hábito que quieres eliminar sea más difícil, lento o incómodo de ejecutar.',
       extra:'Inversión de la ley de la facilidad: si quieres menos redes sociales, borra las apps y entra solo por navegador. Si quieres menos TV, desconecta el cable y guárdalo en un armario. Cada paso extra de fricción reduce dramáticamente la probabilidad de hacer el mal hábito. No necesitas voluntad si necesitas 5 pasos para empezar.'},
    ],

    /* ── 30 AFIRMACIONES ── */
    affs: [
      'Lo que repito cada día me construye.',
      'El 1% de hoy es el gigante de mañana.',
      'No rompo la cadena.',
      'Reemplazo lo que me frena por lo que me impulsa.',
      'Soy alguien que cumple lo que empieza.',
      'Pequeño y constante le gana a grande y disperso.',
      'No busco perfección; busco constancia.',
      'Cada día que cumplo, refuerzo quién soy.',
      'Mi identidad se construye con cada repetición.',
      'Inhalo disciplina, exhalo excusas.',
      'Un hábito a la vez, sin prisa, sin pausa.',
      'Mi entorno trabaja para mí, no contra mí.',
      'La cadena es mi testigo: yo cumplo.',
      'No necesito motivación; necesito un sistema.',
      'Hago lo correcto aunque no tenga ganas.',
      'Soy la suma de mis pequeños actos diarios.',
      'Hoy hago mi parte, por mínima que sea.',
      'La versión mínima cuenta. Aparecer es ganar.',
      'Mi futuro yo me agradece cada repetición de hoy.',
      'No compito con nadie, solo con quien fui ayer.',
      'La disciplina es libertad disfrazada de esfuerzo.',
      'Cada vez que cumplo, voto por la persona que quiero ser.',
      'Los días difíciles son los que más fortalecen la cadena.',
      'Nunca dos días seguidos sin hacerlo.',
      'Mi sistema es más fuerte que mi estado de ánimo.',
      'La constancia silenciosa supera al talento ruidoso.',
      'Confío en el proceso aunque no vea los resultados aún.',
      'Soy arquitecto de mis hábitos, no víctima de ellos.',
      'Cada micro-hábito es un ladrillo de mi mejor versión.',
      'La cadena sigue viva. Y yo también.',
    ],

    /* ── 12 LEYES ── */
    leyes: [
      {color:'#5cbcc4',
       title:'El bucle del hábito',
       idea:'Todo hábito tiene 3 partes: señal → rutina → recompensa. Tu cerebro lo ejecuta en automático para ahorrar energía. Si quieres cambiar la rutina, primero identifica la señal y la recompensa.',
       ej:'Anota las 3 partes de un hábito tuyo antes de intentar cambiarlo. Sin este mapa, vas a ciegas.'},

      {color:'#2c8d97',
       title:'La ley del 1%',
       idea:'Mejorar 1% cada día no se nota hoy, pero a un año te hace 37 veces mejor. Empeorar 1% diario te lleva casi a cero. Lo pequeño, repetido, explota.',
       ej:'Elige una mejora tan mínima que sea ridícula no hacerla. La acumulación hace el trabajo pesado.'},

      {color:'#2c8d97',
       title:'Házlo obvio (1ra Ley)',
       idea:'Un hábito que ves, lo haces. La primera ley del cambio de comportamiento es hacer la señal imposible de ignorar para el buen hábito, e invisible para el malo.',
       ej:'¿Quieres leer más? Deja el libro sobre la almohada. ¿Menos celular? Déjalo en otro cuarto.'},

      {color:'#3fb0b8',
       title:'Házlo atractivo (2da Ley)',
       idea:'Cuanto más atractivo es un comportamiento, más probable es que se convierta en hábito. La dopamina se libera con la anticipación, no con la recompensa.',
       ej:'Empaqueta tentaciones: solo escucha tu podcast favorito mientras haces ejercicio. Asocia esfuerzo con placer.'},

      {color:'#2c8d97',
       title:'Házlo fácil (3ra Ley)',
       idea:'Cuanto menos esfuerzo cuesta empezar, más probable es que lo hagas. La fricción es el enemigo silencioso de los buenos hábitos y el aliado de los malos.',
       ej:'Regla de 2 minutos: reduce cualquier hábito a su versión de 2 minutos. «Correr 5 km» → «Ponerme los tenis.»'},

      {color:'#52cd86',
       title:'Házlo satisfactorio (4ta Ley)',
       idea:'Repetimos lo que nos da placer inmediato. El cerebro prioriza recompensas inmediatas sobre las futuras. Necesitas sentir algo bueno AHORA al terminar el hábito.',
       ej:'Después de completar tu hábito, date una micro-recompensa instantánea: marca la X, di «hecho», celebra en silencio.'},

      {color:'#82cd85',
       title:'No rompas la cadena',
       idea:'Cada día que cumples, sumas un eslabón. Ver la cadena crecer activa el efecto de dotación: no quieres perder lo que ya construiste. La regla crítica: nunca falles dos días seguidos.',
       ej:'Marca en un calendario cada día que cumplas. Un día malo está permitido; dos seguidos son un nuevo patrón.'},

      {color:'#b8923a',
       title:'Identidad sobre metas',
       idea:'Las metas te dicen qué quieres lograr; la identidad te dice quién quieres ser. Los hábitos duraderos nacen de cambios de identidad, no de cambios de resultado.',
       ej:'No digas «quiero dejar de fumar», di «no soy fumador». Cada hábito es un voto por el tipo de persona en la que te conviertes.'},

      {color:'#e2703a',
       title:'La meseta de lo latente',
       idea:'Los resultados no son lineales. Puedes estar haciendo todo bien sin ver cambios durante semanas. El hielo no se derrite a 25°, ni a 28°, ni a 31°. A 32° todo cambia. No abandonas porque no funciona; abandonas justo antes de que funcione.',
       ej:'Cuando sientas que no pasa nada, recuerda: estás calentando el hielo. El salto viene, pero solo si sigues.'},

      {color:'#8b5cf6',
       title:'Sistemas sobre metas',
       idea:'No te eleves al nivel de tus metas, te caes al nivel de tus sistemas. Los ganadores y los perdedores tienen las mismas metas. La diferencia es el sistema que siguen para llegar.',
       ej:'En vez de obsesionarte con el resultado, diseña un sistema diario que lo haga inevitable. Enfócate en el proceso.'},

      {color:'#2c8d97',
       title:'El entorno supera la voluntad',
       idea:'La fuerza de voluntad es un recurso finito que se agota. El diseño del entorno es infinito. Las personas disciplinadas no tienen más voluntad; tienen mejores entornos.',
       ej:'Diseña tu espacio para que lo correcto sea lo fácil y lo incorrecto sea lo difícil. No dependas de resistir la tentación.'},

      {color:'#52cd86',
       title:'La ley de la repetición',
       idea:'Un hábito no se forma por tiempo sino por frecuencia. No importa cuántos días lleves; importa cuántas repeticiones acumules. La automaticidad viene de la repetición, no del calendario.',
       ej:'No preguntes «¿cuánto tiempo hasta que sea hábito?» Pregunta «¿cuántas repeticiones necesito?» Y luego acumúlalas.'},
    ],
  },

  /* ═══════════════════════════════════════════════════════════════
     ENGLISH
     ═══════════════════════════════════════════════════════════════ */
  en: {

    /* ── 30 PRACTICES ── */
    practices: [
      /* 0-2: originals */
      {icon:'🔍', num:'Practice 01', title:'Hunt the cue',
       desc:'Identify what triggers the habit you want to change: time, place, emotion or person.',
       extra:'A habit always has a trigger. If you can\'t see the cue, you can\'t change the routine.'},

      {icon:'🔁', num:'Practice 02', title:'Replace, don\'t erase',
       desc:'Keep the same cue and the same reward, but change the routine in between.',
       extra:'Don\'t try to remove a habit: swap it for a better one that gives the same satisfaction.'},

      {icon:'⛓️', num:'Practice 03', title:'Chain it to your day',
       desc:'Attach the new habit to something you already do without fail, so the anchor holds it.',
       extra:'"After [something I already do], I will [new habit]." The daily 1%, repeated, transforms you.'},

      /* 3: Habit Stacking */
      {icon:'📚', num:'Practice 04', title:'Stack your habits',
       desc:'Link a new habit to one you already own, creating an automatic sequence.',
       extra:'Formula: "After [current habit], I will [new habit]." Example: after pouring my coffee, I write 3 things I\'m grateful for. Start with 2-habit stacks; once they\'re automatic, add a third.'},

      /* 4: Environment Design */
      {icon:'🏠', num:'Practice 05', title:'Design your environment',
       desc:'Modify your physical space so the good habit becomes the most visible and easy option.',
       extra:'Your environment is the invisible architect of your habits. Put fruit at the front of the counter, leave books on your pillow, move your phone away from your desk. Don\'t rely on willpower: design the space so the right thing is the obvious thing.'},

      /* 5: Temptation Bundling */
      {icon:'🎁', num:'Practice 06', title:'Bundle the temptation',
       desc:'Pair something you need to do with something you love to do.',
       extra:'Formula: "I will only do [what I enjoy] while I do [what I need]." Example: I only listen to my favorite podcast while exercising. Your brain links effort with pleasure, and the hard habit becomes attractive.'},

      /* 6: Implementation Intentions */
      {icon:'📍', num:'Practice 07', title:'Implementation intention',
       desc:'Define exactly when, where, and how you will execute the habit.',
       extra:'Formula: "I will [BEHAVIOR] at [TIME] in [LOCATION]." Example: I will meditate for 5 minutes at 7:00 AM in the chair in my room. Studies show this doubles follow-through compared to saying "I\'ll meditate more."'},

      /* 7: Habit Tracking */
      {icon:'📊', num:'Practice 08', title:'Track your habit',
       desc:'Keep a visual record of every day you follow through. The growing chain motivates you not to break it.',
       extra:'Use a calendar, an app, or simply an X on paper. Key rule: record immediately after doing it, not at the end of the day. The act of marking becomes part of the reward. If you miss a day, the rule is: never two in a row.'},

      /* 8: Cue-Routine-Reward Mapping */
      {icon:'🗺️', num:'Practice 09', title:'Map cue-routine-reward',
       desc:'Draw the full loop of any habit to understand exactly what keeps it alive.',
       extra:'Grab paper and write: 1) What cue triggers it? (time, emotion, person, place, preceding action), 2) What routine do you do?, 3) What reward do you get? Once you see all 3 parts, you can intervene on any of them.'},

      /* 9: Keystone Habit Identification */
      {icon:'🔑', num:'Practice 10', title:'Find your keystone habit',
       desc:'Identify the ONE habit that, when changed, creates a ripple of improvement in other areas of your life.',
       extra:'Typical keystone habits: exercise, sleep, meditation, tidiness. When you start exercising, you eat better, sleep more, have more energy. Don\'t try to change 10 things. Find the domino piece that topples the rest.'},

      /* 10: Friction Reduction */
      {icon:'🧈', num:'Practice 11', title:'Reduce the friction',
       desc:'Eliminate every unnecessary step between you and the habit you want to build.',
       extra:'Count the steps between your current state and the desired action. Every step is a chance to quit. Want to run? Sleep in your workout clothes. Want to read? Leave the book open to the page. Reduce steps to fewer than 3.'},

      /* 11: Commitment Devices */
      {icon:'🔒', num:'Practice 12', title:'Commitment devices',
       desc:'Create a restriction in the present that locks your future self out of doing the wrong thing.',
       extra:'Examples: leave your phone in another room while working, use app blockers, give money to a friend who only returns it if you follow through. A commitment device makes the bad habit impossible, not just hard.'},

      /* 12: Habit Graduation */
      {icon:'🎓', num:'Practice 13', title:'Graduate your habit',
       desc:'When a micro-habit is automatic, raise the level gradually without breaking the chain.',
       extra:'Progressive scale: Week 1-2: 2-minute version. Week 3-4: 5-minute version. Month 2: full version. Never increase more than 10-15% at a time. If you stop doing it, drop back to the easiest version. Consistency matters more than intensity.'},

      /* 13: Micro-Habits */
      {icon:'🔬', num:'Practice 14', title:'2-minute micro-habits',
       desc:'Shrink any habit to a version so small it\'s impossible to say no.',
       extra:'James Clear\'s 2-minute rule: "Read 30 pages" → "Read one page." "Run 5k" → "Put on my shoes." "Study for the exam" → "Open my notes." The goal isn\'t the outcome — it\'s becoming the kind of person who shows up every day.'},

      /* 14: Identity-Based Habits */
      {icon:'🪞', num:'Practice 15', title:'Identity-based habits',
       desc:'Don\'t chase outcomes; become the kind of person who produces those outcomes.',
       extra:'Instead of "I want to lose 10 kg," think "I am someone who takes care of their body." Every action is a vote for the person you want to become. You don\'t need unanimity, just a majority. Ask yourself: what would the person I want to become do?'},

      /* 15: Streak Maintenance */
      {icon:'🔥', num:'Practice 16', title:'Keep the streak alive',
       desc:'Protect your chain of consecutive days as if it were a treasure that grows only with consistency.',
       extra:'Golden rule: never miss two days in a row. One bad day doesn\'t destroy the chain; two in a row create a new pattern. On hard days, do the minimum version (1 push-up, 1 page, 1 minute). The goal is keeping the streak, not being perfect.'},

      /* 16: Habit Recovery After Breaks */
      {icon:'🩹', num:'Practice 17', title:'Recover your habit after a break',
       desc:'If you broke the chain, don\'t punish yourself. Come back with the minimum version today.',
       extra:'The biggest mistake after failing isn\'t the failure — it\'s the guilt spiral that pushes you further away. Recovery protocol: 1) Accept without drama, 2) Do the 2-minute version TODAY, 3) Don\'t try to make up for lost time, 4) Remember that one stumble doesn\'t erase your prior progress.'},

      /* 17: Morning Routine Design */
      {icon:'🌅', num:'Practice 18', title:'Design your morning routine',
       desc:'Build a stacked sequence of habits that launches your day with intention and clarity.',
       extra:'Template: wake up → glass of water → 5 min meditation/breathing → 3 priorities for the day → movement (10 min). Key: prepare it the night before (leave the glass, clothes, notebook ready). Don\'t check your phone for the first 30 minutes. Your morning programs your entire day.'},

      /* 18: Evening Routine Design */
      {icon:'🌙', num:'Practice 19', title:'Design your evening routine',
       desc:'Close the day with habits that prepare tomorrow and calm your nervous system.',
       extra:'Template: review the day (1 min) → prepare tomorrow (clothes, bag, priorities) → screens off 30 min before bed → read or breathe 10 min → same bedtime ±15 min. The evening routine is the secret weapon: quality sleep multiplies everything else.'},

      /* 19: Trigger Identification */
      {icon:'⚡', num:'Practice 20', title:'Identify your triggers',
       desc:'Discover the 5 types of cues that activate your habits without you noticing.',
       extra:'The 5 universal cues: 1) Time of day, 2) Location, 3) Emotional state, 4) Other people, 5) Immediately preceding action. For 3 days, every time you do the habit (good or bad), note which of the 5 cues triggered it. The pattern will surprise you.'},

      /* 20: Reward Substitution */
      {icon:'🎯', num:'Practice 21', title:'Substitute the reward',
       desc:'If the bad habit\'s reward is instant pleasure, find an alternative that delivers the same thing.',
       extra:'Your brain doesn\'t want the cigarette, it wants stress relief. It doesn\'t want social media, it wants connection. Identify the REAL reward behind the habit and find a healthier alternative that provides it: deep breathing (relief), calling someone (connection), walking 5 min (energy).'},

      /* 21: Social Accountability */
      {icon:'👥', num:'Practice 22', title:'Social accountability',
       desc:'Share your commitment with someone. Positive social pressure is a discipline multiplier.',
       extra:'Accountability options: 1) Habit partner: someone doing the same thing with you, 2) Commitment contract: write it down and have someone sign as witness, 3) Group: join or create one with the same goal. Key: report daily, not weekly. Frequency is the force.'},

      /* 22: Habit Audits */
      {icon:'📋', num:'Practice 23', title:'Habit audit',
       desc:'Take a complete inventory of your current habits and classify each as +, −, or neutral.',
       extra:'List everything you do from waking to sleeping. Next to each one write: + (moves me toward who I want to be), − (moves me away), = (neutral). Don\'t judge; observe. The first step to change is seeing clearly. Repeat this audit every 3 months.'},

      /* 23: 66-Day Challenge */
      {icon:'📅', num:'Practice 24', title:'The 66-day challenge',
       desc:'Commit to ONE habit for 66 days — the average time for a behavior to become automatic.',
       extra:'Research by Phillippa Lally (University College London) shows a habit takes 18 to 254 days, with a median of 66. Not 21, as the myth says. Mark all 66 days on a calendar. On day 1, write down WHY you\'re doing it. Read it every time you want to quit.'},

      /* 24: One Habit at a Time */
      {icon:'☝️', num:'Practice 25', title:'One habit at a time',
       desc:'Resist the urge to change everything at once. Focus on ONE habit until it\'s automatic.',
       extra:'The ego wants revolutions; science says willpower is a limited resource. If you attempt 5 changes at once, you fail at all 5. Choose the most important, master it (4-8 weeks), then move to the next. Speed = one solid habit every 2 months = 6 transformative habits per year.'},

      /* 25: Dopamine Management */
      {icon:'🧠', num:'Practice 26', title:'Manage your dopamine',
       desc:'Understand how dopamine drives your habits and learn to use it in your favor.',
       extra:'Dopamine isn\'t pleasure, it\'s anticipation. It\'s released BEFORE the reward, not during. That\'s why you check your phone: your brain anticipates something new. Trick: make the good habit more attractive (music while training, special coffee while studying) and the bad one less so (remove visual cues).'},

      /* 26: Craving Surfing */
      {icon:'🌊', num:'Practice 27', title:'Surf the craving',
       desc:'When you feel the urge for a bad habit, don\'t fight it — watch it pass like a wave.',
       extra:'Urge surfing technique (Alan Marlatt): 1) Notice the craving without judging it, 2) Take 3 deep breaths, 3) Observe where you feel it in your body, 4) Tell yourself: "This is just a wave, it will pass in 10 minutes." The intensity of a craving ALWAYS drops if you don\'t act. Hold 10 minutes and you win.'},

      /* 27: Habit Scorecards */
      {icon:'📝', num:'Practice 28', title:'Habit scorecard',
       desc:'Rate each day from 1 to 5 based on how well you executed your habit system.',
       extra:'At the end of each day, rate: 5 = completed the whole system, 4 = missed one minor item, 3 = did the minimum, 2 = barely showed up, 1 = did nothing. Don\'t aim for 5 every day. Aim for a weekly average of ≥3.5. The score creates awareness without guilt, and awareness precedes change.'},

      /* 28: Behavior Chains */
      {icon:'🔗', num:'Practice 29', title:'Behavior chains',
       desc:'Build sequences where the end of one habit is the cue for the next.',
       extra:'Example morning chain: alarm → feet on floor → glass of water → 10 breaths → get dressed → coffee → review priorities. Each step triggers the next without deciding. The power is that you DON\'T THINK; the sequence flows. Design chains of 3-5 habits. Practice the same sequence for 30 days before modifying it.'},

      /* 29: Friction Addition for Bad Habits */
      {icon:'🚧', num:'Practice 30', title:'Add friction to bad habits',
       desc:'Make the habit you want to eliminate harder, slower, or more uncomfortable to execute.',
       extra:'Inversion of the ease law: if you want less social media, delete the apps and enter only through the browser. If you want less TV, unplug the cable and store it in a closet. Every extra step of friction dramatically reduces the probability of doing the bad habit. You don\'t need willpower if you need 5 steps to start.'},
    ],

    /* ── 30 AFFIRMATIONS ── */
    affs: [
      'What I repeat each day builds me.',
      'Today\'s 1% is tomorrow\'s giant.',
      'I don\'t break the chain.',
      'I replace what holds me back with what drives me.',
      'I am someone who finishes what they start.',
      'Small and steady beats big and scattered.',
      'I don\'t seek perfection; I seek consistency.',
      'Every day I follow through, I reinforce who I am.',
      'My identity is built with every repetition.',
      'I inhale discipline, I exhale excuses.',
      'One habit at a time, no rush, no pause.',
      'My environment works for me, not against me.',
      'The chain is my witness: I follow through.',
      'I don\'t need motivation; I need a system.',
      'I do the right thing even when I don\'t feel like it.',
      'I am the sum of my small daily acts.',
      'Today I do my part, however small it may be.',
      'The minimum version counts. Showing up is winning.',
      'My future self thanks me for every repetition today.',
      'I compete with no one, only with who I was yesterday.',
      'Discipline is freedom disguised as effort.',
      'Every time I follow through, I vote for the person I want to be.',
      'The hard days are the ones that strengthen the chain the most.',
      'Never two days in a row without doing it.',
      'My system is stronger than my mood.',
      'Quiet consistency outperforms loud talent.',
      'I trust the process even when I can\'t see the results yet.',
      'I am the architect of my habits, not their victim.',
      'Every micro-habit is a brick in my best version.',
      'The chain stays alive. And so do I.',
    ],

    /* ── 12 LAWS ── */
    leyes: [
      {color:'#5cbcc4',
       title:'The habit loop',
       idea:'Every habit has 3 parts: cue → routine → reward. Your brain runs it automatically to save energy. If you want to change the routine, first identify the cue and the reward.',
       ej:'Write down the 3 parts of one of your habits before trying to change it. Without this map, you\'re flying blind.'},

      {color:'#2c8d97',
       title:'The 1% law',
       idea:'Improving 1% a day isn\'t visible today, but over a year it makes you 37x better. Declining 1% daily takes you to near zero. Small, repeated, explodes.',
       ej:'Pick an improvement so tiny it\'s ridiculous not to do it. Compounding does the heavy lifting.'},

      {color:'#2c8d97',
       title:'Make it obvious (1st Law)',
       idea:'A habit you see, you do. The first law of behavior change is making the cue impossible to ignore for the good habit, and invisible for the bad one.',
       ej:'Want to read more? Leave the book on your pillow. Less phone? Leave it in another room.'},

      {color:'#3fb0b8',
       title:'Make it attractive (2nd Law)',
       idea:'The more attractive a behavior is, the more likely it becomes a habit. Dopamine is released with anticipation, not with the reward itself.',
       ej:'Bundle temptations: only listen to your favorite podcast while exercising. Link effort with pleasure.'},

      {color:'#2c8d97',
       title:'Make it easy (3rd Law)',
       idea:'The less effort it takes to start, the more likely you\'ll do it. Friction is the silent enemy of good habits and the ally of bad ones.',
       ej:'2-minute rule: shrink any habit to its 2-minute version. "Run 5k" → "Put on my shoes."'},

      {color:'#52cd86',
       title:'Make it satisfying (4th Law)',
       idea:'We repeat what gives us immediate pleasure. The brain prioritizes instant rewards over future ones. You need to feel something good NOW when you finish the habit.',
       ej:'After completing your habit, give yourself an instant micro-reward: mark the X, say "done," celebrate silently.'},

      {color:'#82cd85',
       title:'Don\'t break the chain',
       idea:'Every day you follow through, you add a link. Watching the chain grow triggers the endowment effect: you don\'t want to lose what you\'ve already built. The critical rule: never miss two days in a row.',
       ej:'Mark a calendar every day you follow through. One bad day is allowed; two in a row are a new pattern.'},

      {color:'#b8923a',
       title:'Identity over goals',
       idea:'Goals tell you what you want to achieve; identity tells you who you want to be. Lasting habits are born from identity shifts, not outcome changes.',
       ej:'Don\'t say "I want to quit smoking," say "I\'m not a smoker." Every habit is a vote for the kind of person you\'re becoming.'},

      {color:'#e2703a',
       title:'The plateau of latent potential',
       idea:'Results aren\'t linear. You can be doing everything right and see no changes for weeks. Ice doesn\'t melt at 25°, or 28°, or 31°. At 32° everything changes. You don\'t quit because it\'s not working; you quit right before it works.',
       ej:'When you feel like nothing\'s happening, remember: you\'re heating the ice. The breakthrough comes, but only if you keep going.'},

      {color:'#8b5cf6',
       title:'Systems over goals',
       idea:'You don\'t rise to the level of your goals, you fall to the level of your systems. Winners and losers have the same goals. The difference is the system they follow to get there.',
       ej:'Instead of obsessing over the outcome, design a daily system that makes it inevitable. Focus on the process.'},

      {color:'#2c8d97',
       title:'Environment beats willpower',
       idea:'Willpower is a finite resource that depletes. Environment design is infinite. Disciplined people don\'t have more willpower; they have better environments.',
       ej:'Design your space so the right thing is easy and the wrong thing is hard. Don\'t rely on resisting temptation.'},

      {color:'#52cd86',
       title:'The law of repetition',
       idea:'A habit isn\'t formed by time but by frequency. It doesn\'t matter how many days you\'ve been going; what matters is how many repetitions you\'ve stacked. Automaticity comes from repetition, not from the calendar.',
       ej:'Don\'t ask "how long until it\'s a habit?" Ask "how many reps do I need?" Then stack them.'},
    ],
  },
};
