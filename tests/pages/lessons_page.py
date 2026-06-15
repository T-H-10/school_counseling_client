from playwright.sync_api import Locator

from base_page import BasePage
from components.lesson_card import LessonCard


class LessonsPage(BasePage):
    def __init__(self, page):
        super().__init__(page)
        self.header: Locator = page.get_by_role("heading", name="מערכי שיעור")
        self.add_btn: Locator = page.get_by_test_id("lessons-add")
        self.cards: Locator = page.get_by_test_id("lesson-card")

    def get_page_header(self) -> str:
        return self.header.text_content()

    def open_add_modal(self) -> "AddLessonModal":
        from modals.add_lesson_modal import AddLessonModal

        self.add_btn.click()
        return AddLessonModal(self.page)

    def get_card_with_title(self, title: str) -> LessonCard:
        root = self.cards.filter(
            has=self.page.get_by_text(title, exact=True)
        ).first
        return LessonCard(self.page, root)
