import React from 'react';

interface InputFieldProps {
  label: string;
  value: number | string;
  onChange: (val: string) => void;
  icon?: React.ReactNode;
  placeholder?: string;
  step?: string;
  suffix?: string;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChange,
  icon,
  placeholder,
  step = "0.01",
  suffix
}) => {
  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm font-medium text-slate-400">{label}</label>
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-emerald-400 transition-colors">
          {icon}
        </div>
        <input
          type="number"
          step={step}
          className="w-full bg-slate-800 border border-slate-700 text-slate-100 text-lg rounded-xl pl-10 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all placeholder-slate-600"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        {suffix && (
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-500 text-sm font-semibold">
            {suffix}
          </div>
        )}
      </div>
    </div>
  );
};