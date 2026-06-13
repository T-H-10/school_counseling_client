from playwright.sync_api import expect

def test_login_success(page, login):
        expect(page.get_by_role("button", name = "יציאה מהמערכת")).to_be_visible()
        
        