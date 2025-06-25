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
    name="alzhaimer_bot_agent",
    description=(
        "This agent provides detailed and helpful responses related to Alzheimer’s disease. It addresses "
        "the user’s query using medical facts, caregiver tips, and lifestyle advice tailored to this neurodegenerative condition."
    ),
    instruction=PROMPT1,
    model=MODEL,
    output_key="alzhaimer_bot_response",
)
