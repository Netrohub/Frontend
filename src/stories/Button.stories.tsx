import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "@/components/ui/button";

const meta = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: { type: "select" },
      options: [
        "default",
        "secondary",
        "destructive",
        "outline",
        "ghost",
        "link",
        "arctic",
        "arctic-ghost",
        "danger",
      ],
    },
    size: {
      control: { type: "inline-radio" },
      options: ["sm", "default", "lg", "icon"],
    },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: "2rem", background: "#0f172a", borderRadius: 12 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: "arctic",
    size: "default",
    children: "Primary Button",
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    size: "default",
    children: "Secondary Button",
  },
};

export const Destructive: Story = {
  args: {
    variant: "destructive",
    children: "Delete",
  },
};

export const Small: Story = {
  args: {
    variant: "arctic-ghost",
    size: "sm",
    children: "Small Button",
  },
};

export const Large: Story = {
  args: {
    variant: "outline",
    size: "lg",
    children: "Large Outline",
  },
};

