from playwright.sync_api import Locator

from base_page import BasePage


class AddEventModal(BasePage):
    def __init__(self, page):
        super().__init__(page)
        self.root: Locator = page.get_by_test_id("add-event-modal")
        self.type_select: Locator = page.get_by_test_id("add-event-type")
        self.date_input: Locator = page.get_by_test_id("add-event-date")
        self.title_input: Locator = page.get_by_test_id("add-event-title")
        self.agenda_input: Locator = page.get_by_test_id("add-event-agenda")
        self.submit_btn: Locator = page.get_by_test_id("add-event-submit")
        self.cancel_btn: Locator = page.get_by_test_id("add-event-cancel")

    def fill_and_submit(self, title: str, date: str) -> "StudentProfilePage":
        from pages.student_profile_page import StudentProfilePage

        self.date_input.fill(date)
        self.title_input.fill(title)
        self.submit_btn.click()
        self.page.wait_for_load_state("networkidle")
        return StudentProfilePage(self.page)

    def click_submit(self) -> "AddEventModal":
        self.submit_btn.click()
        return self
