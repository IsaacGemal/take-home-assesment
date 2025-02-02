import { ProcessStatsProps } from '@/types/process';

export function ProcessStats({ stats }: ProcessStatsProps) {
    const progress = ((stats.completed + stats.failed) / stats.total) * 100;

    return (
        <div className="space-y-4">
            <div className="w-full bg-gray-200 rounded-full h-4 dark:bg-gray-700">
                <div
                    className="bg-primary-green h-4 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                />
            </div>

            <div className="grid grid-cols-4 gap-4 text-center">
                <div className="bg-blue-100 p-3 rounded-lg dark:bg-blue-900">
                    <div className="font-bold text-blue-600 dark:text-blue-300">{stats.pending}</div>
                    <div className="text-sm">Pending</div>
                </div>
                <div className="bg-yellow-100 p-3 rounded-lg dark:bg-yellow-900">
                    <div className="font-bold text-yellow-600 dark:text-yellow-300">{stats.running}</div>
                    <div className="text-sm">Running</div>
                </div>
                <div className="bg-green-100 p-3 rounded-lg dark:bg-green-900">
                    <div className="font-bold text-green-600 dark:text-green-300">{stats.completed}</div>
                    <div className="text-sm">Completed</div>
                </div>
                <div className="bg-red-100 p-3 rounded-lg dark:bg-red-900">
                    <div className="font-bold text-red-600 dark:text-red-300">{stats.failed}</div>
                    <div className="text-sm">Failed</div>
                </div>
            </div>
        </div>
    );
} 