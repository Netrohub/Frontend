import type { Meta, StoryObj } from "@storybook/react-vite";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const meta = {
  title: "Primitives/Card",
  component: Card,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-[hsl(210,30%,8%)] flex items-center justify-center">
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Package Delivery</CardTitle>
        <CardDescription>سجل التسليم والتحديثات في الوقت الحقيقي</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-white/70">
          اطلع على حالة الطلب، مدة المعالجة، وأي ملاحظات أمان مرتبطة بالشحنة.
        </p>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="ghost" size="sm">
          التفاصيل
        </Button>
        <Button variant="arctic" size="sm">
          متابعة الطلب
        </Button>
      </CardFooter>
    </Card>
  ),
};

