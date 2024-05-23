from django.db import models

from users.models import Customers


# Create your models here.
class Referral(models.Model):
    id = models.AutoField(primary_key=True)
    refererID = models.ForeignKey(Customers, related_name='referals_as_referer', on_delete=models.CASCADE)
    refereredID = models.ForeignKey(Customers, related_name='referals_as_refered', on_delete=models.CASCADE)
    date_created = models.DateTimeField(auto_now_add=True)

    # def __str__(self):
    #     return self.refererID

    class Meta:
        db_table = 'referals'
