from playwright.sync_api import expect

from components import Sidebar
from utils import random_id_number, unique_suffix


def test_search_student(logged_in_page):
    students = Sidebar(logged_in_page).navigate_to_students()

    students.search("דנה")

    card = students.get_card_with_name("דנה כהן")
    assert card.get_name() == "דנה כהן"


def test_open_student_profile(logged_in_page):
    students = Sidebar(logged_in_page).navigate_to_students()

    card = students.get_card_with_name("דנה כהן")
    profile = card.click()

    assert profile.get_back_link_text() == "חזרה לרשימת התלמידים"


def test_add_event_from_profile(logged_in_page):
    students = Sidebar(logged_in_page).navigate_to_students()

    card = students.get_card_with_name("דנה כהן")
    profile = card.click()

    modal = profile.click_add_event()
    profile = modal.fill_and_submit("פגישת בדיקה", "2026-06-13T10:00")

    event = profile.get_event_with_title("פגישת בדיקה")
    assert event.get_title() == "פגישת בדיקה"


def test_edit_event_title_persists(logged_in_page):
    students = Sidebar(logged_in_page).navigate_to_students()
    profile = students.get_card_with_name("דנה כהן").click()

    original = f"פגישה לעריכה {unique_suffix()}"
    modal = profile.click_add_event()
    profile = modal.fill_and_submit(original, "2026-06-13T10:00")

    updated = f"פגישה עודכנה {unique_suffix()}"
    edit = profile.get_event_with_title(original).click_edit()
    profile = edit.set_title_and_submit(updated)

    # The timeline re-fetches on save, so the edited title replaces the original.
    expect(profile.get_event_with_title(updated).root_locator).to_be_visible()


def test_add_student_appears_in_search(logged_in_page):
    students = Sidebar(logged_in_page).navigate_to_students()
    name = f"תלמיד בדיקה {unique_suffix()}"

    modal = students.open_add_modal()
    modal.fill_required(name, random_id_number())
    students = modal.submit()

    # New student is searchable right after creation.
    students.search(name)
    card = students.get_card_with_name(name)
    assert card.get_name() == name


def test_add_student_invalid_id_shows_error(logged_in_page):
    students = Sidebar(logged_in_page).navigate_to_students()

    modal = students.open_add_modal()
    # Too-short national ID — server rejects it and the modal stays open.
    modal.fill_required(f"שגוי {unique_suffix()}", "123")
    modal.submit_expecting_error()

    expect(modal.root).to_be_visible()
    expect(modal.id_number_error).to_be_visible()


def test_cancel_add_student_modal_closes_and_unblocks_ui(logged_in_page):
    students = Sidebar(logged_in_page).navigate_to_students()

    modal = students.open_add_modal()
    expect(modal.root).to_be_visible()

    students = modal.cancel()

    # The modal (and its blocking backdrop) is gone, so the app shell is usable:
    # navigating away via the sidebar succeeds rather than being intercepted.
    expect(modal.root).to_have_count(0)
    calendar = Sidebar(logged_in_page).navigate_to_calendar()
    assert calendar.get_page_header() == "לוח שנה"


def test_edit_student_contact_persists(logged_in_page):
    students = Sidebar(logged_in_page).navigate_to_students()
    name = f"עריכה {unique_suffix()}"

    # Edit a freshly-created student rather than seed data, so the test is idempotent.
    modal = students.open_add_modal()
    modal.fill_required(name, random_id_number())
    students = modal.submit()

    students.search(name)
    profile = students.get_card_with_name(name).click()

    address = f"רחוב הבדיקה {unique_suffix()}"
    edit = profile.click_edit()
    profile = edit.set_contact_and_submit(address=address, mother_phone="0501234567")

    # The profile re-fetches on save, so the contact card reflects the new details.
    expect(profile.contact_card).to_contain_text(address)
    expect(profile.contact_card).to_contain_text("0501234567")


def test_filter_students_by_level(logged_in_page):
    students = Sidebar(logged_in_page).navigate_to_students()

    students.filter_by_level("א")

    # Filtering executes end-to-end: the select keeps its value and the table
    # resolves to either results or the empty state (never an error).
    assert students.selected_level_value() != ""
    expect(students.cards.first.or_(students.empty_state)).to_be_visible()


def test_add_then_delete_student(logged_in_page):
    students = Sidebar(logged_in_page).navigate_to_students()
    name = f"למחיקה {unique_suffix()}"

    modal = students.open_add_modal()
    modal.fill_required(name, random_id_number())
    students = modal.submit()

    students.search(name)
    card = students.get_card_with_name(name)
    confirm = card.delete()
    confirm.confirm()

    # After deleting the only matching student, the list is empty.
    expect(students.empty_state).to_be_visible()
