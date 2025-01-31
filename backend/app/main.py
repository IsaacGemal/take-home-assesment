from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
import random
import asyncio
import uuid

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

@app.get("/process")
async def process(request: Request):
    task_id = str(uuid.uuid4())[:8]  # Generate a short unique ID
    sleep_time = random.randint(5, 10) # Shortened for testing purposes
    
    # Simulate processing
    await asyncio.sleep(sleep_time)
    
    # Log success message
    print(f"✅ Successfully processed task {task_id} in {sleep_time} seconds")
    
    return Response("ok", status_code=200)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
