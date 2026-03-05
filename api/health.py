from api._utils import response


def handler(_request):
    return response(200, {"ok": True})
