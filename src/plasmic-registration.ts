/**
 * Plasmic Component Registration
 * 
 * This file registers your existing React components so they can be used
 * in Plasmic Studio. This allows you to recreate and edit your current
 * design visually in Plasmic.
 */

import { registerComponent } from "@plasmicapp/react-web/lib/host";

// Import your components
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

// Register Button component
registerComponent(Button, {
  name: "Button",
  displayName: "Button",
  props: {
    variant: {
      type: 'choice',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
      defaultValue: 'default',
      description: 'Button style variant',
    },
    size: {
      type: 'choice',
      options: ['default', 'sm', 'lg', 'icon'],
      defaultValue: 'default',
      description: 'Button size',
    },
    children: {
      type: 'slot',
      defaultValue: 'Button',
    },
    disabled: {
      type: 'boolean',
      defaultValue: false,
      description: 'Disable the button',
    },
    asChild: {
      type: 'boolean',
      defaultValue: false,
      description: 'Render as child component',
      advanced: true,
    },
  },
  importPath: "./components/ui/button",
  defaultStyles: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

// Register Card component
registerComponent(Card, {
  name: "Card",
  displayName: "Card",
  props: {
    children: {
      type: 'slot',
      defaultValue: [
        {
          type: 'component',
          name: 'CardHeader',
          props: {
            children: [
              {
                type: 'component',
                name: 'CardTitle',
                props: {
                  children: {
                    type: 'text',
                    value: 'Card Title',
                  },
                },
              },
            ],
          },
        },
        {
          type: 'component',
          name: 'CardContent',
          props: {
            children: {
              type: 'text',
              value: 'Card content goes here.',
            },
          },
        },
      ],
    },
  },
  importPath: "./components/ui/card",
});

// Register Card sub-components
registerComponent(CardHeader, {
  name: "CardHeader",
  displayName: "Card Header",
  props: {
    children: 'slot',
  },
  importPath: "./components/ui/card",
});

registerComponent(CardTitle, {
  name: "CardTitle",
  displayName: "Card Title",
  props: {
    children: 'slot',
  },
  importPath: "./components/ui/card",
});

registerComponent(CardDescription, {
  name: "CardDescription",
  displayName: "Card Description",
  props: {
    children: 'slot',
  },
  importPath: "./components/ui/card",
});

registerComponent(CardContent, {
  name: "CardContent",
  displayName: "Card Content",
  props: {
    children: 'slot',
  },
  importPath: "./components/ui/card",
});

registerComponent(CardFooter, {
  name: "CardFooter",
  displayName: "Card Footer",
  props: {
    children: 'slot',
  },
  importPath: "./components/ui/card",
});

