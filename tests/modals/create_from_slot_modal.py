from playwright.sync_api import Locator

from base_page import BasePage


class CreateFromSlotModal(BasePage):
    def __init__(self, page):
        super().__init__(page)
        self.root: Locator = page.get_by_test_id("create-from-slot-modal")
        self.event_mode_btn: Locator = page.get_by_test_id("create-mode-event")
        self.lesson_mode_btn: Locator = page.get_by_test_id("create-mode-lesson")
        self.title_input: Locator = page.get_by_test_id("create-title")
        self.student_select_input: Locator = page.get_by_test_id("create-student-select").locator("input").first
        self.event_type_select: Locator = page.get_by_test_id("create-event-type")
        self.start_input: Locator = page.get_by_test_id("create-start")
        self.submit_btn: Locator = page.get_by_test_id("create-submit")
        self.cancel_btn: Locator = page.get_by_test_id("create-cancel")
        self.error: Locator = page.get_by_test_id("create-error")

    def pick_student(self, query: str) -> None:
        # react-select loads options asynchronously (min 2 chars). Type, wait for the
        # menu, then click the first match immediately — reading the DOM in between
        # blurs the control and closes the menu.
        self.student_select_input.fill(query)
        option = self.page.locator("[id^='react-select'][id*='option']").first
        option.wait_for()
        option.click()

    def create_event_and_submit(self, title: str, student_query: str) -> "CalendarPage":
        from pages.calendar_page import CalendarPage

        self.title_input.fill(title)
        self.pick_student(student_query)
        self.submit_btn.click()
        self.root.wait_for(state="detached")
        self.page.wait_for_load_state("networkidle")
        return CalendarPage(self.page)

    def submit_expecting_error(self) -> None:
        self.submit_btn.click()
