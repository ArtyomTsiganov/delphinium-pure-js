import datetime

from pydantic import BaseModel
from decimal import Decimal
from typing import List, Optional


class BlogPostCreate(BaseModel):
    title: str
    text: str

    creation_date: datetime.datetime

    class Config:
        from_attributes = True

