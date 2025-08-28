from apscheduler.schedulers.asyncio import AsyncIOScheduler
from telegram.ext import Application
from bot.utils.db import SessionLocal
from api.models.user import User
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

async def send_daily_reminder(application: Application):
    """Send daily reminder to all active users"""
    try:
        db = SessionLocal()
        
        # Get all active users
        users = db.query(User).filter(User.is_active == True).all()
        
        reminder_message = """
🔔 **Reminder Harian**

Jangan lupa untuk melakukan claim harian Anda!
Claim harian tersedia setiap hari pukul 00:00 WIB.

💡 **Tips:**
• Claim harian untuk mendapatkan return investasi
• Semakin rutin claim, semakin besar profit
• Jangan lewatkan claim harian Anda!

Klik tombol di bawah untuk claim sekarang!
        """
        
        for user in users:
            try:
                # Send reminder message
                await application.bot.send_message(
                    chat_id=user.telegram_id,
                    text=reminder_message,
                    parse_mode='Markdown'
                )
                logger.info(f"Sent reminder to user {user.telegram_id}")
                
            except Exception as e:
                logger.error(f"Failed to send reminder to user {user.telegram_id}: {e}")
                continue
        
        logger.info(f"Daily reminder sent to {len(users)} users")
        
    except Exception as e:
        logger.error(f"Error in daily reminder job: {e}")
    finally:
        db.close()

def setup_reminder_jobs(application: Application):
    """Setup reminder jobs"""
    scheduler = AsyncIOScheduler()
    
    # Daily reminder at 8:00 AM
    scheduler.add_job(
        send_daily_reminder,
        'cron',
        hour=8,
        minute=0,
        args=[application],
        id='daily_reminder',
        name='Daily Reminder'
    )
    
    # Start scheduler
    scheduler.start()
    logger.info("Reminder jobs scheduled successfully")
    
    return scheduler
