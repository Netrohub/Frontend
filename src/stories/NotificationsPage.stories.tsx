import type { Meta, StoryObj } from "@storybook/react-vite";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Notifications as NotificationsPage } from "@/pages/Notifications";
import { StoryProviders } from "./storyProviders";

const mockUser = {
  id: 21,
  name: "Notification Tester",
  email: "notify@nxoland.com",
  role: "user",
  is_verified: true,
  created_at: "2024-03-01T00:00:00Z",
  updated_at: "2024-03-01T00:00:00Z",
};

const createNotificationsClient = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const notifications = [
    {
      id: 1,
      title: "الطلب الخاص بك قيد المراجعة",
      message: "جارٍ التأكد من التفاصيل. سنتواصل معك عند اكتمال التحقق.",
      type: "Package",
      status: "unread",
      created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    },
    {
      id: 2,
      title: "تم اعتماد السحب",
      message: "المبلغ تم تحويله إلى حسابك البنكي.",
      type: "AlertTriangle",
      status: "read",
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    },
    {
      id: 3,
      title: "إشعار أمان",
      message: "غيرنا إجراءات الحماية للملف الشخصي. تأكد من بريدك.",
      type: "MessageSquare",
      status: "read",
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString(),
    },
  ];
  queryClient.setQueryData(["notifications", 1, "all", "all"], {
    data: notifications,
    meta: {
      total: notifications.length,
      per_page: 10,
      current_page: 1,
    },
  });
  queryClient.setQueryData(["notifications-unread-count"], { count: 1 });
  return queryClient;
};

const meta: Meta<typeof NotificationsPage> = {
  title: "Pages/Notifications",
  component: NotificationsPage,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <StoryProviders user={mockUser} path="/notifications">
        <div className="min-h-screen">
          <Story />
        </div>
      </StoryProviders>
    ),
  ],
} satisfies Meta<typeof NotificationsPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const queryClient = createNotificationsClient();
    return (
      <QueryClientProvider client={queryClient}>
        <NotificationsPage />
      </QueryClientProvider>
    );
  },
};

