from django.conf.urls import patterns, include, url
from django.contrib import admin

from django.conf import settings
admin.autodiscover()
urlpatterns = patterns('',
    url(r'^$', 'vis.views.index', name='index'),
    url(r'^vis/', include('vis.urls')),
    url(r'^admin_tools/', include('admin_tools.urls')),
    url(r'^admin/', include(admin.site.urls)),
)

if settings.DEBUG:
    urlpatterns += patterns(
        'django.views.static',
        (r'media/(?P<path>.*)',
        'serve',
        {'document_root': settings.MEDIA_ROOT}), )