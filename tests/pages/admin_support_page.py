from playwright.sync_api import Locator

from base_page import BasePage


class AdminSupportPage(BasePage):
    def __init__(self, page):
        super().__init__(page)
        self.root: Locator = page.get_by_test_id("admin-support-page")
        # Filter tabs
        self.tab_open: Locator = page.get_by_test_id("admin-support-tab-open")
        self.tab_resolved: Locator = page.get_by_test_id("admin-support-tab-resolved")
        self.tab_all: Locator = page.get_by_test_id("admin-support-tab-all")

    def get_request_row(self, request_id: int) -> Locator:
        return self.page.get_by_test_id(f"admin-support-row-{request_id}")

    def get_resolve_btn(self, request_id: int) -> Locator:
        return self.page.get_by_test_id(f"admin-support-resolve-{request_id}")

    def get_all_rows(self) -> Locator:
        return self.page.locator("[data-testid^='admin-support-row-']")

    def switch_to_tab(self, tab: str) -> None:
        """tab must be one of: 'open', 'resolved', 'all'."""
        self.page.get_by_test_id(f"admin-support-tab-{tab}").click()
        self.page.wait_for_load_state("networkidle")

    def resolve_request(self, request_id: int) -> None:
        """Click the 'סמן כטופל' button for the given request and wait for network."""
        self.get_resolve_btn(request_id).click()
        self.page.wait_for_load_state("networkidle")

    def find_row_by_subject(self, subject: str) -> Locator:
        """Return the first support-row card whose subject text matches."""
        return self.root.locator("[data-testid^='admin-support-row-']").filter(
            has=self.page.get_by_text(subject)
        ).first

    def row_is_open(self, request_id: int) -> bool:
        """Return True if the row shows an 'פתוח' badge."""
        return self.get_request_row(request_id).get_by_text("פתוח").count() > 0

    def row_is_resolved(self, request_id: int) -> bool:
        """Return True if the row shows a 'טופל' badge."""
        return self.get_request_row(request_id).get_by_text("טופל").count() > 0
