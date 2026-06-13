import urllib.request

import pytest

CLIENT_URL = "http://localhost:5173"
API_URL = "http://localhost:8000"


def _reachable(url):
    try:
        urllib.request.urlopen(url, timeout=2)
        return True
    except urllib.error.HTTPError:
        # Any HTTP response (even 401/404) means the server is up.
        return True
    except Exception:
        return False


# Cache the result so we only hit the network once per run.
_servers_checked = {}


@pytest.fixture(autouse=True)
def require_servers():
    if "ok" not in _servers_checked:
        _servers_checked["ok"] = _reachable(CLIENT_URL) and _reachable(API_URL)
    if not _servers_checked["ok"]:
        pytest.skip(
            "Servers not reachable. Start the client (npm run dev → :5173) and the "
            "backend (python manage.py runserver 8000), and seed counselor1 / Test1234!."
        )


def do_login(page, username="counselor1", password="Test1234!"):
    page.goto("/login")

    page.get_by_placeholder("הכנס שם משתמש").fill(username)
    page.get_by_placeholder("הכנס סיסמה").fill(password)

    page.get_by_role("button", name="כניסה").click()

    # Land on the app shell — assert on a stable element, not an exact URL.
    page.get_by_role("button", name="יציאה מהמערכת").wait_for()


@pytest.fixture
def logged_in_page(page):
    do_login(page)
    return page


@pytest.fixture
def login(logged_in_page):
    # Alias kept so tests referencing `login` keep working.
    return logged_in_page
