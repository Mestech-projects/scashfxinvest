# Generated by Django 5.0.2 on 2024-02-24 18:52

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='CompanyFloat',
            fields=[
                ('id', models.IntegerField(primary_key=True, serialize=False)),
                ('balance', models.DecimalField(decimal_places=2, max_digits=10)),
            ],
            options={
                'db_table': 'company_float',
            },
        ),
    ]
