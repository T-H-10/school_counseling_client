import random
import time


def unique_suffix() -> str:
    """A short, run-unique token for names/titles so reruns don't collide."""
    return str(int(time.time() * 1000))[-7:]


def random_id_number() -> str:
    """A random valid 9-digit Israeli national ID with a correct check digit."""
    digits = [random.randint(0, 9) for _ in range(8)]
    total = 0
    for i, d in enumerate(digits):
        step = d * (1 if i % 2 == 0 else 2)
        if step >= 10:
            step -= 9
        total += step
    check = (10 - (total % 10)) % 10
    digits.append(check)
    return "".join(map(str, digits))
