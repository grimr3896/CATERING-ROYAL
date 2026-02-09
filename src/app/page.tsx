'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import type { StaticImageData } from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowRight, Quote, Star, Search, UtensilsCrossed } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  PlaceHolderImages,
  type ImagePlaceholder,
} from '@/lib/placeholder-images';
import { useSiteContent } from '@/context/SiteContentContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Home() {
  const { services, galleryImages, testimonials, heroImageUrl } =
    useSiteContent();
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const [isControllerModalOpen, setIsControllerModalOpen] = useState(false);
  const [controllerCode, setControllerCode] = useState('');
  const [codeError, setCodeError] = useState('');

  const CONTROLLER_ACCESS_CODE = '739482615904';
  const CONTROLLER_PIN_CODE = '1994';

  useEffect(() => {
    if (searchQuery === CONTROLLER_ACCESS_CODE) {
      setIsControllerModalOpen(true);
    }
  }, [searchQuery]);

  const handleControllerAccess = () => {
    if (controllerCode === CONTROLLER_PIN_CODE) {
      setCodeError('');
      setIsControllerModalOpen(false);
      setSearchQuery('');
      setControllerCode('');
      router.push('/controller');
    } else {
      setCodeError('Incorrect code. Please try again.');
    }
  };

  const galleryPreviewImages = galleryImages.filter(g => g.is_active && g.is_featured).sort((a,b) => a.display_order - b.display_order).slice(0, 4);

  const heroImagePlaceholder = PlaceHolderImages.find(
    (p) => p.id === 'hero-image'
  );

  const filteredServices = services.filter(
    (service) =>
      service.is_active &&
      (service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.short_description.toLowerCase().includes(searchQuery.toLowerCase()))
  ).sort((a,b) => a.display_order - b.display_order);

  return (
    <div className="flex flex-col">
      <section className="relative h-[60vh] md:h-[80vh] w-full flex flex-col items-center justify-center text-center text-primary-foreground p-4 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={heroImageUrl}
            alt={heroImagePlaceholder?.description || 'Catering event'}
            fill
            className="object-cover"
            data-ai-hint={heroImagePlaceholder?.imageHint}
            priority
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative z-10">
          <h1
            className="text-4xl md:text-6xl lg:text-7xl font-headline font-bold animate-fade-in-up drop-shadow-lg"
            style={{ animationDelay: '0.2s', opacity: 0 }}
          >
            Exceptional Catering. Crafted Live.
          </h1>
          <p
            className="mt-4 max-w-2xl text-lg md:text-xl animate-fade-in-up"
            style={{ animationDelay: '0.4s', opacity: 0 }}
          >
            Weddings • Corporate • Private Dining
          </p>
          <div
            className="animate-fade-in-up"
            style={{ animationDelay: '0.6s', opacity: 0 }}
          >
            <Button asChild size="lg" className="mt-8">
              <Link href="/booking">
                Book an Event <ArrowRight />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section id="services" className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-headline font-semibold">
              Our Catering Services
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Whatever the occasion, SAVIE ROYAL provides exceptional food and
              impeccable service. Explore our offerings to find the perfect fit
              for your event.
            </p>
          </div>

          <div className="mt-12 max-w-lg mx-auto relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search services (e.g., wedding, corporate...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 text-base h-12"
            />
          </div>

          {filteredServices.length > 0 ? (
            <div className="mt-16">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredServices.map((service) => {
                  const imageSrc = service.image_url;

                  return (
                    <Card
                      key={service.id}
                      className="flex flex-col overflow-hidden hover:shadow-xl transition-shadow duration-300"
                    >
                      {imageSrc && (
                        <div className="relative h-48 w-full">
                          <Image
                            src={imageSrc}
                            alt={service.title}
                            data-ai-hint={'custom image'}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <CardHeader className="items-center text-center">
                        <div className="bg-primary/10 p-4 rounded-full -mt-12 bg-card z-10 border">
                          <UtensilsCrossed className="w-10 h-10 text-primary" />
                        </div>
                        <CardTitle className="font-headline mt-4 text-2xl">
                          {service.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="flex-grow text-center">
                        <CardDescription>
                          {service.short_description}
                        </CardDescription>
                      </CardContent>
                      <CardFooter className="flex flex-col gap-4 pt-4">
                        <p className="text-sm text-muted-foreground">
                          Starting from {service.currency} {service.price}
                        </p>
                        <Button asChild className="w-full">
                          <Link href="/about#contact">Inquire Now</Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-lg text-muted-foreground">
                No services found for "{searchQuery}". Try a different search.
              </p>
            </div>
          )}
        </div>
      </section>

      <section id="gallery" className="py-16 md:py-24 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-headline font-semibold">
              From Our Events
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              A glimpse into the beautiful moments and delectable spreads we've
              had the pleasure of creating.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4">
            {galleryPreviewImages.map((img, index) => (
              <div
                key={img.id}
                className="relative aspect-square rounded-lg overflow-hidden group"
              >
                <Image
                  src={img.image_url}
                  alt={img.caption}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Button asChild>
              <Link href="/gallery">
                View Full Gallery <ArrowRight />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section id="testimonials" className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-headline font-semibold">
              What Our Clients Say
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              We're honored to have been a part of so many special occasions.
            </p>
          </div>
          <Carousel
            opts={{
              align: 'start',
              loop: true,
            }}
            className="w-full max-w-4xl mx-auto mt-12"
          >
            <CarouselContent>
              {testimonials.filter(t => t.is_active && t.is_featured).map((testimonial) => (
                <CarouselItem key={testimonial.id}>
                  <Card className="border-none shadow-none bg-transparent">
                    <CardContent className="flex flex-col items-center text-center p-6">
                      <Quote className="w-8 h-8 text-primary" />
                      <p className="mt-4 text-lg md:text-xl italic">
                        "{testimonial.quote}"
                      </p>
                      <div className="flex mt-4">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 transition-colors ${
                              i < testimonial.rating
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-muted-foreground/50'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="mt-2 font-semibold">{testimonial.client_name}</p>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </section>
      <Dialog
        open={isControllerModalOpen}
        onOpenChange={(isOpen) => {
          setIsControllerModalOpen(isOpen);
          if (!isOpen) {
            setSearchQuery('');
            setControllerCode('');
            setCodeError('');
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Access Controller</DialogTitle>
            <DialogDescription>
              Please enter the PIN code to access the content controller.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="code" className="text-right">
                PIN
              </Label>
              <Input
                id="code"
                type="password"
                value={controllerCode}
                onChange={(e) => setControllerCode(e.target.value)}
                className="col-span-3"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleControllerAccess();
                  }
                }}
              />
            </div>
            {codeError && (
              <p className="text-sm font-medium text-destructive text-center">
                {codeError}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button onClick={handleControllerAccess}>Unlock</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
