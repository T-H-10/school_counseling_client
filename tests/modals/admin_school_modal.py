from playwright.sync_api import Locator

from base_page import BasePage


class AdminSchoolModal(BasePage):
    def __init__(self, page):
        super().__init__(page)
        self.root: Locator = page.get_by_test_id("admin-school-modal")
        self.name_input: Locator = page.get_by_test_id("admin-school-name")
        self.institution_code_input: Locator = page.get_by_test_id("admin-school-institution-code")
        self.address_input: Locator = page.get_by_test_id("admin-school-address")
        self.phone_input: Locator = page.get_by_test_id("admin-school-phone")
        self.save_btn: Locator = page.get_by_test_id("admin-school-save-btn")
        self.cancel_btn: Locator = page.get_by_test_id("admin-school-cancel-btn")
        self.close_btn: Locator = page.get_by_test_id("admin-school-modal-close")

    def fill(self, name: str, institution_code: str, address: str = "", phone: str = "") -> None:
        self.name_input.fill(name)
        self.institution_code_input.fill(institution_code)
        if address:
            self.address_input.fill(address)
        if phone:
            self.phone_input.fill(phone)

    def submit(self) -> "AdminSchoolsPage":
        from pages.admin_schools_page import AdminSchoolsPage

        self.save_btn.click()
        return AdminSchoolsPage(self.page)

    def submit_expecting_error(self) -> None:
        self.save_btn.click()

    def cancel(self) -> "AdminSchoolsPage":
        from pages.admin_schools_page import AdminSchoolsPage

        self.cancel_btn.click()
        self.root.wait_for(state="detached")
        return AdminSchoolsPage(self.page)

    def get_institution_code_error(self) -> str:
        """Return the inline error text below the institution_code field."""
        # The error <p> is rendered by parseApiErrors immediately after the input
        # wrapper; locate it by following sibling from the input.
        return (
            self.institution_code_input.locator("xpath=following-sibling::*[1]").inner_text()
        )

    def is_open(self) -> bool:
        return self.root.count() > 0
