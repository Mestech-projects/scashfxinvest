# Generated by Django 5.0.2 on 2024-02-24 18:52

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Referral',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('date_created', models.DateTimeField(auto_now_add=True)),
                ('refererID', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='referals_as_referer', to='users.customers')),
                ('refereredID', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='referals_as_refered', to='users.customers')),
            ],
            options={
                'db_table': 'referals',
            },
        ),
    ]
