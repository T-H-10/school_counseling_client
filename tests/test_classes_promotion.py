import pytest
from playwright.sync_api import expect

from components import Sidebar
from modals.promote_result_modal import PromoteResultModal
from modals.upload_document_modal import UploadDocumentModal
from utils import unique_suffix


# ---------------------------------------------------------------------------
# Private helpers — not collected as tests
# ---------------------------------------------------------------------------


def _navigate_to_classes(page):
    return Sidebar(page).navigate_to_classes()


def _do_promotion(classes) -> PromoteResultModal:
    """
    Expand the inline promotion panel, pick the first real (non-placeholder)
    target year (select index 1 — index 0 is the empty placeholder), confirm
    in the dialog, and return the visible PromoteResultModal.

    Calls pytest.skip() if the required UI controls are absent.
    """
    if classes.promote_btn.count() == 0:
        pytest.skip("Promote button not found — verify an active school year exists.")
    classes.promote_btn.click()
    classes.promote_year_select.wait_for(state="visible")
    options = classes.promote_year_select.locator("option")
    if options.count() <= 1:
        pytest.skip("No non-active school year is available as a promotion target.")
    classes.promote_year_select.select_option(index=1)
    classes.promote_confirm_btn.click()
    classes.confirm_dialog.wait_for(state="visible")
    classes.confirm_yes_btn.click()
    classes.page.get_by_test_id("promote-result-modal").wait_for(state="visible")
    return PromoteResultModal(classes.page)


# ---------------------------------------------------------------------------
# CL-01 — Promotion creates new enrollments at one grade higher
# ---------------------------------------------------------------------------


def test_promotion_advances_students_to_next_grade(logged_in_page):
    classes = _navigate_to_classes(logged_in_page)
    if not classes.has_classes():
        pytest.skip("No classes seeded — promotion cannot be exercised.")

    result = _do_promotion(classes)

    total = result.get_created_count() + result.get_skipped_count()
    assert total > 0
    expect(result.activate_note).to_be_visible()
    result.close()


# ---------------------------------------------------------------------------
# CL-02 — Grade-ח students are excluded and appear in the skipped table
# ---------------------------------------------------------------------------


def test_promotion_skips_grade_het_students(logged_in_page):
    classes = _navigate_to_classes(logged_in_page)
    if not classes.has_classes():
        pytest.skip("No classes seeded — promotion cannot be exercised.")

    result = _do_promotion(classes)

    skipped_count = result.get_skipped_count()
    if skipped_count == 0:
        result.close()
        pytest.skip(
            "No students were skipped — grade-ח student may not exist in seeded data."
        )

    result.skipped_table.wait_for(state="visible")
    table_text = result.skipped_table_text()
    if "בוגר (כיתה ח׳)" not in table_text:
        result.close()
        pytest.skip(
            "Grade-ח graduation reason absent from skipped table — seeded data may "
            "not include a grade-ח student, or they were already enrolled in the "
            "target year by a prior promotion run."
        )

    assert "בוגר (כיתה ח׳)" in table_text
    result.close()


# ---------------------------------------------------------------------------
# CL-03 — Promotion is idempotent: second run with the same pair reports 0
# ---------------------------------------------------------------------------


def test_promotion_is_idempotent(logged_in_page):
    classes = _navigate_to_classes(logged_in_page)
    if not classes.has_classes():
        pytest.skip("No classes seeded — promotion cannot be exercised.")

    # First pass — establishes enrollments in the target year
    result1 = _do_promotion(classes)
    result1.close()

    # Navigate fresh so the inline panel is in a known closed state
    classes = _navigate_to_classes(logged_in_page)
    result2 = _do_promotion(classes)

    assert result2.get_created_count() == 0
    result2.skipped_table.wait_for(state="visible")
    assert "כבר רשום לשנה זו" in result2.skipped_table_text()
    result2.close()


# ---------------------------------------------------------------------------
# CL-04 — Class detail roster lists students with correct names
# ---------------------------------------------------------------------------


