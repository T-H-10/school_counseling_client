def test_login_success(login_page):
    login_page.fill_username_tb("counselor1")
    login_page.fill_password_tb("Test1234!")

    home = login_page.click_login_btn()

    assert home.get_page_header() == "עמוד הבית"


def test_login_failed(login_page):
    login_page.fill_username_tb("wrong_user")
    login_page.fill_password_tb("wrong_password")
    login_page.click_login_btn()

    assert login_page.get_login_error() == "שם משתמש או סיסמה שגויים. אנא נסה שנית."
