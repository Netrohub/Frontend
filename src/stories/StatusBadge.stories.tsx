import type { Meta, StoryObj } from "@storybook/react-vite";
import { StatusBadge } from "@/components/StatusBadge";

const meta = {
  title: "Primitives/StatusBadge",
  component: StatusBadge,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="p-6 bg-[hsl(210,30%,8%)] flex flex-col gap-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof StatusBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllStatuses: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <StatusBadge status="success" label="موثق" />
      <StatusBadge status="pending" label="قيد المراجعة" />
      <StatusBadge status="warning" label="انتظار تصحيح" />
      <StatusBadge status="error" label="مرفوض" />
      <StatusBadge status="info" label="معلومات" />
    </div>
  ),
};

