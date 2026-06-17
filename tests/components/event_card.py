from playwright.sync_api import Locator

from base_page import BasePage


class EventCard(BasePage):
    def __init__(self, page, root_locator: Locator):
        super().__init__(page)
        self.root_locator = root_locator

    def get_title(self) -> str:
        return self.root_locator.locator("p.font-semibold").inner_text()

    def click_edit(self) -> "EditEventModal":
        from modals.edit_event_modal import EditEventModal

        self.root_locator.get_by_test_id("timeline-event-edit").click()
        return EditEventModal(self.page)
