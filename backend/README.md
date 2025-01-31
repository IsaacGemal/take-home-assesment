# Backend Service

This is a FastAPI-based backend service that simulates a long-running process.

## Setup

1. Create a virtual environment (recommended):
   ```bash
   uv venv venv
   source venv/bin/activate  # On Unix/macOS
   # OR
   .\venv\Scripts\activate  # On Windows
   ```

2. Install dependencies:
   ```bash
   uv pip install -r requirements.txt
   ```

3. Run the application:
   ```bash
   # Regular run
   python app/main.py
   
   # With hot reloading
   uvicorn app.main:app --reload
   ```
