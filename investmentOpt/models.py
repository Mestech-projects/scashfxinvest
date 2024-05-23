from django.db import models


# Create your models here.

class InvestmentOption(models.Model):
    id = models.AutoField(primary_key=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    daily_income = models.DecimalField(max_digits=10, decimal_places=2)
    cycle = models.IntegerField()
    total_income = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)



    

    
    # def __str__(self):
    #     return self.id

    class Meta:
        db_table = 'products'
