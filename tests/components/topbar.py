from playwright.sync_api import Locator

from base_page import BasePage


class Topbar(BasePage):
    def __init__(self, page):
        super().__init__(page)
        self.logout_btn: Locator = page.get_by_role("button", name="יציאה מהמערכת")
        self.dark_mode_toggle: Locator = page.locator('button[aria-label="עבור למצב כהה"]')

    def logout(self) -> "LoginPage":
        from pages.login_page import LoginPage

        self.logout_btn.click()
        return LoginPage(self.page)

    def toggle_dark_mode(self) -> None:
        self.dark_mode_toggle.click()
