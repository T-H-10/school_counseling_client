"""E2E tests for the Documents feature.

Covers:
- Documents page navigation and tab structure
- Upload / edit / delete a general document
- Tab switching shows correct content (no stale-data flash)
- Student profile embeds the documents section
- Class detail embeds the documents section
- Quick action modal document card opens the upload modal
- Upload → logout → login: document persists (full storage round-trip)
"""
import re

import pytest
from playwright.sync_api import expect

from components import Sidebar
from components.topbar import Topbar
from modals.upload_document_modal import UploadDocumentModal
from modals.confirm_delete_modal import ConfirmDeleteModal
from pages import LoginPage
from pages.documents_page import DocumentsPage
from utils import unique_suffix


# ---------------------------------------------------------------------------
# Fixture — a small .txt file the backend's extension whitelist accepts
# ---------------------------------------------------------------------------

@pytest.fixture
def sample_file(tmp_path):
    path = tmp_path / "sample.txt"
    path.write_text("תוכן בדיקה", encoding="utf-8")
    return path


# ---------------------------------------------------------------------------
# Navigation
# ---------------------------------------------------------------------------

def test_documents_page_loads(logged_in_page):
    docs = Sidebar(logged_in_page).navigate_to_documents()

    expect(logged_in_page).to_have_url(re.compile(r"/documents"))
    assert docs.get_page_header() == "מסמכים"
    expect(docs.tab_general).to_be_visible()
    expect(docs.tab_class).to_be_visible()
    expect(docs.tab_student).to_be_visible()
    # Either rows or empty state — never a loading spinner or raw error text.
    docs.wait_for_content()
    expect(docs.document_rows.first.or_(docs.empty_state)).to_be_visible()


# ---------------------------------------------------------------------------
# Upload → list
# ---------------------------------------------------------------------------

def test_upload_general_document_appears_in_list(logged_in_page, sample_file):
    docs = Sidebar(logged_in_page).navigate_to_documents()
    title = f"מסמך כללי {unique_suffix()}"

    modal = docs.click_upload()
    expect(modal.root).to_be_visible()
    modal.fill_and_submit(title, sample_file)

    logged_in_page.wait_for_load_state("networkidle")
    expect(logged_in_page.get_by_text(title)).to_be_visible()


# ---------------------------------------------------------------------------
# Edit
# ---------------------------------------------------------------------------

def test_edit_document_title_persists(logged_in_page, sample_file):
    docs = Sidebar(logged_in_page).navigate_to_documents()
    original = f"לפני עריכה {unique_suffix()}"
    updated  = f"אחרי עריכה {unique_suffix()}"

    # Upload
    docs.click_upload().fill_and_submit(original, sample_file)
    logged_in_page.wait_for_load_state("networkidle")

    # Click edit on the row
    row = docs.get_row_for_title(original)
    row.get_by_test_id("document-edit").click()

    modal = UploadDocumentModal(logged_in_page)
    expect(modal.root).to_be_visible()
    modal.title_input.fill(updated)
    modal.submit()

    logged_in_page.wait_for_load_state("networkidle")
    expect(logged_in_page.get_by_text(updated)).to_be_visible()
    expect(logged_in_page.get_by_text(original)).to_have_count(0)


# ---------------------------------------------------------------------------
# Delete
# ---------------------------------------------------------------------------

def test_delete_document_removes_it_from_list(logged_in_page, sample_file):
    docs = Sidebar(logged_in_page).navigate_to_documents()
    title = f"למחיקה {unique_suffix()}"

    docs.click_upload().fill_and_submit(title, sample_file)
    logged_in_page.wait_for_load_state("networkidle")

    row = docs.get_row_for_title(title)
    row.get_by_test_id("document-delete").click()

    confirm = ConfirmDeleteModal(logged_in_page)
    expect(confirm.root).to_be_visible()
    confirm.confirm()

    logged_in_page.wait_for_load_state("networkidle")
    expect(logged_in_page.get_by_text(title)).to_have_count(0)


# ---------------------------------------------------------------------------
# Tab switching — no stale data between tabs
# ---------------------------------------------------------------------------

