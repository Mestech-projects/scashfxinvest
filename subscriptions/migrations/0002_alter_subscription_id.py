# Generated by Django 5.0.1 on 2024-02-25 17:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('subscriptions', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='subscription',
            name='id',
            field=models.AutoField(primary_key=True, serialize=False),
        ),
    ]
