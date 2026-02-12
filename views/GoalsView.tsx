import React, { useEffect, useState } from 'react';
import { Target, Save, Trophy, Activity } from 'lucide-react';
import { UserGoals, DailyProgress } from '../types';
import { generateDailyMotivation } from '../services/geminiService';

interface GoalsViewProps {
  goals: UserGoals;
  progress: DailyProgress;
  onUpdateGoals: (newGoals: UserGoals) => void;
}

export const GoalsView: React.FC<GoalsViewProps> = ({ goals, progress, onUpdateGoals }) => {
  const [localGoals, setLocalGoals] = useState<UserGoals>(goals);
  const [motivation, setMotivation] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    generateDailyMotivation(goals, progress).then(setMotivation);
  }, [goals, progress]);

  const handleSave = () => {
    onUpdateGoals(localGoals);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-right duration-300">
      
      {/* Motivation Card */}
      <div className="bg-gradient-to-br from-purple-600 to-indigo-800 p-6 rounded-2xl text-white shadow-lg relative overflow-hidden">
        <Trophy className="absolute top-4 right-4 text-white/20 -rotate-12" size={60} />
        <h2 className="font-bold text-lg mb-2 z-10 relative">Coach IA dice:</h2>
        <p className="text-lg italic font-light z-10 relative">"{motivation || 'Cargando motivación...'}"</p>
      </div>

      {/* Stats Display */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
            <p className="text-slate-500 text-xs uppercase font-bold tracking-wider mb-1">Contactos Hoy</p>
            <p className="text-3xl font-bold text-slate-800">{progress.contactsMade}</p>
            <p className="text-xs text-slate-400">Meta: {goals.dailyContacts}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
            <p className="text-slate-500 text-xs uppercase font-bold tracking-wider mb-1">Seguimientos</p>
            <p className="text-3xl font-bold text-slate-800">{progress.followUpsMade}</p>
            <p className="text-xs text-slate-400">Meta: {goals.dailyFollowUps}</p>
        </div>
      </div>

      {/* Goal Settings Form */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Target size={20} className="text-purple-500"/>
                Configurar Metas
            </h3>
            <button 
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                className="text-sm font-medium text-purple-600 hover:bg-purple-50 px-3 py-1 rounded-lg transition-colors"
            >
                {isEditing ? 'Guardar' : 'Editar'}
            </button>
        </div>

        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Meta diaria de Contactos</label>
                <input 
                    type="number" 
                    value={localGoals.dailyContacts}
                    disabled={!isEditing}
                    onChange={(e) => setLocalGoals({...localGoals, dailyContacts: parseInt(e.target.value) || 0})}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl disabled:opacity-60"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Meta diaria de Seguimientos</label>
                <input 
                    type="number" 
                    value={localGoals.dailyFollowUps}
                    disabled={!isEditing}
                    onChange={(e) => setLocalGoals({...localGoals, dailyFollowUps: parseInt(e.target.value) || 0})}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl disabled:opacity-60"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Meta de Ingreso Mensual ($)</label>
                <input 
                    type="text" 
                    value={localGoals.monthlyIncome}
                    disabled={!isEditing}
                    onChange={(e) => setLocalGoals({...localGoals, monthlyIncome: e.target.value})}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl disabled:opacity-60"
                />
            </div>
            
            {isEditing && (
                <button 
                    onClick={handleSave}
                    className="w-full bg-purple-600 text-white font-bold py-3 rounded-xl mt-2 flex items-center justify-center gap-2"
                >
                    <Save size={18} />
                    Guardar Cambios
                </button>
            )}
        </div>
      </div>
    </div>
  );
};