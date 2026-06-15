from playwright.sync_api import Locator

from base_page import BasePage


class AddStudentModal(BasePage):
    def __init__(self, page):
        super().__init__(page)
        self.root: Locator = page.get_by_test_id("add-student-modal")
        self.full_name_input: Locator = page.get_by_test_id("student-full-name")
        self.id_number_input: Locator = page.get_by_test_id("student-id-number")
        self.school_year_select: Locator = page.get_by_test_id("student-school-year")
        self.class_level_select: Locator = page.get_by_test_id("student-class-level")
        self.class_number_input: Locator = page.get_by_test_id("student-class-number")
        self.submit_btn: Locator = page.get_by_test_id("add-student-submit")
        self.cancel_btn: Locator = page.get_by_test_id("add-student-cancel")
        self.id_number_error: Locator = page.get_by_test_id("student-id-number").locator(
            "xpath=following-sibling::*[1]"
        )

    def fill_required(self, full_name: str, id_number: str) -> None:
        self.full_name_input.fill(full_name)
        self.id_number_input.fill(id_number)
        # The lists are populated from the API; pick the first real option of each.
        self.school_year_select.select_option(index=1)
        self.class_level_select.select_option(index=1)
        self.class_number_input.fill("1")

    def submit(self) -> "StudentsPage":
        from pages.students_page import StudentsPage

        self.submit_btn.click()
        return StudentsPage(self.page)

    def submit_expecting_error(self) -> None:
        self.submit_btn.click()

    def cancel(self) -> "StudentsPage":
        from pages.students_page import StudentsPage

        # Live investigation showed Escape does not dismiss this modal; the
        # backdrop stays mounted and blocks the UI. Cancel is the real close path.
        self.cancel_btn.click()
        self.root.wait_for(state="detached")
        return StudentsPage(self.page)

    def get_id_number_error(self) -> str:
        return self.id_number_error.inner_text()
