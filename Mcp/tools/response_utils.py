import requests

def safe_parse_response(response: requests.Response) -> dict:
    try:
        if response.status_code == 204 or not response.content:
            return {"status_code": response.status_code, "content": None, "headers": dict(response.headers)}
        return response.json()
    except ValueError:
        return {"status_code": response.status_code, "content": response.text, "headers": dict(response.headers)}
    except Exception as e:
        return {"error": str(e)}
