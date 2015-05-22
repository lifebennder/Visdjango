# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime


class Migration(migrations.Migration):

    dependencies = [
        ('vis', '0002_visits'),
    ]

    operations = [
        migrations.AlterField(
            model_name='visits',
            name='last_visited',
            field=models.DateTimeField(default=datetime.datetime(2015, 5, 22, 23, 58, 16, 755000)),
            preserve_default=True,
        ),
    ]
