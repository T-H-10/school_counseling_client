from playwright.sync_api import Locator

from base_page import BasePage


class AddLessonModal(BasePage):
    def __init__(self, page):
        super().__init__(page)
        self.root: Locator = page.get_by_test_id("add-lesson-modal")
        self.title_input: Locator = page.get_by_test_id("add-lesson-title")
        self.year_select: Locator = page.get_by_test_id("add-lesson-year")
        self.description_input: Locator = page.get_by_test_id("add-lesson-description")
        self.submit_btn: Locator = page.get_by_test_id("add-lesson-submit")

    def fill_and_submit(self, title: str, description: str = "") -> "LessonsPage":
        from pages.lessons_page import LessonsPage

        self.title_input.fill(title)
        self.year_select.select_option(index=1)
        if description:
            self.description_input.fill(description)
        self.submit_btn.click()
        self.page.wait_for_load_state("networkidle")
        return LessonsPage(self.page)
