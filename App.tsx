
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { InputArea } from './components/InputArea';
import { ResultsDisplay } from './components/ResultsDisplay';
import { Loader } from './components/Loader';
import { transcribeAudio, translateToGerman } from './services/geminiService';
import { ProcessingState } from './types';
import type { InputMode } from './types';

const App: React.FC = () => {
  const [inputMode, setInputMode] = useState<InputMode>('file');
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [processingState, setProcessingState] = useState<ProcessingState>(ProcessingState.IDLE);
  const [transcription, setTranscription] = useState<string>('');
  const [translation, setTranslation] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const resetState = () => {
    setTranscription('');
    setTranslation('');
    setError(null);
    setProcessingState(ProcessingState.IDLE);
  };

  const handleFileChange = (file: File | null) => {
    setMediaFile(file);
    if(file) {
      resetState();
    }
  };

  const handleSubmit = useCallback(async () => {
    if (inputMode === 'url' && videoUrl) {
      setError("URL processing is not supported in this demo. Please use the file upload feature.");
      setProcessingState(ProcessingState.ERROR);
      return;
    }

    if (inputMode === 'file' && mediaFile) {
      setError(null);
      setProcessingState(ProcessingState.TRANSCRIBING);
      try {
        const transcribedText = await transcribeAudio(mediaFile);
        setTranscription(transcribedText);

        setProcessingState(ProcessingState.TRANSLATING);
        const translatedText = await translateToGerman(transcribedText);
        setTranslation(translatedText);

        setProcessingState(ProcessingState.DONE);
      } catch (err) {
        console.error(err);
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
        setError(`Failed during processing. ${errorMessage}`);
        setProcessingState(ProcessingState.ERROR);
      }
    }
  }, [inputMode, videoUrl, mediaFile]);

  const isProcessing = processingState === ProcessingState.TRANSCRIBING || processingState === ProcessingState.TRANSLATING;
  
  const getStatusMessage = () => {
    switch (processingState) {
      case ProcessingState.TRANSCRIBING:
        return 'Analyzing and transcribing audio... This may take a moment.';
      case ProcessingState.TRANSLATING:
        return 'Translating transcription to German...';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans flex flex-col items-center p-4 sm:p-6">
      <div className="w-full max-w-4xl mx-auto">
        <Header />
        <main className="mt-8">
          <div className="bg-gray-800/50 rounded-2xl shadow-2xl p-6 sm:p-8 backdrop-blur-sm border border-gray-700">
            <p className="text-gray-400 mb-6 text-center">
              Upload a video or audio file. Our AI will transcribe the content and translate it into German.
            </p>
            <InputArea
              inputMode={inputMode}
              setInputMode={setInputMode}
              videoUrl={videoUrl}
              setVideoUrl={setVideoUrl}
              onFileChange={handleFileChange}
              onSubmit={handleSubmit}
              isProcessing={isProcessing}
              mediaFile={mediaFile}
            />
          </div>

          <div className="mt-8">
            {isProcessing && <Loader message={getStatusMessage()} />}
            {error && (
              <div className="bg-red-900/50 border border-red-700 text-red-300 p-4 rounded-lg text-center">
                <h3 className="font-bold text-lg mb-2">An Error Occurred</h3>
                <p>{error}</p>
              </div>
            )}
            {processingState === ProcessingState.DONE && (
              <ResultsDisplay
                transcription={transcription}
                translation={translation}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
