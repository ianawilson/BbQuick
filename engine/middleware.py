# taken from http://stackoverflow.com/questions/5886275/print-a-stack-trace-to-stdout-on-errors-in-django-while-using-manage-py-runserve

class ExceptionLoggingMiddleware(object):
    def process_exception(self, request, exception):
        import traceback
        print traceback.format_exc()
    
