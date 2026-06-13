from playwright.sync_api import expect

def test_toggle_dark_mode(logged_in_page):
    page = logged_in_page
    
    button = page.locator('button[aria-label="עבור למצב כהה"]')
    button.click()
    
    expect(page.locator("html")).to_have_class("dark")
    
    
    
    