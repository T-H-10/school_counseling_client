from playwright.sync_api import Locator

from base_page import BasePage
from components.class_card import ClassCard


class ClassesPage(BasePage):
    def __init__(self, page):
        super().__init__(page)
        self.header: Locator = page.get_by_role("heading", name="כיתות")
        self.cards: Locator = page.get_by_test_id("class-card")
        self.empty_state: Locator = page.get_by_test_id("classes-empty")

    def get_page_header(self) -> str:
        return self.header.text_content()

    def has_classes(self) -> bool:
        self.page.wait_for_load_state("networkidle")
        return self.cards.count() > 0

    def first_card(self) -> ClassCard:
        return ClassCard(self.page, self.cards.first)
