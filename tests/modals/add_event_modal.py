from playwright.sync_api import Locator

from base_page import BasePage


class AddEventModal(BasePage):
    def __init__(self, page):
        super().__init__(page)
        self.title_input: Locator = page.get_by_placeholder("נושא הפגישה")
        self.date_input: Locator = page.locator("input[type='datetime-local']")
        self.submit_btn: Locator = page.get_by_role("button", name="שמור אירוע")

    def fill_and_submit(self, title: str, date: str) -> "StudentProfilePage":
        from pages.student_profile_page import StudentProfilePage

        self.date_input.fill(date)
        self.title_input.fill(title)
        self.submit_btn.click()
        self.page.wait_for_load_state("networkidle")
        return StudentProfilePage(self.page)
