from playwright.sync_api import Locator

from base_page import BasePage


class EventDetailPanel(BasePage):
    def __init__(self, page):
        super().__init__(page)
        self.root: Locator = page.get_by_test_id("event-detail-panel")
        self.title: Locator = page.get_by_test_id("event-detail-title")
        self.close_btn: Locator = page.get_by_test_id("event-detail-close")
        self.goto_lesson_btn: Locator = page.get_by_test_id("event-detail-goto-lesson")

    def get_title(self) -> str:
        return self.title.inner_text()

    def close(self) -> "CalendarPage":
        from pages.calendar_page import CalendarPage

        self.close_btn.click()
        self.root.wait_for(state="detached")
        return CalendarPage(self.page)
