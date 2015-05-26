from django.db import models
from django.contrib.auth.models import User
from datetime import datetime


class UserProfile(models.Model):
    user = models.OneToOneField(User)
    #projects = models.ManyToManyField('Project', blank=True)
    #website = models.URLField(blank=True)
    #picture = models.ImageField(upload_to='profile_images', blank=True)

    def __unicode__(self):
        return self.user.username

class Visit(models.Model):
    visits = models.IntegerField(default=0)
    last_visited = models.DateTimeField(default=datetime.now())
    meta = models.TextField(default="empty")
    ip = models.CharField(max_length=60,null=True,blank=True,default='Not')
    def __unicode__(self):
        return'%s, %s, %s' % (self.visits, self.last_visited.strftime('%Y-%m-%d %H:%M'),self.ip)
    class Meta:
        db_table = 'Visit'