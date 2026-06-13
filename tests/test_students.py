from playwright.sync_api import expect

SEARCH_PLACEHOLDER = "חיפוש חכם (שם, טלפון, ת״ז)..."


def test_students_page_loads(logged_in_page):
    page = logged_in_page

    page.get_by_role("link", name="תלמידים").click()

    expect(page.get_by_role("heading", name="תלמידים")).to_be_visible()
    expect(page.get_by_placeholder(SEARCH_PLACEHOLDER)).to_be_visible()


def test_students_search_accepts_input(logged_in_page):
    page = logged_in_page

    page.get_by_role("link", name="תלמידים").click()

    search = page.get_by_placeholder(SEARCH_PLACEHOLDER)
    search.fill("דנה")

    expect(search).to_have_value("דנה")
