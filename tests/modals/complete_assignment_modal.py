from playwright.sync_api import Locator

from base_page import BasePage


class CompleteAssignmentModal(BasePage):
    def __init__(self, page):
        super().__init__(page)
        self.root: Locator = page.get_by_test_id("complete-assignment-modal")
        self.date_input: Locator = page.get_by_test_id("complete-assignment-date")
        self.summary_input: Locator = page.get_by_test_id("complete-assignment-summary")
        self.submit_btn: Locator = page.get_by_test_id("complete-assignment-submit")
        self.cancel_btn: Locator = page.get_by_test_id("complete-assignment-cancel")

    def fill_and_submit(self, summary: str = "") -> "LessonDetailPage":
        from pages.lesson_detail_page import LessonDetailPage

        # The completion date is pre-filled with today; only the summary is optional.
        if summary:
            self.summary_input.fill(summary)
        self.submit_btn.click()
        self.root.wait_for(state="detached")
        self.page.wait_for_load_state("networkidle")
        return LessonDetailPage(self.page)
