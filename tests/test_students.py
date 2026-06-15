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
