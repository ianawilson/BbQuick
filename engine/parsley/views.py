# Create your views here.

from django.shortcuts import *
from django.http import *
from BeautifulSoup import BeautifulSoup

def getContentURL(request):
    if request.method == 'POST':
        print 'testing!'
        body = request.POST
        soup = BeautifulSoup(body)
        print soup('frame', name='content')
    return HttpResponse(content='')
    
def isUserAuthenticated(request):
    if request.method == 'POST':
        pass
    return HttpResponse(content='' )
    
def getCourses(request):
    if request.method == 'POST':
        pass
    return HttpResponse(content= )
    
def getCourseSections(request):
    if request.method == 'POST':
        pass
    return HttpResponse(content= )
    
def getCourseSubsections(request):
    if request.method == 'POST':
        pass
    return HttpResponse(content= )
