from django.conf.urls import url
#from . import views
from django.views.generic import TemplateView

urlpatterns = [
    url(r'^django/$', TemplateView.as_view(template_name='django_app/index.html'), name='django'),
]
