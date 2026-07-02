from playwright.sync_api import Locator, expect

from base_page import BasePage


class ClassCard(BasePage):
    def __init__(self, page, root_locator: Locator):
        super().__init__(page)
        self.root_locator = root_locator

    def get_teacher_text(self) -> str:
        return self.root_locator.inner_text()

    def set_teacher(self, name: str) -> None:
        """Inline-edit the class teacher and save, waiting for the value to persist."""
        self.root_locator.hover()
        self.root_locator.get_by_test_id("class-card-edit-teacher").click()
        field = self.root_locator.get_by_test_id("class-card-teacher-input")
        field.fill(name)
        self.root_locator.get_by_test_id("class-card-teacher-save").click()
        # Edit mode collapses back to the read-only label once saved.
        expect(self.root_locator.get_by_test_id("class-card-teacher-input")).to_have_count(0)

    def get_student_count(self) -> int:
        """Parse the student count badge text, e.g. '10 תלמידים' → 10."""
        badge_text = self.root_locator.locator("span").first.text_content()
        return int(badge_text.strip().split()[0])

    def click(self) -> "ClassDetailPage":
        from pages.class_detail_page import ClassDetailPage

        self.root_locator.click()
        return ClassDetailPage(self.page)
