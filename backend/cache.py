import json
import logging
import os
from typing import Any, Optional

import redis

logger = logging.getLogger(__name__)

# Redis configuration
REDIS_HOST = os.getenv("REDIS_HOST", "localhost")
REDIS_PORT = int(os.getenv("REDIS_PORT", 6379))
REDIS_DB = int(os.getenv("REDIS_DB", 0))

# Initialize Redis client
try:
    redis_client = redis.Redis(
        host=REDIS_HOST,
        port=REDIS_PORT,
        db=REDIS_DB,
        decode_responses=True,
        socket_connect_timeout=5,
        socket_keepalive=True,
    )
    # Test connection
    redis_client.ping()
    logger.info(f"✅ Redis connected: {REDIS_HOST}:{REDIS_PORT}")
except Exception as e:
    logger.warning(f"⚠️  Redis connection failed: {str(e)}. Caching disabled.")
    redis_client = None


def cache_get(key: str) -> Optional[Any]:
    """Get value from cache"""
    if not redis_client:
        return None
    try:
        logger.debug(f"🔍 Cache GET: {key}")
        value = redis_client.get(key)
        if value:
            logger.debug(f"✅ Cache HIT: {key}")
            return json.loads(value)
        logger.debug(f"❌ Cache MISS: {key}")
        return None
    except Exception as e:
        logger.error(f"❌ Cache GET error: {str(e)}")
        return None


def cache_set(key: str, value: Any, ttl: int = 3600) -> bool:
    """Set value in cache with TTL (in seconds)"""
    if not redis_client:
        return False
    try:
        logger.debug(f"💾 Cache SET: {key} (TTL: {ttl}s)")
        redis_client.setex(key, ttl, json.dumps(value))
        logger.debug(f"✅ Cache SET complete: {key}")
        return True
    except Exception as e:
        logger.error(f"❌ Cache SET error: {str(e)}")
        return False


def cache_delete(key: str) -> bool:
    """Delete key from cache"""
    if not redis_client:
        return False
    try:
        logger.debug(f"🗑️  Cache DELETE: {key}")
        redis_client.delete(key)
        return True
    except Exception as e:
        logger.error(f"❌ Cache DELETE error: {str(e)}")
        return False


def cache_clear_pattern(pattern: str) -> int:
    """Clear all keys matching pattern"""
    if not redis_client:
        return 0
    try:
        logger.debug(f"🗑️  Cache CLEAR PATTERN: {pattern}")
        keys = redis_client.keys(pattern)
        if keys:
            deleted = redis_client.delete(*keys)
            logger.debug(f"✅ Deleted {deleted} keys matching {pattern}")
            return deleted
        return 0
    except Exception as e:
        logger.error(f"❌ Cache CLEAR error: {str(e)}")
        return 0


def rate_limit(key: str, limit: int = 100, window: int = 60) -> bool:
    """Rate limiting: Allow 'limit' requests per 'window' seconds"""
    if not redis_client:
        return True  # Allow if Redis unavailable
    try:
        current = redis_client.incr(key)
        if current == 1:
            redis_client.expire(key, window)
        return current <= limit
    except Exception as e:
        logger.error(f"❌ Rate limit error: {str(e)}")
        return True  # Allow if Redis error
