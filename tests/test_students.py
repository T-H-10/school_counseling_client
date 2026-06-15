from components import Sidebar


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
