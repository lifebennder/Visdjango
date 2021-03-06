# -*- coding: utf-8 -*-
from django.template import RequestContext
from django.shortcuts import render_to_response, render
from django.contrib.staticfiles.views import serve
from django.contrib.auth import authenticate, login, logout
from django.http import HttpResponseRedirect, HttpResponse
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from collections import defaultdict
from numbers import Number
import csv, string
import json
from django.contrib.staticfiles.templatetags.staticfiles import static
import random
from datetime import datetime
import time, os
from django.conf import settings
#def index(request):
#    return render_to_response('vis/index.html')
from vis.models import Visit


def isnumeric(v):
    try:
        """for v in list:
            if v == '' or v == ' ': continue
            float(v) or int(v)
            break"""
        if v=='null' or v==None or v==''or v==' ' : return True
        float(v) or int(v)
    except ValueError:
        return False
    return True

def strtointfloat(str):
    if isinstance(str, int):
        return int(str)
    return float(str)

def readcsv(path):
    chartdata = []
    if not os.path.isfile(path): return chartdata
    with open(path) as f:
        reader = list(csv.reader(f))
        for rownum, row in enumerate(reader):
            adjcolnum = 1
            for colnum, cell in enumerate(row):
                if rownum == 0:
                    if not isnumeric(reader[1][colnum]) or colnum==0: continue
                    chartdata.append({'key': cell, 'values': [], 'disabled': False})
                else:
                    if colnum == 0 or not isnumeric(reader[1][colnum]):
                        if not isnumeric(reader[1][colnum]): adjcolnum += 1
                        continue
                    collnum = colnum
                    adj = adjcolnum
                    index = colnum-adjcolnum
                    keyval = chartdata[colnum-adjcolnum]
                    keyval['values'].append({'x':row[0],'y':cell})
    """   transposed = zip(*reader)
   for colnum , val in enumerate(transposed):
       #if not (unicode(val[1],'utf-8')).isdecimal(): continue
       if not isnumeric(val[1:]): continue
       if colnum == 0:
           a=''
           #chartdata.append({'x':map(int,val[1:])}) # change to do if statement outside, so not do if everytime
           #chartdata['x'] = map(int,val[1:]) # change to do if statement outside, so not do if everytime
       else:
           chartdata.append({'key': val[0], 'values': val[1:]})"""
    return chartdata

def help(request):
    return render_to_response('vis/help.html')

def main_data(request,country):
    tooltip_date = "%d %b %Y %H:%M:%S %p"
    extra_serie = {"tooltip": {"y_start": "There are ", "y_end": " calls"},
                   "date_format": tooltip_date}
    chartdata = readcsv(os.path.join(settings.STATIC_PATH, country+'.csv'))
    return JsonResponse(chartdata, safe=False)

def main_ref(request, country):
    return render_to_response('vis/'+country+'reference.html')

def main_quiz(request, country):
    return render_to_response('vis/'+country+'quiz.html')

def main_quizanswers(request):
    json_data = open(os.path.join(settings.STATIC_PATH, 'quizanswers.json'))
    data1 = json.load(json_data)
    json_data.close()
    return JsonResponse(data1, safe=False)


def visit(request):
    context_dict = {'vvv': Visit.objects.first()}
    #if request.META['USERDOMAIN']!='LUKA':
    v = Visit.objects.last()
    if v is None:
        visits = 1
    else:
        visits = v.visits + 1
    info = 'Not'
    if 'HTTP_FROM' in request.META:
        info = request.META['HTTP_FROM']
    elif 'HTTP_X_REAL_IP' in request.META:
        info = request.META['HTTP_X_REAL_IP']
    vv = Visit.objects.get_or_create(visits=visits,last_visited=datetime.now(),meta=request.META,ip=info)[0]
    vv.save()
    #context_dict['vvv'] = vv
    response = render(request, 'vis/index.html', context_dict)
    return response



def index(request):
    return visit(request)
    #return render(request,'vis/index.html', {})
    #return render_to_response('nvd3/barchart_2.html')

def about(request):
    return render_to_response('vis/about.html')

def decode_url(param):  # helper function just to mak things that little easier
    name = param.replace('_', ' ')
    return name

def encode_url(str):
    return str.replace(' ', '_')

def vladreadcsv(path):
    chartdata = []
    if not os.path.isfile(path): return chartdata
    with open(path) as f:
        reader = list(csv.reader(f))
        for rownum, row in enumerate(reader):
            #print row
            adjcolnum = 1
            for colnum, cell in enumerate(row):
                if rownum == 0:
                    if not isnumeric(reader[1][colnum]) or colnum==0: continue
                    if colnum==1 or colnum==2:chartdata.append({'key': cell, 'values': [{'x':399,'y':0.03}], 'disabled': False})
                    else:
                        chartdata.append({'key': cell, 'values': [], 'disabled': True})
                else:
                    if colnum == 0 or not isnumeric(reader[1][colnum]):
                       # if not isnumeric(reader[1][colnum]): adjcolnum += 1
                        continue
                    keyval = chartdata[colnum-adjcolnum]
                    #keyval['values']   .append({'x':row[0],'y':0})
                    if isfloat(cell): cell = float(cell)
                    elif isint(cell): cell = int(cell)

                    keyval['values'].append({'x':row[0],'y':cell})
    #print chartdata
    chartdata[1]['values'].append({'x':1000,'y':0.29})
    return chartdata

def vlad(request):
    chartdata = vladreadcsv(os.path.join(settings.STATIC_PATH, 'specchart.csv'))
    return JsonResponse(chartdata, safe=False)

def isfloat(value):
  try:
    float(value)
    return True
  except:
    return False
def isint(value):
  try:
    int(value)
    return True
  except:
    return False
def vladindex(request):
    response = render(request, 'vis/vladindex.html')
    return response

def test(request):
    response = render(request, 'vis/test.html')
    return response
