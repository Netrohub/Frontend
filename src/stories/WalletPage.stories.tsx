import type { Meta, StoryObj } from "@storybook/react-vite";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Wallet as WalletPage } from "@/pages/Wallet";
import { StoryProviders } from "./storyProviders";

const mockUser = {
  id: 99,
  name: "Wallet Tester",
  email: "wallet@nxoland.com",
  role: "user",
  is_verified: true,
  created_at: "2024-05-01T00:00:00Z",
  updated_at: "2024-05-01T00:00:00Z",
};

const createWalletClient = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  queryClient.setQueryData(["wallet"], {
    available_balance: 1245.12,
    on_hold_balance: 430.0,
    withdrawn_total: 1900.5,
  });
  queryClient.setQueryData(["withdrawals"], [
    {
      id: "w1",
      amount: 300,
      status: "pending",
      created_at: "2025-11-01T10:00:00Z",
      fee_amount: 15,
      net_amount: 285,
      fee_percentage: 5,
    },
    {
      id: "w2",
      amount: 520,
      status: "completed",
      created_at: "2025-10-20T14:30:00Z",
      fee_amount: 26,
      net_amount: 494,
      fee_percentage: 5,
    },
  ]);
  queryClient.setQueryData(["withdrawal-fee-info"], {
    fee_percentage: 5,
    min_withdrawal: 10,
    max_withdrawal: 2000,
  });
  return queryClient;
};

const meta: Meta<typeof WalletPage> = {
  title: "Pages/Wallet",
  component: WalletPage,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <StoryProviders user={mockUser} path="/wallet">
        <div className="min-h-screen bg-gradient-to-b from-[hsl(200,70%,15%)] via-[hsl(195,60%,25%)] to-[hsl(200,70%,15%)]">
          <Story />
        </div>
      </StoryProviders>
    ),
  ],
} satisfies Meta<typeof WalletPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const queryClient = createWalletClient();
    return (
      <QueryClientProvider client={queryClient}>
        <WalletPage />
      </QueryClientProvider>
    );
  },
};

