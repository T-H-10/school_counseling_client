from playwright.sync_api import Locator

from base_page import BasePage


class SupportModal(BasePage):
    def __init__(self, page):
        super().__init__(page)
        self.root: Locator = page.get_by_test_id("support-modal")
        self.subject_input: Locator = page.get_by_test_id("support-modal-subject")
        self.message_textarea: Locator = page.get_by_test_id("support-modal-message")
        self.submit_btn: Locator = page.get_by_test_id("support-modal-submit")
        self.cancel_btn: Locator = page.get_by_test_id("support-modal-cancel")
        self.close_btn: Locator = page.get_by_test_id("support-modal-close")

    def fill(self, subject: str, message: str) -> None:
        self.subject_input.fill(subject)
        self.message_textarea.fill(message)

    def submit(self) -> None:
        """Submit the support request. The modal closes on success (onClose called)."""
        self.submit_btn.click()
        self.page.wait_for_load_state("networkidle")

    def cancel(self) -> None:
        self.cancel_btn.click()
        self.root.wait_for(state="detached")

    def is_open(self) -> bool:
        return self.root.count() > 0

    def subject_value(self) -> str:
        return self.subject_input.input_value()

    def message_value(self) -> str:
        return self.message_textarea.input_value()
