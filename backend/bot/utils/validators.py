import re
from typing import Union

def validate_telegram_id(telegram_id: Union[int, str]) -> bool:
    """Validate Telegram user ID"""
    try:
        user_id = int(telegram_id)
        return user_id > 0
    except (ValueError, TypeError):
        return False

def validate_amount(amount: Union[int, float, str]) -> bool:
    """Validate amount (must be positive number)"""
    try:
        amount_float = float(amount)
        return amount_float > 0
    except (ValueError, TypeError):
        return False

def validate_referral_code(code: str) -> bool:
    """Validate referral code format (8-10 alphanumeric characters)"""
    if not code or not isinstance(code, str):
        return False
    
    # Check length
    if len(code) < 8 or len(code) > 10:
        return False
    
    # Check if alphanumeric and uppercase
    if not re.match(r'^[A-Z0-9]+$', code):
        return False
    
    return True

def validate_package_name(name: str) -> bool:
    """Validate package name"""
    if not name or not isinstance(name, str):
        return False
    
    # Check length
    if len(name) < 3 or len(name) > 100:
        return False
    
    return True

def validate_duration_days(days: Union[int, str]) -> bool:
    """Validate package duration in days"""
    try:
        days_int = int(days)
        return 1 <= days_int <= 365  # Between 1 day and 1 year
    except (ValueError, TypeError):
        return False

def validate_daily_return(return_rate: Union[float, str]) -> bool:
    """Validate daily return percentage"""
    try:
        rate = float(return_rate)
        return 0.01 <= rate <= 10.0  # Between 0.01% and 10%
    except (ValueError, TypeError):
        return False
