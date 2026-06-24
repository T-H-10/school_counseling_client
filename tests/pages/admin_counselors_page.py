from playwright.sync_api import Locator

from base_page import BasePage


class AdminCounselorsPage(BasePage):
    def __init__(self, page):
        super().__init__(page)
        self.root: Locator = page.get_by_test_id("admin-counselors-page")
        self.add_btn: Locator = page.get_by_test_id("admin-counselors-add-btn")

    def open_add_modal(self) -> "AdminCounselorModal":
        from modals.admin_counselor_modal import AdminCounselorModal

        self.add_btn.click()
        return AdminCounselorModal(self.page)

    def get_counselor_row(self, counselor_id: int) -> Locator:
        return self.page.get_by_test_id(f"admin-counselor-row-{counselor_id}")

    def open_edit_modal(self, counselor_id: int) -> "AdminCounselorModal":
        from modals.admin_counselor_modal import AdminCounselorModal

        self.page.get_by_test_id(f"admin-counselor-edit-{counselor_id}").click()
        return AdminCounselorModal(self.page)

    def get_all_counselor_rows(self) -> Locator:
        return self.page.locator("[data-testid^='admin-counselor-row-']")

    def row_contains_username(self, username: str) -> bool:
        return self.root.get_by_text(username).count() > 0

    def find_row_by_username(self, username: str) -> Locator:
        """Return the table row whose username cell matches exactly."""
        return self.root.locator("tr").filter(
            has=self.page.get_by_text(username, exact=True)
        ).first
