from base_page import BasePage


class Sidebar(BasePage):
    def navigate_to_students(self) -> "StudentsPage":
        from pages.students_page import StudentsPage

        self.page.get_by_role("link", name="תלמידים").click()
        return StudentsPage(self.page)
