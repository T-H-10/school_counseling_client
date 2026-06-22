from pathlib import Path

from playwright.sync_api import Locator

from base_page import BasePage


class UploadDocumentModal(BasePage):
    def __init__(self, page):
        super().__init__(page)
        self.root: Locator = page.get_by_test_id("upload-document-modal")
        self.title_input: Locator = page.get_by_test_id("upload-document-title")
        self.category_select: Locator = page.get_by_test_id("upload-document-category")
        self.file_input: Locator = page.get_by_test_id("upload-document-file")
        self.submit_btn: Locator = page.get_by_test_id("upload-document-submit")
        self.cancel_btn: Locator = page.get_by_test_id("upload-document-cancel")
        self.close_btn: Locator = page.get_by_test_id("upload-document-close")

    def fill(self, title: str, file_path: Path, category: str | None = None) -> None:
        if category:
            self.category_select.select_option(category)
        self.title_input.fill(title)
        self.file_input.set_input_files(str(file_path))

    def submit(self) -> None:
        self.submit_btn.click()
        self.root.wait_for(state="detached")

    def fill_and_submit(self, title: str, file_path: Path, category: str | None = None) -> None:
        self.fill(title, file_path, category)
        self.submit()

    def cancel(self) -> None:
        self.cancel_btn.click()
        self.root.wait_for(state="detached")
