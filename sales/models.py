from django.db import models

# Create your models here.
class Items(models.Model):
    name = models.CharField(max_length=100)
    category = models.CharField(max_length=100)
    restaurant = models.CharField(max_length=100)
    price = models.FloatField(default=0)
    uid = models.CharField(max_length=100)