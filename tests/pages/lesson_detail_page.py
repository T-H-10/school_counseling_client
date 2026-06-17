from playwright.sync_api import Locator

from base_page import BasePage
from components.assignment_card import AssignmentCard


class LessonDetailPage(BasePage):
    def __init__(self, page):
        super().__init__(page)
        self.title: Locator = page.get_by_test_id("lesson-detail-title")
        self.back_btn: Locator = page.get_by_test_id("lesson-detail-back")
        self.assign_btn: Locator = page.get_by_test_id("lesson-detail-assign")
        self.edit_btn: Locator = page.get_by_test_id("lesson-detail-edit")
        self.cards: Locator = page.get_by_test_id("assignment-card")

    def get_title(self) -> str:
        return self.title.inner_text()

    def open_assign_modal(self) -> "AssignClassModal":
        from modals.assign_class_modal import AssignClassModal

        self.assign_btn.click()
        return AssignClassModal(self.page)

    def open_edit_modal(self) -> "EditLessonModal":
        from modals.edit_lesson_modal import EditLessonModal

        self.edit_btn.click()
        return EditLessonModal(self.page)

    def first_assignment(self) -> AssignmentCard:
        return AssignmentCard(self.page, self.cards.first)

    def go_back(self) -> "LessonsPage":
        from pages.lessons_page import LessonsPage

        self.back_btn.click()
        return LessonsPage(self.page)
