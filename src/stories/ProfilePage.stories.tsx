import type { Meta, StoryObj } from "@storybook/react-vite";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Profile as ProfilePage } from "@/pages/Profile";
import { StoryProviders } from "./storyProviders";
import type { User } from "@/types/api";

const mockUser: User = {
  id: 5,
  name: "NXO Designer",
  email: "designer@nxoland.com",
  role: "user",
  is_verified: true,
  avatar: "/nxoland-new-logo.png",
  created_at: "2024-04-15T08:00:00Z",
  updated_at: "2024-11-01T00:00:00Z",
};

const createProfileClient = () => {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  qc.setQueryData(["user-stats"], {
    referrals: 12,
    response_rate: 98,
    total_sales: 72,
    total_purchases: 21,
  });
  qc.setQueryData(["user-activity"], [
    {
      id: 1,
      type: "order_completed",
      created_at: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
      payload: {},
    },
    {
      id: 2,
      type: "kyc_verified",
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
      payload: {},
    },
    {
      id: 3,
      type: "listing_created",
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      payload: {},
    },
  ]);
  return qc;
};

const meta = {
  title: "Pages/Profile",
  component: ProfilePage,
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <StoryProviders user={mockUser} path="/profile">
        <div className="min-h-screen bg-gradient-to-b from-[hsl(200,70%,15%)] via-[hsl(195,60%,25%)] to-[hsl(200,70%,15%)]">
          <Story />
        </div>
      </StoryProviders>
    ),
  ],
} satisfies Meta<typeof ProfilePage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const queryClient = createProfileClient();
    return (
      <QueryClientProvider client={queryClient}>
        <ProfilePage />
      </QueryClientProvider>
    );
  },
};

