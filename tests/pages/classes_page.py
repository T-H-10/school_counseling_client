from playwright.sync_api import Locator

from base_page import BasePage
from components.class_card import ClassCard


class ClassesPage(BasePage):
    def __init__(self, page):
        super().__init__(page)
        self.header: Locator = page.get_by_role("heading", name="כיתות")
        self.cards: Locator = page.get_by_test_id("class-card")
        self.empty_state: Locator = page.get_by_test_id("classes-empty")
        self.promote_btn: Locator = page.get_by_test_id("classes-promote")
        self.promote_year_select: Locator = page.get_by_test_id("classes-promote-year")
        self.promote_confirm_btn: Locator = page.get_by_test_id("classes-promote-confirm")
        self.confirm_dialog: Locator = page.get_by_test_id("promote-confirm-dialog")
        self.confirm_yes_btn: Locator = page.get_by_test_id("promote-confirm-yes")
        self.confirm_cancel_btn: Locator = page.get_by_test_id("promote-confirm-cancel")

    def get_page_header(self) -> str:
        return self.header.text_content()

    def has_classes(self) -> bool:
        self.page.wait_for_load_state("networkidle")
        return self.cards.count() > 0

    def first_card(self) -> ClassCard:
        return ClassCard(self.page, self.cards.first)

    def run_promotion(self, target_year_name: str) -> "PromoteResultModal":
        from modals.promote_result_modal import PromoteResultModal

        self.promote_btn.click()
        self.promote_year_select.select_option(label=target_year_name)
        self.promote_confirm_btn.click()
        self.confirm_dialog.wait_for(state="visible")
        self.confirm_yes_btn.click()
        self.page.get_by_test_id("promote-result-modal").wait_for(state="visible")
        return PromoteResultModal(self.page)
