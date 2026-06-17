from playwright.sync_api import expect

from components import Sidebar
from utils import unique_suffix


def test_add_lesson_appears_in_list(logged_in_page):
    lessons = Sidebar(logged_in_page).navigate_to_lessons()
    title = f"מערך בדיקה {unique_suffix()}"

    modal = lessons.open_add_modal()
    lessons = modal.fill_and_submit(title, "תיאור קצר לבדיקה")

    card = lessons.get_card_with_title(title)
    assert card.get_title() == title


def test_edit_lesson_title_persists(logged_in_page):
    lessons = Sidebar(logged_in_page).navigate_to_lessons()
    title = f"מערך לעריכה {unique_suffix()}"

    modal = lessons.open_add_modal()
    lessons = modal.fill_and_submit(title)
    detail = lessons.get_card_with_title(title).click()

    new_title = f"{title} (עודכן)"
    detail = detail.open_edit_modal().set_title_and_submit(new_title)

    # The detail header reflects the renamed lesson after the edit is saved.
    assert detail.get_title() == new_title


def test_open_lesson_detail_and_back(logged_in_page):
    lessons = Sidebar(logged_in_page).navigate_to_lessons()
    title = f"מערך לפרטים {unique_suffix()}"

    modal = lessons.open_add_modal()
    lessons = modal.fill_and_submit(title)

    detail = lessons.get_card_with_title(title).click()
    assert detail.get_title() == title
    expect(detail.assign_btn).to_be_visible()

    lessons = detail.go_back()
    expect(lessons.header).to_be_visible()


def test_delete_lesson(logged_in_page):
    lessons = Sidebar(logged_in_page).navigate_to_lessons()
    title = f"מערך למחיקה {unique_suffix()}"

    modal = lessons.open_add_modal()
    lessons = modal.fill_and_submit(title)

    card = lessons.get_card_with_title(title)
    confirm = card.delete()
    confirm.confirm()

    # The deleted lesson's card is gone from the grid.
    expect(lessons.cards.filter(has=logged_in_page.get_by_text(title, exact=True))).to_have_count(0)
