from playwright.sync_api import Locator

from base_page import BasePage


class CalendarPage(BasePage):
    def __init__(self, page):
        super().__init__(page)
        self.header: Locator = page.get_by_role("heading", name="לוח שנה")
        self.container: Locator = page.get_by_test_id("calendar-container")
        self.month_btn: Locator = page.get_by_role("button", name="חודש")
        self.week_btn: Locator = page.get_by_role("button", name="שבוע")
        self.day_btn: Locator = page.get_by_role("button", name="יום")
        self.next_btn: Locator = page.get_by_role("button", name="הבא")
        self.day_cells: Locator = page.get_by_test_id("calendar-day-cell")

    def get_page_header(self) -> str:
        return self.header.text_content()

    def switch_to_month(self) -> None:
        self.month_btn.click()

    def switch_to_day(self) -> None:
        self.day_btn.click()

    def open_create_from_slot(self) -> "CreateFromSlotModal":
        from modals.create_from_slot_modal import CreateFromSlotModal

        # Advance to a month with no events so any day cell is an unobstructed slot —
        # independent of whatever data other tests have created in the current month.
        self.switch_to_month()
        self.day_cells.first.wait_for()
        for _ in range(24):
            # Settle the events fetch before counting, otherwise a not-yet-loaded month
            # reads as empty and we land a slot on a cell another test already populated.
            self.page.wait_for_load_state("networkidle")
            if self.page.locator(".rbc-event").count() == 0:
                break
            self.next_btn.click()

        # react-big-calendar fires onSelectSlot on a mouse down→up over a day cell,
        # not on a synthetic click — so drive a real mouse sequence.
        # ~0.7 down the cell is the reliable hit zone: the top holds the date number
        # and the very bottom edge falls outside react-big-calendar's selectable area.
        box = self.day_cells.nth(15).bounding_box()
        self.page.mouse.move(box["x"] + box["width"] / 2, box["y"] + box["height"] * 0.7)
        self.page.mouse.down()
        self.page.mouse.up()
        modal = CreateFromSlotModal(self.page)
        modal.root.wait_for()
        return modal

    def get_event_by_title(self, title: str) -> Locator:
        return self.page.locator(".rbc-event", has_text=title).first

    def open_event_detail(self, title: str) -> "EventDetailPanel":
        from modals.event_detail_panel import EventDetailPanel

        self.get_event_by_title(title).click()
        panel = EventDetailPanel(self.page)
        panel.root.wait_for()
        return panel
