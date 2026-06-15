import re

from playwright.sync_api import expect

from components import Sidebar, Topbar
from pages import LoginPage


def test_navigate_to_students(logged_in_page):
    students = Sidebar(logged_in_page).navigate_to_students()

    expect(logged_in_page).to_have_url(re.compile(r"/students"))
    assert students.get_page_header() == "תלמידים"


def test_navigate_to_classes(logged_in_page):
    classes = Sidebar(logged_in_page).navigate_to_classes()

    expect(logged_in_page).to_have_url(re.compile(r"/classes"))
    assert classes.get_page_header() == "כיתות"


def test_navigate_to_lessons(logged_in_page):
    lessons = Sidebar(logged_in_page).navigate_to_lessons()

    expect(logged_in_page).to_have_url(re.compile(r"/lessons"))
    assert lessons.get_page_header() == "מערכי שיעור"


def test_navigate_to_calendar(logged_in_page):
    calendar = Sidebar(logged_in_page).navigate_to_calendar()

    expect(logged_in_page).to_have_url(re.compile(r"/calendar"))
    assert calendar.get_page_header() == "לוח שנה"


def test_navigate_back_to_home(logged_in_page):
    Sidebar(logged_in_page).navigate_to_students()
    home = Sidebar(logged_in_page).navigate_to_home()

    expect(logged_in_page).to_have_url(re.compile(r"/$"))
    assert home.get_page_header() == "עמוד הבית"


def test_logout_returns_to_login(logged_in_page):
    login = Topbar(logged_in_page).logout()

    expect(logged_in_page).to_have_url(re.compile(r"/login"))
    expect(login.login_btn).to_be_visible()


def test_protected_route_redirects_to_login(page):
    """Visiting a protected route while logged out lands on /login."""
    page.goto("/students")

    expect(page).to_have_url(re.compile(r"/login"))
    expect(LoginPage(page).login_btn).to_be_visible()
