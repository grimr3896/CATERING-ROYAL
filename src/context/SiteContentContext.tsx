'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { Service, GalleryImage, Testimonial, TeamMember, SocialLinks } from '@/lib/definitions';
import { services as initialServices, galleryImages as initialGalleryImages, testimonials as initialTestimonials, teamMembers as initialTeamMembers, socialLinks as initialSocialLinks } from '@/lib/data';
import { supabase } from '@/lib/supabase';

const heroImagePlaceholder = PlaceHolderImages.find(
  (p) => p.id === 'hero-image'
);
const aboutUsImagePlaceholder = PlaceHolderImages.find(
  (p) => p.id === 'about-us-image'
);


type SiteContentContextType = {
  heroImageUrl: string;
  setHeroImageUrl: (url: string) => void;
  aboutUsImageUrl: string;
  setAboutUsImageUrl: (url: string) => void;
  services: Service[];
  setServices: (services: Service[]) => void;
  galleryImages: GalleryImage[];
  setGalleryImages: (images: GalleryImage[]) => void;
  testimonials: Testimonial[];
  setTestimonials: (testimonials: Testimonial[]) => void;
  teamMembers: TeamMember[];
  setTeamMembers: (members: TeamMember[]) => void;
  socialLinks: SocialLinks;
  setSocialLinks: (links: SocialLinks) => void;
};

const SiteContentContext = createContext<SiteContentContextType | undefined>(
  undefined
);

