from django.db import models

from users.models import Customers


# Create your models here.
class Account(models.Model):
    id = models.AutoField(primary_key=True)
    user_id = models.ForeignKey(Customers, related_name='account', on_delete=models.CASCADE)
    date_opened = models.DateTimeField(auto_now_add=True)
    balance = models.DecimalField(max_digits=15, decimal_places=2, default=0.00)
    referal_amnt = models.DecimalField(max_digits=15, decimal_places=2, default=0.00)
    other_amnt = models.DecimalField(max_digits=15, decimal_places=2, default=0.00)
    
    # def __str__(self):
    #     return self.id
    

    class Meta:
        db_table = 'accounts'