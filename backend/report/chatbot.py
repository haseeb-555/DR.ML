import asyncio
from google.adk.sessions import InMemorySessionService
from google.adk.runners import Runner
from google.genai import types

# Agent imports
from chat.agents.classify.agent import root_agent as classify_bot
from chat.agents.alzhaimer.agent import root_agent as alzhaimer_bot
from chat.agents.brain.agent import root_agent as brain_bot
from chat.agents.heart.agent import root_agent as heart_bot
from chat.agents.kidney.agent import root_agent as kidney_bot
from chat.agents.general.agent import root_agent as general_bot

# Constants
APP_NAME = "drml_chatbot"
USER_ID = "user_ui"
CLASSIFY_SESSION = "ui_classify_session"
SPECIALIST_SESSION = "ui_specialist_session"

# Session manager
session_service = InMemorySessionService()

# Agent label → (agent, session_state_key) mapping
BOT_MAPPING = {
    "alzhaimer": (alzhaimer_bot, "alzhaimer_bot_response"),
    "brain": (brain_bot, "brain_bot_response"),
    "heart": (heart_bot, "heart_bot_response"),
    "kidney": (kidney_bot, "kidney_bot_response"),
    "general": (general_bot, "general_bot_response"),
}


async def classify_query(query: str) -> str:
    await session_service.create_session(
        app_name=APP_NAME, user_id=USER_ID, session_id=CLASSIFY_SESSION
    )

    runner = Runner(
        agent=classify_bot, app_name=APP_NAME, session_service=session_service
    )
    content = types.Content(role="user", parts=[types.Part(text=query)])

    for _ in runner.run(
        user_id=USER_ID, session_id=CLASSIFY_SESSION, new_message=content
    ):
        pass

    session = await session_service.get_session(
        app_name=APP_NAME, user_id=USER_ID, session_id=CLASSIFY_SESSION
    )
    disease_class = session.state.get("disease_class", "general")

    print("classification result:", disease_class)
    return disease_class


async def get_bot_response(label: str, query: str) -> str:
    await session_service.create_session(
        app_name=APP_NAME, user_id=USER_ID, session_id=SPECIALIST_SESSION
    )

    agent, state_key = BOT_MAPPING.get(label, (general_bot, "general_bot_response"))
    runner = Runner(agent=agent, app_name=APP_NAME, session_service=session_service)
    content = types.Content(role="user", parts=[types.Part(text=query)])

    for _ in runner.run(
        user_id=USER_ID, session_id=SPECIALIST_SESSION, new_message=content
    ):
        pass

    session = await session_service.get_session(
        app_name=APP_NAME, user_id=USER_ID, session_id=SPECIALIST_SESSION
    )
    response = session.state.get(
        state_key, "I'm sorry, I couldn't generate a response."
    )

    print(f"{label} session state:", response)
    return response


async def get_chatbot_response(query: str) -> str:
    label = await classify_query(query)
    response = await get_bot_response(label, query)
    return response
