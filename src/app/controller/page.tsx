'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Upload,
  Edit,
  Trash2,
  PlusCircle,
  UtensilsCrossed,
  Star,
  Facebook,
  Instagram,
  Twitter,
} from 'lucide-react';
import Image from 'next/image';
import {
  PlaceHolderImages,
  type ImagePlaceholder,
} from '@/lib/placeholder-images';
import type {
  Service,
  Testimonial,
  GalleryImage,
  TeamMember,
  SocialLinks,
  SocialLink,
} from '@/lib/definitions';
import { useToast } from '@/hooks/use-toast';
import { useSiteContent } from '@/context/SiteContentContext';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/lib/supabase';

const uploadImageToSupabase = async (file: File, folder: string): Promise<string | null> => {
  try {
    if (!supabase) {
      console.warn('Supabase client not configured');
      return null;
    }

    // Generate a unique filename
    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    const filePath = `${folder}/${fileName}`;

    // Upload the file to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('public-assets')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Error uploading image:', uploadError);
      return null;
    }

    // Get the public URL
    const { data: publicUrlData } = supabase.storage
      .from('public-assets')
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    return null;
  }
};

const ImageUploader = ({
  onFileChange,
}: {
  onFileChange: (file: File) => void;
}) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = React.useState(false);

  const handleFileSelect = (file: File) => {
    onFileChange(file);
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center text-center text-muted-foreground h-48 cursor-pointer transition-colors ${
        dragging
          ? 'border-primary bg-primary/10'
          : 'border-muted-foreground/50 hover:border-primary hover:bg-primary/5'
      }`}
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        ref={inputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />
      <Upload className="w-8 h-8 mb-2" />
      <p>Click to upload or drag and drop</p>
    </div>
  );
};

const getImageUrlFromService = (
  service: Service | null | undefined
): string | null => {
  if (!service) return null;
  return service.image_url || null;
};

const ServiceEditDialog = ({
  open,
  onOpenChange,
  service,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: Service | null | undefined;
  onSave: (serviceData: Partial<Service>) => void;
}) => {
  const [title, setTitle] = React.useState('');
  const [shortDescription, setShortDescription] = React.useState('');
  const [price, setPrice] = React.useState(0);
  const [displayOrder, setDisplayOrder] = React.useState(0);
  const [isActive, setIsActive] = React.useState(true);
  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (service) {
      setTitle(service.title);
      setShortDescription(service.short_description);
      setPrice(service.price);
      setDisplayOrder(service.display_order);
      setIsActive(service.is_active);
      setImagePreview(getImageUrlFromService(service));
    } else {
      setTitle('');
      setShortDescription('');
      setPrice(0);
      setDisplayOrder(0);
      setIsActive(true);
      setImagePreview(null);
    }
    setImageFile(null); // Reset file on open
  }, [service, open]);

  React.useEffect(() => {
    if (imageFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(imageFile);
    }
  }, [imageFile]);

  const handleSaveClick = () => {
    const saveData: Partial<Service> = { 
        title, 
        short_description: shortDescription, 
        price: Number(price),
        display_order: Number(displayOrder),
        is_active: isActive
    };

    const initialImageUrl = getImageUrlFromService(service);

    if (imagePreview && imagePreview !== initialImageUrl) {
      saveData.image_url = imagePreview;
    }

    onSave(saveData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {service ? 'Edit Service' : 'Add New Service'}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-4">
          <div className="space-y-2">
            <Label htmlFor="service-title">Title</Label>
            <Input
              id="service-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Wedding Catering"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="service-description">Short Description</Label>
            <Textarea
              id="service-description"
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="Describe the service..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="service-price">Starting Price ({service?.currency || 'Ksh'})</Label>
              <Input
                id="service-price"
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                placeholder="e.g., 1000"
              />
            </div>
             <div className="space-y-2">
              <Label htmlFor="service-display-order">Display Order</Label>
              <Input
                id="service-display-order"
                type="number"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(Number(e.target.value))}
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="service-active" checked={isActive} onCheckedChange={setIsActive} />
            <Label htmlFor="service-active">Service is Active</Label>
          </div>
          <div className="space-y-2">
            <Label>Image</Label>
            {imagePreview && (
              <div className="my-2 rounded-lg overflow-hidden relative aspect-video">
                <Image
                  src={imagePreview}
                  alt="Image preview"
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <ImageUploader onFileChange={setImageFile} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSaveClick}>Save Service</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const GalleryEditDialog = ({
  open,
  onOpenChange,
  image,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  image: GalleryImage | null | undefined;
  onSave: (imageData: Partial<GalleryImage>) => void;
}) => {
  const [caption, setCaption] = React.useState('');
  const [eventType, setEventType] = React.useState<GalleryImage['event_type']>('other');
  const [displayOrder, setDisplayOrder] = React.useState(0);
  const [isFeatured, setIsFeatured] = React.useState(false);
  const [isActive, setIsActive] = React.useState(true);
  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (image) {
      setCaption(image.caption);
      setImagePreview(image.image_url);
      setEventType(image.event_type);
      setDisplayOrder(image.display_order);
      setIsFeatured(image.is_featured);
      setIsActive(image.is_active);
    } else {
      setCaption('');
      setEventType('other');
      setDisplayOrder(0);
      setIsFeatured(false);
      setIsActive(true);
      setImagePreview(null);
    }
    setImageFile(null); // Reset file on open
  }, [image, open]);

  React.useEffect(() => {
    if (imageFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(imageFile);
    }
  }, [imageFile]);

  const handleSaveClick = () => {
    const saveData: Partial<GalleryImage> = { 
        caption, 
        event_type: eventType, 
        display_order: Number(displayOrder), 
        is_featured: isFeatured,
        is_active: isActive 
    };
    if (imagePreview && imagePreview !== image?.image_url) {
      saveData.image_url = imagePreview;
    }
    onSave(saveData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {image ? 'Edit Gallery Image' : 'Add Gallery Image'}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="gallery-alt">Image Caption</Label>
            <Input
              id="gallery-alt"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="e.g., A beautiful summer wedding"
            />
          </div>
          <div className='grid grid-cols-2 gap-4'>
            <div className="space-y-2">
                <Label htmlFor="gallery-event-type">Event Type</Label>
                <Select value={eventType} onValueChange={(v) => setEventType(v as GalleryImage['event_type'])}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="wedding">Wedding</SelectItem>
                        <SelectItem value="corporate">Corporate</SelectItem>
                        <SelectItem value="private-party">Private Party</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                </Select>
            </div>
             <div className="space-y-2">
              <Label htmlFor="gallery-display-order">Display Order</Label>
              <Input
                id="gallery-display-order"
                type="number"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(Number(e.target.value))}
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="gallery-featured" checked={isFeatured} onCheckedChange={setIsFeatured} />
            <Label htmlFor="gallery-featured">Featured Image</Label>
          </div>
           <div className="flex items-center space-x-2">
            <Switch id="gallery-active" checked={isActive} onCheckedChange={setIsActive} />
            <Label htmlFor="gallery-active">Image is Active</Label>
          </div>
          <div className="space-y-2">
            <Label>Image</Label>
            {imagePreview && (
              <div className="my-2 rounded-lg overflow-hidden relative aspect-video">
                <Image
                  src={imagePreview}
                  alt="Image preview"
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <ImageUploader onFileChange={setImageFile} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSaveClick}>Save Image</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const TestimonialEditDialog = ({
  open,
  onOpenChange,
  testimonial,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  testimonial: Testimonial | null | undefined;
  onSave: (testimonialData: Partial<Testimonial>) => void;
}) => {
  const [clientName, setClientName] = React.useState('');
  const [quote, setQuote] = React.useState('');
  const [rating, setRating] = React.useState(5);
  const [isFeatured, setIsFeatured] = React.useState(true);
  const [isActive, setIsActive] = React.useState(true);

  React.useEffect(() => {
    if (testimonial) {
      setClientName(testimonial.client_name);
      setQuote(testimonial.quote);
      setRating(testimonial.rating);
      setIsFeatured(testimonial.is_featured);
      setIsActive(testimonial.is_active);
    } else {
      setClientName('');
      setQuote('');
      setRating(5);
      setIsFeatured(true);
      setIsActive(true);
    }
  }, [testimonial, open]);

  const handleSaveClick = () => {
    onSave({ client_name: clientName, quote, rating: Number(rating), is_featured: isFeatured, is_active: isActive });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {testimonial ? 'Edit Testimonial' : 'Add New Testimonial'}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="testimonial-name">Client Name</Label>
            <Input
              id="testimonial-name"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Client Name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="testimonial-quote">Quote</Label>
            <Textarea
              id="testimonial-quote"
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              placeholder="Client quote..."
            />
          </div>
          <div className="space-y-3 pt-2">
            <Label>Rating</Label>
            <div className="flex items-center gap-2">
              {[...Array(5)].map((_, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => setRating(i + 1)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`h-6 w-6 transition-colors ${
                      i < rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'fill-muted text-muted-foreground'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
           <div className="flex items-center space-x-2">
            <Switch id="testimonial-featured" checked={isFeatured} onCheckedChange={setIsFeatured} />
            <Label htmlFor="testimonial-featured">Featured Testimonial</Label>
          </div>
           <div className="flex items-center space-x-2">
            <Switch id="testimonial-active" checked={isActive} onCheckedChange={setIsActive} />
            <Label htmlFor="testimonial-active">Testimonial is Active</Label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSaveClick}>Save Testimonial</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const TeamMemberEditDialog = ({
  open,
  onOpenChange,
  member,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: TeamMember | null | undefined;
  onSave: (memberData: Partial<TeamMember>) => void;
}) => {
  const [name, setName] = React.useState('');
  const [role, setRole] = React.useState('');
  const [bio, setBio] = React.useState('');
  const [displayOrder, setDisplayOrder] = React.useState(0);
  const [isActive, setIsActive] = React.useState(true);
  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (member) {
      setName(member.name);
      setRole(member.role);
      setBio(member.bio);
      setDisplayOrder(member.display_order);
      setIsActive(member.is_active);
      setImagePreview(member.photo_url || `https://picsum.photos/seed/${member.id}/200/200`);
    } else {
      setName('');
      setRole('');
      setBio('');
      setDisplayOrder(0);
      setIsActive(true);
      setImagePreview(null);
    }
    setImageFile(null); // Reset file on open
  }, [member, open]);

  React.useEffect(() => {
    if (imageFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(imageFile);
    }
  }, [imageFile]);

  const handleSaveClick = () => {
    const saveData: Partial<TeamMember> = {
      name,
      role,
      bio,
      display_order: Number(displayOrder),
      is_active: isActive
    };

    const initialImageUrl =
      member?.photo_url ||
      (member?.id
        ? `https://picsum.photos/seed/${member.id}/200/200`
        : null);

    if (imagePreview && imagePreview !== initialImageUrl) {
      saveData.photo_url = imagePreview;
    }

    onSave(saveData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {member ? 'Edit Team Member' : 'Add New Team Member'}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-4">
          <div className="space-y-2">
            <Label htmlFor="member-name">Name</Label>
            <Input
              id="member-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Jane Doe"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="member-role">Role</Label>
            <Input
              id="member-role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g., Head Chef"
            />
          </div>
           <div className="space-y-2">
            <Label htmlFor="member-bio">Bio</Label>
            <Textarea
              id="member-bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Short bio..."
            />
          </div>
          <div className="space-y-2">
              <Label htmlFor="member-display-order">Display Order</Label>
              <Input
                id="member-display-order"
                type="number"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(Number(e.target.value))}
              />
            </div>
            <div className="flex items-center space-x-2">
                <Switch id="member-active" checked={isActive} onCheckedChange={setIsActive} />
                <Label htmlFor="member-active">Team Member is Active</Label>
            </div>
          <div className="space-y-2">
            <Label>Image</Label>
            {imagePreview && (
              <div className="my-2 rounded-full w-32 h-32 mx-auto overflow-hidden relative">
                <Image
                  src={imagePreview}
                  alt="Image preview"
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <ImageUploader onFileChange={setImageFile} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSaveClick}>Save Member</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const socialIcons: Record<string, React.ElementType> = {
    facebook: Facebook,
    instagram: Instagram,
    twitter: Twitter,
}

export default function ControllerPage() {
  const { toast } = useToast();
  const {
    heroImageUrl,
    setHeroImageUrl,
    aboutUsImageUrl,
    setAboutUsImageUrl,
    services,
    setServices,
    galleryImages,
    setGalleryImages,
    testimonials,
    setTestimonials,
    teamMembers,
    setTeamMembers,
    socialLinks,
    setSocialLinks,
  } = useSiteContent();

  const heroImagePlaceholder = PlaceHolderImages.find(
    (p) => p.id === 'hero-image'
  );
  const aboutUsImagePlaceholder = PlaceHolderImages.find(
    (p) => p.id === 'about-us-image'
  );

  const [heroImageFile, setHeroImageFile] = React.useState<File | null>(null);
  const [aboutImageFile, setAboutImageFile] = React.useState<File | null>(null);

  const [heroImagePreview, setHeroImagePreview] = React.useState<string | null>(
    null
  );
  const [aboutImagePreview, setAboutImagePreview] =
    React.useState<string | null>(null);

  React.useEffect(() => {
    if (heroImageFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setHeroImagePreview(reader.result as string);
      };
      reader.readAsDataURL(heroImageFile);
    } else {
      setHeroImagePreview(null);
    }
  }, [heroImageFile]);

  React.useEffect(() => {
    if (aboutImageFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAboutImagePreview(reader.result as string);
      };
      reader.readAsDataURL(aboutImageFile);
    } else {
      setAboutImagePreview(null);
    }
  }, [aboutImageFile]);

  const handleUpdateSiteImages = async () => {
    let imageUpdated = false;
    if (heroImageFile) {
      const imageUrl = await uploadImageToSupabase(heroImageFile, 'hero-images');
      if (imageUrl) {
        setHeroImageUrl(imageUrl);
        imageUpdated = true;
      } else {
        toast({
          title: 'Error',
          description: 'Failed to upload hero image',
          variant: 'destructive',
        });
      }
    }
    if (aboutImageFile) {
      const imageUrl = await uploadImageToSupabase(aboutImageFile, 'team-photos');
      if (imageUrl) {
        setAboutUsImageUrl(imageUrl);
        imageUpdated = true;
      } else {
        toast({
          title: 'Error',
          description: 'Failed to upload about us image',
          variant: 'destructive',
        });
      }
    }

    if (imageUpdated) {
      toast({
        title: 'Images Updated',
        description: 'Your new images are now live.',
      });
      if (heroImageFile) setHeroImageFile(null);
      if (aboutImageFile) setAboutImageFile(null);
    } else {
      toast({
        title: 'No Changes',
        description: 'No new images were selected to update.',
      });
    }
  };

  // --- State for Services ---
  const [isServiceDialogOpen, setServiceDialogOpen] = React.useState(false);
  const [editingService, setEditingService] = React.useState<
    Service | null | undefined
  >(undefined);
  const [serviceToDelete, setServiceToDelete] = React.useState<Service | null>(
    null
  );

  // --- State for Gallery ---
  const [galleryImageToDelete, setGalleryImageToDelete] =
    React.useState<GalleryImage | null>(null);
  const [isGalleryDialogOpen, setGalleryDialogOpen] = React.useState(false);
  const [editingGalleryImage, setEditingGalleryImage] = React.useState<
    GalleryImage | null | undefined
  >(undefined);

  // Open gallery dialog automatically when page loads
  React.useEffect(() => {
    setGalleryDialogOpen(true);
  }, []);

  // --- State for Testimonials ---
  const [testimonialToDelete, setTestimonialToDelete] =
    React.useState<Testimonial | null>(null);
  const [isTestimonialDialogOpen, setTestimonialDialogOpen] =
    React.useState(false);
  const [editingTestimonial, setEditingTestimonial] = React.useState<
    Testimonial | null | undefined
  >(undefined);

  // --- State for Team Members ---
  const [isTeamMemberDialogOpen, setTeamMemberDialogOpen] =
    React.useState(false);
  const [editingTeamMember, setEditingTeamMember] = React.useState<
    TeamMember | null | undefined
  >(undefined);
  const [teamMemberToDelete, setTeamMemberToDelete] =
    React.useState<TeamMember | null>(null);
  
  // --- State for Social Links ---
  const [currentSocialLinks, setCurrentSocialLinks] = React.useState<SocialLinks>([]);

  React.useEffect(() => {
    setCurrentSocialLinks(socialLinks);
  }, [socialLinks]);
  
  const handleSocialLinkChange = (platform: SocialLink['platform'], key: keyof SocialLink, value: any) => {
    const newLinks = currentSocialLinks.map(link => 
        link.platform === platform ? { ...link, [key]: value } : link
    );
    setCurrentSocialLinks(newLinks);
  }

  const handleSaveSocialLinks = () => {
    setSocialLinks(currentSocialLinks);
    toast({
      title: 'Social Links Updated',
      description: 'Your social media links have been saved.',
    });
  };

  const handleSaveService = async (serviceData: Partial<Service>) => {
    // Handle image upload if needed
    let finalServiceData = { ...serviceData };
    
    // If we have a base64 image, it means it's a new file that needs to be uploaded
    if (finalServiceData.image_url && finalServiceData.image_url.startsWith('data:')) {
      // Create a blob from the base64 data
      const response = await fetch(finalServiceData.image_url);
      const blob = await response.blob();
      const file = new File([blob], `service-${Date.now()}.jpg`, { type: 'image/jpeg' });
      
      const imageUrl = await uploadImageToSupabase(file, 'services');
      if (imageUrl) {
        finalServiceData.image_url = imageUrl;
      } else {
        toast({
          title: 'Error',
          description: 'Failed to upload service image',
          variant: 'destructive',
        });
        return;
      }
    }

    if (editingService) {
      setServices(
        services.map((s) =>
          s.id === editingService.id
            ? {
                ...s,
                ...finalServiceData,
              }
            : s
        )
      );
      toast({
        title: 'Service Updated',
        description: `${finalServiceData.title} has been updated.`,
      });
    } else {
      const newService: Service = {
        id: Date.now(),
        title: finalServiceData.title || "New Service",
        short_description: finalServiceData.short_description || "",
        long_description: finalServiceData.long_description || "",
        price: finalServiceData.price || 0,
        currency: 'Ksh',
        is_active: finalServiceData.is_active !== undefined ? finalServiceData.is_active : true,
        display_order: finalServiceData.display_order || 99,
        image_url: finalServiceData.image_url,
        created_at: new Date().toISOString()
      };
      setServices([newService, ...services]);
      toast({
        title: 'Service Added',
        description: `${newService.title} has been added.`,
      });
    }
    setServiceDialogOpen(false);
    setEditingService(undefined);
  };

  const confirmDeleteService = () => {
    if (serviceToDelete) {
      setServices(services.filter((s) => s.id !== serviceToDelete.id));
      toast({
        title: 'Service Deleted',
        description: `${serviceToDelete.title} has been removed.`,
      });
      setServiceToDelete(null);
    }
  };

  const handleSaveGalleryImage = async (imageData: Partial<GalleryImage>) => {
    // Handle image upload if needed
    let finalImageData = { ...imageData };
    
    // If we have a base64 image, it means it's a new file that needs to be uploaded
    if (finalImageData.image_url && finalImageData.image_url.startsWith('data:')) {
      // Create a blob from the base64 data
      const response = await fetch(finalImageData.image_url);
      const blob = await response.blob();
      const file = new File([blob], `gallery-${Date.now()}.jpg`, { type: 'image/jpeg' });
      
      const imageUrl = await uploadImageToSupabase(file, 'gallery');
      if (imageUrl) {
        finalImageData.image_url = imageUrl;
      } else {
        toast({
          title: 'Error',
          description: 'Failed to upload gallery image',
          variant: 'destructive',
        });
        return;
      }
    }

    if (editingGalleryImage) {
      setGalleryImages(
        galleryImages.map((img) =>
          img.id === editingGalleryImage.id ? { ...img, ...finalImageData } : img
        )
      );
      toast({
        title: 'Gallery Image Updated',
        description: `The image has been updated.`,
      });
    } else {
      const newImage: GalleryImage = {
        id: `gallery-image-${Date.now()}`,
        image_url:
          finalImageData.image_url || `https://picsum.photos/seed/${Date.now()}/600/400`,
        caption: finalImageData.caption || "New Image",
        event_type: finalImageData.event_type || 'other',
        created_at: new Date().toISOString(),
        display_order: finalImageData.display_order || 99,
        is_featured: finalImageData.is_featured !== undefined ? finalImageData.is_featured : false,
        is_active: finalImageData.is_active !== undefined ? finalImageData.is_active : true
      };
      setGalleryImages([newImage, ...galleryImages]);
      toast({
        title: 'Gallery Image Added',
        description: `The new image has been added.`,
      });
    }
    setGalleryDialogOpen(false);
    setEditingGalleryImage(undefined);
  };

  const confirmDeleteGalleryImage = () => {
    if (galleryImageToDelete) {
      setGalleryImages(
        galleryImages.filter((img) => img.id !== galleryImageToDelete.id)
      );
      toast({
        title: 'Gallery Image Deleted',
        description: `The image has been removed.`,
      });
      setGalleryImageToDelete(null);
    }
  };

  const handleSaveTestimonial = (testimonialData: Partial<Testimonial>) => {
    if (editingTestimonial) {
      setTestimonials(
        testimonials.map((t) =>
          t.id === editingTestimonial.id ? { ...t, ...testimonialData } : t
        )
      );
      toast({
        title: 'Testimonial Updated',
        description: `The testimonial from ${testimonialData.client_name} has been updated.`,
      });
    } else {
      const newTestimonial: Testimonial = {
        id: Date.now(),
        client_name: testimonialData.client_name || "Anonymous",
        quote: testimonialData.quote || "",
        rating: testimonialData.rating || 5,
        source: 'Manual',
        is_featured: testimonialData.is_featured !== undefined ? testimonialData.is_featured : true,
        is_active: testimonialData.is_active !== undefined ? testimonialData.is_active : true,
        created_at: new Date().toISOString(),
      };
      setTestimonials([newTestimonial, ...testimonials]);
      toast({
        title: 'Testimonial Added',
        description: `The testimonial from ${newTestimonial.client_name} has been added.`,
      });
    }
    setTestimonialDialogOpen(false);
    setEditingTestimonial(undefined);
  };

  const confirmDeleteTestimonial = () => {
    if (testimonialToDelete) {
      setTestimonials(
        testimonials.filter((t) => t.id !== testimonialToDelete.id)
      );
      toast({
        title: 'Testimonial Deleted',
        description: `The testimonial by ${testimonialToDelete.client_name} has been removed.`,
      });
      setTestimonialToDelete(null);
    }
  };

  const handleSaveTeamMember = async (memberData: Partial<TeamMember>) => {
    // Handle image upload if needed
    let finalMemberData = { ...memberData };
    
    // If we have a base64 image, it means it's a new file that needs to be uploaded
    if (finalMemberData.photo_url && finalMemberData.photo_url.startsWith('data:')) {
      // Create a blob from the base64 data
      const response = await fetch(finalMemberData.photo_url);
      const blob = await response.blob();
      const file = new File([blob], `team-${Date.now()}.jpg`, { type: 'image/jpeg' });
      
      const imageUrl = await uploadImageToSupabase(file, 'team-photos');
      if (imageUrl) {
        finalMemberData.photo_url = imageUrl;
      } else {
        toast({
          title: 'Error',
          description: 'Failed to upload team member photo',
          variant: 'destructive',
        });
        return;
      }
    }

    if (editingTeamMember) {
      setTeamMembers(
        teamMembers.map((m) =>
          m.id === editingTeamMember.id
            ? {
                ...m,
                ...finalMemberData,
              }
            : m
        )
      );
      toast({
        title: 'Team Member Updated',
        description: `${finalMemberData.name} has been updated.`,
      });
    } else {
      const newMember: TeamMember = {
        id: Date.now(),
        name: finalMemberData.name || "New Member",
        role: finalMemberData.role || "Role",
        bio: finalMemberData.bio || "",
        photo_url: finalMemberData.photo_url || `https://picsum.photos/seed/${Date.now()}/200/200`,
        is_active: finalMemberData.is_active !== undefined ? finalMemberData.is_active : true,
        display_order: finalMemberData.display_order || 99,
        joined_at: new Date().toISOString(),
      };
      setTeamMembers([newMember, ...teamMembers]);
      toast({
        title: 'Team Member Added',
        description: `${newMember.name} has been added.`,
      });
    }
    setTeamMemberDialogOpen(false);
    setEditingTeamMember(undefined);
  };

  const confirmDeleteTeamMember = () => {
    if (teamMemberToDelete) {
      setTeamMembers(
        teamMembers.filter((m) => m.id !== teamMemberToDelete.id)
      );
      toast({
        title: 'Team Member Deleted',
        description: `Team member ${teamMemberToDelete.name} has been removed.`,
      });
      setTeamMemberToDelete(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-headline font-bold">
          Content Controller
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Manage your website's content from one central location.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Site-Wide Imagery */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Site-Wide Imagery</CardTitle>
            <CardDescription>
              Manage key images across the site. Upload an image to change it.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="hero-image">Homepage Hero Image</Label>
              <div className="my-2 rounded-lg overflow-hidden relative aspect-video">
                <Image
                  src={heroImagePreview || heroImageUrl}
                  alt={heroImagePlaceholder?.description || 'Hero image preview'}
                  fill
                  className="object-cover"
                  data-ai-hint={heroImagePlaceholder?.imageHint}
                />
              </div>
              <ImageUploader onFileChange={setHeroImageFile} />
            </div>
            <div>
              <Label htmlFor="about-us-image">About Us Page Image</Label>
              <div className="my-2 rounded-lg overflow-hidden relative aspect-video">
                <Image
                  src={aboutImagePreview || aboutUsImageUrl}
                  alt={
                    aboutUsImagePlaceholder?.description ||
                    'About us image preview'
                  }
                  fill
                  className="object-cover"
                  data-ai-hint={aboutUsImagePlaceholder?.imageHint}
                />
              </div>
              <ImageUploader onFileChange={setAboutImageFile} />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={handleUpdateSiteImages}>
              Update Site Images
            </Button>
          </CardFooter>
        </Card>

        <div className="col-span-1 space-y-8">
           <Card>
            <CardHeader>
              <CardTitle>Social Media Links</CardTitle>
              <CardDescription>
                Update your social media profile URLs.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentSocialLinks.sort((a,b) => a.display_order - b.display_order).map(link => {
                const Icon = socialIcons[link.platform];
                return (
                    <div key={link.platform} className="space-y-2">
                        <Label htmlFor={`${link.platform}-url`} className="flex items-center gap-2 capitalize"><Icon className='w-4 h-4'/> {link.platform} URL</Label>
                        <Input
                        id={`${link.platform}-url`}
                        value={link.url}
                        onChange={(e) =>
                            handleSocialLinkChange(link.platform, 'url', e.target.value)
                        }
                        placeholder={`https://...`}
                        />
                        <div className="flex items-center space-x-2">
                            <Switch id={`${link.platform}-active`} checked={link.is_active} onCheckedChange={(checked) => handleSocialLinkChange(link.platform, 'is_active', checked)} />
                            <Label htmlFor={`${link.platform}-active`}>Show on site</Label>
                        </div>
                    </div>
                )
              })}
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={handleSaveSocialLinks}>
                Update Social Links
              </Button>
            </CardFooter>
          </Card>
          {/* Visual Archive -> Gallery */}
          <Card>
            <CardHeader>
              <CardTitle>Visual Archive (Gallery)</CardTitle>
              <CardDescription>Manage your event portfolio.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                className="w-full"
                onClick={() => {
                  setEditingGalleryImage(null);
                  setGalleryDialogOpen(true);
                }}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add to Archive
              </Button>
              {/* Test button to open gallery dialog */}
              <Button onClick={() => setGalleryDialogOpen(true)}>Test Open Gallery Dialog</Button>
              <div className="space-y-2 pt-4">
                <h4 className="font-semibold">Current Gallery Images</h4>
                <div className="max-h-96 overflow-y-auto space-y-2 pr-2">
                  {galleryImages.sort((a,b) => a.display_order - b.display_order).map((image) => (
                    <div
                      key={image.id}
                      className="border rounded-lg p-2 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        <Image
                          src={image.image_url}
                          alt={image.caption}
                          width={40}
                          height={40}
                          className="rounded flex-shrink-0"
                        />
                        <span className="text-sm truncate">{image.caption}</span>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setEditingGalleryImage(image);
                            setGalleryDialogOpen(true);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => setGalleryImageToDelete(image)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Manage Services */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Manage Services</CardTitle>
            <CardDescription>
              Add, edit, or remove service offerings.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {services.sort((a,b) => a.display_order - b.display_order).map((service) => {
                  const imageSrc = service.image_url;
                  
                  return (
                    <Card
                      key={service.id}
                      className="flex flex-col overflow-hidden"
                    >
                      {imageSrc && (
                        <div className="relative h-40 w-full">
                          <Image
                            src={imageSrc}
                            alt={service.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <CardHeader>
                        <div className="flex items-center gap-2">
                          <UtensilsCrossed className="w-6 h-6 text-primary" />
                          <h3 className="text-lg font-headline">
                            {service.title}
                          </h3>
                        </div>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <p className="text-sm text-muted-foreground h-24">
                          {service.short_description}
                        </p>
                        <p className="text-sm font-semibold mt-2">
                          Starting from {service.currency} {service.price}
                        </p>
                      </CardContent>
                      <CardFooter className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingService(service);
                            setServiceDialogOpen(true);
                          }}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => setServiceToDelete(service)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })}
                <div
                  onClick={() => {
                    setEditingService(null);
                    setServiceDialogOpen(true);
                  }}
                >
                  <Card className="flex items-center justify-center border-dashed min-h-[200px] h-full cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors">
                    <div className="text-center">
                      <PlusCircle className="mx-auto h-10 w-10 text-muted-foreground" />
                      <p className="mt-2 text-sm font-semibold text-muted-foreground">
                        Add New Service
                      </p>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Manage Testimonials */}
        <Card>
          <CardHeader>
            <CardTitle>Manage Testimonials</CardTitle>
            <CardDescription>
              Add or remove client testimonials.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              className="w-full"
              onClick={() => {
                setEditingTestimonial(null);
                setTestimonialDialogOpen(true);
              }}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Testimonial
            </Button>
            <div className="space-y-2 pt-4">
              <h4 className="font-semibold">Current Testimonials</h4>
              <div className="max-h-64 overflow-y-auto space-y-2 pr-2">
                {testimonials.map((testimonial) => (
                  <div
                    key={testimonial.id}
                    className="border rounded-lg p-3 flex items-center justify-between"
                  >
                    <div className="overflow-hidden">
                      <p className="font-semibold">{testimonial.client_name}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        "{testimonial.quote}"
                      </p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditingTestimonial(testimonial);
                          setTestimonialDialogOpen(true);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => setTestimonialToDelete(testimonial)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Manage Team Members */}
        <Card>
          <CardHeader>
            <CardTitle>Manage Team</CardTitle>
            <CardDescription>
              Add, edit, or remove team members.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              className="w-full"
              onClick={() => {
                setEditingTeamMember(null);
                setTeamMemberDialogOpen(true);
              }}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Team Member
            </Button>
            <div className="space-y-2 pt-4">
              <h4 className="font-semibold">Current Team Members</h4>
              <div className="max-h-64 overflow-y-auto space-y-2 pr-2">
                {teamMembers.sort((a,b) => a.display_order - b.display_order).map((member) => (
                  <div
                    key={member.id}
                    className="border rounded-lg p-2 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <Image
                        src={
                          member.photo_url ||
                          `https://picsum.photos/seed/${member.id}/40/40`
                        }
                        alt={member.name}
                        width={40}
                        height={40}
                        className="rounded-full flex-shrink-0"
                        data-ai-hint="portrait person"
                      />
                      <div className="overflow-hidden">
                        <p className="font-semibold truncate">{member.name}</p>
                        <p className="text-sm text-muted-foreground truncate">
                          {member.role}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditingTeamMember(member);
                          setTeamMemberDialogOpen(true);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => setTeamMemberToDelete(member)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <ServiceEditDialog
        open={isServiceDialogOpen}
        onOpenChange={setServiceDialogOpen}
        service={editingService}
        onSave={handleSaveService}
      />
      <TestimonialEditDialog
        open={isTestimonialDialogOpen}
        onOpenChange={setTestimonialDialogOpen}
        testimonial={editingTestimonial}
        onSave={handleSaveTestimonial}
      />
      <GalleryEditDialog
        open={isGalleryDialogOpen}
        onOpenChange={setGalleryDialogOpen}
        image={editingGalleryImage}
        onSave={handleSaveGalleryImage}
      />
      <TeamMemberEditDialog
        open={isTeamMemberDialogOpen}
        onOpenChange={setTeamMemberDialogOpen}
        member={editingTeamMember}
        onSave={handleSaveTeamMember}
      />
      <AlertDialog
        open={!!serviceToDelete}
        onOpenChange={() => setServiceToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              service {'"'}
              {serviceToDelete?.title}
              {'"'}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              onClick={confirmDeleteService}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={!!galleryImageToDelete}
        onOpenChange={() => setGalleryImageToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              gallery image with caption "{galleryImageToDelete?.caption}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              onClick={confirmDeleteGalleryImage}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={!!testimonialToDelete}
        onOpenChange={() => setTestimonialToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              testimonial by "{testimonialToDelete?.client_name}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              onClick={confirmDeleteTestimonial}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog
        open={!!teamMemberToDelete}
        onOpenChange={() => setTeamMemberToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the team
              member "{teamMemberToDelete?.name}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              onClick={confirmDeleteTeamMember}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
