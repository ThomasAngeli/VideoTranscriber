
import React, { useState } from 'react';
import { ClipboardIcon } from './icons';

interface ResultsDisplayProps {
  transcription: string;
  translation: string;
}

const ResultCard: React.FC<{ title: string; text: string }> = ({ title, text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gray-800/60 rounded-xl shadow-lg p-5 relative backdrop-blur-sm border border-gray-700">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold text-blue-300">{title}</h3>
        <button
          onClick={handleCopy}
          className="text-gray-400 hover:text-white transition-colors p-2 rounded-md hover:bg-gray-700"
          aria-label={`Copy ${title}`}
        >
          {copied ? <span className="text-xs text-green-400">Copied!</span> : <ClipboardIcon className="w-5 h-5" />}
        </button>
      </div>
      <div className="prose prose-invert prose-p:text-gray-300 max-h-60 overflow-y-auto p-1 rounded bg-gray-900/50">
        <p className="whitespace-pre-wrap break-words">{text}</p>
      </div>
    </div>
  );
};


export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ transcription, translation }) => {
  return (
    <div className="grid md:grid-cols-2 gap-6 animate-fade-in">
      <ResultCard title="Original Transcription" text={transcription} />
      <ResultCard title="German Translation" text={translation} />
    </div>
  );
};

// Add fade-in animation to tailwind config or a style tag if needed. For simplicity, we can do it here.
const style = document.createElement('style');
style.innerHTML = `
  @keyframes fade-in {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in {
    animation: fade-in 0.5s ease-out forwards;
  }
`;
document.head.appendChild(style);
