import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import { axe } from "axe-core";
import { Button } from "@/components/ui/button";
import { HeroTemplate } from "@/stories/Hero.stories";
import { NotificationBanner } from "@/components/NotificationBanner";

const seedNotification = () => {
  localStorage.setItem(
    "admin_notifications",
    JSON.stringify([
      {
        id: "story-1",
        title: "تحذير أمان",
        message: "احذر الرسائل الاحتيالية.",
        type: "announcement",
        status: "published",
      },
    ])
  );
  window.dispatchEvent(new Event("notificationsUpdated"));
};

beforeEach(() => {
  seedNotification();
});

const runAxe = async (container: HTMLElement) => {
  const results = await axe(container);
  expect(results.violations).toHaveLength(0);
};

describe("Accessibility smoke tests", () => {
  it("Primary button is accessible", async () => {
    const { container } = render(
      <Button variant="arctic" size="default">
        Primary Action
      </Button>
    );
    await runAxe(container);
  });

  it("Hero layout is accessible", async () => {
    const { container } = render(<HeroTemplate />);
    await runAxe(container);
  });

  it("Notification banner is accessible", async () => {
    const { container } = render(<NotificationBanner />);
    await runAxe(container);
  });
});

