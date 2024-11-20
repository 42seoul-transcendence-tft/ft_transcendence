import logging

logger=logging.getLogger('django.request')

class RequestLoggingMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
    
    def __call__(self, request):
        response = self.get_response(request)
        message = f'{request.method} {request.path_info} => {response.status_code} {response.reason_phrase}'
        extra = {
            'req_path_info': request.path_info,
            'req_method': request.method,
            'req_user_agent': request.META['HTTP_USER_AGENT'],
            'req_romote_addr': request.META['REMOTE_ADDR'],
            'res_status_code': f"{response.status_code}",
        }
        logger.info(message, extra=extra)
        return response 