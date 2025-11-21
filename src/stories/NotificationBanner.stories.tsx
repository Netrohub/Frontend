import type { Meta, StoryObj } from "@storybook/react-vite";
import { NotificationBanner } from "@/components/NotificationBanner";
import { StoryProviders } from "./storyProviders";

const mockAnnouncement = {
  id: "announcement-1",
  title: "تحذير أمني",
  message: "المنصة لا تتواصل خارج واجهة الموقع الرسمية. احذر الروابط المرسلة عبر الرسائل الخاصة.",
  type: "announcement",
  status: "published",
};

const seedNotifications = () => {
  localStorage.setItem("admin_notifications", JSON.stringify([mockAnnouncement]));
  window.dispatchEvent(new Event("notificationsUpdated"));
};

const meta = {
  title: "Content/NotificationBanner",
  component: NotificationBanner,
  decorators: [
    (Story) => (
      <StoryProviders user={null} path="/">
        <div className="min-h-screen bg-[hsl(200,70%,15%)]">
          <Story />
        </div>
      </StoryProviders>
    ),
  ],
} satisfies Meta<typeof NotificationBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    seedNotifications();
    return <NotificationBanner />;
  },
};

