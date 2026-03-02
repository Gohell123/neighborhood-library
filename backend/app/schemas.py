from pydantic import BaseModel, Field, EmailStr
from typing import Optional
from datetime import datetime



# -------------------
# Book Schemas
# -------------------

class BookBase(BaseModel):
    title: str = Field(min_length=1, max_length=255)
    author: str = Field(min_length=1, max_length=255)
    isbn: Optional[str] = Field(default=None, max_length=20)
    total_copies: int = Field(gt=0)



class BookCreate(BookBase):
    pass


class BookResponse(BookBase):
    id: int
    available_copies: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# -------------------
# Member Schemas
# -------------------

class MemberBase(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    email: EmailStr
    phone: str = Field(min_length=10, max_length=20)


class MemberCreate(MemberBase):
    pass


class MemberResponse(MemberBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# -------------------
# BorrowRecord Schemas
# -------------------

class BorrowRecordBase(BaseModel):
    book_id: int
    member_id: int


class BorrowRecordCreate(BorrowRecordBase):
    pass


class BorrowRecordResponse(BaseModel):
    id: int
    book_id: int
    member_id: int
    borrowed_at: datetime
    due_date: datetime
    returned_at: Optional[datetime]

    class Config:
        from_attributes = True