import type { ProcessStats } from '@/types/process';
import { THEME } from '@/constants/process';

interface ProcessStatsProps {
    stats: ProcessStats;
}

export function ProcessStats({ stats }: ProcessStatsProps) {
    const { completedCount, errorCount, totalCount, progress } = stats;

    return (
        <div className="space-y-6 bg-white p-8 rounded-3xl shadow-xl">
            <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden">
                <div
                    className="absolute left-0 top-0 h-full transition-all duration-300 ease-in-out rounded-full bg-primary-green"
                    style={{ width: `${progress}%` }}
                />
            </div>

            <div className="grid grid-cols-3 gap-6">
                <StatCard
                    label="Completed"
                    value={completedCount}
                    color={THEME.colors.success}
                />
                <StatCard
                    label="Failed"
                    value={errorCount}
                    color={THEME.colors.error}
                />
                <StatCard
                    label="Total"
                    value={totalCount}
                    color={THEME.colors.pending}
                />
            </div>
        </div>
    );
}

interface StatCardProps {
    label: string;
    value: number;
    color: string;
}

function StatCard({ label, value, color }: StatCardProps) {
    return (
        <div className="bg-secondary p-6 rounded-2xl">
            <div className="text-3xl font-outfit font-bold" style={{ color }}>
                {value}
            </div>
            <div className="text-base font-inter text-gray-600 mt-2">{label}</div>
        </div>
    );
} 