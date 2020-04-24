from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('vend/<code>/', views.vendhq_data),
    path('vend_place_order/', views.vendhq_place_order),
]