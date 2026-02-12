import React, { useState } from 'react';
import { ShieldCheck, MessageSquareWarning, Loader2, ChevronRight, User } from 'lucide-react';
import { generateObjectionResponse } from '../services/geminiService';
import { ActionCard } from '../components/ActionCard';

export const ObjectionView: React.FC = () => {
  const [selectedObjection, setSelectedObjection] = useState<string | null>(null);
  const [customObjection, setCustomObjection] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);

  const commonObjections = [
    "No tengo dinero",
    "No tengo tiempo",
    "Es una pirámide",
    "Tengo que consultarlo con mi pareja",
    "No soy bueno vendiendo",
    "Déjame pensarlo"
  ];

  const handleObjectionSubmit = async (obj: string) => {
    setSelectedObjection(obj);
    setLoading(true);
    setResponse(null);
    
    const result = await generateObjectionResponse(obj);
    setResponse(result);
    setLoading(false);
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-right duration-300">
      
      {!response && !loading && (
        <div className="space-y-4">
            <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 mb-4">
                <h2 className="text-amber-800 font-bold text-lg mb-1 flex items-center gap-2">
                    <ShieldCheck size={20}/>
                    Escudo Anti-Excusas
                </h2>
                <p className="text-amber-700/80 text-sm">
                    Selecciona qué te dijeron. La IA te dará una respuesta profesional y empática.
                </p>
            </div>

            <p className="text-slate-600 font-medium ml-1">Objeciones Comunes:</p>
            <div className="grid grid-cols-1 gap-3">
                {commonObjections.map((obj) => (
                    <button
                        key={obj}
                        onClick={() => handleObjectionSubmit(obj)}
                        className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between hover:bg-amber-50 hover:border-amber-300 transition-all text-left group"
                    >
                        <span className="font-medium text-slate-700 group-hover:text-amber-900 transition-colors">{obj}</span>
                        <ChevronRight size={20} className="text-slate-300 group-hover:text-amber-400 transition-colors" />
                    </button>
                ))}
            </div>

            <div className="mt-6 pt-6 border-t border-slate-200">
                <label className="block text-sm font-medium text-slate-600 mb-2">¿Fue algo diferente?</label>
                <div className="flex gap-2">
                    <input 
                        type="text" 
                        value={customObjection}
                        onChange={(e) => setCustomObjection(e.target.value)}
                        placeholder="Escribe exactamente qué te dijeron..."
                        className="flex-1 p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all"
                    />
                    <button 
                        onClick={() => handleObjectionSubmit(customObjection)}
                        disabled={!customObjection}
                        className="bg-slate-800 text-white p-3 rounded-xl disabled:opacity-50 hover:bg-slate-900 transition-colors shadow-md"
                    >
                        <ShieldCheck size={24} />
                    </button>
                </div>
            </div>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="bg-amber-100 p-4 rounded-full mb-4 animate-pulse">
                <ShieldCheck className="text-amber-600" size={32} />
            </div>
            <Loader2 className="animate-spin text-slate-400 mb-2" size={24} />
            <p className="text-slate-500 font-medium">Analizando la objeción...</p>
            <p className="text-slate-400 text-xs mt-1">Buscando el mejor ángulo psicológico.</p>
        </div>
      )}

      {response && (
        <div className="animate-in fade-in zoom-in duration-300">
             {/* Context Box */}
             <div className="bg-slate-100 border border-slate-200 p-4 rounded-xl mb-6 relative">
                <div className="absolute -top-3 left-4 bg-white px-2 py-0.5 rounded-md border border-slate-200 text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <User size={12} /> Prospecto dijo:
                </div>
                <p className="text-slate-700 italic font-medium">
                    "{selectedObjection || customObjection}"
                </p>
             </div>
             
             <h3 className="text-sm font-bold text-amber-600 uppercase tracking-wider mb-3 ml-1 flex items-center gap-2">
                <ShieldCheck size={16} />
                Respuesta Sugerida
             </h3>
             
             <ActionCard text={response} />

             <div className="mt-4 bg-blue-50 p-3 rounded-lg border border-blue-100">
                <p className="text-xs text-blue-700 text-center">
                    💡 <strong>Tip Pro:</strong> Usa el botón de editar (lápiz) para adaptar la respuesta a tu propio vocabulario antes de enviar.
                </p>
             </div>

             <button 
                onClick={() => {
                    setResponse(null);
                    setSelectedObjection(null);
                    setCustomObjection('');
                }}
                className="w-full py-4 mt-6 text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 rounded-xl font-bold transition-all shadow-sm"
             >
                Responder otra objeción
             </button>
        </div>
      )}

    </div>
  );
};