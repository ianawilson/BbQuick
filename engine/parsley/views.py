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
        response = jsonEncode({'contentURL': url})
    else:
        response = jsonEncode({'error': "You must POST to this URL with the key 'html' in the POST data."})
    return HttpResponse(content=response)
    
def isAuthenticated(request):
    if request.method == 'POST' and 'html' in request.POST:
        body = request.POST['html']
        soup = BeautifulSoup(body)
        form = soup('form', attrs={'name': 'login'})
        if form:
            response = jsonEncode({'authenticated': 'false'})
        else:
            response = jsonEncode({'authenticated': 'true'})
    else:
        response = jsonEncode({'error': "You must POST to this URL with the key 'html' in the POST data."})
    return HttpResponse(content=response)
    
def getCourses(request):
    if request.method == 'POST' and 'html' in request.POST:
        print 1
        courses = []
        body = request.POST['html']
        soup = BeautifulSoup(body)
        div = soup.find(text='Courses Online').parent.parent.parent
        trs = div.findAll('tr')
        print 2
        trs = trs[2:-1]
        print 3
        for tr in trs:
            print 4
            course = {}
            anchor = tr.find('a')
            print dir(anchor.attrs)
            course['name'] = anchor.contents[0].strip()
            print anchor.attrs
            for attr in anchor.attrs:
                if attr[0] == 'href':
                    course['url'] = attr[1]
            print course
    return HttpResponse(content='')
    
def getCourseSections(request):
    if request.method == 'POST':
        pass
    return HttpResponse(content='')
    
def getCourseSubsections(request):
    if request.method == 'POST':
        pass
    return HttpResponse(content='')
