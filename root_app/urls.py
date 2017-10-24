from django.conf.urls import url
from django.views.generic import RedirectView
from . import views

urlpatterns = [
    #rl(r'^html/(?P<tab_id>[^/]+)/$', views.view_html),

    #url(r'^$', RedirectView.as_view(url='/' + header_meta['tabs'][0]['id'] + '/')),
    url(r'^$', RedirectView.as_view(url='/root/')),
    url(r'^(?P<tab_id>[^/]+)/$', views.view_html),
    url(r'^(?P<tab_id>[^/]+)/gameplay.js$', views.gameplay_js),
    url(r'^(?P<tab_id>[^/]+)/html/(?P<html_id>[^/]+)$', views.gameplay_html),
    #url(r'^/(?P<tab_id>[^/]+).js$', views.view_js),
]
