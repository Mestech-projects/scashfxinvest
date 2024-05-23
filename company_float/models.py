from django.db import models

# Create your models here.
class CompanyFloat(models.Model):
    id = models.AutoField(primary_key=True)
    balance = models.DecimalField(max_digits=10, decimal_places=2, null=False)

    class Meta:
        db_table = 'company_float'