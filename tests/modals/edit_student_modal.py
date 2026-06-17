from playwright.sync_api import Locator

from base_page import BasePage


class EditStudentModal(BasePage):
    def __init__(self, page):
        super().__init__(page)
        # Reuses the same field test ids as the add-student modal; only the
        # container and action buttons differ.
        self.root: Locator = page.get_by_test_id("edit-student-modal")
        self.full_name_input: Locator = page.get_by_test_id("student-full-name")
        self.id_number_input: Locator = page.get_by_test_id("student-id-number")
        self.address_input: Locator = page.get_by_test_id("student-address")
        self.mother_name_input: Locator = page.get_by_test_id("student-mother-name")
        self.mother_phone_input: Locator = page.get_by_test_id("student-mother-phone")
        self.father_name_input: Locator = page.get_by_test_id("student-father-name")
        self.father_phone_input: Locator = page.get_by_test_id("student-father-phone")
        self.submit_btn: Locator = page.get_by_test_id("edit-student-submit")
        self.cancel_btn: Locator = page.get_by_test_id("edit-student-cancel")

    def set_contact_and_submit(self, address: str, mother_phone: str) -> "StudentProfilePage":
        from pages.student_profile_page import StudentProfilePage

        self.address_input.fill(address)
        self.mother_phone_input.fill(mother_phone)
        self.submit_btn.click()
        self.root.wait_for(state="detached")
        self.page.wait_for_load_state("networkidle")
        return StudentProfilePage(self.page)

    def cancel(self) -> "StudentProfilePage":
        from pages.student_profile_page import StudentProfilePage

        self.cancel_btn.click()
        self.root.wait_for(state="detached")
        return StudentProfilePage(self.page)
