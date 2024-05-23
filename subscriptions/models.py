from django.db import models

from investmentOpt.models import InvestmentOption
from users.models import Customers


# Create your models here.
class Subscription(models.Model):
    id = models.AutoField(primary_key=True)
    user_id = models.ForeignKey(Customers, on_delete=models.CASCADE, related_name='subscriptions')
    prod_id = models.ForeignKey(InvestmentOption, on_delete=models.CASCADE, related_name='subscriptions')
    date_subscribed = models.DateTimeField(auto_now_add=True)
    status = models.IntegerField(default=1)

    # def __str__(self):
    #     return self.user_id

    class Meta:
        db_table = 'subscriptions'
