from playwright.sync_api import Locator

from base_page import BasePage


class AdminSchoolYearModal(BasePage):
    def __init__(self, page):
        super().__init__(page)
        self.root: Locator = page.get_by_test_id("admin-school-year-modal")
        self.name_input: Locator = page.get_by_test_id("admin-school-year-name")
        self.active_checkbox: Locator = page.get_by_test_id("admin-school-year-active")
        self.save_btn: Locator = page.get_by_test_id("admin-school-year-save-btn")
        self.cancel_btn: Locator = page.get_by_test_id("admin-school-year-cancel-btn")
        self.close_btn: Locator = page.get_by_test_id("admin-school-year-modal-close")

    def fill(self, name: str, is_active: bool = False) -> None:
        self.name_input.fill(name)
        if is_active and not self.active_checkbox.is_checked():
            self.active_checkbox.check()
        elif not is_active and self.active_checkbox.is_checked():
            self.active_checkbox.uncheck()

    def set_active(self, active: bool) -> None:
        if active:
            self.active_checkbox.check()
        else:
            self.active_checkbox.uncheck()

    def submit(self) -> "AdminSchoolYearsPage":
        from pages.admin_school_years_page import AdminSchoolYearsPage

        self.save_btn.click()
        return AdminSchoolYearsPage(self.page)

    def submit_expecting_error(self) -> None:
        self.save_btn.click()

    def cancel(self) -> "AdminSchoolYearsPage":
        from pages.admin_school_years_page import AdminSchoolYearsPage

        self.cancel_btn.click()
        self.root.wait_for(state="detached")
        return AdminSchoolYearsPage(self.page)

    def is_open(self) -> bool:
        return self.root.count() > 0
