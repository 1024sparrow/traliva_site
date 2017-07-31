from django.conf.urls import url
#from . import views
from django.views.generic import TemplateView

urlpatterns = [
    url(r'^vm/$', TemplateView.as_view(template_name='vm_app/index.html')),
]
