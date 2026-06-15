from playwright.sync_api import Locator

from base_page import BasePage
from components.student_card import StudentCard


class StudentsPage(BasePage):
    def __init__(self, page):
        super().__init__(page)
        self.header: Locator = page.get_by_role("heading", name="תלמידים")
        self.search_input: Locator = page.get_by_placeholder("חיפוש חכם (שם, טלפון, ת״ז)...")

    def get_page_header(self) -> str:
        return self.header.text_content()

    def search(self, text: str) -> None:
        self.search_input.fill(text)
        # Wait for debounce (400 ms) then for the API response to land
        self.page.wait_for_timeout(500)
        self.page.wait_for_load_state("networkidle")

    def get_card_with_name(self, name: str) -> StudentCard:
        root = self.page.locator("div.group").filter(
            has=self.page.get_by_text(name, exact=True)
        ).first
        return StudentCard(self.page, root)
