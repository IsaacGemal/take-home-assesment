'use client';

import { useState, useCallback, useEffect } from 'react';
import { wsService } from '@/services/api';
import { TOTAL_PROCESSES } from '@/constants/process';

export default function Home() {
  const [isProcessing, setIsProcessing] = useState(false);

  // Connect to WebSocket when component mounts
  useEffect(() => {
    wsService.connect()
      .catch(error => console.error('Failed to connect to WebSocket:', error));

    // Add message handler
    const messageHandler = (event: MessageEvent) => {
      const data = JSON.parse(event.data);

      if (data.status === 'all_completed') {
        setIsProcessing(false);
      }
    };

    wsService.ws?.addEventListener('message', messageHandler);

    // Cleanup on unmount
    return () => {
      wsService.ws?.removeEventListener('message', messageHandler);
      wsService.disconnect();
    };
  }, []);

  const handleStartProcess = useCallback(async () => {
    setIsProcessing(true);
    try {
      wsService.startProcesses(TOTAL_PROCESSES);
    } catch (error) {
      console.error('Failed to start processes:', error);
      setIsProcessing(false);
    }
  }, []);

  // For now, keep the same UI but with minimal state
  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary p-4">
      <main className="w-full max-w-xl space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-5xl font-outfit">Process Manager</h1>
          <p className="font-inter text-gray-600">Monitor your running processes in real-time</p>
        </div>

        <button
          onClick={handleStartProcess}
          disabled={isProcessing}
          className="w-full bg-primary-green text-white rounded-lg px-8 py-3 font-outfit
            hover:opacity-90 transition-all duration-200 
            disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl
            flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <>
              <LoadingSpinner />
              Processing...
            </>
          ) : (
            'Start Process'
          )}
        </button>
      </main>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}