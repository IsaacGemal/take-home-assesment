import { useState } from "react";

export interface ProcessStatus {
  id: number;
  status: "pending" | "success" | "error";
  startTime: Date;
  endTime?: Date;
}

export async function startProcess(): Promise<Response> {
  return fetch("http://localhost:8000/process", {
    method: "GET",
  });
}
