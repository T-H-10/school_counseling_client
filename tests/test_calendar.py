from playwright.sync_api import expect

from components import Sidebar
from utils import unique_suffix


def test_calendar_page_loads(logged_in_page):
    calendar = Sidebar(logged_in_page).navigate_to_calendar()

    assert calendar.get_page_header() == "לוח שנה"
    expect(calendar.container).to_be_visible()


def test_calendar_switch_to_month_view(logged_in_page):
    calendar = Sidebar(logged_in_page).navigate_to_calendar()

    calendar.switch_to_month()

    # react-big-calendar renders a month grid only in month view.
    expect(logged_in_page.locator(".rbc-month-view")).to_be_visible()


def test_create_event_from_slot_appears_on_calendar(logged_in_page):
    calendar = Sidebar(logged_in_page).navigate_to_calendar()
    title = f"פגישת לוח {unique_suffix()}"

    modal = calendar.open_create_from_slot()
    calendar = modal.create_event_and_submit(title, "דנה")

    # The new meeting renders on the calendar grid…
    expect(calendar.get_event_by_title(title)).to_be_visible()

    # …and clicking it opens the detail panel showing the same title.
    panel = calendar.open_event_detail(title)
    assert panel.get_title() == title


def test_create_from_slot_requires_student(logged_in_page):
    calendar = Sidebar(logged_in_page).navigate_to_calendar()

    modal = calendar.open_create_from_slot()
    modal.title_input.fill(f"ללא תלמיד {unique_suffix()}")
    # Event mode is the default; submitting with no student is blocked client-side.
    modal.submit_expecting_error()

    expect(modal.error).to_be_visible()
    expect(modal.root).to_be_visible()
