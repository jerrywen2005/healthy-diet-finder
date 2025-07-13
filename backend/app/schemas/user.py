from pydantic import BaseModel, EmailStr

class userCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class userLogin(BaseModel):
    email: EmailStr
    password: str
    
class userInfo(BaseModel):
    id: int
    name: str
    email: str
    
    class Config:
        orm_mode = True