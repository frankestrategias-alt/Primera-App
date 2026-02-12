import React, { useState } from 'react';
import { Send, Clock, Loader2, ThumbsUp } from 'lucide-react';
import { generateFollowUpScript } from '../services/geminiService';
import { ActionCard } from '../components/ActionCard';

interface FollowUpViewProps {
  onRecordAction: () => void;
}

export const FollowUpView: React.FC<FollowUpViewProps> = ({ onRecordAction }) => {
  const [lastInteraction, setLastInteraction] = useState('');
  const [timeAgo, setTimeAgo] = useState('3 días');
  const [interest, setInterest] = useState('Medio');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<string[]>([]);

  const handleGenerate = async () => {
    if (!lastInteraction.trim()) return;
    setLoading(true);
    setResults([]);
    
    const response = await generateFollowUpScript(lastInteraction, timeAgo, interest);
    const scripts = response.split('---').map(s => s.trim()).filter(s => s.length > 0);
    
    setResults(scripts);
    setLoading(false);
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-right duration-300">
      
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Clock className="text-blue-500" size={20} />
          Datos del Seguimiento
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">¿Qué hablaron la última vez?</label>
            <input 
              type="text" 
              value={lastInteraction}
              onChange={(e) => setLastInteraction(e.target.value)}
              placeholder="Ej: Vio el video de presentación, probó el producto..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Tiempo pasado</label>
                <select 
                    value={timeAgo}
                    onChange={(e) => setTimeAgo(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                >
                    <option>1 día</option>
                    <option>3 días</option>
                    <option>1 semana</option>
                    <option>+2 semanas</option>
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Interés previo</label>
                <select 
                    value={interest}
                    onChange={(e) => setInterest(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                >
                    <option>Alto</option>
                    <option>Medio</option>
                    <option>Bajo</option>
                    <option>Indeciso</option>
                </select>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={!lastInteraction || loading}
            className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-md transition-all ${
              !lastInteraction || loading
              ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
            }`}
          >
            {loading ? <Loader2 className="animate-spin" /> : <Send size={20} />}
            {loading ? 'Generando...' : 'Crear Seguimiento'}
          </button>
        </div>
      </div>

      {results.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 ml-1">Mensajes Sugeridos</h3>
          {results.map((script, idx) => (
            <ActionCard 
                key={idx} 
                text={script} 
                onCopy={onRecordAction}
            />
          ))}
           <p className="text-xs text-center text-slate-400 mt-4">
            La fortuna está en el seguimiento. Mantén la postura profesional.
          </p>
        </div>
      )}

    </div>
  );
};