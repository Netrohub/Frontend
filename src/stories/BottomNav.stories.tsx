import type { Meta, StoryObj } from "@storybook/react-vite";
import { BottomNav } from "@/components/BottomNav";
import { StoryProviders } from "./storyProviders";
import type { User } from "@/types/api";

const mockUser: User = {
  id: 2,
  name: "NXO Mobile",
  email: "mobile@nxoland.com",
  role: "user",
  is_verified: true,
  created_at: "2024-02-01T00:00:00Z",
  updated_at: "2024-02-01T00:00:00Z",
};

const meta = {
  title: "Navigation/BottomNav",
  component: BottomNav,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof BottomNav>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LoggedOut: Story = {
  render: () => (
    <StoryProviders user={null} path="/">
      <BottomNav />
    </StoryProviders>
  ),
};

export const LoggedIn: Story = {
  render: () => (
    <StoryProviders user={mockUser} path="/wallet">
      <BottomNav />
    </StoryProviders>
  ),
};

