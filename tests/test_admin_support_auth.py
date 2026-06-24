from pages import LoginPage
from components import Sidebar
from modals.admin_counselor_modal import AdminCounselorModal
from utils import unique_suffix

EXPIRED_ACCESS_TOKEN = (
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"
    ".eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjAwMDAwMDAwLCJpYXQiOjE2MDAwMDAwMDAsImp0aSI6ImZha2UiLCJ1c2VyX2lkIjoxfQ"
    ".fake_sig"
)


def _login_as_admin(page):
    """Log in as the admin user (user / userf2) and return the page."""
    page.goto("/login")
    login = LoginPage(page)
    login.fill_username_tb("user")
    login.fill_password_tb("userf2")
    home = login.click_login_btn()
    home.header.wait_for()
    return page


# ---------------------------------------------------------------------------
# AS-01 — Non-admin is redirected away from admin routes
# ---------------------------------------------------------------------------

def test_non_admin_redirected_from_admin_route(logged_in_page):
    logged_in_page.goto("http://localhost:5173/admin/schools")
    logged_in_page.wait_for_load_state("networkidle")
    assert "/admin" not in logged_in_page.url


# ---------------------------------------------------------------------------
# AS-02 — Admin creates a school; duplicate institution code is rejected
# ---------------------------------------------------------------------------

def test_admin_create_school_duplicate_institution_code_rejected(page):
    _login_as_admin(page)
    schools_page = Sidebar(page).navigate_to_admin_schools()
    page.wait_for_load_state("networkidle")

    code = "999" + unique_suffix()[:3]
    name1 = f"בית ספר א {unique_suffix()}"
    modal = schools_page.open_add_modal()
    modal.root.wait_for()
    modal.fill(name1, code, address="רחוב הבדיקה 1")
    modal.submit()
    page.wait_for_load_state("networkidle")

    assert schools_page.row_contains_institution_code(code)

    name2 = f"בית ספר ב {unique_suffix()}"
    modal2 = schools_page.open_add_modal()
    modal2.root.wait_for()
    modal2.fill(name2, code, address="רחוב הבדיקה 2")
    modal2.submit_expecting_error()
    page.wait_for_load_state("networkidle")

    assert modal2.is_open()
    error = modal2.get_institution_code_error()
    assert "קוד מוסד כבר קיים" in error


# ---------------------------------------------------------------------------
# AS-03 — Admin creates a counselor; new counselor can log in
# ---------------------------------------------------------------------------

def test_admin_create_counselor_new_counselor_can_login(page):
    _login_as_admin(page)
    counselors_page = Sidebar(page).navigate_to_admin_counselors()
    page.wait_for_load_state("networkidle")

    suffix = unique_suffix()
    username = f"testcounselor{suffix}"
    full_name = f"יועץ בדיקה {suffix}"

    modal = counselors_page.open_add_modal()
    modal.root.wait_for()
    modal.fill_create(username, full_name, "Test1234!", school_index=1)
    modal.submit()
    page.wait_for_load_state("networkidle")

    assert counselors_page.row_contains_username(username)

    login_page = Sidebar(page).logout()
    login_page.login_btn.wait_for()

    login_page.fill_username_tb(username)
    login_page.fill_password_tb("Test1234!")
    home = login_page.click_login_btn()
    home.header.wait_for()

    assert "/login" not in page.url


# ---------------------------------------------------------------------------
# AS-04 — Admin resets a counselor's password
# ---------------------------------------------------------------------------

def test_admin_reset_counselor_password(page):
    _login_as_admin(page)
    counselors_page = Sidebar(page).navigate_to_admin_counselors()
    page.wait_for_load_state("networkidle")

    suffix = unique_suffix()
    username = f"resettest{suffix}"
    full_name = f"איפוס סיסמה {suffix}"

    modal = counselors_page.open_add_modal()
    modal.root.wait_for()
    modal.fill_create(username, full_name, "Test1234!", school_index=1)
    modal.submit()
    page.wait_for_load_state("networkidle")

    row = counselors_page.find_row_by_username(username)
    row.wait_for()
    edit_btn = row.get_by_role("button").filter(has_text="עריכה").first
    if edit_btn.count() == 0:
        row.get_by_test_id("admin-counselor-edit-btn").click()
    else:
        edit_btn.click()

    page.wait_for_load_state("networkidle")

    edit_modal = AdminCounselorModal(page)
    edit_modal.root.wait_for()
    edit_modal.open_reset_password_section()
    edit_modal.reset_password("NewPass5678!")
    page.wait_for_load_state("networkidle")

    login_page = Sidebar(page).logout()
    login_page.login_btn.wait_for()

    login_page.fill_username_tb(username)
    login_page.fill_password_tb("Test1234!")
    login_page.click_login_btn()
    page.wait_for_load_state("networkidle")

    assert login_page.login_error_msg.count() > 0

    login_page.fill_username_tb(username)
    login_page.fill_password_tb("NewPass5678!")
    home = login_page.click_login_btn()
    home.header.wait_for()

    assert "/login" not in page.url


# ---------------------------------------------------------------------------
# AS-05 — Admin activates a school year; previous year is deactivated
# ---------------------------------------------------------------------------

