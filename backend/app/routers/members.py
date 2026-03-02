from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app import crud, schemas

router = APIRouter(prefix="/members", tags=["Members"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("", response_model=schemas.MemberResponse)
def create_member(member: schemas.MemberCreate, db: Session = Depends(get_db)):
    return crud.create_member(db, member)

@router.get("", response_model=list[schemas.MemberResponse])
def list_members(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return crud.get_members(db, skip=skip, limit=limit)

@router.get("/{member_id}", response_model=schemas.MemberResponse)
def get_member(member_id: int, db: Session = Depends(get_db)):
    return crud.get_member(db, member_id)

@router.get("/{member_id}/borrowed", response_model=list[schemas.BorrowRecordResponse])
def borrowed_books(member_id: int, db: Session = Depends(get_db)):
    return crud.get_borrowed_books_by_member(db, member_id)