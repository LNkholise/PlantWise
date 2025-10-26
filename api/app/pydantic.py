from pydantic import BaseModel

class UserQuery(BaseModel):
    message: str

class AIResponse(BaseModel):
    response: str
    
class User(BaseModel):
    username: str
    password: str