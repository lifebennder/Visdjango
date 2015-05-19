"""
Django settings for Visdjango project.

For more information on this file, see
https://docs.djangoproject.com/en/1.7/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.7/ref/settings/
"""

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
import os
BASE_DIR = os.path.dirname(os.path.dirname(__file__))
SETTINGS_DIR = os.path.dirname(__file__)
PROJECT_PATH = os.path.join(SETTINGS_DIR, os.pardir)
PROJECT_ROOT = os.path.abspath(
os.path.join(os.path.dirname(__file__), ".."),
)
PROJECT_PATH = os.path.abspath(PROJECT_PATH)
TEMPLATE_PATH = os.path.join(PROJECT_PATH, 'templates')
STATIC_PATH = os.path.join(PROJECT_PATH, 'static')

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.7/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = '7qd*yle&=(lwc_^!!gbz#t2$vo0a0!y5g^=5!#q1ld=35i3sgt'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

TEMPLATE_DEBUG = False

ALLOWED_HOSTS = ['.econvis.com','localhost', '127.0.0.1','.pythonanywhere.com']

GOOGLE_ANALYTICS_PROPERTY_ID = 'UA-61319124-1'
GOOGLE_ANALYTICS_DISPLAY_ADVERTISING = True
GOOGLE_ANALYTICS_SITE_SPEED = True
# Application definition

INSTALLED_APPS = (
    'admin_tools',
    'admin_tools.theming',
    'admin_tools.menu',
    'admin_tools.dashboard',
    'admin_tools_stats',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django_nvd3',
    'djangobower',
    'analytical',
    #'bootstrap3',
    'vis',
)

MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.auth.middleware.SessionAuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
)

ROOT_URLCONF = 'Visdjango.urls'

WSGI_APPLICATION = 'Visdjango.wsgi.application'

# Database
# https://docs.djangoproject.com/en/1.7/ref/settings/#databases
DATABASE_PATH = os.path.join(PROJECT_PATH, 'vis.db')
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': DATABASE_PATH,
    }
}

# Internationalization
# https://docs.djangoproject.com/en/1.7/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'GMT'

USE_I18N = True

USE_L10N = True

USE_TZ = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.7/howto/static-files/

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(PROJECT_PATH, 'media') # Absolute path to the media directory
STATIC_ROOT = os.path.join(PROJECT_ROOT, 'static')
STATIC_URL = '/static/'

STATICFILES_DIRS = (
    #STATIC_PATH,
)

TEMPLATE_DIRS = (
    TEMPLATE_PATH,
)

TEMPLATE_CONTEXT_PROCESSORS = (
"django.contrib.auth.context_processors.auth",
"django.core.context_processors.debug",
"django.core.context_processors.i18n",
"django.core.context_processors.media",
"django.core.context_processors.static",
"django.core.context_processors.tz",
"django.core.context_processors.request",
"django.contrib.messages.context_processors.messages",
)

#Bower
BOWER_COMPONENTS_ROOT = os.path.join(PROJECT_ROOT, 'components')
STATICFILES_FINDERS = (
'django.contrib.staticfiles.finders.FileSystemFinder',
'django.contrib.staticfiles.finders.AppDirectoriesFinder',
'djangobower.finders.BowerFinder',
)
BOWER_PATH = 'bower.cmd'

BOWER_INSTALLED_APPS = (
'd3#3.3.13',
#'nvd3#1.1.15-beta',
'bootstrap#3.3.1',
'jquery#2.1.3',
'google-code-prettify#1.0.3',
'nvd3-community#1.7.0',
)