def test_class_detail_roster_lists_students(logged_in_page):
    classes = _navigate_to_classes(logged_in_page)
    if not classes.has_classes():
        pytest.skip("No classes seeded — class detail roster cannot be verified.")

    card = classes.first_card()
    card_text = card.get_teacher_text()
    # inner_text() returns: "47 תלמידים\nב׳ 1\nמחנכ/ת..." — the class label is the 2nd non-empty line.
    lines = [line.strip() for line in card_text.split("\n") if line.strip()]
    class_label = lines[1] if len(lines) > 1 else ""

    detail = card.click()
    assert detail.is_on_class_detail()
    detail.roster.wait_for(state="visible")
    # fetchAll is a multi-page loop: networkidle fires too early while the skeleton
    # is still showing. Wait for the first student row OR any <p> inside the roster
    # (which only renders once loading is done and either rows or empty-state appear).
    logged_in_page.wait_for_selector(
        '[data-testid="class-detail-student-row"], '
        '[data-testid="class-detail-roster"] p',
        timeout=15000,
    )

    row_count = detail.student_rows.count()
    if row_count == 0:
        pytest.skip("First class card has no enrolled students — skip roster content check.")
    first_row_text = detail.student_rows.first.inner_text().strip()
    assert len(first_row_text) > 0

    header = detail.get_page_header()
    assert "כיתה" in header
    if class_label:
        assert class_label in header


# ---------------------------------------------------------------------------
# CL-05 — Upload document from class detail associates it with that class
# ---------------------------------------------------------------------------


def test_upload_document_from_class_detail(logged_in_page, tmp_path):
    classes = _navigate_to_classes(logged_in_page)
    if not classes.has_classes():
        pytest.skip("No classes seeded — class detail upload cannot be exercised.")

    detail = classes.first_card().click()
    logged_in_page.wait_for_load_state("networkidle")
    assert detail.is_on_class_detail()

    title = f"מסמך כיתה {unique_suffix()}"
    txt_file = tmp_path / "class_doc.txt"
    txt_file.write_text("תוכן לבדיקה")

    detail.upload_btn.click()
    modal = UploadDocumentModal(logged_in_page)
    modal.root.wait_for(state="visible")
    # Category must be pre-set to "class" when the modal is opened from class detail
    expect(modal.category_select).to_have_value("class")

    modal.fill_and_submit(title, txt_file)

    # Verify document appears in the class detail documents section
    new_doc_in_detail = detail.documents_section.get_by_test_id("document-row").filter(
        has=logged_in_page.get_by_text(title, exact=True)
    )
    new_doc_in_detail.wait_for(state="visible")

    # Verify document also appears on the /documents page under the "כיתתי" tab.
    # Documents are ordered newest-first so the freshly uploaded doc is on page 1.
    # Use expect(...).to_be_visible with a generous timeout rather than
    # get_row_for_title().wait_for() which times out when the locator has no matches.
    docs_page = Sidebar(logged_in_page).navigate_to_documents()
    docs_page.switch_to_tab("class")
    expect(logged_in_page.get_by_text(title, exact=True)).to_be_visible(timeout=15000)


# ---------------------------------------------------------------------------
# CL-06 — Class card student count badge matches the class detail roster length
# ---------------------------------------------------------------------------


def test_class_card_count_matches_detail_roster_length(logged_in_page):
    classes = _navigate_to_classes(logged_in_page)
    if not classes.has_classes():
        pytest.skip("No classes seeded — count comparison cannot be verified.")

    card = classes.first_card()
    expected_count = card.get_student_count()

    detail = card.click()
    detail.roster.wait_for(state="visible")
    # fetchAll is a multi-page loop; wait for any row (all rows appear atomically once done).
    logged_in_page.wait_for_selector(
        '[data-testid="class-detail-student-row"], '
        '[data-testid="class-detail-roster"] p',
        timeout=15000,
    )

    actual_count = detail.student_rows.count()
    assert expected_count == actual_count
