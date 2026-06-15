import re

import pytest
from playwright.sync_api import expect

from components import Sidebar
from utils import unique_suffix


def test_classes_page_loads(logged_in_page):
    classes = Sidebar(logged_in_page).navigate_to_classes()

    assert classes.get_page_header() == "כיתות"
    # Either real class cards or the documented empty state — never an error.
    expect(classes.cards.first.or_(classes.empty_state)).to_be_visible()


def test_edit_class_teacher_persists(logged_in_page):
    classes = Sidebar(logged_in_page).navigate_to_classes()
    if not classes.has_classes():
        pytest.skip("No classes seeded — inline teacher edit cannot be exercised.")

    teacher = f"מורה {unique_suffix()}"
    card = classes.first_card()
    card.set_teacher(teacher)

    expect(card.root_locator).to_contain_text(teacher)


def test_class_card_navigates_to_filtered_students(logged_in_page):
    classes = Sidebar(logged_in_page).navigate_to_classes()
    if not classes.has_classes():
        pytest.skip("No classes seeded — class navigation cannot be exercised.")

    students = classes.first_card().click()

    expect(logged_in_page).to_have_url(re.compile(r"/students\?class_level="))
    assert students.get_page_header() == "תלמידים"
