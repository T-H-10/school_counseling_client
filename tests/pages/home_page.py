from playwright.sync_api import Locator

from base_page import BasePage


class HomePage(BasePage):
    def __init__(self, page):
        super().__init__(page)
        self.header: Locator = page.get_by_role("heading", name="עמוד הבית")

    def get_page_header(self) -> str:
        return self.header.text_content()
