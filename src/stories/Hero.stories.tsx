import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "@/components/ui/button";

const meta = {
  title: "Design/HeroSection",
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const HeroTemplate = () => (
  <div className="min-h-screen bg-gradient-to-b from-[hsl(200,70%,15%)] via-[hsl(195,60%,25%)] to-[hsl(200,70%,15%)] px-6 py-16">
    <div className="max-w-5xl mx-auto text-white space-y-10">
      <div className="flex flex-col gap-3">
        <p className="text-sm uppercase tracking-[0.4em] text-white/50">أفضل منصة رقمية</p>
        <h1 className="text-4xl md:text-6xl font-black leading-tight">
          اكتشف أكبر سوق للمنتجات الرقمية مع نظام ضمان متكامل
        </h1>
        <p className="text-lg text-white/70 max-w-2xl">
          نربط المشترين والبائعين مع حماية مالية متقدمة، دعم مباشر، وخيارات سحب مريحة
          لضمان تجربة تداول متميزة وآمنة.
        </p>
      </div>
      <div className="flex flex-wrap gap-4">
        <Button variant="arctic" size="lg">
          ابدأ التداول الآن
        </Button>
        <Button variant="arctic-ghost" size="lg">
          خدماتنا
        </Button>
      </div>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {[
          "TikTok",
          "Instagram",
          "Discord",
          "YouTube",
          "Snapchat",
          "Twitter",
        ].map((label) => (
          <div
            key={label}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/70 text-center"
          >
            {label}
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const LandingHero: Story = {
  render: () => <HeroTemplate />,
};

