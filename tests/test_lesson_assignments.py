from playwright.sync_api import expect

from components import Sidebar
from utils import unique_suffix


def _fresh_lesson_detail(page):
    """Create a brand-new lesson (no assignments yet) and open its detail page."""
    lessons = Sidebar(page).navigate_to_lessons()
    title = f"מערך שיוך {unique_suffix()}"
    modal = lessons.open_add_modal()
    lessons = modal.fill_and_submit(title)
    return lessons.get_card_with_title(title).click()


def test_assign_lesson_to_class(logged_in_page):
    detail = _fresh_lesson_detail(logged_in_page)
    # A fresh lesson has no class assignments.
    expect(detail.cards).to_have_count(0)

    modal = detail.open_assign_modal()
    detail = modal.fill_and_submit(class_number="3")

    # The new assignment shows up as a single "planned" card.
    expect(detail.cards).to_have_count(1)
    assert detail.first_assignment().get_status() == "מתוכנן"


def test_complete_assignment_marks_done(logged_in_page):
    detail = _fresh_lesson_detail(logged_in_page)
    detail = detail.open_assign_modal().fill_and_submit(class_number="3")

    summary = f"סיכום שיעור {unique_suffix()}"
    complete_modal = detail.first_assignment().complete()
    detail = complete_modal.fill_and_submit(summary)

    # The card flips to "completed" and surfaces the summary text.
    card = detail.first_assignment()
    assert card.get_status() == "הושלם"
    expect(card.root_locator).to_contain_text(summary)


def test_delete_assignment_removes_card(logged_in_page):
    detail = _fresh_lesson_detail(logged_in_page)
    detail = detail.open_assign_modal().fill_and_submit(class_number="3")
    expect(detail.cards).to_have_count(1)

    confirm = detail.first_assignment().delete()
    confirm.confirm()

    # Once the only assignment is deleted, the lesson has no class cards left.
    expect(detail.cards).to_have_count(0)
