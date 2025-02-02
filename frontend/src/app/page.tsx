'use client';

import { useState, useCallback, useEffect } from 'react';
import { wsService } from '@/services/api';
import { TOTAL_PROCESSES } from '@/types/process';
import { ProcessStats } from '@/components/ProcessStats';
import { ProcessGrid } from '@/components/ProcessGrid';
import { ProcessStatus } from '@/types/process';
import { Loader2 } from "lucide-react";

export default function Home() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [processes, setProcesses] = useState<Record<string, ProcessStatus>>({});
  const [stats, setStats] = useState({
    pending: 0,
    running: 0,
    completed: 0,
    failed: 0,
    total: TOTAL_PROCESSES
  });

  // Connect to WebSocket when component mounts
  useEffect(() => {
    const connect = async () => {
      try {
        await wsService.connect();
        setIsConnected(true);
      } catch (error) {
        console.error('Failed to connect to WebSocket:', error);
        setIsConnected(false);
      }
    };

    // Handle WebSocket connection events
    const handleOpen = () => setIsConnected(true);
    const handleClose = () => {
      setIsConnected(false);
      // Try to reconnect after a delay
      setTimeout(connect, 3000);
    };

    connect();

    wsService.ws?.addEventListener('open', handleOpen);
    wsService.ws?.addEventListener('close', handleClose);

    // Add message handler
    const messageHandler = (event: MessageEvent) => {
      const data = JSON.parse(event.data);

      if (data.status === 'all_completed') {
        setIsProcessing(false);
      } else if (data.task_id) {
        setProcesses(prev => ({
          ...prev,
          [data.task_id]: data
        }));

        setStats(prev => {
          const newStats = { ...prev };
          const prevProcess = processes[data.task_id];
          if (prevProcess?.status) {
            newStats[prevProcess.status as keyof typeof newStats]--;
          }
          newStats[data.status as keyof typeof newStats]++;
          return newStats;
        });
      }
    };

    wsService.ws?.addEventListener('message', messageHandler);

    // Cleanup on unmount
    return () => {
      wsService.ws?.removeEventListener('open', handleOpen);
      wsService.ws?.removeEventListener('close', handleClose);
      wsService.ws?.removeEventListener('message', messageHandler);
      wsService.disconnect();
    };
  }, []);

  const handleStartProcess = useCallback(async () => {
    if (!isConnected) {
      console.error('WebSocket is not connected');
      return;
    }

    // Reset processes and stats before starting new process
    setProcesses({});
    setStats({
      pending: 0,
      running: 0,
      completed: 0,
      failed: 0,
      total: TOTAL_PROCESSES
    });

    setIsProcessing(true);
    try {
      await wsService.startProcesses(TOTAL_PROCESSES);
    } catch (error) {
      console.error('Failed to start processes:', error);
      setIsProcessing(false);
    }
  }, [isConnected]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary p-4">
      <main className="w-full max-w-4xl space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-5xl font-outfit">Process Manager</h1>
          <p className="font-inter text-gray-600">Monitor your running processes in real-time</p>
          {!isConnected && (
            <p className="text-red-500">Disconnected - Attempting to reconnect...</p>
          )}
        </div>

        <button
          onClick={handleStartProcess}
          disabled={isProcessing || !isConnected}
          className="w-full bg-primary-green text-white rounded-lg px-8 py-3 font-outfit
            hover:opacity-90 transition-all duration-200 
            disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl
            flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Processing...
            </>
          ) : !isConnected ? (
            'Connecting...'
          ) : (
            'Start Process'
          )}
        </button>

        <div className="space-y-6">
          <ProcessStats stats={stats} />
          <ProcessGrid processes={processes} />
        </div>
      </main>
    </div>
  );
}