from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from pathlib import Path
import os
from dotenv import load_dotenv
from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
from google.genai import types
from agents.alzhaimer.agent import report_agent  # ✅ ensure this import is correct

# Load .env
env_path = Path(__file__).resolve().parents[1] / ".env"
load_dotenv(dotenv_path=env_path)

app = FastAPI()
templates = Jinja2Templates(directory="templates")
app.mount("/static", StaticFiles(directory="static"), name="static")

APP_NAME = "alzhaimer_report"
USER_ID = "report_user"
SESSION_ID = "alzhaimer_report_session"
session_service = InMemorySessionService()


# ✅ GET /
@app.get("/", response_class=HTMLResponse)
async def index(request: Request):
    return templates.TemplateResponse("report.html", {"request": request})


@app.post("/alzhaimer-report")
async def generate_report(request: Request):
    data = await request.json()
    query = data.get("query", "")

    session_service.create_session(
        app_name=APP_NAME, user_id=USER_ID, session_id=SESSION_ID
    )

    runner = Runner(
        agent=report_agent, app_name=APP_NAME, session_service=session_service
    )
    content = types.Content(role="user", parts=[types.Part(text=query)])

    events = runner.run(user_id=USER_ID, session_id=SESSION_ID, new_message=content)

    for event in events:
        if event.is_final_response():
            session = session_service.get_session(
                app_name=APP_NAME, user_id=USER_ID, session_id=SESSION_ID
            )
            print("Specialist Session State:", session.state)
            print(f"session.state:", session.state.get("alzhaimer_report_response"))
            res = session.state.get(
                "alzhaimer_report_response", "I'm sorry, I couldn't find a response."
            )

            return JSONResponse(content={"response": res})

    return JSONResponse(content={"response": "No report generated."})