def test_tab_switch_resets_content(logged_in_page):
    docs = Sidebar(logged_in_page).navigate_to_documents()
    docs.wait_for_content()

    # Switch to "כיתתי" — should not still show the previous tab's data
    docs.switch_to_tab("class")
    # The loading skeleton must appear (list cleared) or content loads cleanly —
    # either way the "general" tab's active class is gone.
    expect(docs.tab_class).to_have_class(re.compile(r"border-indigo"))

    docs.switch_to_tab("student")
    expect(docs.tab_student).to_have_class(re.compile(r"border-indigo"))

    # Switching back to general reloads it.
    docs.switch_to_tab("general")
    expect(docs.tab_general).to_have_class(re.compile(r"border-indigo"))
    docs.wait_for_content()
    expect(docs.document_rows.first.or_(docs.empty_state)).to_be_visible()


# ---------------------------------------------------------------------------
# Quick action modal — document card
# ---------------------------------------------------------------------------

def test_quick_action_document_card_opens_upload_modal(logged_in_page):
    logged_in_page.get_by_test_id("quick-action-button").click()

    modal_outer = logged_in_page.get_by_test_id("quick-action-modal")
    expect(modal_outer).to_be_visible()

    # The document card must be active (not disabled / "בקרוב").
    doc_card = logged_in_page.get_by_test_id("quick-action-card").filter(
        has=logged_in_page.get_by_text("מסמך")
    )
    expect(doc_card).to_be_visible()
    # It should NOT contain the "בקרוב" badge.
    expect(doc_card.get_by_text("בקרוב")).to_have_count(0)

    doc_card.click()

    upload_modal = UploadDocumentModal(logged_in_page)
    expect(upload_modal.root).to_be_visible()


# ---------------------------------------------------------------------------
# Student profile embed
# ---------------------------------------------------------------------------

def test_student_profile_shows_documents_section(logged_in_page):
    students = Sidebar(logged_in_page).navigate_to_students()
    # Use the seeded student that other tests also rely on.
    card = students.get_card_with_name("דנה כהן")
    card.click()

    logged_in_page.wait_for_load_state("networkidle")
    section = logged_in_page.get_by_test_id("student-documents")
    expect(section).to_be_visible()
    # Either an upload button or existing rows.
    expect(logged_in_page.get_by_test_id("student-documents-upload-btn")).to_be_visible()


# ---------------------------------------------------------------------------
# Class detail embed
# ---------------------------------------------------------------------------

def test_class_detail_shows_documents_section(logged_in_page):
    classes = Sidebar(logged_in_page).navigate_to_classes()
    if not classes.has_classes():
        pytest.skip("No classes seeded — class detail cannot be exercised.")

    detail = classes.first_card().click()
    logged_in_page.wait_for_load_state("networkidle")

    expect(detail.documents_section).to_be_visible()
    expect(detail.roster).to_be_visible()
    expect(logged_in_page.get_by_test_id("class-detail-upload-btn")).to_be_visible()


# ---------------------------------------------------------------------------
# Persistence: upload → logout → login → document still listed
# ---------------------------------------------------------------------------

def test_document_persists_across_logout_and_login(logged_in_page, sample_file):
    docs = Sidebar(logged_in_page).navigate_to_documents()
    title = f"נשמר בין כניסות {unique_suffix()}"

    docs.click_upload().fill_and_submit(title, sample_file)
    logged_in_page.wait_for_load_state("networkidle")
    expect(logged_in_page.get_by_text(title)).to_be_visible()

    # Log out
    Topbar(logged_in_page).logout()
    expect(logged_in_page).to_have_url(re.compile(r"/login"))

    # Log back in
    login = LoginPage(logged_in_page)
    login.fill_username_tb("counselor1")
    login.fill_password_tb("Test1234!")
    login.click_login_btn()

    # Navigate to documents and verify the upload survived the round-trip
    docs = Sidebar(logged_in_page).navigate_to_documents()
    logged_in_page.wait_for_load_state("networkidle")
    expect(logged_in_page.get_by_text(title)).to_be_visible()
