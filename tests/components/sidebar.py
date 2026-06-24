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

    def navigate_to_documents(self) -> "DocumentsPage":
        from pages.documents_page import DocumentsPage

        self.page.get_by_test_id("sidebar-link-documents").click()
        return DocumentsPage(self.page)

    # ------------------------------------------------------------------
    # Admin section (visible only when user.isAdmin === true)
    # ------------------------------------------------------------------

    def navigate_to_admin_schools(self) -> "AdminSchoolsPage":
        from pages.admin_schools_page import AdminSchoolsPage

        self.page.get_by_test_id("sidebar-link-admin-schools").click()
        return AdminSchoolsPage(self.page)

    def navigate_to_admin_counselors(self) -> "AdminCounselorsPage":
        from pages.admin_counselors_page import AdminCounselorsPage

        self.page.get_by_test_id("sidebar-link-admin-counselors").click()
        return AdminCounselorsPage(self.page)

    def navigate_to_admin_school_years(self) -> "AdminSchoolYearsPage":
        from pages.admin_school_years_page import AdminSchoolYearsPage

        self.page.get_by_test_id("sidebar-link-admin-years").click()
        return AdminSchoolYearsPage(self.page)

    def navigate_to_admin_support(self) -> "AdminSupportPage":
        from pages.admin_support_page import AdminSupportPage

        self.page.get_by_test_id("sidebar-link-admin-support").click()
        return AdminSupportPage(self.page)

    # ------------------------------------------------------------------
    # Counselor (non-admin) support button
    # ------------------------------------------------------------------

    def open_support_modal(self) -> "SupportModal":
        from modals.support_modal import SupportModal

        self.page.get_by_test_id("sidebar-support-btn").click()
        return SupportModal(self.page)

    # ------------------------------------------------------------------
    # Auth
    # ------------------------------------------------------------------

    def logout(self) -> "LoginPage":
        from pages.login_page import LoginPage

        self.page.get_by_test_id("sidebar-logout").click()
        return LoginPage(self.page)

    def get_username(self) -> str:
        return self.page.get_by_test_id("sidebar-username").inner_text()
