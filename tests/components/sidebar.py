from base_page import BasePage


class Sidebar(BasePage):
    def navigate_to_home(self) -> "HomePage":
        from pages.home_page import HomePage

        self.page.get_by_test_id("sidebar-link-home").click()
        return HomePage(self.page)

    def navigate_to_students(self) -> "StudentsPage":
        from pages.students_page import StudentsPage

        self.page.get_by_test_id("sidebar-link-students").click()
        return StudentsPage(self.page)

    def navigate_to_classes(self) -> "ClassesPage":
        from pages.classes_page import ClassesPage

        self.page.get_by_test_id("sidebar-link-classes").click()
        return ClassesPage(self.page)

    def navigate_to_lessons(self) -> "LessonsPage":
        from pages.lessons_page import LessonsPage

        self.page.get_by_test_id("sidebar-link-lessons").click()
        return LessonsPage(self.page)

    def navigate_to_calendar(self) -> "CalendarPage":
        from pages.calendar_page import CalendarPage

        self.page.get_by_test_id("sidebar-link-calendar").click()
        return CalendarPage(self.page)
