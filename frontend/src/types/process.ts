export interface ProcessStatus {
  id: number;
  status: "pending" | "success" | "error";
  startTime: Date;
  endTime?: Date;
}

export interface ProcessStats {
  completedCount: number;
  errorCount: number;
  totalCount: number;
  progress: number;
}