def test_admin_activate_school_year_deactivates_previous(page):
    _login_as_admin(page)
    years_page = Sidebar(page).navigate_to_admin_school_years()
    page.wait_for_load_state("networkidle")

    all_rows = years_page.get_all_year_rows()
    all_rows.first.wait_for()

    if all_rows.count() < 2:
        suffix = unique_suffix()
        modal = years_page.open_add_modal()
        modal.root.wait_for()
        modal.fill(f"שנה בדיקה {suffix}", is_active=False)
        modal.submit()
        page.wait_for_load_state("networkidle")

    active_row = years_page.get_active_year_row()
    active_row.wait_for()
    active_year_testid = active_row.get_attribute("data-testid")
    active_year_id = int(active_year_testid.replace("admin-school-year-row-", ""))

    all_rows = years_page.get_all_year_rows()
    count = all_rows.count()
    second_year_id = None
    for i in range(count):
        row = all_rows.nth(i)
        tid = row.get_attribute("data-testid")
        row_id = int(tid.replace("admin-school-year-row-", ""))
        if row_id != active_year_id:
            second_year_id = row_id
            break

    assert second_year_id is not None, "Could not find a second school year to activate"

    edit_modal = years_page.open_edit_modal(second_year_id)
    edit_modal.root.wait_for()
    edit_modal.set_active(True)
    edit_modal.submit()
    page.wait_for_load_state("networkidle")

    assert years_page.is_year_active(second_year_id)
    assert not years_page.is_year_active(active_year_id)


# ---------------------------------------------------------------------------
# AS-06 — Counselor submits a support request successfully
# ---------------------------------------------------------------------------

def test_counselor_submit_support_request(logged_in_page):
    modal = Sidebar(logged_in_page).open_support_modal()
    modal.root.wait_for()

    modal.fill("בעיה בהכנסת תלמיד", "אני מנסה להוסיף תלמיד אבל מופיעה שגיאה")
    modal.submit()

    success = logged_in_page.get_by_text("הפנייה נשלחה בהצלחה")
    success.wait_for(timeout=5000)
    assert success.count() > 0

    if modal.is_open():
        assert modal.subject_value() == ""
    else:
        assert not modal.is_open()


# ---------------------------------------------------------------------------
# AS-07 — Admin sees the submitted support request
# ---------------------------------------------------------------------------

def test_admin_sees_submitted_support_request(page):
    page.goto("/login")
    login = LoginPage(page)
    login.fill_username_tb("counselor1")
    login.fill_password_tb("Test1234!")
    home = login.click_login_btn()
    home.header.wait_for()

    modal = Sidebar(page).open_support_modal()
    modal.root.wait_for()
    subject = f"בעיה בהכנסת תלמיד {unique_suffix()}"
    modal.fill(subject, "אני מנסה להוסיף תלמיד אבל מופיעה שגיאה")
    modal.submit()
    page.wait_for_load_state("networkidle")

    login_page = Sidebar(page).logout()
    login_page.login_btn.wait_for()

    _login_as_admin(page)
    support_page = Sidebar(page).navigate_to_admin_support()
    page.wait_for_load_state("networkidle")

    row = support_page.find_row_by_subject(subject)
    row.wait_for()
    assert row.count() > 0
    assert row.get_by_text("פתוח").count() > 0


# ---------------------------------------------------------------------------
# AS-08 — Admin resolves a support request; status changes to "טופל"
# ---------------------------------------------------------------------------

def test_admin_resolve_support_request(page):
    page.goto("/login")
    login = LoginPage(page)
    login.fill_username_tb("counselor1")
    login.fill_password_tb("Test1234!")
    home = login.click_login_btn()
    home.header.wait_for()

    modal = Sidebar(page).open_support_modal()
    modal.root.wait_for()
    subject = f"פנייה לטיפול {unique_suffix()}"
    modal.fill(subject, "תוכן הפנייה לסגירה")
    modal.submit()
    page.wait_for_load_state("networkidle")

    login_page = Sidebar(page).logout()
    login_page.login_btn.wait_for()

    _login_as_admin(page)
    support_page = Sidebar(page).navigate_to_admin_support()
    page.wait_for_load_state("networkidle")

    row = support_page.find_row_by_subject(subject)
    row.wait_for()

    testid = row.get_attribute("data-testid")
    request_id = int(testid.replace("admin-support-row-", ""))

    support_page.resolve_request(request_id)

    assert support_page.row_is_resolved(request_id)


# ---------------------------------------------------------------------------
# AS-09 — Expired access token is transparently refreshed
# ---------------------------------------------------------------------------

def test_expired_access_token_is_transparently_refreshed(logged_in_page):
    logged_in_page.evaluate(
        f"() => {{ localStorage.setItem('accessToken', '{EXPIRED_ACCESS_TOKEN}'); }}"
    )

    logged_in_page.goto("http://localhost:5173/students")
    logged_in_page.wait_for_load_state("networkidle")

    assert "/login" not in logged_in_page.url


# ---------------------------------------------------------------------------
# AS-10 — Invalid refresh token redirects to login without looping
# ---------------------------------------------------------------------------

def test_invalid_refresh_token_redirects_to_login(logged_in_page):
    logged_in_page.evaluate(
        "() => { "
        "  localStorage.setItem('accessToken', 'invalid.token.value'); "
        "  localStorage.setItem('refreshToken', 'invalid.token.value'); "
        "}"
    )

    logged_in_page.goto("http://localhost:5173/students")
    logged_in_page.wait_for_load_state("networkidle")

    assert "/login" in logged_in_page.url

    login_btn = logged_in_page.get_by_role("button", name="כניסה")
    login_btn.wait_for(timeout=5000)
    assert login_btn.count() > 0

    access_token = logged_in_page.evaluate("() => localStorage.getItem('accessToken')")
    refresh_token = logged_in_page.evaluate("() => localStorage.getItem('refreshToken')")
    assert access_token is None
    assert refresh_token is None
