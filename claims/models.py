from django.db import models

# Create your models here.
class Claim(models.Model):
    id = models.IntegerField(primary_key=True)
    user_id = models.IntegerField(null=True, blank=True)
    type = models.IntegerField(null=False)
    date_claimed = models.DateTimeField(auto_now_add=True)
    status = models.BooleanField(default=True)
    
    def __str__(self):
        return self.user_id
    

    class Meta:
        db_table = 'claims'