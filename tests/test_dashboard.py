import re

from playwright.sync_api import expect


def test_toggle_dark_mode(logged_in_page):
    page = logged_in_page

    page.locator('button[aria-label="עבור למצב כהה"]').click()

    # Match the `dark` class even if other classes are present on <html>.
    expect(page.locator("html")).to_have_class(re.compile(r"\bdark\b"))
