Neighborhood Library API
A RESTful backend service for managing books, members, and borrowing transactions in a library system.
Built using FastAPI, PostgreSQL, SQLAlchemy, and Docker.



Tech Stack
Backend
    FastAPI – API Layer
    PostgreSQL 15 – Relational database
    SQLAlchemy (ORM) – Database abstraction layer
    Docker Compose – Database containerization
    Pydantic – Input/Output validation

Frontend
    Next.js (App Router)
    React Hooks
    Component-based architecture
    REST-based integration with backend



Architecture Overview
The application follows a layered architecture

Browser (Next.js)
        ↓  HTTP (JSON)
FastAPI (API Layer - Routers)
        ↓
CRUD Layer (Business Logic)
        ↓
SQLAlchemy ORM
        ↓
PostgreSQL (Dockerized)



Design Decisions
REST over gRPC
    REST was selected due to its simplicity, ecosystem maturity, and suitability for CRUD-centric domain services.

PostgreSQL
    Strong ACID compliance
    Foreign key enforcement
    Transaction support
    Production-grade reliability

SQLAlchemy ORM
    Explicit transaction management
    Model-driven schema design
    Clean separation between domain and persistence

Database-Managed Timestamps
    created_at, updated_at, and borrowed_at are managed at the database layer using 
    server_default=func.now() 
    Ensure consistency and prevent client-side tampering.


Transaction Handling
    Borrow and return operations are wrapped in database transactions with rollback support to maintain inventory consistency.



Features
    Book CRUD
    Member CRUD
    Borrow & return workflows
    Inventory auto-updates
    Due date tracking
    Historical borrow records
    Unique constraints (ISBN, email, phone)
    Foreign key integrity enforcement

Frontend
    Add new books
    Add new members
    Switch active member
    Borrow books
    Return books
    Display currently borrowed books
    Display due dates
    Real-time inventory updates


Database Schema
    Books
        id (PK)
        title
        author
        isbn (unique)
        total_copies
        available_copies
        created_at
        updated_at

    Members
        id (PK)
        name
        email (unique)
        phone (unique)
        created_at
        updated_at

    Borrow Records
        id (PK)
        book_id (FK)
        member_id (FK)
        borrowed_at (DB generated)
        due_date
        returned_at (nullable)
    Each borrow transaction is tracked independently to preserve historical accuracy.


API Endpoints

Health
Method    Endpoint
GET       /health

Books
Method    Endpoint
POST	  /books
GET	      /books
GET	      /books/{book_id}

Members
Method    Endpoint
POST	  /members
GET	      /members
GET	      /members/{member_id}
GET       /members/{member_id}/borrowed  

Borrowing
Method	  Endpoint
POST	  /borrow
POST	  /return/{borrow_id}


Interactive Documentation available at
    http://127.0.0.1:8000/docs




Setup Instructions

Clone the Repository
    git clone <repo-url>
    cd neighborhood-library

Start PostgreSQL(Docker)
    docker compose up -d

Database runs at:
    localhost:5432

Credentials:
    User: admin
    Password: admin123
    Database: library

Backend Setup
    cd backend
    python -m venv venv
    venv\Scripts\activate   # Windows
    pip install -r requirements.txt
    uvicorn app.main:app --reload

Backend runs at 
    http://localhost:8000

Frontend Setup
    cd frontend
    npm install
    npm run dev

Frontend runs at 
    http://localhost:3000



Concurrency & Scalability Considerations
    Borrow operations can be enhanced using row-level locking (SELECT ... FOR UPDATE) to prevent race conditions under high concurrency.

The API is stateless and horizontally scalable.
    
Future improvements could include:
    Redis caching for read-heavy workloads
    Background workers for overdue notifications
    Authentication & authorization
    Containerizing the API layer


    
