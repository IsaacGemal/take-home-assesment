from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import random
import asyncio
import uuid
from typing import Dict
from enum import Enum
from datetime import datetime, timezone

app = FastAPI(
    title="Process Tracking API",
    description="API for handling multiple long-running processes with WebSocket status tracking",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

class ProcessStatus(Enum):
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}
        self.tasks: Dict[str, Dict] = {}

    async def connect(self, websocket: WebSocket) -> str:
        connection_id = str(uuid.uuid4())[:8]
        await websocket.accept()
        self.active_connections[connection_id] = websocket
        return connection_id

    async def disconnect(self, connection_id: str):
        if connection_id in self.active_connections:
            del self.active_connections[connection_id]

    async def send_status_update(self, connection_id: str, data: dict):
        if connection_id in self.active_connections:
            await self.active_connections[connection_id].send_json(data)

    async def start_processes(self, connection_id: str, num_processes: int):
        tasks = []
        for _ in range(num_processes):
            task_id = str(uuid.uuid4())[:8]
            self.tasks[task_id] = {
                "status": ProcessStatus.PENDING.value,
                "created_at": datetime.now(timezone.utc).isoformat(),
                "completed_at": None,
                "duration": None
            }
            
            # Send initial status
            await self.send_status_update(connection_id, {
                "task_id": task_id,
                "status": ProcessStatus.PENDING.value
            })
            
            # Create and store the task
            task = asyncio.create_task(self.run_process(connection_id, task_id))
            tasks.append(task)
        
        # Wait for all tasks to complete
        await asyncio.gather(*tasks)
        
        # Send completion message
        await self.send_status_update(connection_id, {
            "status": "all_completed",
            "total_tasks": num_processes
        })

    async def run_process(self, connection_id: str, task_id: str):
        try:
            # Update to running status
            self.tasks[task_id]["status"] = ProcessStatus.RUNNING.value
            await self.send_status_update(connection_id, {
                "task_id": task_id,
                "status": ProcessStatus.RUNNING.value
            })

            # Simulate processing (30 seconds to 2 minutes)
            sleep_time = random.randint(30, 120)  # Adjust these values for testing
            await asyncio.sleep(sleep_time)

            # Randomly fail 5% of processes after the wait time
            if random.random() < 0.05:  # 5% chance of failure
                raise Exception("Random process failure")

            # Update completion status
            completed_at = datetime.now(timezone.utc)
            self.tasks[task_id].update({
                "status": ProcessStatus.COMPLETED.value,
                "completed_at": completed_at.isoformat(),
                "duration": sleep_time
            })

            await self.send_status_update(connection_id, {
                "task_id": task_id,
                "status": ProcessStatus.COMPLETED.value,
                "duration": sleep_time
            })

        except Exception as e:
            self.tasks[task_id]["status"] = ProcessStatus.FAILED.value
            await self.send_status_update(connection_id, {
                "task_id": task_id,
                "status": ProcessStatus.FAILED.value,
                "error": str(e)
            })

manager = ConnectionManager()

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    connection_id = await manager.connect(websocket)
    try:
        while True:
            # Wait for messages from the client
            data = await websocket.receive_json()
            
            if data["action"] == "start_processes":
                num_processes = data.get("num_processes", 50)  # Default to 50 processes
                # Start the processes in the background
                asyncio.create_task(manager.start_processes(connection_id, num_processes))
            
    except WebSocketDisconnect:
        await manager.disconnect(connection_id)
    except Exception as e:
        print(f"Error in websocket connection: {str(e)}")
        await manager.disconnect(connection_id)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
