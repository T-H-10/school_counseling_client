from playwright.sync_api import Locator

from base_page import BasePage


class HomePage(BasePage):
    def __init__(self, page):
        super().__init__(page)
        self.header: Locator = page.get_by_role("heading", name="עמוד הבית")
        self.stat_cards: Locator = page.get_by_test_id("dashboard-stat")
        self.today_meetings_card: Locator = page.get_by_test_id("dashboard-today-meetings")
        self.meeting_items: Locator = page.get_by_test_id("today-meeting-item")

    def get_page_header(self) -> str:
        return self.header.text_content()

    def stat_card(self, label: str) -> Locator:
        return self.page.locator(f'[data-testid="dashboard-stat"][data-stat-label="{label}"]')

    def get_meeting_item_for_student(self, student_name: str) -> Locator:
        return (
            self.page.get_by_test_id("today-meeting-item")
            .filter(has=self.page.get_by_text(student_name))
            .first
        )

    def get_status_badge_for_student(self, student_name: str) -> Locator:
        # The status badge is a rounded-full <span> inside the meeting row.
        # It contains either "ממתין" or "הושלם".
        return self.get_meeting_item_for_student(student_name).locator("span.rounded-full")

    def click_toggle_for_student(self, student_name: str) -> None:
        item = self.get_meeting_item_for_student(student_name)
        item.get_by_test_id("today-meeting-toggle").click()
        self.page.wait_for_load_state("networkidle")

    def click_pending_toggle_for_student(self, student_name: str) -> None:
        """Click the toggle on the first PENDING (ממתין) meeting for this student."""
        item = (
            self.page.get_by_test_id("today-meeting-item")
            .filter(has=self.page.get_by_text(student_name))
            .filter(has=self.page.get_by_text("ממתין"))
            .first
        )
        item.get_by_test_id("today-meeting-toggle").click()
        self.page.wait_for_load_state("networkidle")

    def has_completed_meeting_for_student(self, student_name: str) -> bool:
        """True if any today-meeting-item for this student shows 'הושלם'."""
        return (
            self.page.get_by_test_id("today-meeting-item")
            .filter(has=self.page.get_by_text(student_name))
            .filter(has=self.page.get_by_text("הושלם"))
            .count() > 0
        )
