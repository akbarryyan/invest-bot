import asyncio
import logging
from telegram.ext import Application, CommandHandler, CallbackQueryHandler
from config import settings
from bot.handlers.auth_handler import AuthHandler
from bot.handlers.package_handler import PackageHandler
from bot.handlers.claim_handler import ClaimHandler
from bot.handlers.referral_handler import ReferralHandler
from bot.handlers.user_handler import UserHandler
from bot.utils.db import init_db, check_db_connection
from bot.jobs.reminder import setup_reminder_jobs
from bot.jobs.reset_claim import setup_reset_claim_jobs

# Configure logging
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)
logger = logging.getLogger(__name__)

async def main():
    """Main function to run the bot"""
    try:
        # Check database connection
        if not check_db_connection():
            logger.error("Database connection failed. Exiting...")
            return
        
        # Initialize database tables
        init_db()
        logger.info("Database initialized successfully")
        
        # Create bot application
        application = Application.builder().token(settings.telegram_bot_token).build()
        
        # Add command handlers
        application.add_handler(CommandHandler("start", AuthHandler.start_command))
        
        # Add callback query handlers
        application.add_handler(CallbackQueryHandler(AuthHandler.handle_callback, pattern="^(register|main_menu)$"))
        application.add_handler(CallbackQueryHandler(PackageHandler.handle_callback, pattern="^(packages|buy_package_|confirm_buy_)"))
        application.add_handler(CallbackQueryHandler(ClaimHandler.handle_callback, pattern="^(daily_claim|claim_)"))
        application.add_handler(CallbackQueryHandler(ReferralHandler.handle_callback, pattern="^(referral|referral_)"))
        application.add_handler(CallbackQueryHandler(UserHandler.handle_callback, pattern="^(dashboard|history|topup)"))
        
        # Setup scheduled jobs
        setup_reminder_jobs(application)
        setup_reset_claim_jobs(application)
        
        # Start the bot
        logger.info("Starting bot...")
        await application.run_polling(allowed_updates=["message", "callback_query"])
        
    except Exception as e:
        logger.error(f"Error starting bot: {e}")
        raise

if __name__ == "__main__":
    asyncio.run(main())
