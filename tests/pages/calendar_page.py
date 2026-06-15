from playwright.sync_api import Locator

from base_page import BasePage


class CalendarPage(BasePage):
    def __init__(self, page):
        super().__init__(page)
        self.header: Locator = page.get_by_role("heading", name="לוח שנה")
        self.container: Locator = page.get_by_test_id("calendar-container")
        self.month_btn: Locator = page.get_by_role("button", name="חודש")
        self.week_btn: Locator = page.get_by_role("button", name="שבוע")
        self.day_btn: Locator = page.get_by_role("button", name="יום")

    def get_page_header(self) -> str:
        return self.header.text_content()

    def switch_to_month(self) -> None:
        self.month_btn.click()

    def switch_to_day(self) -> None:
        self.day_btn.click()
