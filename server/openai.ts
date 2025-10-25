import OpenAI from "openai";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const BARBERSHOP_CONTEXT = `Eres un asistente virtual amigable de "Barbería Pro", una barbería moderna y profesional.

INFORMACIÓN DE LA BARBERÍA:
- Nombre: Barbería Pro
- Ubicación: Av. Principal 123, Centro
- Teléfono: +52 123 456 7890

HORARIOS:
- Lunes a Viernes: 9:00 AM - 8:00 PM
- Sábado: 9:00 AM - 7:00 PM
- Domingo: 10:00 AM - 4:00 PM

SERVICIOS Y PRECIOS:
1. Corte de Cabello - $250 (30 min)
2. Arreglo de Barba - $150 (20 min)
3. Corte + Barba - $350 (45 min)
4. Coloración - $450 (60 min)
5. Tratamiento Capilar - $350 (40 min)
6. Afeitado Tradicional - $200 (25 min)

BARBEROS:
1. Carlos Martínez - Especialista en cortes clásicos y modernos
2. Miguel Ángel - Experto en barbas y fade cuts
3. Ana García - Coloración y tratamientos capilares

INSTRUCCIONES:
- Sé amigable, profesional y servicial
- Responde en español de manera clara y concisa
- Si te preguntan por reservas, menciona que pueden usar el sistema de reservas en línea
- Proporciona información precisa sobre servicios, precios y horarios
- Si no sabes algo, sé honesto y sugiere contactar directamente a la barbería
- Usa un tono conversacional y cercano`;

// Fallback responses for common questions
const FALLBACK_RESPONSES: Record<string, string> = {
  horarios: `¡Claro! Nuestros horarios son:
  
📅 Lunes a Viernes: 9:00 AM - 8:00 PM
📅 Sábado: 9:00 AM - 7:00 PM
📅 Domingo: 10:00 AM - 4:00 PM

¿Te gustaría reservar una cita?`,

  servicios: `¡Ofrecemos una variedad de servicios profesionales!

✂️ Corte de Cabello - $250 (30 min)
🧔 Arreglo de Barba - $150 (20 min)
💈 Corte + Barba - $350 (45 min)
🎨 Coloración - $450 (60 min)
💆 Tratamiento Capilar - $350 (40 min)
🪒 Afeitado Tradicional - $200 (25 min)

¿Qué servicio te interesa?`,

  precios: `Nuestros precios son muy competitivos:

• Corte de Cabello: $250
• Arreglo de Barba: $150
• Corte + Barba (paquete): $350
• Coloración: $450
• Tratamiento Capilar: $350
• Afeitado Tradicional: $200

¡Todos nuestros servicios incluyen atención profesional de calidad!`,

  ubicacion: `📍 Estamos ubicados en:

Av. Principal 123, Centro

📞 Teléfono: +52 123 456 7890

¡Te esperamos!`,

  reserva: `¡Excelente! Para reservar tu cita:

1. Haz clic en el botón "Reservar" en el menú
2. Selecciona tu barbero preferido
3. Elige el servicio que deseas
4. Escoge fecha y hora
5. ¡Listo!

También puedes llamarnos al +52 123 456 7890`,

  barberos: `Contamos con un equipo de barberos expertos:

👨‍🦱 Carlos Martínez - Especialista en cortes clásicos y modernos
👨‍🦰 Miguel Ángel - Experto en barbas y fade cuts
👩‍🦰 Ana García - Coloración y tratamientos capilares

Todos con años de experiencia y 5 estrellas de calificación. ¿Quieres reservar con alguno?`,

  default: `¡Hola! Soy el asistente de Barbería Pro. Puedo ayudarte con:

• Horarios de atención
• Servicios y precios
• Información de nuestros barberos
• Ubicación y contacto
• Proceso de reserva

¿Qué te gustaría saber?`,
};

function getFallbackResponse(message: string): string {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes("horario") || lowerMessage.includes("hora") || lowerMessage.includes("abierto")) {
    return FALLBACK_RESPONSES.horarios;
  }

  if (lowerMessage.includes("servicio") || lowerMessage.includes("qué ofrec") || lowerMessage.includes("que ofrec")) {
    return FALLBACK_RESPONSES.servicios;
  }

  if (lowerMessage.includes("precio") || lowerMessage.includes("costo") || lowerMessage.includes("cuanto cuesta") || lowerMessage.includes("cuánto cuesta")) {
    return FALLBACK_RESPONSES.precios;
  }

  if (lowerMessage.includes("ubicación") || lowerMessage.includes("ubicacion") || lowerMessage.includes("dirección") || lowerMessage.includes("direccion") || lowerMessage.includes("dónde") || lowerMessage.includes("donde")) {
    return FALLBACK_RESPONSES.ubicacion;
  }

  if (lowerMessage.includes("reserv") || lowerMessage.includes("cita") || lowerMessage.includes("agendar")) {
    return FALLBACK_RESPONSES.reserva;
  }

  if (lowerMessage.includes("barber") || lowerMessage.includes("estilista") || lowerMessage.includes("quien") || lowerMessage.includes("quién")) {
    return FALLBACK_RESPONSES.barberos;
  }

  return FALLBACK_RESPONSES.default;
}

export async function getChatbotResponse(message: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: BARBERSHOP_CONTEXT,
        },
        {
          role: "user",
          content: message,
        },
      ],
      max_completion_tokens: 500,
    });

    return response.choices[0].message.content || getFallbackResponse(message);
  } catch (error: any) {
    console.error("Error calling OpenAI:", error);
    
    // Use fallback responses when OpenAI is unavailable
    if (error?.status === 429 || error?.code === "insufficient_quota") {
      console.log("OpenAI quota exceeded, using fallback response");
      return getFallbackResponse(message);
    }
    
    // For other errors, also use fallback
    console.log("OpenAI error, using fallback response");
    return getFallbackResponse(message);
  }
}
