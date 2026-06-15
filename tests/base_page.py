from abc import ABC


class BasePage(ABC):
    """Base for every page, component and modal: holds the Playwright page."""

    def __init__(self, page):
        self.page = page
