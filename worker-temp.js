const ORIGENES_PERMITIDOS = ["https://joga4live.github.io"];
const MODELO       = "claude-haiku-4-5";
const MAX_TOKENS   = 400;
const MAX_SITUACION = 1200;
const ELEVENLABS_KEY = "E692FCD8-661D41AB-B85E2805-DE75C5D7";
const VOICE_ID     = "pqHfZKP75CvOlQylNhV4";

const COACHES = {
  "jogamind": {
    "es": "Eres un coach de JOGAMIND, app para entrenar el subconsciente (inspirada en Joseph Murphy, Napoleon Hill, Maxwell Maltz, Wayne Dyer). Analiza esta situación y responde en español, breve y accionable (máx 110 palabras): nombra la CREENCIA subconsciente que puede estar operando, una AFIRMACIÓN en presente para reprogramarla, y 2 acciones concretas para hoy.\n\nSituación: ",
    "en": "You are a JOGAMIND coach, an app to train the subconscious (inspired by Joseph Murphy, Napoleon Hill, Maxwell Maltz, Wayne Dyer). Analyze this situation and answer in English, brief and actionable (max 110 words): name the subconscious BELIEF that may be operating, a present-tense AFFIRMATION to reprogram it, and 2 concrete actions for today.\n\nSituation: "
  },
  "jogatime": {
    "es": "Eres un coach de JOGATIME, app para dominar el tiempo y el enfoque (bloqueo de tiempo, trabajo profundo, leyes de Pareto y Parkinson). Analiza esta situación y responde en español, breve y accionable (máx 110 palabras): nombra el PRINCIPIO del tiempo clave, el ROBA-TIEMPO probable, y 2 acciones concretas para hoy.\n\nSituación: ",
    "en": "You are a JOGATIME coach, an app to master time and focus (time-blocking, deep work, the Pareto and Parkinson laws). Analyze this situation and answer in English, brief and actionable (max 110 words): name the key time PRINCIPLE, the likely TIME-THIEF, and 2 concrete actions for today.\n\nSituation: "
  },
  "jogacapital": {
    "es": "Eres un coach de JOGACAPITAL, app de finanzas personales (presupuesto, págate primero, fondo de emergencia, interés compuesto). Analiza esta situación y responde en español, breve y accionable (máx 110 palabras): nombra el PRINCIPIO financiero clave, la FUGA de dinero probable, y 2 acciones concretas para esta semana.\n\nSituación: ",
    "en": "You are a JOGACAPITAL coach, a personal finance app (budgeting, pay yourself first, emergency fund, compound interest). Analyze this situation and answer in English, brief and actionable (max 110 words): name the key financial PRINCIPLE, the likely money LEAK, and 2 concrete actions for this week.\n\nSituation: "
  },
  "jogaventix": {
    "es": "Eres un coach de JOGAVENTIX, app de ventas (escuchar antes de ofrecer, detectar la necesidad, manejar objeciones, cerrar con honestidad). Analiza esta situación y responde en español, breve y accionable (máx 110 palabras): nombra la ETAPA de la venta donde está el problema, la TÉCNICA clave a aplicar, y 2 acciones concretas para tu próxima conversación.\n\nSituación: ",
    "en": "You are a JOGAVENTIX coach, a sales app (listen before offering, find the need, handle objections, close with honesty). Analyze this situation and answer in English, brief and actionable (max 110 words): name the SALES STAGE where the problem is, the key TECHNIQUE to apply, and 2 concrete actions for your next conversation.\n\nSituation: "
  },
  "jogapath": {
    "es": "Eres un coach del Método del Éxito (JogaPath). Basándote en las 7 leyes (Control, Causa y Efecto, Creencia, Expectativas, Atracción, Correspondencia, Accidente) y en pasos prácticos, analiza esta situación y responde en español, breve y accionable (máx 110 palabras): nombra la LEY clave, el PASO clave y 2 acciones concretas para hoy.\n\nSituación: ",
    "en": "You are a Success-Method coach (JogaPath). Based on the 7 laws (Control, Cause & Effect, Belief, Expectations, Attraction, Correspondence, Accident) and practical steps, analyze this situation and answer in English, brief and actionable (max 110 words): name the key LAW, the key STEP, and 2 concrete actions for today.\n\nSituation: "
  },
  "jogabit": {
    "es": "Eres un coach de JOGABIT, app para construir hábitos (bucle señal-rutina-recompensa, ley del 1% y hábitos atómicos). Analiza esta situación y responde en español, breve y accionable (máx 110 palabras): nombra la SEÑAL que dispara el hábito, el MICROHÁBITO de reemplazo, y 2 acciones concretas para hoy.\n\nSituación: ",
    "en": "You are a JOGABIT coach, an app to build habits (cue-routine-reward loop, the 1% law, atomic habits). Analyze this situation and answer in English, brief and actionable (max 110 words): name the CUE that triggers the habit, the replacement MICRO-HABIT, and 2 concrete actions for today.\n\nSituation: "
  },
  "jogabody": {
    "es": "Eres el guía de energía corporal de JogaBody. Analiza esta situación y responde en español, breve y accionable (máx 110 palabras): nombra el PRINCIPIO clave de energía corporal, la posible causa, y 2 acciones concretas para hoy.\n\nSituación: ",
    "en": "You are the JogaBody body-energy guide. Analyze this situation and answer in English, brief and actionable (max 110 words): name the key body-energy PRINCIPLE, the likely cause, and 2 concrete actions for today.\n\nSituation: "
  }
};

