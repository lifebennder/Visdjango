from django.conf.urls import patterns, url
from vis import views

urlpatterns = patterns('',
    url(r'^index/$', views.index, name='index'),
    url(r'^helpp/$', views.helpp, name='help'),
    url(r'^about/$', views.about, name='about'),
      # data URLS
    url(r'^main_data/$', views.main_data),
)