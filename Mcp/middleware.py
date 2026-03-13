from contextvars import ContextVar
from starlette.middleware.base import BaseHTTPMiddleware

license_key_var: ContextVar[str] = ContextVar("license_key", default="")

class LicenseKeyMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        key = request.headers.get("x-license-key", "")
        token = license_key_var.set(key)
        try:
            response = await call_next(request)
        finally:
            license_key_var.reset(token)
        return response