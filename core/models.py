from __future__ import unicode_literals

from django.db import models
from django.contrib.auth.models import User
# Create your models here.

class Comments(models.Model):
	user = models.ForeignKey(User, null=True)
	text = models.CharField(max_length=255)