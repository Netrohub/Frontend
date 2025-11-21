import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const meta = {
  title: "Primitives/Input",
  component: Input,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-[hsl(210,30%,8%)] flex items-center justify-center">
        <div className="w-full max-w-sm space-y-2">
          <Story />
        </div>
      </div>
    ),
  ],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="space-y-1">
      <Label>البريد الإلكتروني</Label>
      <Input placeholder="name@example.com" />
    </div>
  ),
};

export const Password: Story = {
  render: () => (
    <div className="space-y-1">
      <Label>كلمة المرور</Label>
      <Input type="password" placeholder="••••••••" />
    </div>
  ),
};

