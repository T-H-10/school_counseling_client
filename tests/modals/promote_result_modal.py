from playwright.sync_api import Locator

from base_page import BasePage


class PromoteResultModal(BasePage):
    def __init__(self, page):
        super().__init__(page)
        self.root: Locator = page.get_by_test_id("promote-result-modal")
        self.close_btn: Locator = page.get_by_test_id("promote-result-close")
        self.activate_note: Locator = page.get_by_test_id("promote-activate-note")
        self.skipped_table: Locator = page.get_by_test_id("promote-skipped-table")

    def get_created_count(self) -> int:
        """Return the number of students promoted (the 'הועברו' count)."""
        label = self.root.get_by_text("הועברו", exact=True)
        count_text = label.locator("..").locator("p").first.text_content()
        return int(count_text.strip())

    def get_skipped_count(self) -> int:
        """Return the number of students skipped (the 'דולגו' count)."""
        label = self.root.get_by_text("דולגו", exact=True)
        count_text = label.locator("..").locator("p").first.text_content()
        return int(count_text.strip())

    def skipped_table_text(self) -> str:
        return self.skipped_table.inner_text()

    def close(self) -> None:
        self.close_btn.click()
        self.root.wait_for(state="detached")
