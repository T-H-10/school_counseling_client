import re

from playwright.sync_api import expect


def test_login_success(logged_in_page):
    expect(logged_in_page.get_by_role("button", name="יציאה מהמערכת")).to_be_visible()


def test_login_wrong_credentials(page):
    page.goto("/login")

    page.get_by_placeholder("הכנס שם משתמש").fill("counselor1")
    page.get_by_placeholder("הכנס סיסמה").fill("wrong-password")
    page.get_by_role("button", name="כניסה").click()

    expect(page.get_by_text("שם משתמש או סיסמה שגויים. אנא נסה שנית.")).to_be_visible()
    expect(page).to_have_url(re.compile(r"/login"))
