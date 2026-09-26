import React, { useState } from 'react';
import { X, Lock, KeyRound, ShieldAlert, Check } from 'lucide-react';
import { useCafe } from '../../context/CafeContext';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { adminLogin, settings } = useCafe();
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminLogin(pin)) {
      setError('');
      setPin('');
      onSuccess();
      onClose();
    } else {
      setError('Incorrect passcode. Please check the passcode and try again.');
    }
  };

  const handleUseDefault = () => {
    setPin(settings.adminPin || 'melora2026');
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#141311] rounded-2xl max-w-md w-full shadow-2xl border border-[#2B2723] overflow-hidden text-stone-200">
        
        {/* Header */}
        <div className="p-6 bg-[#181614] border-b border-[#24211D] text-center relative">
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-4 right-4 text-stone-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center mx-auto mb-3">
            <Lock className="w-6 h-6" />
          </div>

          <h3 className="font-serif-display text-2xl text-white">
            Staff & Admin Access
          </h3>
          <p className="text-xs text-stone-400 mt-1">
            Access live order kitchen dispatch, edit menu prices, update contact info & manage settings.
          </p>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
              Enter Admin Security PIN / Passcode
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setError('');
                }}
                placeholder="Enter passcode..."
                autoFocus
                className="w-full pl-9 pr-4 py-2.5 bg-[#1B1917] border border-[#2E2A25] rounded-xl text-xs sm:text-sm text-stone-100 placeholder:text-stone-600 focus:outline-none focus:border-amber-400 font-mono tracking-widest"
              />
            </div>
            {error && (
              <div className="flex items-center gap-1.5 text-xs text-rose-400 mt-2">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Quick Helper for Demo Testing */}
          <div className="p-3 bg-[#191715] rounded-xl border border-[#272420] text-xs text-stone-400 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="font-medium text-stone-300">Default Passcode:</span>
              <div className="font-mono text-amber-300 font-semibold">{settings.adminPin || 'melora2026'}</div>
            </div>
            <button
              type="button"
              onClick={handleUseDefault}
              className="px-2.5 py-1 bg-[#24211D] hover:bg-[#302B26] text-amber-300 border border-[#38332C] rounded-lg text-xs font-medium cursor-pointer transition-colors"
            >
              Fill Default
            </button>
          </div>

          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-[#1B1917] hover:bg-[#25221E] text-stone-300 border border-[#2E2A25] rounded-xl text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold rounded-xl text-xs transition-colors cursor-pointer shadow-md flex items-center justify-center gap-1.5"
            >
              <span>Unlock Portal</span>
              <Check className="w-4 h-4" />
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
