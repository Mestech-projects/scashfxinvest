from django.db import models


# Create your models here.
class Customers(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100, null=False)
    email = models.CharField(max_length=100, null=False)
    phone_number = models.CharField(max_length=100, null=False)
    is_active = models.BooleanField(default=False)
    first_login = models.BooleanField(default=False)
    type = models.IntegerField(default=0)
    password = models.CharField(max_length=200, null=False)
    referal_code = models.CharField(max_length=10, null=False)
    date_created = models.DateTimeField(auto_now_add=True)
    status = models.BooleanField(default=True)
    

    class Meta:
        db_table = 'customers'
