
import React, { useRef } from 'react';
import type { InputMode } from '../types';
import { UploadIcon, LinkIcon } from './icons';

interface InputAreaProps {
  inputMode: InputMode;
  setInputMode: (mode: InputMode) => void;
  videoUrl: string;
  setVideoUrl: (url: string) => void;
  onFileChange: (file: File | null) => void;
  onSubmit: () => void;
  isProcessing: boolean;
  mediaFile: File | null;
}

export const InputArea: React.FC<InputAreaProps> = ({
  inputMode,
  setInputMode,
  videoUrl,
  setVideoUrl,
  onFileChange,
  onSubmit,
  isProcessing,
  mediaFile
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    onFileChange(file);
  };

  const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
  };
  
  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0] || null;
    onFileChange(file);
  };

  const buttonDisabled = isProcessing || (inputMode === 'file' && !mediaFile) || (inputMode === 'url' && !videoUrl);

  return (
    <div>
      <div className="flex justify-center mb-6">
        <div className="bg-gray-700/50 rounded-lg p-1 flex space-x-1">
          <button
            onClick={() => setInputMode('file')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              inputMode === 'file' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-600/50'
            }`}
          >
            Upload File
          </button>
          <button
            onClick={() => setInputMode('url')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              inputMode === 'url' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-600/50'
            }`}
          >
            From URL
          </button>
        </div>
      </div>

      {inputMode === 'file' ? (
        <div className="flex flex-col items-center">
            <label 
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                htmlFor="file-upload" 
                className="w-full flex flex-col items-center justify-center px-6 py-10 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:bg-gray-700/50 hover:border-blue-500 transition-colors"
            >
                <UploadIcon className="w-10 h-10 text-gray-500 mb-3" />
                <p className="font-semibold text-gray-300">
                    {mediaFile ? mediaFile.name : 'Click to upload or drag and drop'}
                </p>
                <p className="text-xs text-gray-500">Video or Audio (MP4, MOV, MP3, WAV, etc.)</p>
            </label>
          <input id="file-upload" ref={fileInputRef} type="file" className="hidden" onChange={handleFileSelect} accept="video/*,audio/*" />
        </div>
      ) : (
        <div className="relative">
            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
                type="text"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="Paste video or social media link here"
                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg py-3 pr-3 pl-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                disabled={isProcessing}
            />
        </div>
      )}

      <div className="mt-6 flex justify-center">
        <button
          onClick={onSubmit}
          disabled={buttonDisabled}
          className="px-8 py-3 text-lg font-bold text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300 disabled:transform-none"
        >
          {isProcessing ? 'Processing...' : 'Transcribe & Translate'}
        </button>
      </div>
    </div>
  );
};
