from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from pathlib import Path
import uvicorn
import os
import asyncio

from dotenv import load_dotenv
from google.adk.sessions import InMemorySessionService
from google.adk.runners import Runner
from google.genai import types

# Load env
env_path = Path(__file__).resolve().parents[1] / ".env"
load_dotenv(dotenv_path=env_path)

# Constants
APP_NAME = "drml_chatbot"
USER_ID = "user_ui"
CLASSIFY_SESSION = "ui_classify_session"
SPECIALIST_SESSION = "ui_specialist_session"

# Bots
from agents.classify.agent import root_agent as classify_bot
from agents.alzhaimer.agent import root_agent as alzhaimer_bot
from agents.brain.agent import root_agent as brain_bot
from agents.heart.agent import root_agent as heart_bot
from agents.kidney.agent import root_agent as kidney_bot
from agents.general.agent import root_agent as general_bot

BOT_MAPPING = {
    "alzhaimer": (alzhaimer_bot, "alzhaimer_bot_response"),
    "brain": (brain_bot, "brain_bot_response"),
    "heart": (heart_bot, "heart_bot_response"),
    "kidney": (kidney_bot, "kidney_bot_response"),
    "general": (general_bot, "general_bot_response"),
}

# App and templates
app = FastAPI()
templates = Jinja2Templates(directory="templates")
app.mount("/static", StaticFiles(directory="static"), name="static")

# Session service
session_service = InMemorySessionService()


# ----------------------
# CLASSIFICATION FUNCTION
# ----------------------
async def classify_query(query: str) -> str:
    runner = Runner(
        agent=classify_bot, app_name=APP_NAME, session_service=session_service
    )
    content = types.Content(role="user", parts=[types.Part(text=query)])
    events = runner.run(
        user_id=USER_ID, session_id=CLASSIFY_SESSION, new_message=content
    )

    for event in events:
        if event.is_final_response():
            label = event.content.parts[0].text.strip().lower()

            session = await session_service.get_session(
                app_name=APP_NAME, user_id=USER_ID, session_id=CLASSIFY_SESSION
            )

            print("Classification Session State:", session.state)
            print("session.state['disease_class']:", session.state.get("disease_class"))
            label = session.state.get("disease_class")

            return label

    return "general"


# ----------------------
# SPECIALIST BOT FUNCTION
# ----------------------
async def get_bot_response(label: str, query: str) -> str:
    agent, state_key = BOT_MAPPING.get(label, (general_bot, "general_bot_response"))
    runner = Runner(agent=agent, app_name=APP_NAME, session_service=session_service)
    content = types.Content(role="user", parts=[types.Part(text=query)])
    events = runner.run(
        user_id=USER_ID, session_id=SPECIALIST_SESSION, new_message=content
    )

    for event in events:
        if event.is_final_response():
            session = await session_service.get_session(
                app_name=APP_NAME, user_id=USER_ID, session_id=SPECIALIST_SESSION
            )

            print("Specialist Session State:", session.state)
            print(f"session.state['{state_key}']:", session.state.get(state_key))

            return session.state.get(
                state_key, "I'm sorry, I couldn't find a response."
            )

    return "I'm sorry, I couldn't generate a response."


# ----------------------
# ROUTES
# ----------------------


@app.get("/", response_class=HTMLResponse)
async def index(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})


@app.post("/ask")
async def ask(request: Request):
    data = await request.json()
    query = data.get("query", "")

    # Explicitly create sessions before classification and response
    await session_service.create_session(
        app_name=APP_NAME, user_id=USER_ID, session_id=CLASSIFY_SESSION
    )
    await session_service.create_session(
        app_name=APP_NAME, user_id=USER_ID, session_id=SPECIALIST_SESSION
    )

    # Run classification and get specialist response
    label = await classify_query(query)
    response = await get_bot_response(label, query)

    return JSONResponse(content={"response": response, "label": label})


# ----------------------
# APP RUNNER
# ----------------------
if __name__ == "__main__":
    uvicorn.run("chatbot:app", host="0.0.0.0", port=8000, reload=True)
