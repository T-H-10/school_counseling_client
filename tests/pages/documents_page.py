import re

from playwright.sync_api import Locator

from base_page import BasePage


class DocumentsPage(BasePage):
    def __init__(self, page):
        super().__init__(page)
        self.header: Locator = page.get_by_role("heading", name="מסמכים")
        self.upload_btn: Locator = page.get_by_test_id("documents-upload-btn")
        self.tab_general: Locator = page.get_by_test_id("documents-tab-general")
        self.tab_class: Locator = page.get_by_test_id("documents-tab-class")
        self.tab_student: Locator = page.get_by_test_id("documents-tab-student")
        self.document_rows: Locator = page.get_by_test_id("document-row")
        self.empty_state: Locator = page.get_by_test_id("document-list-empty")
        self.loading: Locator = page.get_by_test_id("document-list-loading")

    def get_page_header(self) -> str:
        return self.header.text_content()

    def is_on_documents(self) -> bool:
        return bool(re.search(r"/documents", self.page.url))

    def click_upload(self) -> "UploadDocumentModal":
        from modals.upload_document_modal import UploadDocumentModal

        self.upload_btn.click()
        return UploadDocumentModal(self.page)

    def switch_to_tab(self, key: str) -> None:
        """Switch to 'general', 'class', or 'student' tab and wait for load."""
        self.page.get_by_test_id(f"documents-tab-{key}").click()
        self.page.wait_for_load_state("networkidle")

    def wait_for_content(self) -> None:
        """Wait until loading skeletons are gone."""
        self.page.wait_for_load_state("networkidle")

    def get_row_for_title(self, title: str) -> Locator:
        return self.document_rows.filter(has=self.page.get_by_text(title, exact=True))
