# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime


class Migration(migrations.Migration):

    dependencies = [
        ('vis', '0008_auto_20150523_1123'),
    ]

    operations = [
        migrations.CreateModel(
            name='Visit',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('visits', models.IntegerField(default=0)),
                ('last_visited', models.DateTimeField(default=datetime.datetime(2015, 5, 26, 13, 34, 17, 543000))),
                ('meta', models.TextField(default=b'empty')),
                ('ip', models.CharField(default=b'Not', max_length=60, null=True, blank=True)),
            ],
            options={
                'db_table': 'Visit',
            },
            bases=(models.Model,),
        ),
        migrations.DeleteModel(
            name='Visits',
        ),
    ]
