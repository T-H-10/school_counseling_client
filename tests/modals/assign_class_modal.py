from playwright.sync_api import Locator

from base_page import BasePage


class AssignClassModal(BasePage):
    def __init__(self, page):
        super().__init__(page)
        self.root: Locator = page.get_by_test_id("assign-class-modal")
        self.level_select: Locator = page.get_by_test_id("assign-class-level")
        self.class_number_input: Locator = page.get_by_test_id("assign-class-number")
        self.date_input: Locator = page.get_by_test_id("assign-class-date")
        self.submit_btn: Locator = page.get_by_test_id("assign-class-submit")
        self.cancel_btn: Locator = page.get_by_test_id("assign-class-cancel")

    def fill_and_submit(self, class_number: str = "3") -> "LessonDetailPage":
        from pages.lesson_detail_page import LessonDetailPage

        # The class levels are loaded from the API; pick the first real option.
        self.level_select.select_option(index=1)
        self.class_number_input.fill(class_number)
        self.submit_btn.click()
        self.root.wait_for(state="detached")
        self.page.wait_for_load_state("networkidle")
        return LessonDetailPage(self.page)

    def cancel(self) -> "LessonDetailPage":
        from pages.lesson_detail_page import LessonDetailPage

        self.cancel_btn.click()
        self.root.wait_for(state="detached")
        return LessonDetailPage(self.page)
