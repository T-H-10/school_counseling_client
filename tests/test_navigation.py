import re

from playwright.sync_api import expect


def test_navigate_to_students(logged_in_page):
    page = logged_in_page

    page.get_by_role("link", name="תלמידים").click()

    expect(page).to_have_url(re.compile(r"/students"))
    expect(page.get_by_role("heading", name="תלמידים")).to_be_visible()


def test_logout_returns_to_login(logged_in_page):
    page = logged_in_page

    page.get_by_role("button", name="יציאה מהמערכת").click()

    expect(page).to_have_url(re.compile(r"/login"))
    expect(page.get_by_role("button", name="כניסה")).to_be_visible()
