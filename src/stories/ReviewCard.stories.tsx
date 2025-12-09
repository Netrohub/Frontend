import type { Meta, StoryObj } from "@storybook/react-vite";
import { ReviewCard } from "@/components/ReviewCard";
import { LanguageProvider } from "@/contexts/LanguageContext";

const reviewData = {
  id: "review-1",
  rating: 5,
  comment:
    "أفضل منصة جربتها. البائع محترف، والعملية كانت سلسة من البداية للنهاية. أوصي بها بشدة لأي شخص يبحث عن حسابات آمنة.",
  created_at: "2025-11-01T09:32:00Z",
  reviewer: {
    name: "NXO Team",
    verified: true,
  },
  order_id: "ORD-1324",
  helpful_count: 42,
  user_found_helpful: true,
};

const meta = {
  title: "Components/ReviewCard",
  component: ReviewCard,
  decorators: [
    (Story) => (
      <div className="p-6 bg-[hsl(210,30%,8%)] min-h-[100vh]">
        <LanguageProvider>{Story()}</LanguageProvider>
      </div>
    ),
  ],
  parameters: {
    layout: "centered",
    backgrounds: { default: "dark" },
  },
} satisfies Meta<typeof ReviewCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    review: reviewData,
  },
};

export const OwnReview: Story = {
  args: {
    review: { ...reviewData, reviewer: { ...reviewData.reviewer, name: "المستخدم" } },
    isOwnReview: true,
  },
};

