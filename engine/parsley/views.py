# Create your views here.

from django.shortcuts import *
from django.http import *
from BeautifulSoup import BeautifulSoup
from helpers import *

def getContentURL(request):
    if request.method == 'POST' and 'html' in request.POST:
        body = request.POST['html']
        soup = BeautifulSoup(body)
        frame = soup.find('frame', attrs={'name':'content'})
        url = frame['src']
        response = jsonEncode({'contentURL': url})
    else:
        response = jsonEncode({'error': "You must POST to this URL with the key 'html' in the POST data."})
    return HttpResponse(content=response)


def getNavURL(request):
    if request.method == 'POST' and 'html' in request.POST:
        body = request.POST['html']
        soup = BeautifulSoup(body)
        frame = soup.find('frame', attrs={'name':'nav'})
        url = frame['src']
        response = jsonEncode({'navURL': url})
    else:
        response = jsonEncode({'error': "You must POST to this URL with the key 'html' in the POST data."})
    return HttpResponse(content=response)


def getCoursesURL(request):
    if request.method == 'POST' and 'html' in request.POST:
        body = request.POST['html']
        soup = BeautifulSoup(body)
        table = soup.find('table', attrs={'id': 'appTabList'})
        courses = table.find(attrs={'id': 'Courses'}).next
        url = courses['href']
        url = url[23:] # remove http://my.rochester.edu :P
        response = jsonEncode({'coursesURL': url})
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
        courses = []
        body = request.POST['html']
        soup = BeautifulSoup(body)
        div = soup.find(attrs={'class': 'moduleTitle'}, text='Courses Online').parent.parent.parent
        trs = div.findAll('tr')
        trs = trs[2:-1] # remove extraneous entries like header and footer
        for tr in trs:
            course = {}
            anchor = tr.find('a')
            course['name'] = anchor.contents[0].strip().title()
            for attr in anchor.attrs:
                if attr[0] == 'href':
                    match = re.search(r'&url=(.+)', attr[1])
                    if match.groups():
                        course['url'] = match.group(1)
            td = anchor.parent.nextSibling.next
            match = re.search(r'(\w+).', td.contents[0])
            if match.groups():
                course['shortname'] = match.group(1)
            
            courses.append(course)
        print courses
        response = jsonEncode({'courses': courses})
    else:
        response = jsonEncode({'error': "You must POST to this URL with the key 'html' in the POST data."})
    return HttpResponse(content=response)
    
def getCourseSections(request):
    if request.method == 'POST':
        pass
    return HttpResponse(content='')
    
def getCourseSubsections(request):
    if request.method == 'POST':
        pass
    return HttpResponse(content='')
