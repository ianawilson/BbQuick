# Create your views here.

from django.shortcuts import *
from django.http import *
from BeautifulSoup import BeautifulSoup
from helpers import *

def getContentURL(request):
    if request.method == 'POST' and 'html' in request.POST:
        body = request.POST['html']
        soup = BeautifulSoup(body)
        frame = soup('frame', attrs={'name':'content'})[0]
        url = frame['src']
        response = jsonEncode({'url': url})
    else:
        response = jsonEncode({'error': "You must POST to this URL with the key 'html' in the POST data."})
    return HttpResponse(content=response)
    
def isUserAuthenticated(request):
    if request.method == 'POST':
        pass
    return HttpResponse(content='')
    
def getCourses(request):
    if request.method == 'POST':
        pass
    return HttpResponse(content='')
    
def getCourseSections(request):
    if request.method == 'POST':
        pass
    return HttpResponse(content='')
    
def getCourseSubsections(request):
    if request.method == 'POST':
        pass
    return HttpResponse(content='')
