import os
from dotenv import load_dotenv
from pathlib import Path

# Get path to agents/.env
env_path = Path(__file__).resolve().parents[1] / ".env"  # heart -> agents

# Load local agents/.env
load_dotenv(dotenv_path=env_path)

# Access the variable
MODEL = os.getenv("MODEL")


from google.adk.agents.llm_agent import LlmAgent

from chat.agents.classify.prompt import PROMPT

root_agent = LlmAgent(
    name="classifier_agent",
    description=(
        "This agent analyzes a user's input medical query and classifies it into one of five disease "
        "categories: heart, kidney, brain, alzhaimer, or general. It uses domain-specific knowledge "
        "and few-shot examples to guide its prediction. The output is a lowercase label that determines "
        "which specialist agent will respond next."
    ),
    instruction=PROMPT,
    model=MODEL,
    output_key="disease_class",
)
