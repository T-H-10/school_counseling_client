from datetime import datetime

from components import Sidebar
from utils import unique_suffix


def test_create_event_success(logged_in_page):
    students = Sidebar(logged_in_page).navigate_to_students()
    profile = students.get_card_with_name("דנה כהן").click()

    today = datetime.now().strftime("%Y-%m-%dT%H:%M")
    modal = profile.click_add_event()
    modal.root.wait_for()

    profile = modal.fill_and_submit("פגישת הכוונה", today)

    event = profile.get_event_with_title("פגישת הכוונה")
    assert event.get_title() == "פגישת הכוונה"


def test_create_event_missing_title_shows_error(logged_in_page):
    students = Sidebar(logged_in_page).navigate_to_students()
    profile = students.get_card_with_name("דנה כהן").click()

    modal = profile.click_add_event()
    modal.root.wait_for()

    # Leave title empty — browser native `required` validation prevents submission
    modal.click_submit()

    assert modal.root.is_visible()


def test_view_event_details(logged_in_page):
    students = Sidebar(logged_in_page).navigate_to_students()
    profile = students.get_card_with_name("דנה כהן").click()

    today = datetime.now().strftime("%Y-%m-%dT%H:%M")
    title = f"פגישת פרטים {unique_suffix()}"

    modal = profile.click_add_event()
    modal.root.wait_for()
    profile = modal.fill_and_submit(title, today)

    event = profile.get_event_with_title(title)
    edit_modal = event.click_edit()
    edit_modal.root.wait_for()

    assert edit_modal.title_input.input_value() == title
    assert edit_modal.date_input.input_value() != ""
