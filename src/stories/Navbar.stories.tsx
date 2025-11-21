import type { Meta, StoryObj } from "@storybook/react-vite";
import { Navbar } from "@/components/Navbar";
import { StoryProviders } from "./storyProviders";
import type { User } from "@/types/api";

const mockUser: User = {
  id: 1,
  name: "NXO Tester",
  email: "tester@nxoland.com",
  role: "user",
  is_verified: true,
  created_at: "2024-01-01T00:00:00Z",
  updated_at: "2024-01-01T00:00:00Z",
};

const meta = {
  title: "Navigation/Navbar",
  component: Navbar,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-[hsl(200,70%,15%)] flex flex-col">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Navbar>;

export default meta;
type Story = StoryObj<typeof meta>;

const Template = ({ user, path }: { user: User | null; path: string }) => (
  <StoryProviders user={user} path={path}>
    <Navbar />
  </StoryProviders>
);

export const LoggedOut: Story = {
  render: () => Template({ user: null, path: "/" }),
};

export const LoggedIn: Story = {
  render: () => Template({ user: mockUser, path: "/marketplace" }),
};

