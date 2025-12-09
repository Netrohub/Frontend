import type { Meta, StoryObj } from "@storybook/react-vite";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AdminWithdrawals } from "@/pages/admin/Withdrawals";
import { StoryProviders } from "./storyProviders";
import type { User } from "@/types/api";

const adminUser: User = {
  id: 101,
  name: "NXO Admin",
  email: "admin@nxoland.com",
  role: "admin",
  is_verified: true,
  created_at: "2024-02-01T00:00:00Z",
  updated_at: "2024-11-02T00:00:00Z",
};

const createAdminClient = () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  queryClient.setQueryData(["admin-withdrawals", "", ""], {
    data: [
      {
        id: 1,
        user_id: 55,
        amount: 1200,
        iban: "SA0310000000000000000000",
        bank_name: "Al Rajhi",
        account_holder_name: "Ali Tester",
        status: "pending",
        created_at: "2025-11-02T11:00:00Z",
        user: { id: 55, name: "Ali Tester", email: "ali@test.com" },
      },
      {
        id: 2,
        user_id: 72,
        amount: 450,
        bank_name: "SABB",
        account_holder_name: "Noura Saleh",
        status: "processing",
        created_at: "2025-10-30T19:40:00Z",
        user: { id: 72, name: "Noura Saleh", email: "noura@test.com" },
      },
      {
        id: 3,
        user_id: 60,
        amount: 330,
        bank_name: "Riyad Bank",
        account_holder_name: "Saad Abdullah",
        status: "completed",
        created_at: "2025-10-22T14:10:00Z",
        user: { id: 60, name: "Saad Abdullah", email: "saad@test.com" },
      },
    ],
  });
  return queryClient;
};

const meta: Meta<typeof AdminWithdrawals> = {
  title: "Pages/Admin/Withdrawals",
  component: AdminWithdrawals,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <StoryProviders user={adminUser} path="/admin/withdrawals">
        <div className="min-h-screen bg-gradient-to-b from-[hsl(200,70%,15%)] via-[hsl(195,60%,25%)] to-[hsl(200,70%,15%)]">
          <Story />
        </div>
      </StoryProviders>
    ),
  ],
} satisfies Meta<typeof AdminWithdrawals>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const queryClient = createAdminClient();
    return (
      <QueryClientProvider client={queryClient}>
        <AdminWithdrawals />
      </QueryClientProvider>
    );
  },
};

