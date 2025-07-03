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
from chat.agents.general.prompt import PROMPT1


root_agent = LlmAgent(
    name="general_medical_agent",
    description=(
        "This agent answers general medical questions that do not belong to specific domains like heart, kidney, brain, or Alzheimer's. "
        "It helps with common symptoms, general wellness advice, first-aid, public health questions, and lifestyle recommendations."
    ),
    instruction=PROMPT1,
    model=MODEL,
    output_key="general_bot_response",
)
