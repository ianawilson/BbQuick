from django.conf.urls.defaults import patterns, include, url

urlpatterns = patterns('parsley.views',
    url(r'^getContentURL/$', 'getContentURL'),
    url(r'^isAuthenticated/$', 'isAuthenticated'),
    url(r'^getCourses/$', 'getCourses'),
    url(r'^getCourseSections/$', 'getCourseSections'),
    url(r'^getCourseSubsections/$', 'getCourseSubsections'),
)
