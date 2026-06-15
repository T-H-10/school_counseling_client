import re

from playwright.sync_api import expect

from components import Sidebar, Topbar


def test_navigate_to_students(logged_in_page):
    students = Sidebar(logged_in_page).navigate_to_students()

    expect(logged_in_page).to_have_url(re.compile(r"/students"))
    assert students.get_page_header() == "תלמידים"


def test_logout_returns_to_login(logged_in_page):
    login = Topbar(logged_in_page).logout()

    expect(logged_in_page).to_have_url(re.compile(r"/login"))
    expect(login.login_btn).to_be_visible()
