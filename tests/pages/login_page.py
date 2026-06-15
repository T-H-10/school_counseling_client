from playwright.sync_api import Locator

from base_page import BasePage
from pages.home_page import HomePage


class LoginPage(BasePage):
    def __init__(self, page):
        super().__init__(page)
        self.username_tb: Locator = page.get_by_placeholder("הכנס שם משתמש")
        self.password_tb: Locator = page.get_by_placeholder("הכנס סיסמה")
        self.login_btn: Locator = page.get_by_role("button", name="כניסה")
        self.login_error_msg: Locator = page.get_by_text(
            "שם משתמש או סיסמה שגויים. אנא נסה שנית."
        )

    def fill_username_tb(self, username_txt: str) -> None:
        self.username_tb.fill(username_txt)

    def fill_password_tb(self, password_txt: str) -> None:
        self.password_tb.fill(password_txt)

    def click_login_btn(self) -> HomePage:
        self.login_btn.click()
        return HomePage(self.page)

    def get_login_error(self) -> str:
        return self.login_error_msg.inner_text()
