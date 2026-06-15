import re

from playwright.sync_api import expect

from components import Sidebar, Topbar
from pages import HomePage


def test_toggle_dark_mode(logged_in_page):
    Topbar(logged_in_page).toggle_dark_mode()

    # Match the `dark` class even if other classes are present on <html>.
    expect(logged_in_page.locator("html")).to_have_class(re.compile(r"\bdark\b"))


def test_dashboard_shows_kpi_cards(logged_in_page):
    home = HomePage(logged_in_page)

    # The four KPI stat cards render after the dashboard data loads.
    expect(home.stat_cards).to_have_count(4)
    expect(home.stat_card("תלמידות פעילות")).to_be_visible()
    expect(home.stat_card("פגישות היום")).to_be_visible()


def test_dashboard_is_default_route(logged_in_page):
    # Navigating away and back via the home link lands on the dashboard.
    Sidebar(logged_in_page).navigate_to_students()
    home = Sidebar(logged_in_page).navigate_to_home()

    assert home.get_page_header() == "עמוד הבית"
