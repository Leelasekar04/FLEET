"use client";

import { X, CheckCircle, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

export interface EditField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'email' | 'select' | 'textarea' | 'date';
  options?: { label: string; value: string }[];
  placeholder?: string;
  disabled?: boolean;
}

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void> | void;
  title: string;
  fields: EditField[];
  initialData: any;
}

export default function EditModal({ isOpen, onClose, onSave, title, fields, initialData }: EditModalProps) {
  const [formData, setFormData] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen && initialData) {
      setFormData(initialData);
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(formData);
    } finally {
      setIsSaving(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-xl font-black text-slate-900 tracking-tight">{title}</h2>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center bg-white hover:bg-slate-100 border border-slate-200 rounded-full text-slate-500 transition-colors shadow-sm"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body (Scrollable) */}
        <div className="p-6 overflow-y-auto max-h-[60vh] space-y-4">
          {fields.map((field) => (
            <div key={field.name} className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                {field.label}
              </label>
              
              {field.type === 'select' ? (
                <select
                  disabled={field.disabled}
                  value={formData[field.name] || ''}
                  onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                  className="w-full text-sm p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 bg-slate-50 hover:bg-white transition-all disabled:opacity-50"
                >
                  {field.options?.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              ) : field.type === 'textarea' ? (
                <textarea
                  disabled={field.disabled}
                  placeholder={field.placeholder}
                  value={formData[field.name] || ''}
                  onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                  className="w-full text-sm p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 bg-slate-50 hover:bg-white transition-all resize-none min-h-[100px] disabled:opacity-50"
                />
              ) : (
                <input
                  type={field.type}
                  disabled={field.disabled}
                  placeholder={field.placeholder}
                  value={formData[field.name] || ''}
                  onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                  className="w-full text-sm p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 bg-slate-50 hover:bg-white transition-all disabled:opacity-50"
                />
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex gap-3 justify-end">
          <button 
            onClick={onClose}
            className="px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-sm font-bold shadow-sm transition-all"
          >
            Cancel
          </button>
          <button 
            disabled={isSaving}
            onClick={handleSave}
            className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-bold shadow-lg shadow-slate-900/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSaving ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} className="text-emerald-400" />}
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
