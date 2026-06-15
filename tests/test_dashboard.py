import re

from playwright.sync_api import expect

from components import Topbar


def test_toggle_dark_mode(logged_in_page):
    Topbar(logged_in_page).toggle_dark_mode()

    # Match the `dark` class even if other classes are present on <html>.
    expect(logged_in_page.locator("html")).to_have_class(re.compile(r"\bdark\b"))
