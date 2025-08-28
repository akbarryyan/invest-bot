from apscheduler.schedulers.asyncio import AsyncIOScheduler
from bot.utils.db import SessionLocal
import logging
from datetime import datetime, date

logger = logging.getLogger(__name__)

async def reset_daily_claims():
    """Reset daily claims for all users"""
    try:
        db = SessionLocal()
        
        # This would reset daily claim flags in actual implementation
        # For now, we'll just log the action
        
        logger.info("Daily claims reset successfully at midnight")
        
        # In actual implementation, you would:
        # 1. Clear daily claim flags
        # 2. Reset claim counters
        # 3. Update user status
        
    except Exception as e:
        logger.error(f"Error resetting daily claims: {e}")
    finally:
        db.close()

def setup_reset_claim_jobs():
    """Setup reset claim jobs"""
    scheduler = AsyncIOScheduler()
    
    # Reset daily claims at midnight (00:00)
    scheduler.add_job(
        reset_daily_claims,
        'cron',
        hour=0,
        minute=0,
        id='reset_daily_claims',
        name='Reset Daily Claims'
    )
    
    # Start scheduler
    scheduler.start()
    logger.info("Reset claim jobs scheduled successfully")
    
    return scheduler
