from django.db import models
from api.utils import now

# Create your models here.
class User(models.Model):
    ROLE_CHOICES = (
        ('A', 'admin'),
        ('S', 'shop'),
        ('U', 'user'),
        ('P', 'passive'),
    )
    uid = models.CharField(max_length=255, primary_key=True)
    username = models.CharField(max_length=255)
    role = models.CharField(max_length=255, choices=ROLE_CHOICES)
    money = models.IntegerField(default=0)

    def __str__(self):
        return self.username
    

class Code(models.Model):
    code = models.CharField(max_length=255, primary_key=True)
    issuer = models.ForeignKey(User, on_delete=models.CASCADE)
    money = models.IntegerField(default=0)
    description = models.CharField(max_length=255)
    activates = models.DateTimeField()
    expires = models.DateTimeField()
    per_person_limit = models.IntegerField(null=True)
    people_limit = models.IntegerField(null=True)

    def is_valid(self):
        was_activated = self.activates <= now()
        expired = self.expires < now()
        return was_activated and not expired

class Transaction(models.Model):
    receiver = models.ForeignKey(User, on_delete=models.CASCADE)
    code = models.ForeignKey(Code, on_delete=models.CASCADE)
    timestamp = models.DateTimeField()