export const SiteContentProvider = ({ children }: { children: ReactNode }) => {
  const [heroImageUrl, setHeroImageUrl] = useState<string>(
    heroImagePlaceholder?.imageUrl || ''
  );
  const [aboutUsImageUrl, setAboutUsImageUrl] = useState<string>(
    aboutUsImagePlaceholder?.imageUrl || ''
  );
  const [services, setServices] = useState<Service[]>(initialServices);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>(initialGalleryImages);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(initialTeamMembers);
  const [socialLinks, setSocialLinks] = useState<SocialLinks>(initialSocialLinks);


  useEffect(() => {
    const fetchData = async () => {
      // Check if Supabase client is initialized
      if (!supabase) {
        console.warn('Supabase client not configured, using initial data');
        return;
      }

      console.log('Supabase client initialized, fetching data...');

      try {
        // Fetch services
        console.log('Fetching services...');
        const { data: servicesData, error: servicesError } = await supabase
          .from('services')
          .select('*')
          .order('id', { ascending: true });
        if (!servicesError && servicesData && servicesData.length > 0) {
          console.log('Services fetched:', servicesData.length, 'items');
          // Transform data to match expected Service type
          const formattedServices = servicesData.map((service: any) => ({
            id: service.id,
            title: service.title,
            short_description: service.short_description || 'No description available',
            price: service.price || 0,
            currency: 'Ksh',
            image_url: service.image_url,
            display_order: service.display_order || 0,
            is_active: true
          }));
          setServices(formattedServices as Service[]);
        } else {
          console.warn('Services not available, using initial data');
          if (servicesError) {
            console.error('Error fetching services:', servicesError);
          }
        }

        // Fetch gallery images
        console.log('Fetching gallery images...');
        const { data: galleryData, error: galleryError } = await supabase
          .from('gallery_items')
          .select('*')
          .order('id', { ascending: true });
        if (!galleryError && galleryData && galleryData.length > 0) {
          console.log('Gallery images fetched:', galleryData.length, 'items');
          // Transform data to match expected GalleryImage type
          const formattedGallery = galleryData.map((image: any) => ({
            id: image.id,
            image_url: image.image_url,
            caption: image.caption,
            event_type: image.event_type || 'other',
            display_order: image.display_order || 0,
            is_active: true,
            is_featured: true
          }));
          setGalleryImages(formattedGallery as GalleryImage[]);
        } else {
          console.warn('Gallery images not available, using initial data');
          if (galleryError) {
            console.error('Error fetching gallery images:', galleryError);
          }
        }

        // Fetch testimonials
        console.log('Fetching testimonials...');
        const { data: testimonialsData, error: testimonialsError } = await supabase
          .from('testimonials')
          .select('*')
          .order('id', { ascending: true });
        if (!testimonialsError && testimonialsData && testimonialsData.length > 0) {
          console.log('Testimonials fetched:', testimonialsData.length, 'items');
          // Transform data to match expected Testimonial type
          const formattedTestimonials = testimonialsData.map((testimonial: any) => ({
            id: testimonial.id,
            client_name: testimonial.client_name,
            quote: testimonial.quote,
            rating: testimonial.rating || 5,
            display_order: testimonial.display_order || 0,
            is_active: true,
            is_featured: true
          }));
          setTestimonials(formattedTestimonials as Testimonial[]);
        } else {
          console.warn('Testimonials not available, using initial data');
          if (testimonialsError) {
            console.error('Error fetching testimonials:', testimonialsError);
          }
        }

        // Fetch team members
        console.log('Fetching team members...');
        const { data: teamData, error: teamError } = await supabase
          .from('team_members')
          .select('*')
          .order('id', { ascending: true });
        if (!teamError && teamData && teamData.length > 0) {
          console.log('Team members fetched:', teamData.length, 'items');
          // Transform data to match expected TeamMember type
          const formattedTeam = teamData.map((member: any) => ({
            id: member.id,
            name: member.name,
            role: member.role,
            photo_url: member.photo_url,
            display_order: member.display_order || 0,
            is_active: true
          }));
          setTeamMembers(formattedTeam as TeamMember[]);
        } else {
          console.warn('Team members not available, using initial data');
          if (teamError) {
            console.error('Error fetching team members:', teamError);
          }
        }

        // Fetch social links
        console.log('Fetching social links...');
        const { data: socialLinksData, error: socialLinksError } = await supabase
          .from('social_links')
          .select('*')
          .order('id', { ascending: true });
        if (!socialLinksError && socialLinksData && socialLinksData.length > 0) {
          console.log('Social links fetched:', socialLinksData.length, 'items');
          setSocialLinks(socialLinksData as SocialLinks);
        } else {
          console.warn('Social links not available, using initial data');
          if (socialLinksError) {
            console.error('Error fetching social links:', socialLinksError);
          }
        }

        // Fetch site content (hero and about us images)
        console.log('Fetching site content...');
        const { data: siteContentData, error: siteContentError } = await supabase
          .from('site_content')
          .select('*');
        if (!siteContentError && siteContentData && siteContentData.length > 0) {
          console.log('Site content fetched:', siteContentData.length, 'items');
          const heroImage = siteContentData.find((item: any) => item.key === 'hero_image_url');
          const aboutUsImage = siteContentData.find((item: any) => item.key === 'about_us_image_url');
          
          if (heroImage) {
            setHeroImageUrl(heroImage.image_url || heroImage.value);
          }
          if (aboutUsImage) {
            setAboutUsImageUrl(aboutUsImage.image_url || aboutUsImage.value);
          }
        } else {
          console.warn('Site content not available, using initial data');
          if (siteContentError) {
            console.error('Error fetching site content:', siteContentError);
          }
        }
      } catch (error) {
        console.error("Failed to fetch data from Supabase", error);
        console.warn('Using initial hardcoded data');
      }
    };

    fetchData();
  }, []);

  const handleSetHeroImageUrl = async (url: string) => {
    if (!supabase) {
      console.warn('Supabase client not configured, cannot update hero image');
      setHeroImageUrl(url); // Still update locally even if Supabase is not configured
      return;
    }
    
    try {
      await supabase
        .from('site_content')
        .upsert({
          key: 'hero_image_url',
          value: url,
          is_active: true,
          display_order: 1
        });
      setHeroImageUrl(url);
    } catch (error) {
      console.error("Failed to update hero image URL", error);
      setHeroImageUrl(url); // Still update locally even if Supabase fails
    }
  };

  const handleSetAboutUsImageUrl = async (url: string) => {
    if (!supabase) {
      console.warn('Supabase client not configured, cannot update about us image');
      setAboutUsImageUrl(url); // Still update locally even if Supabase is not configured
      return;
    }
    
    try {
      await supabase
        .from('site_content')
        .upsert({
          key: 'about_us_image_url',
          value: url,
          is_active: true,
          display_order: 2
        });
      setAboutUsImageUrl(url);
    } catch (error) {
      console.error("Failed to update about us image URL", error);
      setAboutUsImageUrl(url); // Still update locally even if Supabase fails
    }
  };

  const handleSetSocialLinks = async (links: SocialLinks) => {
    if (!supabase) {
      console.warn('Supabase client not configured, cannot update social links');
      setSocialLinks(links); // Still update locally even if Supabase is not configured
      return;
    }
    
    try {
      // First, delete existing social links
      await supabase.from('social_links').delete();
      // Then insert new ones
      await supabase.from('social_links').insert(links);
      setSocialLinks(links);
    } catch (error) {
      console.error("Failed to update social links", error);
      setSocialLinks(links); // Still update locally even if Supabase fails
    }
  };

  const handleSetServices = async (updatedServices: Service[]) => {
    if (!supabase) {
      console.warn('Supabase client not configured, cannot update services');
      setServices(updatedServices); // Still update locally even if Supabase is not configured
      return;
    }
    
    try {
      // First, delete existing services
      await supabase.from('services').delete();
      // Then insert new ones
      await supabase.from('services').insert(updatedServices);
      setServices(updatedServices);
    } catch (error) {
      console.error("Failed to update services", error);
      setServices(updatedServices); // Still update locally even if Supabase fails
    }
  };

  const handleSetGalleryImages = async (updatedImages: GalleryImage[]) => {
    if (!supabase) {
      console.warn('Supabase client not configured, cannot update gallery images');
      setGalleryImages(updatedImages); // Still update locally even if Supabase is not configured
      return;
    }
    
    try {
      // First, delete existing gallery images
      await supabase.from('gallery_items').delete();
      // Then insert new ones
      await supabase.from('gallery_items').insert(updatedImages);
      setGalleryImages(updatedImages);
    } catch (error) {
      console.error("Failed to update gallery images", error);
      setGalleryImages(updatedImages); // Still update locally even if Supabase fails
    }
  };

  const handleSetTestimonials = async (updatedTestimonials: Testimonial[]) => {
    if (!supabase) {
      console.warn('Supabase client not configured, cannot update testimonials');
      setTestimonials(updatedTestimonials); // Still update locally even if Supabase is not configured
      return;
    }
    
    try {
      // First, delete existing testimonials
      await supabase.from('testimonials').delete();
      // Then insert new ones
      await supabase.from('testimonials').insert(updatedTestimonials);
      setTestimonials(updatedTestimonials);
    } catch (error) {
      console.error("Failed to update testimonials", error);
      setTestimonials(updatedTestimonials); // Still update locally even if Supabase fails
    }
  };

  const handleSetTeamMembers = async (updatedMembers: TeamMember[]) => {
    if (!supabase) {
      console.warn('Supabase client not configured, cannot update team members');
      setTeamMembers(updatedMembers); // Still update locally even if Supabase is not configured
      return;
    }
    
    try {
      // First, delete existing team members
      await supabase.from('team_members').delete();
      // Then insert new ones
      await supabase.from('team_members').insert(updatedMembers);
      setTeamMembers(updatedMembers);
    } catch (error) {
      console.error("Failed to update team members", error);
      setTeamMembers(updatedMembers); // Still update locally even if Supabase fails
    }
  };


  return (
    <SiteContentContext.Provider
      value={{
        heroImageUrl,
        setHeroImageUrl: handleSetHeroImageUrl,
        aboutUsImageUrl,
        setAboutUsImageUrl: handleSetAboutUsImageUrl,
        services,
        setServices: handleSetServices,
        galleryImages,
        setGalleryImages: handleSetGalleryImages,
        testimonials,
        setTestimonials: handleSetTestimonials,
        teamMembers,
        setTeamMembers: handleSetTeamMembers,
        socialLinks,
        setSocialLinks: handleSetSocialLinks,
      }}
    >
      {children}
    </SiteContentContext.Provider>
  );
};

export const useSiteContent = () => {
  const context = useContext(SiteContentContext);
  if (context === undefined) {
    throw new Error('useSiteContent must be used within a SiteContentProvider');
  }
  return context;
};
