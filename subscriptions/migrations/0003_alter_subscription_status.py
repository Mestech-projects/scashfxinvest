# Generated by Django 5.0.2 on 2024-02-27 19:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('subscriptions', '0002_alter_subscription_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='subscription',
            name='status',
            field=models.IntegerField(default=1),
        ),
    ]
