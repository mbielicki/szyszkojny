from datetime import datetime, timedelta
from django.utils.timezone import make_aware

def now(d_days=0):
    return make_aware(datetime.now() + timedelta(days=d_days))