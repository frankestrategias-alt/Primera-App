import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// Initialize the client. API_KEY is guaranteed to be in process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
Eres un mentor experto en Network Marketing (Multinivel) de clase mundial.
Tu estilo es: Claro, directo, motivador, práctico y humano.
Odias la teoría innecesaria. Te enfocas en la acción y los resultados.
Tus respuestas deben ser siempre en Español.

Reglas para generar mensajes:
1. Deben ser cortos y naturales.
2. NUNCA parecer un robot o un vendedor agresivo.
3. El objetivo inicial es CONVERSAR, no vender de inmediato.
4. Usa psicología persuasiva pero ética.
5. FORMATO VISUAL OBLIGATORIO: Usa *negritas* (un solo asterisco al inicio y al final de la frase) para resaltar las palabras clave más importantes, preguntas de cierre o frases de empatía.
`;

const modelId = "gemini-3-flash-preview";

export const generateContactScript = async (context: string, platform: string): Promise<string> => {
  try {
    const prompt = `
    Genera 3 opciones de mensajes cortos para iniciar una conversación con un prospecto.
    
    Contexto del prospecto: ${context}
    Plataforma: ${platform}
    
    Dame solo el texto de los mensajes, separados por "---".
    Usa *asteriscos* para resaltar la intención del mensaje o palabras clave.
    No incluyas introducciones ni explicaciones extra.
    `;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      }
    });

    return response.text || "No se pudo generar el mensaje. Intenta de nuevo.";
  } catch (error) {
    console.error("Error generating contact script:", error);
    return "Hubo un error al conectar con el asistente. Verifica tu conexión.";
  }
};

export const generateFollowUpScript = async (lastInteraction: string, daysAgo: string, interestLevel: string): Promise<string> => {
  try {
    const prompt = `
    Genera 3 opciones de mensajes de seguimiento (follow-up).
    
    Lo que hablamos la última vez: ${lastInteraction}
    Tiempo transcurrido: ${daysAgo}
    Nivel de interés previo: ${interestLevel}
    
    El tono debe ser profesional, sin presión (postura), pero recordando el valor.
    IMPORTANTE: Usa *asteriscos* para resaltar la frase gancho o la pregunta final.
    Dame solo el texto de los mensajes, separados por "---".
    `;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      }
    });

    return response.text || "No se pudo generar el mensaje.";
  } catch (error) {
    console.error("Error generating follow-up:", error);
    return "Error al generar seguimiento.";
  }
};

export const generateObjectionResponse = async (objection: string): Promise<string> => {
  try {
    const prompt = `
    El prospecto me dio esta objeción: "${objection}".
    
    Dame una respuesta segura, breve y clara para manejarla.
    Usa la técnica de: Sentir, Sentí, Encontré (Feel, Felt, Found) o una pregunta reflexiva.
    No discutas. Clarifica.
    
    FORMATO VISUAL:
    - Debes usar *asteriscos* para poner en negrita la frase de empatía o la pregunta clave.
    - Ejemplo: "Entiendo perfectamente, *yo pensaba lo mismo al inicio*..."
    `;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.6, // Slightly lower for consistent, solid answers
      }
    });

    return response.text || "No se pudo generar la respuesta.";
  } catch (error) {
    console.error("Error generating objection response:", error);
    return "Error al generar respuesta.";
  }
};

export const generateDailyMotivation = async (goals: any, progress: any): Promise<string> => {
    try {
      const prompt = `
      Revisa mis metas: ${JSON.stringify(goals)}
      Mi progreso de hoy: ${JSON.stringify(progress)}
      
      Dame un consejo de 1 frase MUY potente para que me levante y tome acción AHORA MISMO.
      Resalta la *acción principal* en negritas (un solo asterisco).
      Si voy bajo, empújame. Si voy bien, felicítame rápido y dime que siga.
      `;
  
      const response: GenerateContentResponse = await ai.models.generateContent({
        model: modelId,
        contents: prompt,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          maxOutputTokens: 100,
        }
      });
  
      return response.text || "¡A trabajar!";
    } catch (error) {
      return "La disciplina es el puente entre metas y logros.";
    }
  };

export const generateDailyPostIdea = async (): Promise<string> => {
  try {
    const prompt = `
    Actúa como experto en Marketing de Atracción.
    Tu objetivo: Decirme exactamente qué publicar HOY. Sin opciones infinitas.
    
    Dame SOLO esta estructura estricta (separada por "---"):
    
    1. GANCHO DEL DÍA: (Frase corta, directa y llamativa. Curiosidad sin vender compañía).
    2. IDEA DE PUBLICACIÓN: (Instrucción breve de qué mostrar. Sin teoría).
    3. FORMATO SUGERIDO: (Elige SOLO UNO: Historia, Post o Reel corto).
    4. CTA SIMPLE: (Llamada a la acción natural).
    
    No añadas introducciones ni conclusiones. Solo los 4 puntos separados por "---".
    `;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.8, // Slightly higher for creativity
      }
    });

    return response.text || "Error generando idea.";
  } catch (error) {
    console.error("Error generating daily post:", error);
    return "Error de conexión.";
  }
};

export const generateRescuePost = async (): Promise<{type: string, text: string, visual: string, objective: string}> => {
    try {
      const prompt = `
      El usuario está en "Modo Salvavidas" (bajo de energía/tiempo).
      Necesita un post de ALTO IMPACTO y PROFUNDIDAD, pero de ejecución instantánea (Texto plano).
      
      Elige ALEATORIAMENTE uno de estos 3 ángulos y genera el contenido:
      1. VULNERABILIDAD: Admitir que el camino es duro pero vale la pena.
      2. AUTORIDAD: Una verdad incómoda sobre el éxito o el dinero.
      3. VISIÓN: Por qué empezaste esto, recordándoselo a tu 'yo' del pasado.
      
      Dame la respuesta en este formato estricto separado por tuberías "|||":
      TIPO DE POST (ej: Autoridad) ||| EL TEXTO DEL POST (Profundo, corto, con emojis, listo para copiar) ||| INSTRUCCIÓN VISUAL EXACTA (ej: Fondo negro, letra blanca, canción de piano) ||| OBJETIVO PSICOLÓGICO (Qué provoca en la mente del prospecto. Ej: Generar curiosidad, filtrar interesados)
      
      Sin introducciones.
      `;
  
      const response: GenerateContentResponse = await ai.models.generateContent({
        model: modelId,
        contents: prompt,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.9, // High creativity for impact
        }
      });
      
      const raw = response.text || "";
      const parts = raw.split('|||');
      
      if (parts.length >= 4) {
          return {
              type: parts[0].trim(),
              text: parts[1].trim(),
              visual: parts[2].trim(),
              objective: parts[3].trim()
          };
      }
      
      // Fallback
      return {
          type: "Reflexión Rápida",
          text: "¿Te has preguntado si estás viviendo la vida que soñaste o la que te tocó? ✨",
          visual: "Fondo de color sólido con letra grande.",
          objective: "Romper el patrón y hacer reflexionar."
      };

    } catch (error) {
      return {
          type: "Emergencia",
          text: "La disciplina es hacer lo que tienes que hacer, incluso cuando no quieres. Hoy cumplo. 💪",
          visual: "Fondo negro, sin música.",
          objective: "Demostrar constancia inquebrantable."
      };
    }
  };

export type HabitScenario = 'SUCCESS' | 'PUSH' | 'RESCUE_WIN';

export const generateHabitMessage = async (scenario: HabitScenario): Promise<string> => {
  const prompt = `
    El usuario acaba de reportar sobre su hábito de publicar hoy.
    Escenario: ${scenario}
    
    Contexto:
    - SUCCESS: Hizo el trabajo normal.
    - PUSH: No lo hizo.
    - RESCUE_WIN: Estaba cansado, casi renuncia, pero usó el "Modo Salvavidas" y cumplió.
    
    Genera UNA frase corta (máximo 12 palabras).
    
    Si es RESCUE_WIN: ¡Celebra la RESILIENCIA! Dile que ganar en un día malo vale doble.
    Si es SUCCESS: Celebra su identidad de líder.
    Si es PUSH: Empatía estoica.
    
    Tono: Coach maduro.
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 1, 
        maxOutputTokens: 50,
      }
    });

    return response.text?.trim() || "La constancia construye tu futuro.";
  } catch (error) {
    if (scenario === 'RESCUE_WIN') return "¡Ganar en días difíciles forja el carácter!";
    return scenario === 'SUCCESS' ? "¡Gran trabajo hoy!" : "Mañana será otro día.";
  }
};