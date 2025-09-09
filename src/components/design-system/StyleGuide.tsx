import React from 'react'
import { 
  Button, 
  Card, CardContent, CardHeader, CardTitle,
  Input, 
  Textarea,
  Badge,
  Heading,
  Text,
  Container,
  Section,
  Grid,
  Flex,
  Stack
} from './index'

export function StyleGuide() {
  return (
    <div className="min-h-screen bg-white">
      <Section spacing="lg">
        <Container>
          <Stack spacing="xl">
            {/* Header */}
            <div className="text-center space-y-4">
              <Heading variant="hero" color="gradient">
                AI Workshop Design System
              </Heading>
              <Text variant="lead" align="center">
                Apple-inspired component library built with Tailwind CSS 4.1
              </Text>
            </div>

            {/* Typography Section */}
            <Card variant="apple">
              <CardHeader>
                <CardTitle>Typography</CardTitle>
              </CardHeader>
              <CardContent>
                <Stack spacing="lg">
                  <div>
                    <Text variant="caption">Headings</Text>
                    <Stack spacing="default">
                      <Heading variant="h1">Heading 1 - Hero Title</Heading>
                      <Heading variant="h2">Heading 2 - Section Title</Heading>
                      <Heading variant="h3">Heading 3 - Card Title</Heading>
                      <Heading variant="h4">Heading 4 - Component Title</Heading>
                      <Heading variant="h5">Heading 5 - Small Title</Heading>
                      <Heading variant="h6">Heading 6 - Micro Title</Heading>
                    </Stack>
                  </div>
                  
                  <div>
                    <Text variant="caption">Text Variants</Text>
                    <Stack spacing="default">
                      <Text variant="lead">Lead text - Perfect for introductions and important information</Text>
                      <Text variant="body">Body text - The standard text for most content and paragraphs</Text>
                      <Text variant="body-sm">Small body text - Useful for secondary information</Text>
                      <Text variant="small">Small text - For captions and fine print</Text>
                      <Text variant="muted">Muted text - For less important information</Text>
                    </Stack>
                  </div>
                </Stack>
              </CardContent>
            </Card>

            {/* Buttons Section */}
            <Card variant="apple">
              <CardHeader>
                <CardTitle>Buttons</CardTitle>
              </CardHeader>
              <CardContent>
                <Stack spacing="lg">
                  <div>
                    <Text variant="caption">Variants</Text>
                    <Flex wrap="wrap" gap="default">
                      <Button variant="default">Default</Button>
                      <Button variant="apple">Apple</Button>
                      <Button variant="apple-secondary">Apple Secondary</Button>
                      <Button variant="gradient">Gradient</Button>
                      <Button variant="glass">Glass</Button>
                      <Button variant="outline">Outline</Button>
                      <Button variant="secondary">Secondary</Button>
                      <Button variant="ghost">Ghost</Button>
                      <Button variant="destructive">Destructive</Button>
                    </Flex>
                  </div>
                  
                  <div>
                    <Text variant="caption">Sizes</Text>
                    <Flex wrap="wrap" gap="default" align="end">
                      <Button size="sm">Small</Button>
                      <Button size="default">Default</Button>
                      <Button size="lg">Large</Button>
                      <Button size="xl">Extra Large</Button>
                      <Button size="mobile">Mobile</Button>
                    </Flex>
                  </div>
                  
                  <div>
                    <Text variant="caption">States</Text>
                    <Flex wrap="wrap" gap="default">
                      <Button variant="apple">Normal</Button>
                      <Button variant="apple" loading>Loading</Button>
                      <Button variant="apple" disabled>Disabled</Button>
                    </Flex>
                  </div>
                </Stack>
              </CardContent>
            </Card>

            {/* Cards Section */}
            <Card variant="apple">
              <CardHeader>
                <CardTitle>Cards</CardTitle>
              </CardHeader>
              <CardContent>
                <Grid cols={3} gap="default">
                  <Card variant="default" padding="default">
                    <CardContent>
                      <Text>Default Card</Text>
                    </CardContent>
                  </Card>
                  
                  <Card variant="apple" padding="default">
                    <CardContent>
                      <Text>Apple Card with hover effects</Text>
                    </CardContent>
                  </Card>
                  
                  <Card variant="glass" padding="default">
                    <CardContent>
                      <Text>Glass Effect Card</Text>
                    </CardContent>
                  </Card>
                  
                  <Card variant="elevated" padding="default">
                    <CardContent>
                      <Text>Elevated Card</Text>
                    </CardContent>
                  </Card>
                  
                  <Card variant="outline" padding="default">
                    <CardContent>
                      <Text>Outline Card</Text>
                    </CardContent>
                  </Card>
                  
                  <Card variant="gradient" padding="default">
                    <CardContent>
                      <Text>Gradient Card</Text>
                    </CardContent>
                  </Card>
                </Grid>
              </CardContent>
            </Card>

            {/* Form Components */}
            <Card variant="apple">
              <CardHeader>
                <CardTitle>Form Components</CardTitle>
              </CardHeader>
              <CardContent>
                <Stack spacing="lg">
                  <div>
                    <Text variant="caption">Input Variants</Text>
                    <Stack spacing="default">
                      <Input 
                        variant="default" 
                        placeholder="Default input" 
                        label="Default Input"
                      />
                      <Input 
                        variant="apple" 
                        placeholder="Apple-style input" 
                        label="Apple Input"
                      />
                      <Input 
                        variant="outline" 
                        placeholder="Outline input" 
                        label="Outline Input"
                      />
                      <Input 
                        variant="ghost" 
                        placeholder="Ghost input" 
                        label="Ghost Input"
                      />
                    </Stack>
                  </div>
                  
                  <div>
                    <Text variant="caption">Input Sizes</Text>
                    <Stack spacing="default">
                      <Input inputSize="sm" placeholder="Small input" />
                      <Input inputSize="default" placeholder="Default input" />
                      <Input inputSize="lg" placeholder="Large input" />
                      <Input inputSize="xl" placeholder="Extra large input" />
                    </Stack>
                  </div>
                  
                  <div>
                    <Text variant="caption">Textarea</Text>
                    <Textarea 
                      variant="apple"
                      placeholder="Enter your message..."
                      label="Message"
                      helperText="This is a helper text"
                      maxLength={500}
                      showCharCount
                    />
                  </div>
                </Stack>
              </CardContent>
            </Card>

            {/* Badges */}
            <Card variant="apple">
              <CardHeader>
                <CardTitle>Badges</CardTitle>
              </CardHeader>
              <CardContent>
                <Stack spacing="lg">
                  <div>
                    <Text variant="caption">Variants</Text>
                    <Flex wrap="wrap" gap="default">
                      <Badge variant="default">Default</Badge>
                      <Badge variant="apple">Apple</Badge>
                      <Badge variant="apple-secondary">Apple Secondary</Badge>
                      <Badge variant="secondary">Secondary</Badge>
                      <Badge variant="destructive">Destructive</Badge>
                      <Badge variant="success">Success</Badge>
                      <Badge variant="warning">Warning</Badge>
                      <Badge variant="info">Info</Badge>
                      <Badge variant="gradient">Gradient</Badge>
                      <Badge variant="glass">Glass</Badge>
                      <Badge variant="outline">Outline</Badge>
                    </Flex>
                  </div>
                  
                  <div>
                    <Text variant="caption">Sizes</Text>
                    <Flex wrap="wrap" gap="default" align="center">
                      <Badge size="sm">Small</Badge>
                      <Badge size="default">Default</Badge>
                      <Badge size="lg">Large</Badge>
                      <Badge size="xl">Extra Large</Badge>
                    </Flex>
                  </div>
                </Stack>
              </CardContent>
            </Card>

            {/* Layout Components */}
            <Card variant="apple">
              <CardHeader>
                <CardTitle>Layout Components</CardTitle>
              </CardHeader>
              <CardContent>
                <Stack spacing="lg">
                  <div>
                    <Text variant="caption">Grid System</Text>
                    <Grid cols={4} gap="default">
                      {Array.from({ length: 8 }).map((_, i) => (
                        <Card key={i} variant="outline" padding="sm">
                          <CardContent>
                            <Text variant="small" align="center">Item {i + 1}</Text>
                          </CardContent>
                        </Card>
                      ))}
                    </Grid>
                  </div>
                  
                  <div>
                    <Text variant="caption">Flex Layout</Text>
                    <Flex justify="between" align="center" className="p-4 border border-gray-200 rounded-apple">
                      <Text>Left Content</Text>
                      <Badge variant="apple">Center Badge</Badge>
                      <Button size="sm">Right Button</Button>
                    </Flex>
                  </div>
                  
                  <div>
                    <Text variant="caption">Stack Layout</Text>
                    <Stack spacing="default" className="p-4 border border-gray-200 rounded-apple">
                      <Text>First item</Text>
                      <Text>Second item</Text>
                      <Text>Third item</Text>
                    </Stack>
                  </div>
                </Stack>
              </CardContent>
            </Card>

            {/* Color Palette */}
            <Card variant="apple">
              <CardHeader>
                <CardTitle>Color Palette</CardTitle>
              </CardHeader>
              <CardContent>
                <Stack spacing="lg">
                  <div>
                    <Text variant="caption">Brand Colors</Text>
                    <Grid cols={4} gap="default">
                      <div className="space-y-2">
                        <div className="h-16 bg-primary rounded-apple"></div>
                        <Text variant="small">Primary</Text>
                      </div>
                      <div className="space-y-2">
                        <div className="h-16 bg-gray-100 rounded-apple"></div>
                        <Text variant="small">Secondary</Text>
                      </div>
                      <div className="space-y-2">
                        <div className="h-16 bg-muted rounded-apple"></div>
                        <Text variant="small">Muted</Text>
                      </div>
                      <div className="space-y-2">
                        <div className="h-16 bg-accent rounded-apple"></div>
                        <Text variant="small">Accent</Text>
                      </div>
                    </Grid>
                  </div>
                  
                  <div>
                    <Text variant="caption">Status Colors</Text>
                    <Grid cols={4} gap="default">
                      <div className="space-y-2">
                        <div className="h-16 bg-success rounded-apple"></div>
                        <Text variant="small">Success</Text>
                      </div>
                      <div className="space-y-2">
                        <div className="h-16 bg-warning rounded-apple"></div>
                        <Text variant="small">Warning</Text>
                      </div>
                      <div className="space-y-2">
                        <div className="h-16 bg-error rounded-apple"></div>
                        <Text variant="small">Error</Text>
                      </div>
                      <div className="space-y-2">
                        <div className="h-16 bg-info rounded-apple"></div>
                        <Text variant="small">Info</Text>
                      </div>
                    </Grid>
                  </div>
                </Stack>
              </CardContent>
            </Card>

            {/* Usage Examples */}
            <Card variant="apple">
              <CardHeader>
                <CardTitle>Usage Examples</CardTitle>
              </CardHeader>
              <CardContent>
                <Stack spacing="lg">
                  <div>
                    <Text variant="caption">Import Components</Text>
                    <pre className="bg-muted p-4 rounded-apple-lg text-sm overflow-x-auto">
{`// Import from design system
import { 
  Button, 
  Card, 
  Input, 
  Heading, 
  Container,
  Section,
  Grid 
} from '@/components/design-system'

// Use in your components
<Section spacing="lg">
  <Container>
    <Grid cols={3} gap="lg">
      <Card variant="apple">
        <CardContent>
          <Heading variant="h3">Feature Title</Heading>
          <Text>Feature description</Text>
          <Button variant="apple">Learn More</Button>
        </CardContent>
      </Card>
    </Grid>
  </Container>
</Section>`}
                    </pre>
                  </div>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Container>
      </Section>
    </div>
  )
}
