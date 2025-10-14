import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { TradeButton } from "@/components/ui/trade-button"

export function UIExample() {
  return (
    <div className="p-8 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">shadcn/ui Components</h1>
        <p className="text-muted-foreground">
          Example of how to use shadcn/ui components in your project
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Trade Buttons */}
        <Card>
          <CardHeader>
            <CardTitle>Trade Buttons</CardTitle>
            <CardDescription>Futuristic angular design buttons</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-4 justify-center">
              <TradeButton 
                label="BUY" 
                color="#00ff99" 
                side="left" 
              />
              <TradeButton 
                label="SELL" 
                color="#ff4d4d" 
                side="right" 
              />
            </div>
            <div className="text-center text-sm text-muted-foreground">
              <p>Customizable colors and angular cuts on left or right side</p>
              <a 
                href="/trade-buttons" 
                className="text-primary hover:underline mt-2 inline-block"
              >
                View Full Demo →
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Button Examples */}
        <Card>
          <CardHeader>
            <CardTitle>Standard Buttons</CardTitle>
            <CardDescription>Different button variants and sizes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Button>Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button size="sm">Small</Button>
              <Button size="default">Default</Button>
              <Button size="lg">Large</Button>
            </div>
          </CardContent>
        </Card>

        {/* Form Example */}
        <Card>
          <CardHeader>
            <CardTitle>Form Elements</CardTitle>
            <CardDescription>Input fields with labels</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="Enter your email" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="Enter your password" />
            </div>
            <Button className="w-full">Submit</Button>
          </CardContent>
        </Card>

        {/* Badge Examples */}
        <Card>
          <CardHeader>
            <CardTitle>Badges</CardTitle>
            <CardDescription>Status and category indicators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="destructive">Destructive</Badge>
              <Badge variant="outline">Outline</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Theme Info */}
        <Card>
          <CardHeader>
            <CardTitle>Theme Support</CardTitle>
            <CardDescription>Built-in dark mode support</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              This project includes automatic dark mode support. The components will
              automatically adapt to your theme preferences.
            </p>
            <div className="mt-4">
              <Badge variant="outline">Light Mode</Badge>
              <Badge variant="outline" className="ml-2">Dark Mode</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
