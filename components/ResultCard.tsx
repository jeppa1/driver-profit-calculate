import React from 'react';

interface ResultCardProps {
  title: string;
  amount: number;
  isCurrency?: boolean;
  highlight?: boolean;
  colorClass?: string;
  subtext?: string;
}

export const ResultCard: React.FC<ResultCardProps> = ({ 
  title, 
  amount, 
  isCurrency = true, 
  highlight = false,
  colorClass = "text-slate-100",
  subtext
}) => {
  const formatted = isCurrency 
    ? amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    : amount.toFixed(1);

  return (
    <div className={`relative overflow-hidden rounded-2xl p-5 border ${highlight ? 'bg-emerald-900/20 border-emerald-500/30' : 'bg-slate-800 border-slate-700'}`}>
      <div className="relative z-10">
        <p className="text-sm font-medium text-slate-400 mb-1">{title}</p>
        <h3 className={`text-2xl font-bold ${colorClass}`}>{formatted}</h3>
        {subtext && <p className="text-xs text-slate-500 mt-1">{subtext}</p>}
      </div>
      {highlight && (
        <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>
      )}
    </div>
  );
};