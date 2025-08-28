import time
from typing import Dict, Tuple
from functools import wraps
import logging

logger = logging.getLogger(__name__)

# In-memory storage for rate limiting (in production, use Redis)
_rate_limit_store: Dict[str, Tuple[int, float]] = {}

def rate_limit(max_requests: int = 5, window_seconds: int = 60):
    """
    Rate limiting decorator
    
    Args:
        max_requests: Maximum requests allowed in time window
        window_seconds: Time window in seconds
    """
    def decorator(func):
        @wraps(func)
        async def wrapper(update, context, *args, **kwargs):
            user_id = str(update.effective_user.id)
            current_time = time.time()
            
            # Check if user exists in rate limit store
            if user_id in _rate_limit_store:
                request_count, window_start = _rate_limit_store[user_id]
                
                # Check if we're still in the same time window
                if current_time - window_start < window_seconds:
                    # Still in window, check request count
                    if request_count >= max_requests:
                        logger.warning(f"Rate limit exceeded for user {user_id}")
                        await update.message.reply_text(
                            "⚠️ Terlalu banyak request. Silakan tunggu beberapa saat."
                        )
                        return
                    
                    # Increment request count
                    _rate_limit_store[user_id] = (request_count + 1, window_start)
                else:
                    # New time window, reset counter
                    _rate_limit_store[user_id] = (1, current_time)
            else:
                # First request for this user
                _rate_limit_store[user_id] = (1, current_time)
            
            # Clean up old entries (optional, for memory management)
            _cleanup_rate_limit_store()
            
            # Execute the function
            return await func(update, context, *args, **kwargs)
        
        return wrapper
    return decorator

def anti_spam(interval_seconds: int = 5):
    """
    Anti-spam decorator to prevent rapid successive calls
    
    Args:
        interval_seconds: Minimum interval between calls
    """
    def decorator(func):
        @wraps(func)
        async def wrapper(update, context, *args, **kwargs):
            user_id = str(update.effective_user.id)
            current_time = time.time()
            
            # Check if user has made a recent call
            if user_id in _rate_limit_store:
                _, last_call_time = _rate_limit_store[user_id]
                
                if current_time - last_call_time < interval_seconds:
                    logger.warning(f"Spam detected for user {user_id}")
                    await update.message.reply_text(
                        "⚠️ Terlalu cepat! Silakan tunggu beberapa saat."
                    )
                    return
            
            # Update last call time
            _rate_limit_store[user_id] = (1, current_time)
            
            # Execute the function
            return await func(update, context, *args, **kwargs)
        
        return wrapper
    return decorator

def _cleanup_rate_limit_store():
    """Clean up old rate limit entries"""
    current_time = time.time()
    expired_keys = []
    
    for key, (_, timestamp) in _rate_limit_store.items():
        if current_time - timestamp > 3600:  # 1 hour
            expired_keys.append(key)
    
    for key in expired_keys:
        del _rate_limit_store[key]
    
    if expired_keys:
        logger.debug(f"Cleaned up {len(expired_keys)} expired rate limit entries")

def check_user_activity(user_id: str, max_requests_per_hour: int = 100) -> bool:
    """
    Check if user is being too active (potential bot/spam)
    
    Args:
        user_id: Telegram user ID
        max_requests_per_hour: Maximum requests per hour
    
    Returns:
        True if user is within limits, False if suspicious
    """
    current_time = time.time()
    user_key = f"activity_{user_id}"
    
    if user_key in _rate_limit_store:
        request_count, window_start = _rate_limit_store[user_key]
        
        # Check if within 1 hour window
        if current_time - window_start < 3600:
            if request_count > max_requests_per_hour:
                logger.warning(f"User {user_id} exceeded hourly activity limit")
                return False
            
            # Increment count
            _rate_limit_store[user_key] = (request_count + 1, window_start)
        else:
            # New hour, reset counter
            _rate_limit_store[user_key] = (1, current_time)
    else:
        # First request this hour
        _rate_limit_store[user_key] = (1, current_time)
    
    return True
