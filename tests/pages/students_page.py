from playwright.sync_api import Locator

from base_page import BasePage
from components.student_card import StudentCard


class StudentsPage(BasePage):
    def __init__(self, page):
        super().__init__(page)
        self.header: Locator = page.get_by_role("heading", name="תלמידים")
        self.search_input: Locator = page.get_by_placeholder("חיפוש לפי שם או ת״ז...")
        self.add_btn: Locator = page.get_by_test_id("students-add")
        self.level_filter: Locator = page.get_by_test_id("students-filter-level")
        self.count_label: Locator = page.get_by_test_id("students-count")
        self.empty_state: Locator = page.get_by_test_id("students-empty")
        self.cards: Locator = page.get_by_test_id("student-card")

    def get_page_header(self) -> str:
        return self.header.text_content()

    def search(self, text: str) -> None:
        self.search_input.fill(text)
        # Wait for debounce (400 ms) then for the API response to land
        self.page.wait_for_timeout(500)
        self.page.wait_for_load_state("networkidle")

    def get_card_with_name(self, name: str) -> StudentCard:
        root = self.page.locator("div.group").filter(
            has=self.page.get_by_text(name, exact=True)
        ).first
        return StudentCard(self.page, root)

    def open_add_modal(self) -> "AddStudentModal":
        from modals.add_student_modal import AddStudentModal

        self.add_btn.click()
        return AddStudentModal(self.page)

    def filter_by_level(self, level_name: str) -> None:
        self.level_filter.select_option(label=f"שכבה {level_name}")
        self.page.wait_for_load_state("networkidle")

    def get_count_text(self) -> str:
        return self.count_label.inner_text()

    def selected_level_value(self) -> str:
        return self.level_filter.input_value()
