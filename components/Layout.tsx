import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  onBack?: () => void;
  showBack?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, title, onBack, showBack = false }) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col max-w-md mx-auto shadow-2xl relative overflow-hidden">
        {/* Header */}
        <header className="bg-white p-4 border-b border-slate-200 sticky top-0 z-10 flex items-center h-16">
            {showBack && onBack && (
                <button 
                    onClick={onBack}
                    className="mr-3 p-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors"
                >
                    <ArrowLeft size={24} />
                </button>
            )}
            <h1 className="text-xl font-bold text-slate-800 truncate flex-1">{title || 'MLM Action'}</h1>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 pb-20 scrollbar-hide">
            {children}
        </main>
    </div>
  );
};