const SEGURIDAD = {
  "es": "Excepción de seguridad, antes que nada: si la situación describe una emergencia médica real, una crisis de salud mental o riesgo de autolesión, o una estafa/decisión financiera de altísimo riesgo, no respondas como coach: con calma, dile que busque ayuda de inmediato. Fuera de esos casos, sé el coach de siempre.\n\n",
  "en": "Safety exception, before anything else: if the situation describes a real medical emergency, a mental-health crisis or risk of self-harm, or a scam/extremely high-risk financial decision, do not answer as a coach: calmly tell them to get help right away. Outside of those cases, be the usual coach.\n\n"
};

function cors(origen) {
  var permitido = ORIGENES_PERMITIDOS.includes(origen) ? origen : ORIGENES_PERMITIDOS[0];
  return {
    "Access-Control-Allow-Origin": permitido,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "content-type",
    "Access-Control-Max-Age": "86400",
  };
}

function responde(datos, estado, origen) {
  return new Response(JSON.stringify(datos), {
    status: estado,
    headers: { "content-type": "application/json; charset=utf-8", ...cors(origen) },
  });
}

export default {
  async fetch(request, env) {
    var origen = request.headers.get("Origin") || "";

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors(origen) });
    }

    if (request.method !== "POST") {
      return responde({ error: "metodo_no_permitido" }, 405, origen);
    }

    if (!ORIGENES_PERMITIDOS.includes(origen)) {
      return responde({ error: "origen_no_permitido" }, 403, origen);
    }

    var cuerpo;
    try {
      cuerpo = await request.json();
    } catch (e) {
      return responde({ error: "json_invalido" }, 400, origen);
    }

    if (cuerpo.tts === true && cuerpo.text) {
      var ttsRes = await fetch(
        "https://api.elevenlabs.io/v1/text-to-speech/" + VOICE_ID,
        {
          method: "POST",
          headers: {
            "xi-api-key": ELEVENLABS_KEY,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: cuerpo.text.substring(0, 500),
            model_id: "eleven_multilingual_v2",
            voice_settings: { stability: 0.5, similarity_boost: 0.8 },
          }),
        }
      );
      if (!ttsRes.ok) {
        return responde({ error: "tts_failed" }, 500, origen);
      }
      var audio = await ttsRes.arrayBuffer();
      return new Response(audio, {
        headers: {
          "Content-Type": "audio/mpeg",
          "Access-Control-Allow-Origin": ORIGENES_PERMITIDOS[0],
          "Cache-Control": "public, max-age=3600",
        },
      });
    }

    var app       = (cuerpo.app      || "jogamind").toLowerCase();
    var idioma    = (cuerpo.idioma   || "es").toLowerCase();
    var situacion = (cuerpo.situacion || "").substring(0, MAX_SITUACION);

    if (!situacion) {
      return responde({ error: "situacion_vacia" }, 400, origen);
    }

    var coach     = (COACHES[app] || COACHES["jogamind"])[idioma] || COACHES["jogamind"]["es"];
    var seguridad = SEGURIDAD[idioma] || SEGURIDAD["es"];
    var prompt    = seguridad + coach + situacion;

    var aiRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: MODELO,
        max_tokens: MAX_TOKENS,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!aiRes.ok) {
      return responde({ error: "ia_fallida" }, 502, origen);
    }

    var aiJson = await aiRes.json();
    var texto  = aiJson.content?.[0]?.text || "";
    return responde({ respuesta: texto }, 200, origen);
  },
};
