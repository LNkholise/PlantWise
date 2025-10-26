from fastapi import APIRouter, HTTPException
from app.pydantic import UserQuery
from app.core.agent import ask_agent

router = APIRouter()

@router.post("/ask")
async def ask_ai(data: UserQuery):
    try:
        response_text = await ask_agent(data.message)
        return response_text
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))