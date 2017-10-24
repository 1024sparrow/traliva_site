from django.shortcuts import render
from django.http import HttpResponse
import os, os.path
import json

# Create your views here.
def view_html(request, tab_id): # view_html
    context = {
        'tab_id': tab_id
    }
    return render(request, 'index.html', context)

def gameplay_js(request, tab_id):
    context = {
        'current_tab': tab_id
    }
    return render(request, 'gameplay.js', context)

def gameplay_html(request, tab_id, html_id):
    f = open('tab_apps/%s/html/%s'%(tab_id, html_id), 'r')
    return f.read()
