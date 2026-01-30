import React, { useState, useEffect } from 'react';
import { X, Save, CheckCircle2 } from 'lucide-react';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
    const [signature, setSignature] = useState('');
    const [loading, setLoading] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchSignature();
        }
    }, [isOpen]);

    const fetchSignature = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/settings/signature');
            const data = await res.json();
            if (data.success) {
                setSignature(data.signature);
            }
        } catch (error) {
            console.error('Failed to load signature', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            await fetch('/api/admin/settings/signature', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ signature }),
            });
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        } catch (error) {
            console.error('Failed to save signature', error);
            alert('Fehler beim Speichern');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 m-4">
                {/* Header */}
                <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div>
                        <h2 className="text-xl font-black text-slate-900">Einstellungen</h2>
                        <p className="text-sm text-slate-500 font-medium mt-1">Konfigurieren Sie Ihre E-Mail Signatur</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8">
                    <label className="block text-sm font-bold text-slate-700 mb-3">
                        Globale E-Mail Signatur (HTML erlaubt)
                    </label>
                    <div className="relative">
                        <textarea
                            value={signature}
                            onChange={(e) => setSignature(e.target.value)}
                            className="w-full h-64 p-4 rounded-xl border border-slate-200 bg-slate-50 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none"
                            placeholder="<div>Mit freundlichen Grüßen...</div>"
                        />
                        <div className="absolute bottom-4 right-4 text-[10px] text-slate-400 font-medium bg-white/50 px-2 py-1 rounded backdrop-blur-sm">
                            HTML Format
                        </div>
                    </div>
                    <p className="mt-3 text-xs text-slate-400">
                        Diese Signatur wird automatisch an alle ausgehenden E-Mails angehängt.
                    </p>
                </div>

                {/* Footer */}
                <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-white hover:text-slate-900 rounded-xl transition-all"
                    >
                        Abbrechen
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className={`
              flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white shadow-lg transition-all
              ${saved
                                ? 'bg-emerald-500 shadow-emerald-500/20'
                                : 'bg-slate-900 hover:bg-emerald-600 shadow-slate-900/20 hover:shadow-emerald-600/20'
                            }
            `}
                    >
                        {saved ? (
                            <>
                                <CheckCircle2 className="h-4 w-4" />
                                Gespeichert
                            </>
                        ) : (
                            <>
                                <Save className="h-4 w-4" />
                                {loading ? 'Speichere...' : 'Speichern'}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
