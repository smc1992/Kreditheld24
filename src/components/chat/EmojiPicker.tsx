'use client';

import { useState, useRef, useEffect } from 'react';
import { Smile } from 'lucide-react';

const emojiCategories = [
  {
    name: 'Häufig',
    emojis: ['😊', '👍', '❤️', '🙏', '👋', '✅', '⭐', '🎉', '💪', '🤝', '😄', '🔥', '💯', '👏', '😍', '🙌', '💡', '📞', '📧', '🏠']
  },
  {
    name: 'Gesichter',
    emojis: ['😀', '😃', '😁', '😅', '😂', '🤣', '😇', '😉', '😌', '😋', '🤔', '🤗', '🤩', '😎', '🥳', '😢', '😬', '🙂', '😐', '🫡']
  },
  {
    name: 'Gesten',
    emojis: ['👆', '👇', '👈', '👉', '✌️', '🤞', '🫶', '💪', '👊', '✊', '🤙', '👌', '🙏', '🤝', '✍️', '💅', '🫵', '☝️', '🤟', '🖐️']
  },
  {
    name: 'Objekte',
    emojis: ['📄', '📋', '📎', '📌', '📁', '💼', '🏦', '💰', '💶', '💳', '🏡', '🔑', '📊', '📈', '📉', '⏰', '📅', '✏️', '📝', '🖨️']
  },
  {
    name: 'Symbole',
    emojis: ['✅', '❌', '⚠️', '❗', '❓', '💯', '🔴', '🟢', '🔵', '⭐', '🌟', '💫', '🎯', '🔔', '🔒', '🔓', '➡️', '⬅️', '⬆️', '⬇️']
  },
];

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
  position?: 'top' | 'bottom';
}

export default function EmojiPicker({ onEmojiSelect, position = 'top' }: EmojiPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(0);
  const pickerRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative" ref={pickerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 rounded-lg transition-all shrink-0 ${
          isOpen
            ? 'bg-amber-100 text-amber-600'
            : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
        }`}
        title="Emoji einfügen"
      >
        <Smile className="h-5 w-5" />
      </button>

      {isOpen && (
        <div
          className={`absolute z-50 ${
            position === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'
          } right-0 w-[320px] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150`}
        >
          {/* Category Tabs */}
          <div className="flex border-b border-slate-100 px-2 pt-2 gap-1">
            {emojiCategories.map((cat, i) => (
              <button
                key={cat.name}
                type="button"
                onClick={() => setActiveCategory(i)}
                className={`flex-1 text-[10px] font-bold py-1.5 rounded-t-lg transition-all ${
                  activeCategory === i
                    ? 'bg-emerald-50 text-emerald-700 border-b-2 border-emerald-500'
                    : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Emoji Grid */}
          <div className="p-2 grid grid-cols-10 gap-0.5 max-h-[160px] overflow-y-auto">
            {emojiCategories[activeCategory].emojis.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => {
                  onEmojiSelect(emoji);
                  setIsOpen(false);
                }}
                className="h-8 w-8 flex items-center justify-center text-lg rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                {emoji}
              </button>
            ))}
          </div>

          {/* Footer hint */}
          <div className="px-3 py-1.5 bg-slate-50 border-t border-slate-100 text-[9px] text-slate-400 text-center">
            Tipp: Ctrl+Cmd+Leertaste für alle Emojis
          </div>
        </div>
      )}
    </div>
  );
}
