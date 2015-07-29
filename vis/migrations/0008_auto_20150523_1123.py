# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime


class Migration(migrations.Migration):

    dependencies = [
        ('vis', '0007_auto_20150523_0005'),
    ]

    operations = [
        migrations.AddField(
            model_name='visits',
            name='meta',
            field=models.TextField(default=b'empty'),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='visits',
            name='last_visited',
            field=models.DateTimeField(default=datetime.datetime(2015, 5, 23, 11, 23, 7, 587000)),
            preserve_default=True,
        ),
    ]
