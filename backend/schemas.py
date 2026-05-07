from __future__ import annotations
from pydantic import BaseModel, model_validator
from typing import Optional, List
from datetime import datetime

class TagNode(BaseModel):
    name: str
    data: Optional[str] = None
    children: Optional[List[TagNode]] = None

    @model_validator(mode="after")
    def validate_data_or_children(self) -> "TagNode":
        if self.data is not None and self.children is not None:
            raise ValueError("A tag node cannot have both 'data' and 'children'.")
        return self

    model_config = {"from_attributes": True}

TagNode.model_rebuild()

class TreeBase(BaseModel):
    name: str = "Untitled Tree"
    hierarchy: TagNode

class TreeCreate(TreeBase):
    pass

class TreeUpdate(BaseModel):
    name: Optional[str] = None
    hierarchy: Optional[TagNode] = None

class TreeResponse(TreeBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
