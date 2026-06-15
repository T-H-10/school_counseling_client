import random
import time


def unique_suffix() -> str:
    """A short, run-unique token for names/titles so reruns don't collide."""
    return str(int(time.time() * 1000))[-7:]


def random_id_number() -> str:
    """A random 9-digit Israeli-style national ID (unique per call, no validation check digit)."""
    return str(random.randint(10**8, 10**9 - 1))
