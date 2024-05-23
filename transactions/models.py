from django.db import models

from accounts.models import Account


# Create your models here.
class Transaction(models.Model):
    id = models.AutoField(primary_key=True)
    accountID = models.ForeignKey(Account, related_name='transactions', on_delete=models.CASCADE)
    type = models.CharField(max_length=4, null=True, blank=True)
    reference = models.CharField(max_length=20, null=True, blank=True)
    amount = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    tran_desc = models.CharField(max_length=255)
    transaction_date = models.DateTimeField(auto_now_add=True)
    status = models.IntegerField(default=1)
    
    # def __str__(self):
    #     return self.reference
    #

    class Meta:
        db_table = 'transactions'