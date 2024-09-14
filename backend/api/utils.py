from datetime import datetime, timedelta
from django.utils import timezone

def from_now(d_days=0, d_hours=0, d_minutes=0, d_seconds=0):
    return timezone.now() + timedelta(days=d_days, hours=d_hours, minutes=d_minutes, seconds=d_seconds)
def is_in_time_from_now(time: str, mins: int) -> bool:
    t = datetime.fromisoformat(time)
    reference = from_now(d_minutes=mins)
    error = timedelta(seconds=1)
    
    return equals(t, reference, error)

def equals(a: datetime, b: datetime, error: timedelta) -> bool:
    return a - error <= b <= a + error