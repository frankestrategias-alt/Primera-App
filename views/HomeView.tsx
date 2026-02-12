import React, { useEffect, useState } from 'react';
import { MessageCircle, ShieldCheck, Target, Zap, UserPlus, Trophy, ChevronRight, Share2, X, Check, Copy, Megaphone } from 'lucide-react';
import { ViewState, DailyProgress, UserGoals } from '../types';

interface HomeViewProps {
  setViewState: (view: ViewState) => void;
  progress: DailyProgress;
  goals: UserGoals;
}

// Helper component for Circular Progress
const CircularProgress = ({ 
  current, 
  max, 
  colorClass, 
  icon: Icon 
}: { 
  current: number; 
  max: number; 
  colorClass: string; 
  icon: React.ElementType 
}) => {
  const [offset, setOffset] = useState(0);
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min(100, Math.max(0, (current / max) * 100));

  useEffect(() => {
    const progressOffset = circumference - (percentage / 100) * circumference;
    // Small delay to trigger animation
    const timer = setTimeout(() => setOffset(progressOffset), 100);
    return () => clearTimeout(timer);
  }, [percentage, circumference]);

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-20 h-20">
        {/* Background Circle */}
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="40"
            cy="40"
            r={radius}
            stroke="currentColor"
            strokeWidth="6"
            fill="transparent"
            className="text-slate-700/50"
          />
          {/* Progress Circle */}
          <circle
            cx="40"
            cy="40"
            r={radius}
            stroke="currentColor"
            strokeWidth="6"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset} // Animated via state
            strokeLinecap="round"
            className={`${colorClass} transition-all duration-1000 ease-out`}
            style={{ strokeDashoffset: offset }} // Inline style for ensuring update
          />
        </svg>
        {/* Icon in Center */}
        <div className={`absolute inset-0 flex items-center justify-center ${colorClass}`}>
          <Icon size={24} />
        </div>
      </div>
      <div className="mt-2 text-center">
        <span className="text-2xl font-bold text-white">{current}</span>
        <span className="text-xs text-slate-400">/{max}</span>
      </div>
    </div>
  );
};

