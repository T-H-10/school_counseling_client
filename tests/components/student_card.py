from playwright.sync_api import Locator

from base_page import BasePage


class StudentCard(BasePage):
    def __init__(self, page, root_locator: Locator):
        super().__init__(page)
        self.root_locator = root_locator

    def get_name(self) -> str:
        return self.root_locator.locator("p.font-bold").inner_text()

    def click(self) -> "StudentProfilePage":
        from pages.student_profile_page import StudentProfilePage

        self.root_locator.click()
        return StudentProfilePage(self.page)
