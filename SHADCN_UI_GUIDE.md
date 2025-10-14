# shadcn/ui Guide

This project is now configured with [shadcn/ui](https://ui.shadcn.com/), a collection of beautifully designed, accessible, and customizable React components built on top of Tailwind CSS.

## 🚀 What's Installed

- **shadcn/ui** - Component library with New York style preset
- **Tailwind CSS v4** - Already configured and working
- **Lucide Icons** - Beautiful icon library
- **CSS Variables** - Built-in dark mode support
- **TypeScript** - Full type safety

## 📦 Installed Components

The following components are ready to use:

- `Button` - Various button styles and sizes
- `Card` - Content containers with header, content, and footer
- `Input` - Form input fields
- `Label` - Form labels with accessibility
- `Badge` - Status and category indicators

## 🎨 How to Use Components

### Basic Usage

```tsx
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function MyComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Card</CardTitle>
      </CardHeader>
      <CardContent>
        <Button>Click me</Button>
      </CardContent>
    </Card>
  )
}
```

### Button Variants

```tsx
<Button>Default</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
```

### Button Sizes

```tsx
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
```

### Form Elements

```tsx
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input id="email" type="email" placeholder="Enter your email" />
</div>
```

## 🎯 Adding More Components

To add more shadcn/ui components, use the CLI:

```bash
npx shadcn@latest add [component-name]
```

Popular components you might want to add:

```bash
# Navigation
npx shadcn@latest add navigation-menu
npx shadcn@latest add breadcrumb

# Forms
npx shadcn@latest add form
npx shadcn@latest add select
npx shadcn@latest add textarea
npx shadcn@latest add checkbox
npx shadcn@latest add radio-group

# Feedback
npx shadcn@latest add alert
npx shadcn@latest add toast
npx shadcn@latest add progress
npx shadcn@latest add skeleton

# Data Display
npx shadcn@latest add table
npx shadcn@latest add avatar
npx shadcn@latest add separator

# Overlays
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
npx shadcn@latest add popover
npx shadcn@latest add tooltip
```

## 🌙 Dark Mode

The project includes automatic dark mode support. Components will automatically adapt to your theme preferences.

To toggle dark mode programmatically:

```tsx
import { useTheme } from "next-themes"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  
  return (
    <Button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
      Toggle theme
    </Button>
  )
}
```

## 🎨 Customization

### Colors

The color scheme is defined in `src/app/globals.css` using CSS variables. You can customize:

- Primary colors
- Secondary colors
- Background colors
- Text colors
- Border colors

### Styling

All components use Tailwind CSS classes and can be customized by:

1. **Adding classes**: `<Button className="bg-blue-500 hover:bg-blue-600">`
2. **Using variants**: `<Button variant="custom">`
3. **Modifying the component**: Edit the component file in `src/components/ui/`

## 📁 File Structure

```
src/
├── components/
│   ├── ui/           # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   └── badge.tsx
│   └── ui-example.tsx # Example usage
├── lib/
│   └── utils.ts      # Utility functions (cn, etc.)
└── app/
    └── globals.css   # CSS variables and theme
```

## 🔧 Configuration

The shadcn/ui configuration is in `components.json`:

```json
{
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/app/globals.css",
    "baseColor": "slate",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui"
  }
}
```

## 🚀 Next Steps

1. **Explore the example**: Check out `src/components/ui-example.tsx` to see components in action
2. **Add more components**: Use `npx shadcn@latest add [component]` to add what you need
3. **Customize the theme**: Modify colors in `src/app/globals.css`
4. **Build your UI**: Start using components in your pages and components

## 📚 Resources

- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Component Examples](https://ui.shadcn.com/examples)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)

Happy building! 🎉
