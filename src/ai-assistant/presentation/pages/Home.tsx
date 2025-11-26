import { Link } from "react-router-dom";
import { MessageSquare } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [showInfo, setShowInfo] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-2xl">
        <div className="mb-8 flex justify-center">
          <div className="bg-white rounded-full p-6 shadow-lg border border-gray-200">
            <MessageSquare size={64} className="text-gray-700" />
          </div>
        </div>

        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
          Calima IA
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Tu asistente turístico inteligente para Calima Darién
        </p>

        <div className="space-y-4">
          <p className="text-gray-700 text-base leading-relaxed">
            Descubre información sobre deportes náuticos, cultura, gastronomía y
            lugares turísticos con nuestro asistente alimentado por IA.
          </p>
        </div>

        <Link
          to="/chat"
          className="mt-12 inline-block px-8 py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
        >
          Ir al Chat
        </Link>
      </div>

      {/* Info Modal */}
      {showInfo && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
              Sobre Calima IA
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                Objetivo: Mejorar la experiencia de los visitantes al municipio de Calima Darién y el Lago Calima,
                resolviendo cualquier duda sobre deportes náuticos, cultura, gastronomía y lugares turísticos.
              </p>
              <p>
                Para usar el chat de manera avanzada con modelos de IA como Claude, Google Gemini u OpenAI,
                debes agregar tu API Key en Configuración.
              </p>
              <p>
                Seguridad: No almaceno tu API Key en ningún lugar del proyecto.
                Se envía directamente al proveedor del modelo de IA.
              </p>
              <p>
                Si te preocupa el uso de tu API Key, puedes crear una nueva en un modelo gratuito
                (como Google Gemini) donde no te cobrarán. Para más tranquilidad, puedes eliminarla después de usar el asistente.
              </p>
            </div>
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => setShowInfo(false)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
