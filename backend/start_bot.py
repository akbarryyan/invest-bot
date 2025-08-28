#!/usr/bin/env python3
"""
Startup script untuk Invest Bot Telegram
"""

import os
import sys
import logging
from pathlib import Path

# Add project root to Python path
project_root = Path(__file__).parent
sys.path.insert(0, str(project_root))

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('bot.log'),
        logging.StreamHandler(sys.stdout)
    ]
)

logger = logging.getLogger(__name__)

def main():
    """Main function to start the bot"""
    try:
        logger.info("Starting Invest Bot...")
        
        # Check if required environment variables are set
        required_env_vars = ['TELEGRAM_BOT_TOKEN']
        missing_vars = [var for var in required_env_vars if not os.getenv(var)]
        
        if missing_vars:
            logger.error(f"Missing required environment variables: {missing_vars}")
            logger.error("Please check your .env file")
            return 1
        
        # Import and start bot
        from bot.main import main as bot_main
        asyncio.run(bot_main())
        
    except KeyboardInterrupt:
        logger.info("Bot stopped by user")
        return 0
    except Exception as e:
        logger.error(f"Error starting bot: {e}")
        return 1

if __name__ == "__main__":
    import asyncio
    exit_code = main()
    sys.exit(exit_code)
