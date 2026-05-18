from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.blog import BlogPosts
from app.schemas.blog import BlogPostCreate

router = APIRouter(
    prefix="/blog",
    tags=["Blog"]
)

@router.get("/")
async def get_blogs(db: AsyncSession = Depends(get_db)):
    query = select(BlogPosts)
    result = await db.execute(query)
    return result.scalars().all()


@router.post("/", status_code=201)
async def add_posts(
        post_in: BlogPostCreate,
        db: AsyncSession = Depends(get_db)
):
    try:
        new_post = BlogPosts(
            title = post_in.title,
            text = post_in.text
        )
        db.add(new_post)

        await db.commit()  # Сохраняем все сразу
        await db.refresh(new_post)

        return {"status": "success", "post_id": new_post.post_id}

    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=400, detail=f"Database error: {str(e)}")