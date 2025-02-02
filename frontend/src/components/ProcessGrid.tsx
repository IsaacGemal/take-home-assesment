import { ProcessGridProps } from '@/types/process';

export function ProcessGrid({ processes }: ProcessGridProps) {
    return (
        <div className="grid grid-cols-5 gap-2">
            {Object.entries(processes).map(([id, process]) => (
                <div
                    key={id}
                    className={`
            p-2 rounded-lg text-sm
            ${process.status === 'pending' ? 'bg-blue-100 dark:bg-blue-900' : ''}
            ${process.status === 'running' ? 'bg-yellow-100 dark:bg-yellow-900' : ''}
            ${process.status === 'completed' ? 'bg-green-100 dark:bg-green-900' : ''}
            ${process.status === 'failed' ? 'bg-red-100 dark:bg-red-900' : ''}
          `}
                >
                    <div className="font-medium">{id}</div>
                    <div className="text-xs opacity-75">
                        {process.duration ? `${process.duration}s` : '...'}
                    </div>
                </div>
            ))}
        </div>
    );
} 