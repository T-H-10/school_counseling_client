from playwright.sync_api import Locator

from base_page import BasePage


class ConfirmDeleteModal(BasePage):
    def __init__(self, page):
        super().__init__(page)
        self.root: Locator = page.get_by_test_id("confirm-delete-modal")
        self.confirm_btn: Locator = page.get_by_test_id("confirm-delete-confirm")
        self.cancel_btn: Locator = page.get_by_test_id("confirm-delete-cancel")

    def confirm(self) -> None:
        self.confirm_btn.click()
        self.page.wait_for_load_state("networkidle")

    def cancel(self) -> None:
        self.cancel_btn.click()
