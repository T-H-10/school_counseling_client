from playwright.sync_api import Locator

from base_page import BasePage
from components.event_card import EventCard
from modals.add_event_modal import AddEventModal


class StudentProfilePage(BasePage):
    def __init__(self, page):
        super().__init__(page)
        self.back_link: Locator = page.get_by_text("חזרה לרשימת התלמידים")
        self.add_event_btn: Locator = page.get_by_role("button", name="+ הוסף פגישה")
        self.edit_btn: Locator = page.get_by_test_id("student-profile-edit")
        self.name_heading: Locator = page.get_by_test_id("student-profile-name")
        self.contact_card: Locator = page.get_by_test_id("student-profile-contact")

    def get_back_link_text(self) -> str:
        return self.back_link.inner_text()

    def click_add_event(self) -> AddEventModal:
        self.add_event_btn.click()
        return AddEventModal(self.page)

    def click_edit(self) -> "EditStudentModal":
        from modals.edit_student_modal import EditStudentModal

        self.edit_btn.click()
        return EditStudentModal(self.page)

    def get_event_with_title(self, title: str) -> EventCard:
        root = self.page.locator("div.relative.mb-5").filter(
            has=self.page.get_by_text(title, exact=True)
        ).first
        return EventCard(self.page, root)
