import os
from langchain_openai import ChatOpenAI
from langchain.agents import create_agent, AgentState
from langchain.agents.middleware import before_model
from langchain_core.runnables import RunnableConfig
from langgraph.checkpoint.memory import InMemorySaver
from langgraph.runtime import Runtime
from langchain.messages import RemoveMessage
from langgraph.graph.message import REMOVE_ALL_MESSAGES
from .tools import all_tools as tools_list
from typing import Any

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

@before_model
def trim_messages(state: AgentState, runtime: Runtime) -> dict[str, Any] | None:
    """Keep only the last few messages to fit context window."""
    messages = state["messages"]

    if len(messages) <= 3:
        return None

    first_msg = messages[0]
    recent_messages = messages[-3:] if len(messages) % 2 == 0 else messages[-4:]
    new_messages = [first_msg] + recent_messages

    return {
        "messages": [
            RemoveMessage(id=REMOVE_ALL_MESSAGES),
            *new_messages
        ]
    }

llm = ChatOpenAI(
    model="nvidia/nemotron-nano-9b-v2:free",
    openai_api_base="https://openrouter.ai/api/v1",
    openai_api_key=OPENROUTER_API_KEY,
)

agent = create_agent(
    model=llm,
    tools=tools_list,
    middleware=[trim_messages],
    checkpointer=InMemorySaver(),
    system_prompt = """
You are Voddie, a helpful gardening assistant. Provide accurate planting advice based on user queries. 
Respond in one short, clean paragraph, maximum 200 words. 
Do NOT use lists, bullet points, headings, or any special formatting. 
Give your advice in natural, readable sentences, like: "You can plant maize, cabbage, and turnips based on your conditions."
"""

)

async def ask_agent(prompt: str) -> str:
    """Send a prompt to the model and return its response text."""
    
    config: RunnableConfig = {"configurable": {"thread_id": "1"}}
    
    messages = [{"role": "user", "content": prompt}]
    response = await agent.ainvoke({"messages": messages}, config)
    final_output = response["messages"][-1].content
    return final_output


