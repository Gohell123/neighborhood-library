from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app import crud, schemas

router = APIRouter(tags=["Borrow"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/borrow", response_model=schemas.BorrowRecordResponse)
def borrow_book(borrow: schemas.BorrowRecordCreate, db: Session = Depends(get_db)):
    return crud.record_borrow(db, borrow)

@router.post("/return/{borrow_id}", response_model=schemas.BorrowRecordResponse)
def return_book(borrow_id: int, db: Session = Depends(get_db)):
    return crud.record_return(db, borrow_id)