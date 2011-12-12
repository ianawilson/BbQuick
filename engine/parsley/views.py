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
        form = soup.find('div', attrs={'id': 'loginBoxFull'})
        if form:
            form.find(attrs={'id': 'loginFormText'}).extract()
            scripts = form.findAll('script')
            for s in scripts:
                for attr in s.attrs:
                    if not ('src' in attr and 'validate_login' in attr[1]):
                        s.extract()
            response = jsonEncode({'authenticated': False, 'loginForm': str(form)})
        else:
            response = jsonEncode({'authenticated': True, 'loginForm': None})
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
        for tr in trs:
            course = {}
            anchor = tr.find('a')
            # skip everything that doesn't have a link in it (like a header or unavailable course)
            if anchor: 
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
        response = jsonEncode({'courses': courses})
    else:
        response = jsonEncode({'error': "You must POST to this URL with the key 'html' in the POST data."})
    return HttpResponse(content=response)
    
def getCourseSections(request):
    if request.method == 'POST' and 'html' in request.POST and 'url' in request.POST:
        sections = []
        
        # add announcements manually, because they are a special case, and the buttons are not always included
        section = {}
        section['name'] = 'Announcements'
        section['url'] = request.POST['url']
        sections.append(section)
        
        # start searching for course buttons
        body = request.POST['html']
        soup = BeautifulSoup(body)
        ul = soup.find(attrs={'id': 'courseMenuPalette_contents'})
        lis = ul.findAll('li')[:-3] # remove final dividers and Course Tools
        for li in lis:
            print li
            section = {}
            anchor = li.next.next
            section['name'] = anchor.next.contents[0]
            section['url'] = anchor['href']
            
            # skip announcements for everything, they were added manually at the beginning
            if not section['name'] == 'Announcements':
                sections.append(section)
        
        response = jsonEncode({'sections': sections})
    else:
        response = jsonEncode({'error': "You must POST to this URL with the key 'html' in the POST data."})
    return HttpResponse(content=response)
    
def getCourseSubsections(request):
    if request.method == 'POST' and 'html' in request.POST:
        subsections = []
        body = request.POST['html']
        body = body.replace('&nbsp;', ' ')
        soup = BeautifulSoup(body)
        
        # most things use the pageList (course materials, assignments, syllabus)
        pageList = soup.find(attrs={'id': 'pageList'})
        # only announcements use the announcementList
        announcementList = soup.find(attrs={'id': 'announcementList'})
        if pageList:
            for li in pageList.findAll('li', attrs={'class': 'clearfix read'}):
                anchor = li.find('a')
                if anchor:
                    subsection = {}
                    subsection['url'] = anchor['href']
                    heading = li.find('h3')
                    name = drillDown(heading)
                    if name:
                        subsection['name'] = name
                else:
                    pass
                    # print '"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""'
                    # print 'no anchor!', li.prettify()
                subsections.append(subsection)
        elif announcementList:
            for li in announcementList.findAll('li', attrs={'class': 'clearfix'}):
                subsection = {}
                heading = li.find('h3')
                subsection['name'] = drillDown(heading).strip()
                detailsList = li.find('div', {'class': 'details'}).contents
                details = ''
                for detail in detailsList:
                    details = details + str(detail)
                subsection['details'] = details.strip()
                info = li.find('div', attrs={'class': 'announcementInfo'})
                spans = info.findAll('span')
                subsection['author'] = spans[0].nextSibling.strip().title()
                subsection['date'] = spans[1].nextSibling.strip()
                
                subsections.append(subsection)
        else:
            # if we can't find one of these, there are no subsections that we could parse
            pass
        
        response = jsonEncode({'subsections': subsections})
    else:
        response = jsonEncode({'error': "You must POST to this URL with the key 'html' in the POST data."})
    return HttpResponse(content=response)
