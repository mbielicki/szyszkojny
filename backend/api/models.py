from uuid import uuid4
from django.db import models
from api.utils import is_in_time_from_now, from_now, uuid

class User(models.Model):
    ROLE_CHOICES = (
        ('A', 'admin'),
        ('S', 'shop'),
        ('U', 'user'),
        ('P', 'passive'),
    )
    uid = models.CharField(max_length=255, primary_key=True)
    username = models.CharField(max_length=255)
    role = models.CharField(max_length=255, choices=ROLE_CHOICES, default='P')
    money = models.IntegerField(default=0)

    def __str__(self):
        return self.username
    

class Code(models.Model):
    code = models.CharField(max_length=255, primary_key=True, default=uuid)
    issuer = models.ForeignKey(User, on_delete=models.CASCADE)
    money = models.IntegerField(default=0)
    description = models.CharField(max_length=255)
    activates = models.DateTimeField(default=from_now())
    expires = models.DateTimeField(default=from_now(d_minutes=5))
    per_person_limit = models.PositiveIntegerField(null=True)
    use_limit = models.PositiveIntegerField(null=True)
    use_count = models.IntegerField(default=0)

    def is_valid(self) -> bool:
        was_activated = self.activates <= from_now()
        expired = self.expires < from_now()
        return was_activated and not expired
    
    def expired(self) -> bool:
        return self.expires < from_now()
    
    def activated(self) -> bool:
        return self.activates <= from_now()
    
    def is_used_up(self) -> bool:
        if self.use_limit is None:
            return False
        return self.use_count >= self.use_limit
    
    def use_by_count(self, user: User) -> int:
        return Transaction.objects.filter(receiver=user, code=self).count()
    

class Transaction(models.Model):
    receiver = models.ForeignKey(User, on_delete=models.CASCADE)
    code = models.ForeignKey(Code, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)

def user_may_make_code(uid, code_params):
    user = User.objects.get(uid=uid)
    
    if user.role in ('S', 'A'):
        return True
    
    if (
        user.role == 'U' 
        and code_params['use_limit'] == 1 
        and user.money >= code_params['money'] 
        and code_params['money'] > 0
        and is_in_time_from_now(code_params['expires'], mins=5)
        and is_in_time_from_now(code_params['activates'], mins=0)
    ):
        return True


    return False