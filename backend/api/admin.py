from django.contrib import admin

from .models import User, Code, Transaction

class CodeAdmin(admin.ModelAdmin):
    list_display = ["issuer", "money", "description", "activates", "expires", "per_person_limit", "use_limit", "use_count"]

admin.site.register(Code, CodeAdmin)

class TransactionAdmin(admin.ModelAdmin):
    list_display = ["receiver", "code", "timestamp"]

admin.site.register(Transaction, TransactionAdmin)

class UserAdmin(admin.ModelAdmin):
    list_display = ["username", "role", "money"]

admin.site.register(User, UserAdmin)