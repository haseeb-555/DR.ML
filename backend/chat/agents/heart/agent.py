import os
from dotenv import load_dotenv
from pathlib import Path

# Get path to agents/.env
env_path = Path(__file__).resolve().parents[3] / ".env"  # heart -> agents

# Load local agents/.env
load_dotenv(dotenv_path=env_path)

# Access the variable
MODEL = os.getenv("MODEL")

from google.adk.agents.llm_agent import LlmAgent
from prompt import PROMPT1

root_agent = LlmAgent(
    name="heart_bot_agent",
    description=(
        "This agent provides expert responses related to cardiovascular health and heart disease. It supports users with medically accurate information, preventive guidance, and treatment options."
    ),
    instruction=PROMPT1,
    model=MODEL,
    output_key="heart_bot_response",
)
