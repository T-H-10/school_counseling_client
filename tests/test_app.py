from abc import ABC
from playwright.sync_api import Locator, Page

class BasePage(ABC):

    def __init__(self, page):
        self.page = page


class HomePage(BasePage):

    def __init__(self, page):
        super().__init__(page)
        self.header: Locator = page.get_by_role("heading", name="עמוד הבית")
        
    def get_page_header(self) -> str:
        return self.header.text_content()
    

class LoginPage(BasePage):

    def __init__(self, page):
        super().__init__(page)        
        self.username_tb:Locator = page.get_by_placeholder("הכנס שם משתמש")
        self.password_tb: Locator = page.get_by_placeholder("הכנס סיסמה")
        self.login_btn: Locator = page.get_by_role("button", name="כניסה")
        self.login_error_msg: Locator = page.get_by_text(
            "שם משתמש או סיסמה שגויים. אנא נסה שנית."
        )
        
    def fill_username_tb(self, username_txt: str):
        print(f"About to fill {username_txt} to username tb")
        self.username_tb.fill(username_txt)

    def fill_password_tb(self, password_txt: str):
        print(f"About to fill password {password_txt} to password tb")
        self.password_tb.fill(password_txt)

    def click_login_btn(self) -> HomePage:
        print("About to click on login btn")
        self.login_btn.click()
        return HomePage(self.page)

    def get_login_error(self) -> str:
        return self.login_error_msg.inner_text()
    
class SidebarComponent(BasePage):
    def __init__(self, page):
        super().__init__(page)

    def navigate_to_students(self) -> "StudentsPage":
        self.page.get_by_role("link", name="תלמידים").click()
        return StudentsPage(self.page)


class StudentCardWidget(BasePage):
    def __init__(self, page, root_locator: Locator):
        self.page = page
        self.root_locator = root_locator

    def get_name(self) -> str:
        return self.root_locator.locator("p.font-bold").inner_text()


class StudentsPage(BasePage):
    def __init__(self, page):
        super().__init__(page)
        self.header: Locator = page.get_by_role("heading", name="תלמידים")
        self.search_input: Locator = page.get_by_placeholder("חיפוש חכם (שם, טלפון, ת״ז)...")

    def get_page_header(self) -> str:
        return self.header.text_content()

    def search(self, text: str) -> None:
        self.search_input.fill(text)
        # Wait for debounce (400 ms) then for the API response to land
        self.page.wait_for_timeout(500)
        self.page.wait_for_load_state("networkidle")

    def get_card_count(self) -> int:
        return self.page.locator("div.group").count()

    def get_card_with_name(self, name: str) -> StudentCardWidget:
        root = self.page.locator("div.group").filter(
            has=self.page.get_by_text(name, exact=True)
        ).first
        return StudentCardWidget(self.page, root)



def test_login_success(page):        
    page.goto("http://localhost:5173/login")    
    loginPage: LoginPage = LoginPage(page)
    loginPage.fill_username_tb("counselor1")
    loginPage.fill_password_tb("Test1234!")
    
    # We are returning the next page to make things easier for the test writer. 
    homePage: HomePage = loginPage.click_login_btn()    
    header: str = homePage.get_page_header()
    assert header == "עמוד הבית"


def test_navigate_to_students(page):
    page.goto("http://localhost:5173/login")
    loginPage = LoginPage(page)
    loginPage.fill_username_tb("counselor1")
    loginPage.fill_password_tb("Test1234!")
    loginPage.click_login_btn()

    sidebar = SidebarComponent(page)
    studentsPage: StudentsPage = sidebar.navigate_to_students()

    assert studentsPage.get_page_header() == "תלמידים"


def test_search_student(page):
    page.goto("http://localhost:5173/login")
    loginPage = LoginPage(page)
    loginPage.fill_username_tb("counselor1")
    loginPage.fill_password_tb("Test1234!")
    loginPage.click_login_btn()

    sidebar = SidebarComponent(page)
    studentsPage: StudentsPage = sidebar.navigate_to_students()

    studentsPage.search("דנה")

    card: StudentCardWidget = studentsPage.get_card_with_name("דנה כהן")
    assert card.get_name() == "דנה כהן"


def test_login_failed(page):
    page.goto("http://localhost:5173/login")

    login_page = LoginPage(page)

    login_page.fill_username_tb("wrong_user")
    login_page.fill_password_tb("wrong_password")
    login_page.click_login_btn()

    assert (
        login_page.get_login_error()
        == "שם משתמש או סיסמה שגויים. אנא נסה שנית."
    )