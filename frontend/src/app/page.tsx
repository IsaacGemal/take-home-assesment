'use client';

import { useState } from 'react';
import { startProcess, ProcessStatus } from '@/services/api';

export default function Home() {
  const [processes, setProcesses] = useState<ProcessStatus[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const completedCount = processes.filter(p => p.status === 'success').length;
  const errorCount = processes.filter(p => p.status === 'error').length;
  const totalCount = processes.length;
  const progress = totalCount > 0 ? ((completedCount + errorCount) / totalCount) * 100 : 0;

  const handleStartProcess = async () => {
    setIsProcessing(true);
    const processArray = Array.from({ length: 50 }, (_, index) => ({
      id: index,
      status: 'pending' as const,
      startTime: new Date(),
    }));
    setProcesses(processArray);

    const requests = processArray.map(async (process) => {
      console.log(`Starting process ${process.id + 1}/50`);
      try {
        await startProcess();
        setProcesses(prev =>
          prev.map(p =>
            p.id === process.id
              ? { ...p, status: 'success', endTime: new Date() }
              : p
          )
        );
        console.log(`✅ Process ${process.id + 1}/50 completed successfully`);
      } catch (error) {
        setProcesses(prev =>
          prev.map(p =>
            p.id === process.id
              ? { ...p, status: 'error', endTime: new Date() }
              : p
          )
        );
        console.error(`❌ Process ${process.id + 1}/50 failed`, error);
      }
    });

    await Promise.allSettled(requests);
    setIsProcessing(false);
    console.log('All processes completed');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <main className="text-center space-y-4 w-full max-w-md">
        <button
          onClick={handleStartProcess}
          disabled={isProcessing}
          className="inline-flex items-center bg-black justify-center gap-2 rounded-lg text-sm font-medium focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-white hover:bg-black/80 h-11 px-8 py-2 shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5"
        >
          {isProcessing ? 'Processing...' : 'Start Process'}
        </button>

        {isProcessing && (
          <div className="space-y-2">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="text-sm text-gray-600">
              {completedCount} completed • {errorCount} errors • {totalCount} total
            </div>
          </div>
        )}
      </main>
    </div>
  );
}