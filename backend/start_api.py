#!/usr/bin/env python3
"""
Startup script untuk Invest Bot API
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
        logging.FileHandler('api.log'),
        logging.StreamHandler(sys.stdout)
    ]
)

logger = logging.getLogger(__name__)

def main():
    """Main function to start the API"""
    try:
        logger.info("Starting Invest Bot API...")
        
        # Check if required environment variables are set
        required_env_vars = ['DB_HOST', 'DB_NAME', 'DB_USER', 'DB_PASSWORD']
        missing_vars = [var for var in required_env_vars if not os.getenv(var)]
        
        if missing_vars:
            logger.error(f"Missing required environment variables: {missing_vars}")
            logger.error("Please check your .env file")
            return 1
        
        # Import and start API
        from api.main import app
        import uvicorn
        from config import settings
        
        logger.info(f"Starting API server on {settings.api_host}:{settings.api_port}")
        uvicorn.run(
            app,
            host=settings.api_host,
            port=settings.api_port,
            reload=True,
            log_level="info"
        )
        
    except KeyboardInterrupt:
        logger.info("API stopped by user")
        return 0
    except Exception as e:
        logger.error(f"Error starting API: {e}")
        return 1

if __name__ == "__main__":
    exit_code = main()
    sys.exit(exit_code)
