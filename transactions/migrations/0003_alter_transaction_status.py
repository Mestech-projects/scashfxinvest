# Generated by Django 5.0.1 on 2024-02-26 14:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('transactions', '0002_alter_transaction_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='transaction',
            name='status',
            field=models.IntegerField(default=1),
        ),
    ]
