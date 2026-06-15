import urllib.request

import pytest

from pages import LoginPage

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


@pytest.fixture
def login_page(page):
    """A fresh LoginPage on the /login route."""
    page.goto("/login")
    return LoginPage(page)


@pytest.fixture
def logged_in_page(page):
    """The app shell after logging in as the seeded counselor."""
    page.goto("/login")
    login = LoginPage(page)
    login.fill_username_tb("counselor1")
    login.fill_password_tb("Test1234!")
    home = login.click_login_btn()
    home.header.wait_for()
    return page
