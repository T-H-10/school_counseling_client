from playwright.sync_api import Locator

from base_page import BasePage


class EditLessonModal(BasePage):
    def __init__(self, page):
        super().__init__(page)
        self.root: Locator = page.get_by_test_id("edit-lesson-modal")
        self.title_input: Locator = page.get_by_test_id("edit-lesson-title")
        self.description_input: Locator = page.get_by_test_id("edit-lesson-description")
        self.url_input: Locator = page.get_by_test_id("edit-lesson-url")
        self.submit_btn: Locator = page.get_by_test_id("edit-lesson-submit")
        self.cancel_btn: Locator = page.get_by_test_id("edit-lesson-cancel")

    def set_title_and_submit(self, title: str) -> "LessonDetailPage":
        from pages.lesson_detail_page import LessonDetailPage

        self.title_input.fill(title)
        self.submit_btn.click()
        self.root.wait_for(state="detached")
        self.page.wait_for_load_state("networkidle")
        return LessonDetailPage(self.page)
