from playwright.sync_api import Locator

from base_page import BasePage


class LessonCard(BasePage):
    def __init__(self, page, root_locator: Locator):
        super().__init__(page)
        self.root_locator = root_locator

    def get_title(self) -> str:
        return self.root_locator.get_by_test_id("lesson-card-title").inner_text()

    def click(self) -> "LessonDetailPage":
        from pages.lesson_detail_page import LessonDetailPage

        self.root_locator.click()
        return LessonDetailPage(self.page)

    def delete(self) -> "ConfirmDeleteModal":
        from modals.confirm_delete_modal import ConfirmDeleteModal

        self.root_locator.hover()
        self.root_locator.get_by_test_id("lesson-card-delete").click()
        return ConfirmDeleteModal(self.page)
