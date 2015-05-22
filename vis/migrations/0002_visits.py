# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime


class Migration(migrations.Migration):

    dependencies = [
        ('vis', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Visits',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('visits', models.IntegerField(default=0)),
                ('last_visited', models.DateTimeField(default=datetime.datetime(2015, 5, 22, 23, 35, 8, 411000))),
            ],
            options={
                'db_table': 'Visits',
            },
            bases=(models.Model,),
        ),
    ]
