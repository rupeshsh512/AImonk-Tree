from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

from database import engine, get_db, Base
import models
import schemas

# Create tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(title="AImonk - Nested Tags API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/trees", response_model=List[schemas.TreeResponse])
def get_trees(db: Session = Depends(get_db)):
    return db.query(models.Tree).order_by(models.Tree.created_at.desc()).all()

@app.post("/trees", response_model=schemas.TreeResponse)
def create_tree(payload: schemas.TreeCreate, db: Session = Depends(get_db)):
    tree = models.Tree(
        name=payload.name,
        hierarchy=payload.hierarchy.model_dump(exclude_none=True)
    )
    db.add(tree)
    db.commit()
    db.refresh(tree)
    return tree

@app.put("/trees/{tree_id}", response_model=schemas.TreeResponse)
def update_tree(tree_id: int, payload: schemas.TreeUpdate, db: Session = Depends(get_db)):
    tree = db.query(models.Tree).filter(models.Tree.id == tree_id).first()
    if not tree:
        raise HTTPException(status_code=404, detail="Tree not found")
    
    if payload.name is not None:
        tree.name = payload.name
    if payload.hierarchy is not None:
        tree.hierarchy = payload.hierarchy.model_dump(exclude_none=True)
    
    db.commit()
    db.refresh(tree)
    return tree

@app.delete("/trees/{tree_id}")
def delete_tree(tree_id: int, db: Session = Depends(get_db)):
    tree = db.query(models.Tree).filter(models.Tree.id == tree_id).first()
    if not tree:
        raise HTTPException(status_code=404, detail="Tree not found")
    db.delete(tree)
    db.commit()
    return {"message": "Deleted"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
