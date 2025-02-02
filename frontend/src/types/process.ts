export interface ProcessStatus {
  task_id: string;
  status: "pending" | "running" | "completed" | "failed";
  created_at?: string;
  completed_at?: string;
  duration?: number;
  error?: string;
}

export interface CompletionStatus {
  status: "all_completed";
  total_tasks: number;
}

export interface ProcessStats {
  completedCount: number;
  errorCount: number;
  totalCount: number;
  progress: number;
}

export interface ProcessStatsData {
  pending: number;
  running: number;
  completed: number;
  failed: number;
  total: number;
}

export interface ProcessGridProps {
  processes: Record<string, ProcessStatus>;
}

export interface ProcessStatsProps {
  stats: ProcessStatsData;
}

export const TOTAL_PROCESSES = 50;
