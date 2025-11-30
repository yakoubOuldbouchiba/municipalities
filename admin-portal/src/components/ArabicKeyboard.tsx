import React from 'react';
import './ArabicKeyboard.css';

interface ArabicKeyboardProps {
  onInput: (char: string) => void;
  onBackspace: () => void;
}

const ArabicKeyboard: React.FC<ArabicKeyboardProps> = ({ onInput, onBackspace }) => {
  // Arabic keyboard layout
  const rows = [
    ['ض', 'ص', 'ث', 'ق', 'ف', 'غ', 'ع', 'ه', 'خ', 'ح', 'ج', 'د'],
    ['ش', 'س', 'ي', 'ب', 'ل', 'ا', 'ت', 'ن', 'م', 'ك', 'ط'],
    ['ؤ', 'ئ', 'ء', 'ؤ', 'ر', 'لا', 'ى', 'ة', 'و', 'ز', 'ظ'],
  ];

  return (
    <div className="arabic-keyboard">
      {rows.map((row, rowIdx) => (
        <div key={rowIdx} className="keyboard-row">
          {row.map((char, charIdx) => (
            <button
              key={charIdx}
              type="button"
              className="keyboard-key"
              onClick={() => onInput(char)}
              onMouseDown={(e) => e.preventDefault()}
            >
              {char}
            </button>
          ))}
        </div>
      ))}
      <div className="keyboard-row">
        <button
          type="button"
          className="keyboard-key space-key"
          onClick={() => onInput(' ')}
          onMouseDown={(e) => e.preventDefault()}
        >
          space
        </button>
        <button
          type="button"
          className="keyboard-key backspace-key"
          onClick={onBackspace}
          onMouseDown={(e) => e.preventDefault()}
        >
          ← Backspace
        </button>
      </div>
    </div>
  );
};

export default ArabicKeyboard;
