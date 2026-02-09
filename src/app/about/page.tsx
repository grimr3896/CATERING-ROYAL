'use client';

import * as React from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChefHat,
  Heart,
  Star,
  Loader2,
  Mail,
  Phone,
  Facebook,
  Instagram,
  Twitter,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { submitContactForm } from './actions';
import { useSiteContent } from '@/context/SiteContentContext';
import type { SocialLink } from '@/lib/definitions';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Invalid email address.'),
  subject: z.string().min(3, 'Subject must be at least 3 characters.'),
  message: z.string().min(10, 'Message must be at least 10 characters.'),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const socialIcons: Record<string, React.ElementType> = {
    facebook: Facebook,
    instagram: Instagram,
    twitter: Twitter,
}

export default function AboutPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const { aboutUsImageUrl, teamMembers, socialLinks } = useSiteContent();
  const aboutUsImagePlaceholder = PlaceHolderImages.find(
    (img) => img.id === 'about-us-image'
  );

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  });

  async function onSubmit(data: ContactFormValues) {
    setIsSubmitting(true);
    const result = await submitContactForm(data);
    setIsSubmitting(false);

    if (result.success) {
      toast({
        title: 'Message Sent!',
        description: result.message,
      });
      form.reset();
    } else {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: result.error,
      });
    }
  }

  return (
    <div className="bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-headline font-bold">
            About SAVIE ROYAL
          </h1>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
            Passion for Food, Dedication to Service.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="order-2 md:order-1">
            <h2 className="text-3xl font-headline font-semibold">Our Story</h2>
            <p className="mt-4 text-muted-foreground">
              SAVIE ROYAL was born from a simple idea: to bring restaurant-quality culinary experiences to private events. What started as a small operation out of a home kitchen has grown into one of the city's most beloved catering companies, known for our creative menus, attention to detail, and unwavering commitment to our clients. We believe that food is more than just sustenance; it's a way to connect, celebrate, and create lasting memories. That philosophy is at the heart of everything we do.
            </p>
          </div>
          <div className="order-1 md:order-2">
            {aboutUsImageUrl && aboutUsImagePlaceholder && (
              <div className="rounded-lg overflow-hidden shadow-lg">
                <Image
                  src={aboutUsImageUrl}
                  alt={aboutUsImagePlaceholder.description}
                  data-ai-hint={aboutUsImagePlaceholder.imageHint}
                  width={800}
                  height={600}
                  className="object-cover"
                />
              </div>
            )}
          </div>
        </div>

        <div className="mt-24">
          <h2 className="text-3xl font-headline font-semibold text-center">
            Our Philosophy
          </h2>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <Card>
              <CardHeader>
                <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
                  <Star className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="font-headline mt-4">
                  Quality Ingredients
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We source the freshest, locally-sourced ingredients to create
                  dishes that are vibrant and delicious.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
                  <Heart className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="font-headline mt-4">
                  Impeccable Service
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Our professional team is dedicated to providing a seamless
                  and stress-free experience for you and your guests.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
                  <ChefHat className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="font-headline mt-4">
                  Culinary Creativity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We love pushing boundaries and creating innovative menus that
                  surprise and delight the senses.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-24">
          <h2 className="text-3xl font-headline font-semibold text-center">
            Meet the Team
          </h2>
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {teamMembers.filter(m => m.is_active).sort((a,b) => a.display_order - b.display_order).map((member) => (
              <Card key={member.id} className="text-center">
                <CardContent className="p-6">
                  <div className="w-32 h-32 rounded-full mx-auto overflow-hidden">
                    <Image
                      src={
                        member.photo_url ||
                        `https://picsum.photos/seed/${member.id}/200/200`
                      }
                      alt={member.name}
                      data-ai-hint="portrait person"
                      width={200}
                      height={200}
                      className="object-cover"
                    />
                  </div>
                  <h3 className="mt-4 text-xl font-semibold font-headline">
                    {member.name}
                  </h3>
                  <p className="text-primary">{member.role}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <div id="contact" className="container mx-auto px-4 pb-16 md:pb-24">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-headline font-bold">
            Get In Touch
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Have a question or a special request? We'd love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-16">
          <div className="md:col-span-2">
            <h3 className="text-2xl font-headline font-semibold mb-6">
              Send us a message
            </h3>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="john.doe@example.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Inquiry about wedding catering"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="I would like to know more about..."
                          className="resize-none h-32"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  size="lg"
                  className="w-full md:w-auto"
                  disabled={isSubmitting}
                >
                  {isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Submit Message
                </Button>
              </form>
            </Form>
          </div>
          <div className="space-y-6">
            <h3 className="text-2xl font-headline font-semibold">
              Contact Information
            </h3>
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Email</h4>
                    <a
                      href="mailto:savieroyal1@gmail.com"
                      className="text-muted-foreground hover:text-primary"
                    >
                      savieroyal1@gmail.com
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Phone</h4>
                    <a
                      href="tel:0718469682"
                      className="text-muted-foreground hover:text-primary"
                    >
                      0718 469 682
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">WhatsApp</h4>
                    <a
                      href="https://wa.me/254711665382"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary"
                    >
                      0711 665 382
                    </a>
                  </div>
                </div>
                {socialLinks.filter(l => l.is_active).sort((a, b) => a.display_order - b.display_order).map(link => {
                  const Icon = socialIcons[link.platform];
                  if (!Icon) return null;
                  return (
                    <div className="flex items-start gap-4" key={link.platform}>
                      <div className="bg-primary/10 p-3 rounded-full">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold capitalize">{link.platform}</h4>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-primary"
                        >
                          Follow on {link.platform}
                        </a>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
