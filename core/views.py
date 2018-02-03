from core.models import Comments, User
import json
from django.shortcuts import render
from django.http import HttpResponse, HttpResponseServerError, JsonResponse, Http404
from django.views.decorators.csrf import csrf_exempt
from django.contrib.sessions.models import Session
from django.contrib.auth.decorators import login_required
from django.contrib.sessions.models import Session

import redis
 
@login_required
def home(request):
    comments = Comments.objects.select_related().all()[0:100]
    if not request.session.session_key:
            request.session.save()
    session_id = request.session.session_key
    return render(request, 'core/index.html', {'comments':comments, 'session_key':session_id})
 
@csrf_exempt
def node_api(request):
    # try:
        #Get User from sessionid
        # session = Session.objects.get(session_key=request.POST.get('sessionid'))
        # user_id = session.get_decoded().get('_auth_user_id')
        # user = User.objects.get(id=user_id)
        session_id = request.POST['session_key']
        session = Session.objects.get(session_key = session_id)
        uid = session.get_decoded().get('_auth_user_id')
        try:
            user = User.objects.get(pk=uid)
        except ObjectDoesNotExist:
            raise Http404
        # print session_id
        # Comments.objects.create( text=request.POST.get('message'))
        data = request.POST
        if data.get('secret') != 'qwertyuiop' or data.get('secret1') != 'asdfghjkl':
            raise Http404 
        #Once comment has been created post it to the chat channel
        r = redis.StrictRedis(host='localhost', port=6379, db=0)
        r.publish('chat',request.POST.get('message'))
        r.set(request.POST['id'], json.dumps({'comment':request.POST}))
        # print r.get('a')
        return JsonResponse({'session_id':session_id, 'message':request.POST.get('message')})
    # except Exception, e:
        return HttpResponseServerError(str(e))