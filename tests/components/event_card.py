from playwright.sync_api import Locator

from base_page import BasePage


class EventCard(BasePage):
    def __init__(self, page, root_locator: Locator):
        super().__init__(page)
        self.root_locator = root_locator

    def get_title(self) -> str:
        return self.root_locator.locator("p.font-semibold").inner_text()
