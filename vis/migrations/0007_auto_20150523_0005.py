# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime


class Migration(migrations.Migration):

    dependencies = [
        ('vis', '0006_auto_20150523_0002'),
    ]

    operations = [
        migrations.AlterField(
            model_name='visits',
            name='last_visited',
            field=models.DateTimeField(default=datetime.datetime(2015, 5, 23, 0, 5, 10, 642000)),
            preserve_default=True,
        ),
    ]
