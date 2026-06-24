from playwright.sync_api import Locator

from base_page import BasePage


class AdminSchoolsPage(BasePage):
    def __init__(self, page):
        super().__init__(page)
        self.root: Locator = page.get_by_test_id("admin-schools-page")
        self.add_btn: Locator = page.get_by_test_id("admin-schools-add-btn")

    def open_add_modal(self) -> "AdminSchoolModal":
        from modals.admin_school_modal import AdminSchoolModal

        self.add_btn.click()
        return AdminSchoolModal(self.page)

    def get_school_row(self, school_id: int) -> Locator:
        return self.page.get_by_test_id(f"admin-school-row-{school_id}")

    def open_edit_modal(self, school_id: int) -> "AdminSchoolModal":
        from modals.admin_school_modal import AdminSchoolModal

        self.page.get_by_test_id(f"admin-school-edit-{school_id}").click()
        return AdminSchoolModal(self.page)

    def get_all_school_rows(self) -> Locator:
        return self.page.locator("[data-testid^='admin-school-row-']")

    def row_contains_institution_code(self, code: str) -> bool:
        return self.root.get_by_text(code).count() > 0
