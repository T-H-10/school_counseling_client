from playwright.sync_api import Locator

from base_page import BasePage


class AdminCounselorModal(BasePage):
    def __init__(self, page):
        super().__init__(page)
        self.root: Locator = page.get_by_test_id("admin-counselor-modal")
        self.fullname_input: Locator = page.get_by_test_id("admin-counselor-fullname")
        # username and password fields are only rendered in create (non-edit) mode
        self.username_input: Locator = page.get_by_test_id("admin-counselor-username")
        self.password_input: Locator = page.get_by_test_id("admin-counselor-password")
        self.school_select: Locator = page.get_by_test_id("admin-counselor-school")
        self.save_btn: Locator = page.get_by_test_id("admin-counselor-save-btn")
        self.cancel_btn: Locator = page.get_by_test_id("admin-counselor-cancel-btn")
        self.close_btn: Locator = page.get_by_test_id("admin-counselor-modal-close")
        # Reset-password section (edit mode only)
        self.reset_pw_toggle: Locator = page.get_by_test_id("admin-counselor-reset-pw-toggle")
        self.new_pw_input: Locator = page.get_by_test_id("admin-counselor-new-pw")
        self.reset_pw_btn: Locator = page.get_by_test_id("admin-counselor-reset-pw-btn")

    def fill_create(self, username: str, full_name: str, password: str, school_index: int = 1) -> None:
        """Fill the create-counselor form (all fields visible)."""
        self.fullname_input.fill(full_name)
        self.username_input.fill(username)
        self.password_input.fill(password)
        self.school_select.select_option(index=school_index)

    def submit(self) -> "AdminCounselorsPage":
        from pages.admin_counselors_page import AdminCounselorsPage

        self.save_btn.click()
        return AdminCounselorsPage(self.page)

    def submit_expecting_error(self) -> None:
        self.save_btn.click()

    def cancel(self) -> "AdminCounselorsPage":
        from pages.admin_counselors_page import AdminCounselorsPage

        self.cancel_btn.click()
        self.root.wait_for(state="detached")
        return AdminCounselorsPage(self.page)

    def open_reset_password_section(self) -> None:
        """Click the 'איפוס סיסמה' toggle to reveal the new-password input."""
        self.reset_pw_toggle.click()

    def reset_password(self, new_password: str) -> None:
        """Enter a new password and click the reset button."""
        self.new_pw_input.fill(new_password)
        self.reset_pw_btn.click()

    def is_open(self) -> bool:
        return self.root.count() > 0
