from playwright.sync_api import Locator

from base_page import BasePage


class AdminSchoolYearsPage(BasePage):
    def __init__(self, page):
        super().__init__(page)
        self.root: Locator = page.get_by_test_id("admin-school-years-page")
        self.add_btn: Locator = page.get_by_test_id("admin-school-years-add-btn")

    def open_add_modal(self) -> "AdminSchoolYearModal":
        from modals.admin_school_year_modal import AdminSchoolYearModal

        self.add_btn.click()
        return AdminSchoolYearModal(self.page)

    def get_year_row(self, year_id: int) -> Locator:
        return self.page.get_by_test_id(f"admin-school-year-row-{year_id}")

    def open_edit_modal(self, year_id: int) -> "AdminSchoolYearModal":
        from modals.admin_school_year_modal import AdminSchoolYearModal

        self.page.get_by_test_id(f"admin-school-year-edit-{year_id}").click()
        return AdminSchoolYearModal(self.page)

    def get_all_year_rows(self) -> Locator:
        return self.page.locator("[data-testid^='admin-school-year-row-']")

    def is_year_active(self, year_id: int) -> bool:
        """Return True if the row for year_id shows a 'פעיל' status badge."""
        row = self.get_year_row(year_id)
        return row.get_by_text("פעיל").count() > 0

    def get_active_year_row(self) -> Locator:
        """Return the first row whose status cell contains 'פעיל'."""
        return self.root.locator("tr").filter(
            has=self.page.get_by_text("פעיל", exact=True)
        ).first
