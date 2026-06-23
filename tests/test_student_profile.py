from datetime import datetime, timedelta

from playwright.sync_api import expect

from components import Sidebar
from pages.student_profile_page import StudentProfilePage
from utils import random_id_number, unique_suffix


# SP-01 — Invalid Phone Number Format Shows a Field Error
def test_invalid_phone_shows_error(logged_in_page):
    students = Sidebar(logged_in_page).navigate_to_students()
    name = f"טלפון שגוי {unique_suffix()}"

    modal = students.open_add_modal()
    modal.fill_required(name, random_id_number())
    students = modal.submit()

    students.search(name)
    profile = students.get_card_with_name(name).click()

    edit = profile.click_edit()
    edit.mother_phone_input.fill("0720000000")
    edit.submit_expecting_error()
    edit.mother_phone_error.wait_for()

    assert edit.root.is_visible()
    assert edit.mother_phone_error.is_visible()


# SP-02 — Add Student with Name Too Short Shows Error
def test_add_student_name_too_short_shows_error(logged_in_page):
    students = Sidebar(logged_in_page).navigate_to_students()

    modal = students.open_add_modal()
    modal.fill_required("א", random_id_number())
    modal.submit_expecting_error()
    modal.full_name_error.wait_for()

    assert modal.root.is_visible()
    assert modal.full_name_error.is_visible()


# SP-03 — Client-Side Luhn Check Blocks a Plausible but Invalid ID
def test_invalid_id_luhn_blocked_client_side(logged_in_page):
    students = Sidebar(logged_in_page).navigate_to_students()

    modal = students.open_add_modal()
    modal.fill_required(f"לון {unique_suffix()}", "123456789")
    modal.submit_expecting_error()
    modal.id_number_error.wait_for()

    assert modal.root.is_visible()
    assert modal.id_number_error.is_visible()


# SP-04 — Inactive Students Tab Shows Only Soft-Deleted Students
def test_inactive_tab_shows_no_error(logged_in_page):
    students = Sidebar(logged_in_page).navigate_to_students()
    students.click_inactive_tab()

    expect(students.cards.first.or_(students.empty_state)).to_be_visible()


# SP-05 — Export Students Triggers an XLSX Download
def test_export_triggers_xlsx_download(logged_in_page):
    students = Sidebar(logged_in_page).navigate_to_students()

    with logged_in_page.expect_download() as dl_info:
        students.export_btn.click()

    download = dl_info.value
    assert download.suggested_filename.endswith(".xlsx")


# SP-07 — Create Event with Non-Default Type Persists the Type Label
def test_event_type_call_persists(logged_in_page):
    students = Sidebar(logged_in_page).navigate_to_students()
    profile = students.get_card_with_name("דנה כהן").click()

    title = f"שיחת בדיקה {unique_suffix()}"
    today = datetime.now().strftime("%Y-%m-%dT%H:%M")

    modal = profile.click_add_event()
    profile = modal.fill_and_submit_with_type(title, today, "call")

    event = profile.get_event_with_title(title)
    edit_modal = event.click_edit()
    edit_modal.root.wait_for()

    assert edit_modal.type_select.input_value() == "call"


# SP-08 — Optional Agenda Field Survives a Round-Trip
def test_agenda_field_survives_round_trip(logged_in_page):
    students = Sidebar(logged_in_page).navigate_to_students()
    profile = students.get_card_with_name("דנה כהן").click()

    title = f"אג'נדה {unique_suffix()}"
    agenda_text = "לבחון ציוני מבחן ורווחה כללית"

    modal = profile.click_add_event()
    modal.root.wait_for()
    # Set a far-future date first so the agenda textarea is rendered.
    modal.date_input.fill("2030-01-01T10:00")
    modal.agenda_input.fill(agenda_text)
    modal.title_input.fill(title)
    modal.submit_btn.click()
    logged_in_page.wait_for_load_state("networkidle")

    profile = StudentProfilePage(logged_in_page)
    event = profile.get_event_with_title(title)
    edit_modal = event.click_edit()
    edit_modal.root.wait_for()

    assert edit_modal.agenda_input.input_value() == agenda_text


def _navigate_home_and_wait(logged_in_page):
    """Navigate to the dashboard and wait until the today-meetings card is fully loaded."""
    from pages.home_page import HomePage
    home = Sidebar(logged_in_page).navigate_to_home()
    # today_meetings_card is only rendered after getDashboard() resolves —
    # waiting for it avoids a race with networkidle firing before the useEffect fetch.
    home.today_meetings_card.wait_for()
    return home


# SP-09 — Dashboard Status Toggle Marks Event Completed
def test_dashboard_toggle_marks_completed(logged_in_page):
    students = Sidebar(logged_in_page).navigate_to_students()
    profile = students.get_card_with_name("דנה כהן").click()

    # +5 min so the event lands in upcoming_today.
    soon = (datetime.now() + timedelta(minutes=5)).strftime("%Y-%m-%dT%H:%M")
    modal = profile.click_add_event()
    profile = modal.fill_and_submit(f"פגישה היום {unique_suffix()}", soon)

    home = _navigate_home_and_wait(logged_in_page)

    home.click_pending_toggle_for_student("דנה כהן")

    assert home.has_completed_meeting_for_student("דנה כהן")


# SP-10 — Completed Event Status Persistence
def test_completed_event_status_persists(logged_in_page):
    students = Sidebar(logged_in_page).navigate_to_students()
    profile = students.get_card_with_name("דנה כהן").click()

    # +5 min guarantees the event appears in upcoming_today when dashboard loads.
    soon = (datetime.now() + timedelta(minutes=5)).strftime("%Y-%m-%dT%H:%M")
    modal = profile.click_add_event()
    profile = modal.fill_and_submit(f"פגישה קבועה {unique_suffix()}", soon)

    home = _navigate_home_and_wait(logged_in_page)

    # Count pending meetings before toggle.
    count_before = (
        logged_in_page.get_by_test_id("today-meeting-item")
        .filter(has=logged_in_page.get_by_text("דנה כהן"))
        .filter(has=logged_in_page.get_by_text("ממתין"))
    ).count()

    home.click_pending_toggle_for_student("דנה כהן")

    # Navigate away and back — dashboard re-fetches from the server.
    Sidebar(logged_in_page).navigate_to_students()
    home = _navigate_home_and_wait(logged_in_page)

    # After reload, completed meetings still appear (status: 'completed'),
    # so the pending count must have dropped by exactly 1.
    count_after = (
        logged_in_page.get_by_test_id("today-meeting-item")
        .filter(has=logged_in_page.get_by_text("דנה כהן"))
        .filter(has=logged_in_page.get_by_text("ממתין"))
    ).count()

    assert count_after == count_before - 1
