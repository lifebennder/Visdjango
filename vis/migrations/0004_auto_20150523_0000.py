# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime


class Migration(migrations.Migration):

    dependencies = [
        ('vis', '0003_auto_20150522_2358'),
    ]

    operations = [
        migrations.AlterField(
            model_name='visits',
            name='last_visited',
            field=models.DateTimeField(default=datetime.datetime(2015, 5, 23, 0, 0, 55, 893000)),
            preserve_default=True,
        ),
    ]
