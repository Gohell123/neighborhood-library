from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException
from datetime import datetime, timedelta, timezone
from sqlalchemy.sql import func

from . import models

from . import schemas


# -------------------
# Book CRUD
# -------------------

def create_book(db: Session, book: schemas.BookCreate):
    db_book = models.Book(**book.dict())
    db_book.available_copies = book.total_copies

    db.add(db_book)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="ISBN already exists")

    db.refresh(db_book)
    return db_book


def get_books(db: Session, skip: int = 0, limit: int = 10):
    return db.query(models.Book).offset(skip).limit(limit).all()


def get_book(db: Session, book_id: int):
    book = db.query(models.Book).filter(models.Book.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    return book


# -------------------
# Member CRUD
# -------------------

def create_member(db: Session, member: schemas.MemberCreate):
    db_member = models.Member(**member.dict())

    db.add(db_member)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Email or phone already exists")

    db.refresh(db_member)
    return db_member


def get_members(db: Session, skip: int = 0, limit: int = 10):
    return db.query(models.Member).offset(skip).limit(limit).all()


def get_member(db: Session, member_id: int):
    member = db.query(models.Member).filter(models.Member.id == member_id).first()
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")
    return member


# -------------------
# BorrowRecord CRUD
# -------------------

def record_borrow(db: Session, borrow: schemas.BorrowRecordCreate):

    book = db.query(models.Book).filter(models.Book.id == borrow.book_id).with_for_update().first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")

    member = db.query(models.Member).filter(models.Member.id == borrow.member_id).first()
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")

    if book.available_copies <= 0:
        raise HTTPException(status_code=400, detail="No copies available")

    loan_period_days = 14
    due_date = datetime.now(timezone.utc) + timedelta(days=loan_period_days)

    db_borrow = models.BorrowRecord(
        book_id=borrow.book_id,
        member_id=borrow.member_id,
        due_date=due_date
    )

    book.available_copies -= 1

    db.add(db_borrow)

    try:
        db.commit()
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to record borrow")

    db.refresh(db_borrow)
    return db_borrow



def record_return(db: Session, borrow_id: int):

    db_borrow = db.query(models.BorrowRecord).filter(
        models.BorrowRecord.id == borrow_id
    ).first()

    if not db_borrow:
        raise HTTPException(status_code=404, detail="Borrow record not found")

    if db_borrow.returned_at:
        raise HTTPException(status_code=400, detail="Book already returned")

    # 1️⃣ Mark return time (DB controlled)
    db_borrow.returned_at = func.now()

    # 2️⃣ Restore inventory
    book = db.query(models.Book).filter(
        models.Book.id == db_borrow.book_id
    ).first()

    if book:
        book.available_copies += 1

    try:
        db.commit()
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to record return")

    db.refresh(db_borrow)
    return db_borrow


def get_borrowed_books_by_member(db: Session, member_id: int):

    member = db.query(models.Member).filter(
        models.Member.id == member_id
    ).first()

    if not member:
        raise HTTPException(status_code=404, detail="Member not found")

    return db.query(models.BorrowRecord).filter(
        models.BorrowRecord.member_id == member_id,
        models.BorrowRecord.returned_at.is_(None)
    ).all()