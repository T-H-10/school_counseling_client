import pytest


def do_login(page, username = "counselor1", password = "Test1234!"):
    page.goto("http://localhost:5173/login")
    
    page.get_by_placeholder("הכנס שם משתמש").fill(username)
    page.get_by_placeholder("הכנס סיסמה").fill(password)
    
    page.get_by_role("button", name="כניסה").click()
    
    page.wait_for_url("http://localhost:5173")

@pytest.fixture
def logged_in_page(page):
    do_login(page)
    return page