import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "@/components/ui/badge";

const meta = {
  title: "Primitives/Badge",
  component: Badge,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="p-6 bg-[hsl(210,30%,8%)] min-h-[200px] flex items-center justify-center gap-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      {["default", "secondary", "destructive", "outline"].map((variant) => (
        <Badge key={variant} variant={variant as any}>
          {variant}
        </Badge>
      ))}
    </div>
  ),
};

