from playwright.sync_api import Locator

from base_page import BasePage


class EditEventModal(BasePage):
    def __init__(self, page):
        super().__init__(page)
        self.root: Locator = page.get_by_test_id("edit-event-modal")
        self.type_select: Locator = page.get_by_test_id("edit-event-type")
        self.date_input: Locator = page.get_by_test_id("edit-event-date")
        self.title_input: Locator = page.get_by_test_id("edit-event-title")
        # Only one of these is mounted depending on whether the event is in the future.
        self.agenda_input: Locator = page.get_by_test_id("edit-event-agenda")
        self.summary_input: Locator = page.get_by_test_id("edit-event-summary")
        self.submit_btn: Locator = page.get_by_test_id("edit-event-submit")
        self.cancel_btn: Locator = page.get_by_test_id("edit-event-cancel")

    def set_title_and_submit(self, title: str) -> "StudentProfilePage":
        from pages.student_profile_page import StudentProfilePage

        self.title_input.fill(title)
        self.submit_btn.click()
        self.root.wait_for(state="detached")
        self.page.wait_for_load_state("networkidle")
        return StudentProfilePage(self.page)
