from pydantic import BaseModel

from decimal import Decimal
from typing import List, Optional

class SuccessResponse(BaseModel):
    status: str
    added_count: int