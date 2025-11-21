import type { Meta, StoryObj } from "@storybook/react-vite";
import { QuickNav } from "@/components/QuickNav";
import { StoryProviders } from "./storyProviders";
import type { User } from "@/types/api";

const mockUser: User = {
  id: 42,
  name: "Quick Tester",
  email: "quick@nxoland.com",
  role: "user",
  is_verified: true,
  created_at: "2024-01-01T00:00:00Z",
  updated_at: "2024-01-01T00:00:00Z",
};

const meta = {
  title: "Content/QuickNav",
  component: QuickNav,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof QuickNav>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Guest: Story = {
  render: () => (
    <StoryProviders user={null} path="/">
      <div className="min-h-screen bg-[hsl(210,30%,8%)]">
        <QuickNav />
      </div>
    </StoryProviders>
  ),
};

export const LoggedIn: Story = {
  render: () => (
    <StoryProviders user={mockUser} path="/wallet">
      <div className="min-h-screen bg-[hsl(210,30%,8%)]">
        <QuickNav />
      </div>
    </StoryProviders>
  ),
};

