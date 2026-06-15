from playwright.sync_api import expect

from components import Sidebar


def test_calendar_page_loads(logged_in_page):
    calendar = Sidebar(logged_in_page).navigate_to_calendar()

    assert calendar.get_page_header() == "לוח שנה"
    expect(calendar.container).to_be_visible()


def test_calendar_switch_to_month_view(logged_in_page):
    calendar = Sidebar(logged_in_page).navigate_to_calendar()

    calendar.switch_to_month()

    # react-big-calendar renders a month grid only in month view.
    expect(logged_in_page.locator(".rbc-month-view")).to_be_visible()
