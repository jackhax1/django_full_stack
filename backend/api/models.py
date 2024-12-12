from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User,AbstractUser

# Create your models here.

class User(AbstractUser):
    pass

class ApiKey(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    api_key = models.CharField(max_length=50)
    gen_time = models.DateTimeField("Generated Time")
    status = models.BooleanField(default = 0)
    expired = models.BooleanField(default = 0)
    use_count = models.IntegerField(default=0)
    limit = models.IntegerField(default=100)


class UsageLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    api_key = models.CharField(max_length=50)
    timestamp = models.DateTimeField(default=timezone.now)
    request_payload = models.JSONField()

class UserCredit(models.Model):
    user = models.OneToOneField(User,on_delete=models.CASCADE,
                                primary_key=True)
    credit_balance = models.IntegerField(default=0)



class Shop(models.Model):
    user = models.OneToOneField(User,on_delete=models.CASCADE,null=True)
    
    
    


class Product(models.Model):

    product_id = models.CharField(blank=True)

    date_created = models.DateTimeField(blank=True, null=True)
    last_updated = models.DateTimeField(blank=True, null=True)

    name = models.CharField(blank=True, null=True)
    buying_price = models.DecimalField(blank=True, null=True, decimal_places=2, max_digits=10)
    selling_price = models.DecimalField(blank=True, null=True, decimal_places=2, max_digits=10)

    quantity = models.IntegerField(blank=True, null=True)

    shop = models.CharField(blank=True)


class Invoice(models.Model):

    invoice_id = models.IntegerField(blank=True)
    entry_time = models.DateTimeField(default=timezone.now, blank=True)
    total_with_tax = models.DecimalField(blank=True, null=True, decimal_places=2, max_digits=10)
    cash = models.DecimalField(blank=True, null=True, decimal_places=2, max_digits=10)
    operator = models.CharField()

    shop = models.CharField(blank=True,null=True)

class InvoiceItems(models.Model):

    invoice_id = models.IntegerField(blank=True)
    product_id = models.IntegerField(blank=True)
    name = models.CharField()
    code = models.CharField()
    buying_price = models.DecimalField(blank=True, null=True, decimal_places=2, max_digits=10)
    selling_price = models.DecimalField(blank=True, null=True, decimal_places=2, max_digits=10)
    quantity = models.DecimalField(blank=True, null=True, decimal_places=2, max_digits=10)
    total_with_tax = models.DecimalField(blank=True, null=True, decimal_places=2, max_digits=10)
    entry_time = models.DateTimeField(default=timezone.now, blank=True)

    shop = models.CharField(blank=True,null=True)
