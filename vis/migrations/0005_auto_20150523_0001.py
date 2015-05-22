# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime


class Migration(migrations.Migration):

    dependencies = [
        ('vis', '0004_auto_20150523_0000'),
    ]

    operations = [
        migrations.AlterField(
            model_name='visits',
            name='last_visited',
            field=models.DateTimeField(default=datetime.datetime(2015, 5, 23, 0, 1, 57, 569000)),
            preserve_default=True,
        ),
    ]
