from playwright.sync_api import Locator

from base_page import BasePage


class LessonDetailPage(BasePage):
    def __init__(self, page):
        super().__init__(page)
        self.title: Locator = page.get_by_test_id("lesson-detail-title")
        self.back_btn: Locator = page.get_by_test_id("lesson-detail-back")
        self.assign_btn: Locator = page.get_by_test_id("lesson-detail-assign")

    def get_title(self) -> str:
        return self.title.inner_text()

    def go_back(self) -> "LessonsPage":
        from pages.lessons_page import LessonsPage

        self.back_btn.click()
        return LessonsPage(self.page)