export const HomeView: React.FC<HomeViewProps> = ({ setViewState, progress, goals }) => {
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const totalActions = progress.contactsMade + progress.followUpsMade;
  const totalGoals = goals.dailyContacts + goals.dailyFollowUps;
  const overallPercentage = Math.min(100, Math.round((totalActions / totalGoals) * 100));

  const shareText = `🚀 *Mi Progreso de Hoy*\n\n✅ Contactos: ${progress.contactsMade}/${goals.dailyContacts}\n🔄 Seguimientos: ${progress.followUpsMade}/${goals.dailyFollowUps}\n🔥 Energía: ${overallPercentage}%\n\n¡La consistencia es clave! #NetworkMarketing #ActionPartner`;

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Mi Progreso Diario',
          text: shareText,
        });
      } catch (err) {
        console.log('Error sharing', err);
      }
    } else {
      handleCopy();
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in zoom-in duration-300 relative">
      
      {/* Hero / Stats Card */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-6 text-white shadow-xl shadow-slate-200 border border-slate-700 relative overflow-hidden">
        
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -ml-10 -mb-10 pointer-events-none"></div>

        <div className="flex justify-between items-center mb-6 relative z-10">
          <div>
            <h2 className="text-xl font-bold tracking-tight">Tu Energía Diaria</h2>
            <p className="text-slate-400 text-sm">{new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
          </div>
          <div className="flex gap-2">
            <button 
                onClick={() => setShowShareModal(true)}
                className="p-2 rounded-xl bg-slate-700/50 text-slate-300 hover:bg-slate-600 hover:text-white transition-colors border border-white/10"
                title="Compartir Progreso"
            >
                <Share2 size={24} />
            </button>
            <div className={`p-2 rounded-xl backdrop-blur-md border border-white/10 ${overallPercentage >= 100 ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-700/50 text-slate-300'}`}>
                {overallPercentage >= 100 ? <Trophy size={24} className="animate-bounce" /> : <Zap size={24} />}
            </div>
          </div>
        </div>

        <div className="flex justify-around items-end relative z-10">
            {/* Contacts Circle */}
            <div className="flex flex-col items-center gap-1">
                <CircularProgress 
                    current={progress.contactsMade} 
                    max={goals.dailyContacts} 
                    colorClass="text-emerald-400"
                    icon={UserPlus}
                />
                <span className="text-xs font-medium text-emerald-400/80 tracking-wide uppercase">Contactos</span>
            </div>

            {/* Divider */}
            <div className="h-12 w-px bg-slate-700/50 mb-6"></div>

            {/* FollowUps Circle */}
            <div className="flex flex-col items-center gap-1">
                <CircularProgress 
                    current={progress.followUpsMade} 
                    max={goals.dailyFollowUps} 
                    colorClass="text-blue-400"
                    icon={MessageCircle}
                />
                <span className="text-xs font-medium text-blue-400/80 tracking-wide uppercase">Seguimientos</span>
            </div>
        </div>
        
        {/* Footer Motivation */}
        <div className="mt-6 pt-4 border-t border-slate-700/50 text-center relative z-10">
             <p className="text-sm text-slate-300 font-light">
                {overallPercentage >= 100 
                    ? <span className="text-amber-400 font-bold">¡Objetivo Destruido! 🔥</span> 
                    : overallPercentage >= 50 
                        ? "¡Vas por buen camino, no pares!" 
                        : "El día es joven. ¡Ataquemos!"}
             </p>
        </div>
      </div>

      {/* Main Action Grid */}
      <div className="grid grid-cols-1 gap-4">
        
        <button 
            onClick={() => setViewState('CONTACT')}
            className="group relative overflow-hidden bg-white hover:bg-emerald-50/50 border border-slate-200 hover:border-emerald-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all text-left flex items-center justify-between"
        >
            <div className="flex items-center gap-4">
                <div className="bg-emerald-100 p-3 rounded-2xl text-emerald-600 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                    <UserPlus size={26} strokeWidth={2.5} />
                </div>
                <div>
                    <h3 className="font-bold text-slate-800 text-lg group-hover:text-emerald-800 transition-colors">Contactar</h3>
                    <p className="text-sm text-slate-500 font-medium">Nuevos prospectos</p>
                </div>
            </div>
            <ChevronRight className="text-slate-300 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
        </button>

        <button 
            onClick={() => setViewState('FOLLOWUP')}
            className="group relative overflow-hidden bg-white hover:bg-blue-50/50 border border-slate-200 hover:border-blue-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all text-left flex items-center justify-between"
        >
            <div className="flex items-center gap-4">
                <div className="bg-blue-100 p-3 rounded-2xl text-blue-600 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300">
                    <MessageCircle size={26} strokeWidth={2.5} />
                </div>
                <div>
                    <h3 className="font-bold text-slate-800 text-lg group-hover:text-blue-800 transition-colors">Dar Seguimiento</h3>
                    <p className="text-sm text-slate-500 font-medium">Retoma conversaciones</p>
                </div>
            </div>
            <ChevronRight className="text-slate-300 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
        </button>

        <button 
            onClick={() => setViewState('OBJECTIONS')}
            className="group relative overflow-hidden bg-white hover:bg-amber-50/50 border border-slate-200 hover:border-amber-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all text-left flex items-center justify-between"
        >
            <div className="flex items-center gap-4">
                <div className="bg-amber-100 p-3 rounded-2xl text-amber-600 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                    <ShieldCheck size={26} strokeWidth={2.5} />
                </div>
                <div>
                    <h3 className="font-bold text-slate-800 text-lg group-hover:text-amber-800 transition-colors">Responder Objeciones</h3>
                    <p className="text-sm text-slate-500 font-medium">Respuestas claras</p>
                </div>
            </div>
            <ChevronRight className="text-slate-300 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
        </button>

         {/* New Feature: PUBLICA HOY */}
         <button 
            onClick={() => setViewState('DAILY_POST')}
            className="group relative overflow-hidden bg-white hover:bg-pink-50/50 border border-slate-200 hover:border-pink-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all text-left flex items-center justify-between"
        >
            <div className="flex items-center gap-4">
                <div className="bg-pink-100 p-3 rounded-2xl text-pink-600 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300">
                    <Megaphone size={26} strokeWidth={2.5} />
                </div>
                <div>
                    <h3 className="font-bold text-slate-800 text-lg group-hover:text-pink-800 transition-colors">Publica Hoy</h3>
                    <p className="text-sm text-slate-500 font-medium">Marketing de Atracción</p>
                </div>
            </div>
            <ChevronRight className="text-slate-300 group-hover:text-pink-400 group-hover:translate-x-1 transition-all" />
        </button>

        <button 
            onClick={() => setViewState('GOALS')}
            className="group relative overflow-hidden bg-white hover:bg-purple-50/50 border border-slate-200 hover:border-purple-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all text-left flex items-center justify-between"
        >
            <div className="flex items-center gap-4">
                <div className="bg-purple-100 p-3 rounded-2xl text-purple-600 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300">
                    <Target size={26} strokeWidth={2.5} />
                </div>
                <div>
                    <h3 className="font-bold text-slate-800 text-lg group-hover:text-purple-800 transition-colors">Mis Metas</h3>
                    <p className="text-sm text-slate-500 font-medium">Enfoque y disciplina</p>
                </div>
            </div>
            <ChevronRight className="text-slate-300 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
        </button>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200 relative">
                
                {/* Close Button */}
                <button 
                    onClick={() => setShowShareModal(false)}
                    className="absolute top-3 right-3 p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200 transition-colors z-20"
                >
                    <X size={20} />
                </button>

                {/* Visual Card (Ready for Screenshot) */}
                <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-8 text-center text-white relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                    
                    <h3 className="text-lg font-medium text-white/80 uppercase tracking-widest mb-4 relative z-10">Resumen Diario</h3>
                    
                    <div className="inline-flex items-center justify-center w-28 h-28 rounded-full border-4 border-white/20 bg-white/10 mb-6 relative z-10">
                        <span className="text-4xl font-bold">{overallPercentage}%</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 relative z-10">
                        <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                            <p className="text-2xl font-bold">{progress.contactsMade}</p>
                            <p className="text-xs text-indigo-200 uppercase">Contactos</p>
                        </div>
                        <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                            <p className="text-2xl font-bold">{progress.followUpsMade}</p>
                            <p className="text-xs text-indigo-200 uppercase">Seguimientos</p>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="p-5 bg-slate-50">
                    <p className="text-center text-slate-500 text-sm mb-4">
                        ¡Comparte tus resultados y motiva a tu equipo!
                    </p>
                    <div className="flex gap-3">
                        <button 
                            onClick={handleNativeShare}
                            className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                        >
                            <Share2 size={18} />
                            Compartir
                        </button>
                        <button 
                            onClick={handleCopy}
                            className="flex-none bg-white border border-slate-200 text-slate-600 p-3 rounded-xl hover:bg-slate-50 transition-colors"
                        >
                            {copied ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};