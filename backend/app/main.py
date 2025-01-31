from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from scalar_fastapi import get_scalar_api_reference
import random
import asyncio
import uuid
from typing import Dict

app = FastAPI(
    title="Process Tracking API",
    description="API for handling long-running processes with status tracking",
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

@app.get("/scalar", include_in_schema=False)
async def scalar_html():
    return get_scalar_api_reference(
        openapi_url=app.openapi_url,
        title=app.title,
    )

@app.get(
    "/process",
    response_model=Dict[str, str],
    summary="Start a long-running process",
    description="""
    Initiates a long-running process that takes between 5-10 seconds to complete.
    This endpoint simulates a heavy computational task using asyncio.sleep().
    
    Returns:
    - A success response when the process completes
    """,
    responses={
        200: {
            "description": "Process completed successfully",
            "content": {
                "application/json": {
                    "example": {"status": "ok"}
                }
            }
        },
        500: {
            "description": "Internal server error",
            "content": {
                "application/json": {
                    "example": {"error": "Process failed"}
                }
            }
        }
    }
)
async def process(request: Request):
    task_id = str(uuid.uuid4())[:8]  # Generate a short unique ID
    sleep_time = random.randint(5, 10) # Shortened for testing purposes
    
    # Simulate processing
    await asyncio.sleep(sleep_time)
    
    # Log success message
    print(f"✅ Successfully processed task {task_id} in {sleep_time} seconds")
    
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
