from playwright.sync_api import Locator

from base_page import BasePage


class AssignmentCard(BasePage):
    def __init__(self, page, root_locator: Locator):
        super().__init__(page)
        self.root_locator = root_locator

    def get_status(self) -> str:
        """The status pill text — 'מתוכנן' (planned) or 'הושלם' (completed)."""
        return self.root_locator.locator("span.rounded-full").inner_text()

    def get_text(self) -> str:
        return self.root_locator.inner_text()

    def complete(self) -> "CompleteAssignmentModal":
        from modals.complete_assignment_modal import CompleteAssignmentModal

        self.root_locator.get_by_test_id("assignment-complete").click()
        return CompleteAssignmentModal(self.page)

    def edit_summary(self) -> "CompleteAssignmentModal":
        from modals.complete_assignment_modal import CompleteAssignmentModal

        self.root_locator.get_by_test_id("assignment-edit-summary").click()
        return CompleteAssignmentModal(self.page)

    def delete(self) -> "ConfirmDeleteModal":
        from modals.confirm_delete_modal import ConfirmDeleteModal

        self.root_locator.get_by_test_id("assignment-delete").click()
        return ConfirmDeleteModal(self.page)
