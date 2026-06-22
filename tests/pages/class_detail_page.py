import re

from playwright.sync_api import Locator

from base_page import BasePage


class ClassDetailPage(BasePage):
    def __init__(self, page):
        super().__init__(page)
        self.back_btn: Locator = page.get_by_test_id("class-detail-back")
        self.roster: Locator = page.get_by_test_id("class-detail-roster")
        self.student_rows: Locator = page.get_by_test_id("class-detail-student-row")
        self.documents_section: Locator = page.get_by_test_id("class-detail-documents")
        self.upload_btn: Locator = page.get_by_test_id("class-detail-upload-btn")

    def get_page_header(self) -> str:
        return self.page.locator("h1").first.text_content()

    def is_on_class_detail(self) -> bool:
        return bool(re.search(r"/classes/\d+/\d+", self.page.url))

    def click_back(self) -> "ClassesPage":
        from pages.classes_page import ClassesPage

        self.back_btn.click()
        return ClassesPage(self.page)
