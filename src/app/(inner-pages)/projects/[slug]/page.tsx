'use client';

import { use, useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import InnerPageHero from '@/components/sections/InnerPageHero';
import { projectsData } from '@/data/siteData';
import { getProjectBySlug, getProjects, getProjectUnits, submitEnquiry } from '@/lib/cmsClient';
import RunningPillBadge from '@/components/ui/RunningPillBadge';
import FadeIn from '@/components/animation/FadeIn';
import UnitBookingModal from '@/components/project/UnitBookingModal';
import PhoneInputWithCountry from '@/components/ui/PhoneInputWithCountry';
import { Country, DEFAULT_COUNTRY } from '@/lib/countryCodes';
import { cleanName, validateName, cleanEmail, validateEmail, validatePhone } from '@/lib/formValidation';
import {
  MapPin,
  Layers,
  Building,
  Maximize,
  Calendar,
  CircleDollarSign,
  Shield,
  FileText,
  Download,
  Camera,
  Dumbbell,
  Gamepad2,
  Wrench,
  Waves,
  Flame,
  Trees,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  Camera as PhotoIcon,
  Maximize2 as PlanIcon,
  Video as VideoIcon,
  Compass as StreetIcon,
  X,
  ZoomIn,
  ZoomOut,
  Share2,
  Play,
  HelpCircle,
  ChevronUp,
  Zap,
  Car,
  CheckCircle2,
  Award,
  Wifi,
  Sparkles,
  Droplets,
  ExternalLink,
} from 'lucide-react';

const getAmenityIcon = (iconName?: string, name?: string) => {
  const norm = `${iconName || ''} ${name || ''}`.toLowerCase();
  if (norm.includes('shield') || norm.includes('security') || norm.includes('guard') || norm.includes('gated')) return Shield;
  if (norm.includes('camera') || norm.includes('cctv') || norm.includes('surveillance')) return Camera;
  if (norm.includes('dumbbell') || norm.includes('gym') || norm.includes('fitness')) return Dumbbell;
  if (norm.includes('gamepad') || norm.includes('play') || norm.includes('children') || norm.includes('kids')) return Gamepad2;
  if (norm.includes('wrench') || norm.includes('maintenance')) return Wrench;
  if (norm.includes('wave') || norm.includes('pool') || norm.includes('swimming') || norm.includes('water')) return Waves;
  if (norm.includes('flame') || norm.includes('fire')) return Flame;
  if (norm.includes('tree') || norm.includes('garden') || norm.includes('park') || norm.includes('landscape') || norm.includes('green') || norm.includes('eco')) return Trees;
  if (norm.includes('light') || norm.includes('lamp') || norm.includes('street light') || norm.includes('power') || norm.includes('electricity') || norm.includes('backup')) return Zap;
  if (norm.includes('road') || norm.includes('car') || norm.includes('parking') || norm.includes('tar') || norm.includes('black top') || norm.includes('driveway')) return Car;
  if (norm.includes('document') || norm.includes('file') || norm.includes('clear') || norm.includes('title') || norm.includes('approved') || norm.includes('approval') || norm.includes('dtcp') || norm.includes('cmda')) return FileText;
  if (norm.includes('building') || norm.includes('club') || norm.includes('community')) return Building;
  if (norm.includes('wifi') || norm.includes('internet')) return Wifi;
  if (norm.includes('droplet') || norm.includes('plumbing') || norm.includes('drainage')) return Droplets;
  if (norm.includes('sparkle') || norm.includes('modern') || norm.includes('luxury')) return Sparkles;
  if (norm.includes('award') || norm.includes('certified')) return Award;

  return CheckCircle2;
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function ProjectCategoryOrDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug.toLowerCase();

  // Category slug check ('apartments' | 'plots' | 'villas')
  const isCategory = slug === 'apartments' || slug === 'plots' || slug === 'villas';
  const categoryName =
    slug === 'apartments' ? 'Apartments' : slug === 'plots' ? 'Plots' : slug === 'villas' ? 'Villas' : '';

  // Interactive Unit Booking Modal state
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // Category projects state
  const [categoryProjects, setCategoryProjects] = useState<any[]>(() =>
    projectsData.filter((p) => p.type?.toLowerCase() === categoryName.toLowerCase())
  );

  // Current project lookup
  const projectIndex = projectsData.findIndex((p) => p.slug === slug);
  const [project, setProject] = useState<any>(() =>
    projectIndex !== -1
      ? projectsData[projectIndex]
      : {
          name: slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
          slug,
          location: 'Chennai, Tamil Nadu',
          bhk: 'Residential Development',
          propertyType: 'Plots',
          type: 'Plots',
          status: 'Ongoing',
          budget: 'Price on Request',
          image: '/images/projects/project_1.jpg',
        }
  );

  // Dynamic project list for Next / Prev navigation
  const [allProjectsList, setAllProjectsList] = useState<any[]>(projectsData);

  useEffect(() => {
    let isMounted = true;

    if (isCategory) {
      async function loadCategoryProjects() {
        try {
          const allProjects = await getProjects();
          if (isMounted && Array.isArray(allProjects) && allProjects.length > 0) {
            const filtered = allProjects.filter(
              (p: any) => ((p as any).propertyType || p.type || '').toLowerCase() === categoryName.toLowerCase()
            );
            if (filtered.length > 0) {
              setCategoryProjects(filtered);
            }
          }
        } catch {
          // Fallback to static siteData
        }
      }
      loadCategoryProjects();
      return () => {
        isMounted = false;
      };
    }

    async function loadProjectDetails() {
      try {
        const [live, all] = await Promise.all([
          getProjectBySlug(slug),
          getProjects(),
        ]);
        if (isMounted) {
          if (Array.isArray(all) && all.length > 0) {
            setAllProjectsList(all);
          }
          if (live) {
            setProject((prev: any) => ({
              ...prev,
              ...live,
              brochureUrl:
                live.brochureUrl !== undefined && live.brochureUrl !== null && live.brochureUrl !== ''
                  ? live.brochureUrl
                  : prev?.brochureUrl || (projectIndex !== -1 ? projectsData[projectIndex]?.brochureUrl : ''),
            }));
          }
        }
      } catch (err) {
        console.warn('Could not load dynamic project from CMS');
      }
    }
    loadProjectDetails();
    return () => {
      isMounted = false;
    };
  }, [slug, isCategory, categoryName, projectIndex]);

  // Previous and Next navigation across all live active projects
  const activeProjectIndex = allProjectsList.findIndex(
    (p) => (p.slug || '').toLowerCase() === slug || p.id === (project?._id || project?.id)
  );
  const safeProjectIndex = activeProjectIndex !== -1 ? activeProjectIndex : (projectIndex !== -1 ? projectIndex : 0);
  const prevProject =
    allProjectsList[
      (safeProjectIndex - 1 + allProjectsList.length) % allProjectsList.length
    ] || projectsData[0];
  const nextProject =
    allProjectsList[(safeProjectIndex + 1) % allProjectsList.length] || projectsData[0];

  // Check if current project is an apartment
  const isApartment = Boolean(
    ((project?.propertyType || project?.type || '') as string)
      .toLowerCase()
      .trim()
      .includes('apartment')
  );

  // Active Media Tab state: 'Photos' | 'Plans' | 'Video' | 'Street View'
  const [activeMediaTab, setActiveMediaTab] = useState<string>('Photos');

  // Dynamic Media Gallery Photos List (Pulls from CMS project.image and project.galleryImages)
  const rawPhotos: string[] = Array.from(
    new Set([
      ...(project?.image && typeof project.image === 'string' && project.image.trim() !== '' ? [project.image] : []),
      ...(Array.isArray(project?.galleryImages)
        ? project.galleryImages.filter((img: any) => typeof img === 'string' && img.trim() !== '')
        : []),
    ])
  );

  const projectPhotos =
    rawPhotos.length > 0
      ? rawPhotos.map((src: string, idx: number) => ({
          src,
          title:
            idx === 0
              ? `${project?.name || 'Project'} - Exterior View`
              : `${project?.name || 'Project'} - Gallery Photo ${idx + 1}`,
        }))
      : [
          {
            src: project?.image || '/images/projects/apt_lenid.jpg',
            title: `${project?.name || 'Project'} - Exterior View`,
          },
        ];

  // Dynamic Floor / Layout Plans List (Pulls from CMS project.floorPlans, project.masterPlanUrl, project.layoutImages)
  const rawPlans: any[] = [
    ...(project?.masterPlanUrl && typeof project.masterPlanUrl === 'string' && project.masterPlanUrl.trim() !== ''
      ? [{ imageUrl: project.masterPlanUrl, title: `${project?.name || 'Project'} - Master Plan`, sqft: project?.projectArea || project?.plotSizes || '' }]
      : []),
    ...(Array.isArray(project?.floorPlans) ? project.floorPlans : []),
    ...(Array.isArray(project?.layoutImages)
      ? project.layoutImages
          .filter((img: any) => typeof img === 'string' && img.trim() !== '')
          .map((img: string, idx: number) => ({
            imageUrl: img,
            title: `Layout Plan ${idx + 1}`,
            sqft: '',
          }))
      : []),
  ];

  const projectPlans = rawPlans.map((plan: any, idx: number) => ({
    src:
      typeof plan === 'string'
        ? plan
        : plan.imageUrl || plan.src || '/images/projects/p1.webp',
    title:
      typeof plan === 'object' && plan.title
        ? `${plan.title}${plan.sqft ? ` (${plan.sqft})` : ''}`
        : `Floor / Layout Plan ${idx + 1}`,
  }));

  // Dynamic Amenities List (Pulls from CMS project.amenities)
  const dynamicAmenities =
    Array.isArray(project?.amenities) && project.amenities.length > 0
      ? project.amenities
          .map((item: any) => {
            if (typeof item === 'string') {
              const trimmed = item.trim();
              return {
                name: trimmed,
                icon: trimmed,
                description: `${trimmed} provided with verified infrastructure.`,
              };
            }
            const name = (item.name || '').trim();
            const description = (item.description || '').trim();
            return {
              name,
              icon: (item.icon || '').trim() || name,
              description: description || `${name} provided with verified infrastructure.`,
            };
          })
          .filter((item: any) => Boolean(item.name))
      : [
          {
            name: '24x7 Security',
            icon: 'Shield',
            description: 'Gated perimeter with round-the-clock trained security personnel.',
          },
          {
            name: 'Surveillance System',
            icon: 'Camera',
            description: 'High-definition CCTV surveillance across key vantage points.',
          },
          {
            name: isApartment ? 'Fitness Center' : 'Black Top Roads',
            icon: isApartment ? 'Dumbbell' : 'Car',
            description: isApartment
              ? 'Fully equipped indoor fitness gym with modern training equipment.'
              : 'Wide well-laid tar roads designed with proper storm water drainage.',
          },
          {
            name: "Children's Play Area",
            icon: 'Gamepad2',
            description: 'Dedicated outdoor recreational zone for kids and families.',
          },
          {
            name: isApartment ? 'Power Backup & Maintenance' : 'Street Lighting',
            icon: isApartment ? 'Wrench' : 'Zap',
            description: isApartment
              ? 'Continuous power support and scheduled upkeep of common utilities.'
              : 'Energy-efficient street lamps lighting all avenue roads.',
          },
          {
            name: isApartment ? 'Water Management' : 'Clear Legal Titles',
            icon: isApartment ? 'Waves' : 'FileText',
            description: isApartment
              ? 'Abundant potable ground water with overhead storage capacity.'
              : '100% clear parent documentation with DTCP and CMDA clearances.',
          },
          {
            name: isApartment ? 'Fire Safety System' : 'Avenue Plantation',
            icon: isApartment ? 'Flame' : 'Trees',
            description: isApartment
              ? 'Advanced fire safety installations adhering to statutory norms.'
              : 'Lush avenue trees and greenery promoting clean residential living.',
          },
          {
            name: 'Landscape Garden',
            icon: 'Trees',
            description: 'Manicured green spaces and walking tracks for wellness.',
          },
        ];

  // Dynamic Nearby Landmarks (Pulls from CMS project.nearbyLocations)
  const nearbyLandmarks =
    Array.isArray(project?.nearbyLocations) && project.nearbyLocations.length > 0
      ? project.nearbyLocations
      : [
          { name: 'Supermarket', distance: '500m', description: 'Daily grocery & essentials' },
          { name: 'Bus Station', distance: '450m', description: 'Metropolitan transport connectivity' },
          { name: 'Railway Station', distance: '1.7 km', description: 'Suburban train network' },
          { name: 'Hospital', distance: '1.2 km', description: 'Multi-speciality medical care' },
          { name: 'Schools & Colleges', distance: '850m', description: 'Leading educational institutions' },
          { name: 'Airport', distance: '22 km', description: 'Chennai International Airport' },
        ];

  // Carousel width & container measurement
  const carouselContainerRef = useRef<HTMLDivElement>(null);
  const [carouselWidth, setCarouselWidth] = useState(1200);

  useEffect(() => {
    const updateDimensions = () => {
      if (carouselContainerRef.current) {
        setCarouselWidth(carouselContainerRef.current.clientWidth);
      } else if (typeof window !== 'undefined') {
        setCarouselWidth(window.innerWidth);
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    const timer = setTimeout(updateDimensions, 200);

    return () => {
      window.removeEventListener('resize', updateDimensions);
      clearTimeout(timer);
    };
  }, [activeMediaTab]);

  // Carousel active virtual index for seamless 3-set infinite track
  const [photoVirtualIndex, setPhotoVirtualIndex] = useState(projectPhotos.length || 5);
  const [planVirtualIndex, setPlanVirtualIndex] = useState(projectPlans.length || 3);
  const [allowTransition, setAllowTransition] = useState(true);

  useEffect(() => {
    if (projectPhotos.length > 0) {
      setPhotoVirtualIndex(projectPhotos.length);
    }
  }, [projectPhotos.length]);

  useEffect(() => {
    if (projectPlans.length > 0) {
      setPlanVirtualIndex(projectPlans.length);
    }
  }, [projectPlans.length]);

  // Drag state for uninterrupted real-time sliding
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);
  const isPointerDownRef = useRef(false);
  const hasDraggedRef = useRef(false);

  const handlePointerDown = (clientX: number) => {
    isPointerDownRef.current = true;
    startXRef.current = clientX;
    hasDraggedRef.current = false;
    setIsDragging(true);
    setAllowTransition(true);
  };

  const handlePointerMove = (clientX: number) => {
    if (!isPointerDownRef.current) return;
    const diff = clientX - startXRef.current;
    if (Math.abs(diff) > 6) {
      hasDraggedRef.current = true;
    }
    setDragOffset(diff);
  };

  const handlePointerUp = (type: 'photos' | 'plans') => {
    if (!isPointerDownRef.current) return;
    isPointerDownRef.current = false;
    setIsDragging(false);

    if (type === 'photos') {
      if (dragOffset < -40) {
        setPhotoVirtualIndex((prev) => prev + 1);
      } else if (dragOffset > 40) {
        setPhotoVirtualIndex((prev) => prev - 1);
      }
    } else {
      if (dragOffset < -40) {
        setPlanVirtualIndex((prev) => prev + 1);
      } else if (dragOffset > 40) {
        setPlanVirtualIndex((prev) => prev - 1);
      }
    }
    setDragOffset(0);
  };

  // Silent infinite wrap reset for Photos after transition ends
  useEffect(() => {
    const N = projectPhotos.length;
    if (photoVirtualIndex >= 2 * N) {
      const timer = setTimeout(() => {
        setAllowTransition(false);
        setPhotoVirtualIndex((prev) => prev - N);
      }, 450);
      return () => clearTimeout(timer);
    } else if (photoVirtualIndex < N) {
      const timer = setTimeout(() => {
        setAllowTransition(false);
        setPhotoVirtualIndex((prev) => prev + N);
      }, 450);
      return () => clearTimeout(timer);
    } else if (!allowTransition) {
      const timer = setTimeout(() => setAllowTransition(true), 50);
      return () => clearTimeout(timer);
    }
  }, [photoVirtualIndex, allowTransition, projectPhotos.length]);

  // Silent infinite wrap reset for Plans after transition ends
  useEffect(() => {
    const N = projectPlans.length;
    if (planVirtualIndex >= 2 * N) {
      const timer = setTimeout(() => {
        setAllowTransition(false);
        setPlanVirtualIndex((prev) => prev - N);
      }, 450);
      return () => clearTimeout(timer);
    } else if (planVirtualIndex < N) {
      const timer = setTimeout(() => {
        setAllowTransition(false);
        setPlanVirtualIndex((prev) => prev + N);
      }, 450);
      return () => clearTimeout(timer);
    } else if (!allowTransition) {
      const timer = setTimeout(() => setAllowTransition(true), 50);
      return () => clearTimeout(timer);
    }
  }, [planVirtualIndex, allowTransition, projectPlans.length]);

  // Lightbox Modal State & Drag Mechanics
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxType, setLightboxType] = useState<'photos' | 'plans'>('photos');
  const [isZoomed, setIsZoomed] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  // Lock background scrolling when lightbox is open
  useEffect(() => {
    if (!lightboxOpen) return;

    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    const originalBodyPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.body.style.paddingRight = originalBodyPaddingRight;
    };
  }, [lightboxOpen]);

  const [lightboxDragOffset, setLightboxDragOffset] = useState(0);
  const [isLightboxDragging, setIsLightboxDragging] = useState(false);
  const lightboxStartXRef = useRef(0);
  const isLightboxPointerDownRef = useRef(false);

  const handleLightboxPointerDown = (clientX: number) => {
    isLightboxPointerDownRef.current = true;
    lightboxStartXRef.current = clientX;
    setIsLightboxDragging(true);
  };

  const handleLightboxPointerMove = (clientX: number) => {
    if (!isLightboxPointerDownRef.current) return;
    const diff = clientX - lightboxStartXRef.current;
    setLightboxDragOffset(diff);
  };

  const handleLightboxPointerUp = (totalItems: number) => {
    if (!isLightboxPointerDownRef.current) return;
    isLightboxPointerDownRef.current = false;
    setIsLightboxDragging(false);

    if (lightboxDragOffset < -40) {
      setIsZoomed(false);
      setLightboxIndex((prev) => (prev + 1) % totalItems);
    } else if (lightboxDragOffset > 40) {
      setIsZoomed(false);
      setLightboxIndex((prev) => (prev - 1 + totalItems) % totalItems);
    }
    setLightboxDragOffset(0);
  };

  const activeLightboxItems = lightboxType === 'photos' ? projectPhotos : projectPlans;

  const openLightbox = (index: number, type: 'photos' | 'plans' = 'photos') => {
    setLightboxIndex(index);
    setLightboxType(type);
    setIsZoomed(false);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setIsZoomed(false);
  };

  const nextLightboxImage = useCallback(() => {
    setIsZoomed(false);
    setLightboxIndex((prev) => (prev + 1) % activeLightboxItems.length);
  }, [activeLightboxItems.length]);

  const prevLightboxImage = useCallback(() => {
    setIsZoomed(false);
    setLightboxIndex(
      (prev) => (prev - 1 + activeLightboxItems.length) % activeLightboxItems.length
    );
  }, [activeLightboxItems.length]);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (!lightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextLightboxImage();
      if (e.key === 'ArrowLeft') prevLightboxImage();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, nextLightboxImage, prevLightboxImage]);

  // Copy share link
  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard?.writeText(window.location.href);
      alert('Project link copied to clipboard!');
    }
  };

  // Dynamic lead inquiry state
  const [inquiryFirstName, setInquiryFirstName] = useState('');
  const [inquiryLastName, setInquiryLastName] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [inquiryCountry, setInquiryCountry] = useState<Country>(DEFAULT_COUNTRY);
  const [inquiryFieldErrors, setInquiryFieldErrors] = useState<{
    firstName?: string;
    lastName?: string;
    phone?: string;
    email?: string;
  }>({});
  const [inquirySubmitted, setInquirySubmitted] = useState(false);
  const [isSubmittingInquiry, setIsSubmittingInquiry] = useState(false);
  const [inquiryError, setInquiryError] = useState<string | null>(null);

  const handleInquiryFirstNameChange = (val: string) => {
    const cleaned = cleanName(val);
    setInquiryFirstName(cleaned);
    if (inquiryFieldErrors.firstName) {
      setInquiryFieldErrors((prev) => ({ ...prev, firstName: validateName(cleaned, 'First name').error }));
    }
  };

  const handleInquiryLastNameChange = (val: string) => {
    const cleaned = cleanName(val);
    setInquiryLastName(cleaned);
    if (inquiryFieldErrors.lastName && cleaned) {
      setInquiryFieldErrors((prev) => ({ ...prev, lastName: validateName(cleaned, 'Last name').error }));
    }
  };

  const handleInquiryEmailChange = (val: string) => {
    const cleaned = cleanEmail(val);
    setInquiryEmail(cleaned);
    if (inquiryFieldErrors.email) {
      setInquiryFieldErrors((prev) => ({ ...prev, email: validateEmail(cleaned, true).error }));
    }
  };

  const handleInquiryPhoneChange = (val: string) => {
    setInquiryPhone(val);
    if (inquiryFieldErrors.phone) {
      setInquiryFieldErrors((prev) => ({ ...prev, phone: validatePhone(val, inquiryCountry, true).error }));
    }
  };

  // Inquiry form submit
  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInquiryError(null);

    const firstNameRes = validateName(inquiryFirstName, 'First name');
    const lastNameRes = inquiryLastName.trim() ? validateName(inquiryLastName, 'Last name') : { isValid: true, error: '' };
    const emailRes = validateEmail(inquiryEmail, true);
    const phoneRes = validatePhone(inquiryPhone, inquiryCountry, true);

    const newErrors = {
      firstName: firstNameRes.error,
      lastName: lastNameRes.error,
      email: emailRes.error,
      phone: phoneRes.error,
    };
    setInquiryFieldErrors(newErrors);

    if (!firstNameRes.isValid || !lastNameRes.isValid || !emailRes.isValid || !phoneRes.isValid) {
      return;
    }

    const fullName = `${inquiryFirstName} ${inquiryLastName}`.trim();
    setIsSubmittingInquiry(true);
    try {
      const res = await submitEnquiry({
        name: fullName,
        phone: `${inquiryCountry.dialCode} ${inquiryPhone.trim()}`,
        email: inquiryEmail.trim(),
        projectName: project.name,
        message: inquiryMessage.trim(),
        source: 'Project Detail',
      });
      if (res && res.success) {
        setInquirySubmitted(true);
        setInquiryFieldErrors({});
      } else {
        setInquiryError(res?.message || 'Could not submit inquiry. Please try again.');
      }
    } catch (err: any) {
      setInquiryError(err?.message || 'Network error. Please try again.');
    } finally {
      setIsSubmittingInquiry(false);
    }
  };

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const projectFaqs = [
    {
      question: `What are the key specifications and floor plans available at ${project.name}?`,
      answer: `${project.name} offers premium ${project.bhk} layouts ranging from 550 to 1200 Sq. Ft. built with high-grade RCC frame structures, vitrified tile flooring, modular electrical fittings, and Vastu-compliant architecture.`,
    },
    {
      question: 'Are bank loan approvals available for purchasing this property?',
      answer: 'Yes, our projects are approved by leading nationalized and private banks including SBI, HDFC, ICICI, Axis Bank, and LIC Housing Finance. We offer full assistance with hassle-free loan processing.',
    },
    {
      question: 'What is the current construction status and expected possession date?',
      answer: `This project status is currently ${project.status}. For detailed unit availability, stage-wise construction schedule, and exact possession timelines, please submit an inquiry form or contact our customer desk.`,
    },
    {
      question: 'What safety standards and security features are provided?',
      answer: 'The project features 24x7 security personnel, gated entry/exit checkpoints, CCTV surveillance, automated fire-fighting systems, power backup, and dedicated maintenance support.',
    },
    {
      question: 'How can I schedule a physical site visit or request a brochure?',
      answer: 'You can easily request a callback or schedule a site visit by filling out the "Request more information" form above, or by contacting our sales team directly.',
    },
  ];

  // Dynamic FAQs (Pulls from CMS project.faqs)
  const dynamicFaqs =
    Array.isArray(project?.faqs) && project.faqs.length > 0
      ? project.faqs.map((f: any) => ({
          question: f.question,
          answer: f.answer,
        }))
      : projectFaqs;

  // Category page view (/projects/apartments, /projects/plots, or /projects/villas)
  if (isCategory) {
    return (
      <>
        <Navbar variant="hero" />
        <InnerPageHero
          title={categoryName}
          breadcrumb={`Home / Projects / ${categoryName}`}
          description={`Explore premium ${categoryName.toLowerCase()} developed by KPN Promoters.`}
          image="/images/projects/project_4.jpg"
        />

        <section className="bg-white px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
          <div className="mx-auto max-w-[1500px]">
            {/* Category Tabs */}
            <div className="mb-12 flex flex-wrap items-center gap-3 border-b border-slate-100 pb-8">
              <Link
                href="/projects"
                className="flex h-12 items-center justify-center rounded-full bg-slate-100 px-7 text-sm font-extrabold text-slate-700 transition-all hover:bg-slate-200"
              >
                All Projects
              </Link>
              <Link
                href="/projects/apartments"
                className={`flex h-12 items-center justify-center rounded-full px-7 text-sm font-extrabold transition-all ${
                  slug === 'apartments'
                    ? 'bg-[#f12131] text-white shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Apartments
              </Link>
              <Link
                href="/projects/plots"
                className={`flex h-12 items-center justify-center rounded-full px-7 text-sm font-extrabold transition-all ${
                  slug === 'plots'
                    ? 'bg-[#f12131] text-white shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Plots
              </Link>
              <Link
                href="/projects/villas"
                className={`flex h-12 items-center justify-center rounded-full px-7 text-sm font-extrabold transition-all ${
                  slug === 'villas'
                    ? 'bg-[#f12131] text-white shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Villas
              </Link>
            </div>

            {/* Project Cards Grid */}
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {categoryProjects.map((item) => (
                <Link
                  key={item.id}
                  href={`/projects/${item.slug}`}
                  className="group relative flex min-h-[380px] flex-col overflow-hidden rounded-[32px] border border-slate-100 shadow-md transition-all duration-500 hover:shadow-2xl"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="relative z-10 flex h-full flex-col justify-between bg-gradient-to-t from-black/80 via-black/30 to-transparent p-8 transition-colors duration-500 group-hover:bg-[#f12131]/90">
                    <span className="w-fit rounded-full bg-[#f12131] px-4 py-1.5 text-xs font-extrabold uppercase text-white shadow-xs group-hover:bg-white group-hover:text-slate-900">
                      {item.bhk}
                    </span>

                    <div className="mt-auto space-y-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-white/90">
                        <MapPin className="h-4 w-4 text-[#f12131] group-hover:text-white" />
                        <span>{item.location}</span>
                      </div>
                      <h3 className="text-2xl font-extrabold text-white">
                        {item.name}
                      </h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <Navbar variant="hero" />
      <InnerPageHero
        title={project.name}
        breadcrumb={`Projects / ${project.name}`}
        description="Explore landmark real estate developments engineered for luxury living, modern architecture, and lasting value."
        image={project.image}
      />

      <section className="bg-white px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
        <div className="mx-auto max-w-[1500px]">

          {/* =========================================================
              HEADER & 5 KEY STAT CARDS
          ========================================================= */}
          <div className="space-y-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold text-[#f12131]">
                <MapPin className="h-4 w-4" />
                <span className="text-slate-800">{project.location}</span>
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight text-[#29247c] sm:text-5xl lg:text-[56px] lg:leading-tight">
                {project.name}
              </h1>
            </div>

            {/* 5 Key Stat Cards */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 pt-4">
              <div className="flex items-center gap-4 rounded-full border border-slate-100 bg-slate-50/70 p-3.5 pr-6 shadow-xs">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-[#f12131]">
                  <Layers className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[11px] font-medium text-slate-400">Status</p>
                  <p className="text-sm font-bold text-[#29247c]">{project.status}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-full border border-slate-100 bg-slate-50/70 p-3.5 pr-6 shadow-xs">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-[#f12131]">
                  <Building className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[11px] font-medium text-slate-400">Project Type</p>
                  <p className="text-sm font-bold text-[#29247c]">{project.propertyType || project.type}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-full border border-slate-100 bg-slate-50/70 p-3.5 pr-6 shadow-xs">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-[#f12131]">
                  <Maximize className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[11px] font-medium text-slate-400">
                    {isApartment ? 'Apartment Size' : 'Project Area'}
                  </p>
                  <p className="text-sm font-bold text-[#29247c]">
                    {project.projectArea || project.plotSizes || (project as any).area || (project as any).apartmentSize || (isApartment ? '550 - 1200 Sq. Ft.' : '458 - 2171 Sq.Ft.')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-full border border-slate-100 bg-slate-50/70 p-3.5 pr-6 shadow-xs">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-[#f12131]">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[11px] font-medium text-slate-400">Commencement date</p>
                  <p className="text-sm font-bold text-[#29247c]">
                    {project.commencementDate || project.handoverTimeline || 'Ready for Possession'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-full border border-slate-100 bg-slate-50/70 p-3.5 pr-6 shadow-xs">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-[#f12131]">
                  <CircleDollarSign className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[11px] font-medium text-slate-400">Price Range</p>
                  <p className="text-sm font-bold text-[#29247c]">
                    {project.budget
                      ? (project.budget.includes('₹') ? project.budget : `₹ ${project.budget}`)
                      : 'Price on Request'}
                  </p>
                </div>
              </div>
            </div>

            {/* Featured Image Banner */}
            <div className="overflow-hidden rounded-[32px] border border-slate-100 shadow-xl my-10">
              <img
                src={project.image}
                alt={project.name}
                className="h-[450px] w-full object-cover sm:h-[550px]"
              />
            </div>

            {/* Centered Book Now CTA Button (Step 2: After Image & Before Project Description) */}
            <div className="my-8 flex flex-col items-center justify-center text-center" suppressHydrationWarning>
              <button
                type="button"
                suppressHydrationWarning
                onClick={() => setIsBookingModalOpen(true)}
                className="group relative inline-flex items-center gap-3 rounded-full bg-[#f12131] px-9 py-4 text-sm sm:text-base font-black text-white shadow-xl shadow-red-500/25 hover:bg-[#d81928] hover:shadow-2xl hover:shadow-red-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 cursor-pointer"
              >
                <span className="flex h-2.5 w-2.5 rounded-full bg-white animate-ping" />
                <span>Explore Units & Book Now</span>
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1.5" />
              </button>
              <p className="text-xs text-slate-500 font-semibold mt-2.5 flex items-center gap-1.5">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
                Live Block, Floor & Unit Availability Navigator
              </p>
            </div>
          </div>

          {/* =========================================================
              DESCRIPTION & KEY DETAILS
          ========================================================= */}
          <div className="mt-20 grid grid-cols-1 gap-12 lg:grid-cols-12">
            <div className="space-y-6 lg:col-span-7">
              <h2 className="text-3xl font-extrabold text-[#29247c] sm:text-4xl">
                Project description
              </h2>
              <p className="text-base font-medium leading-relaxed text-slate-600">
                {project.description ||
                  `${project.name} is a premier development situated in ${project.location}. Offering CMDA & RERA approved infrastructure, strategic transit access, and exceptional value appreciation.`}
              </p>

              {project.highlights && project.highlights.length > 0 && (
                <div className="pt-4">
                  <h3 className="text-xl font-bold text-[#29247c] mb-4">
                    Key Project Highlights
                  </h3>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {project.highlights.map((h: string, i: number) => (
                      <div key={i} className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#f12131] text-xs font-bold text-white">
                          ✓
                        </span>
                        <span className="text-xs font-semibold text-slate-700 leading-relaxed">{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-5">
              <div className="space-y-6 rounded-[28px] border border-slate-100 bg-slate-50/60 p-8 shadow-sm">
                <h3 className="text-xl font-bold text-[#29247c]">
                  Key Details
                </h3>
                <ul className="space-y-3.5 text-sm leading-relaxed text-slate-600">
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#f12131]" />
                    <span><strong className="text-slate-800">Location:</strong> {project.address || project.location}.</span>
                  </li>
                  {project.plotSizes && (
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#f12131]" />
                      <span><strong className="text-slate-800">Plot Extents:</strong> {project.plotSizes}.</span>
                    </li>
                  )}
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#f12131]" />
                    <span><strong className="text-slate-800">Type:</strong> {project.propertyType || project.type} ({project.bhk}).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#f12131]" />
                    <span><strong className="text-slate-800">Status:</strong> {project.status} (CMDA & RERA Approved).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#f12131]" />
                    <span><strong className="text-slate-800">Pricing:</strong> {project.budget}.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* =========================================================
              BROCHURE LOCATION ADVANTAGES MATRIX (IF AVAILABLE)
          ========================================================= */}
          {project.locationAdvantages && (
            <div className="mt-16">
              <h2 className="mb-8 text-3xl font-extrabold text-[#29247c]">
                Location Advantages
              </h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {/* Schools & Colleges */}
                {project.locationAdvantages.schoolsColleges && (
                  <div className="rounded-[24px] border border-slate-100 bg-white p-6 shadow-sm">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-[#f12131]">
                        <Building className="h-5 w-5" />
                      </div>
                      <h4 className="font-extrabold text-[#29247c]">Schools & Colleges</h4>
                    </div>
                    <ul className="space-y-2 text-xs font-semibold text-slate-600">
                      {project.locationAdvantages.schoolsColleges.map((item: string, idx: number) => (
                        <li key={idx} className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#f12131]" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Hospitals */}
                {project.locationAdvantages.hospitals && (
                  <div className="rounded-[24px] border border-slate-100 bg-white p-6 shadow-sm">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-[#f12131]">
                        <Shield className="h-5 w-5" />
                      </div>
                      <h4 className="font-extrabold text-[#29247c]">Hospitals</h4>
                    </div>
                    <ul className="space-y-2 text-xs font-semibold text-slate-600">
                      {project.locationAdvantages.hospitals.map((item: string, idx: number) => (
                        <li key={idx} className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#f12131]" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Public Facilities */}
                {project.locationAdvantages.publicFacilities && (
                  <div className="rounded-[24px] border border-slate-100 bg-white p-6 shadow-sm">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-[#f12131]">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <h4 className="font-extrabold text-[#29247c]">Public Facilities</h4>
                    </div>
                    <ul className="space-y-2 text-xs font-semibold text-slate-600">
                      {project.locationAdvantages.publicFacilities.map((item: string, idx: number) => (
                        <li key={idx} className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#f12131]" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Corporate Offices */}
                {project.locationAdvantages.corporateOffices && (
                  <div className="rounded-[24px] border border-slate-100 bg-white p-6 shadow-sm">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-[#f12131]">
                        <Layers className="h-5 w-5" />
                      </div>
                      <h4 className="font-extrabold text-[#29247c]">Corporate Offices</h4>
                    </div>
                    <ul className="space-y-2 text-xs font-semibold text-slate-600">
                      {project.locationAdvantages.corporateOffices.map((item: string, idx: number) => (
                        <li key={idx} className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#f12131]" />
                          {item}
                        </li>
                      ))}
                    </ul>                    
                  </div>
                )}
              </div>
            </div>
          )}
          <hr className="my-20 border-t border-slate-100" />

          {/* =========================================================
              FEATURES & AMENITIES (DYNAMIC FROM CMS / BACKEND)
          ========================================================= */}
          <div>
            <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-3xl font-extrabold text-[#29247c] sm:text-4xl">
                  Features & amenities
                </h2>
                <p className="mt-2 text-xs sm:text-sm text-slate-500 font-medium">
                  Designed for modern convenience, security, and long-term community value.
                </p>
              </div>

              {Boolean(project.brochureUrl && project.brochureUrl.trim() !== '') && (
                <button
                  type="button"
                  suppressHydrationWarning
                  onClick={() => {
                    window.dispatchEvent(
                      new CustomEvent('kpn_open_brochure_modal', {
                        detail: {
                          brochureUrl: project.brochureUrl,
                          projectName: project.name,
                        },
                      })
                    );
                  }}
                  className="group inline-flex items-center gap-3 rounded-full bg-[#f12131] px-6 py-3.5 text-white shadow-md transition-all duration-300 hover:bg-red-600 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white transition-colors">
                    <FileText className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-extrabold">Download Brochure</span>
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-white transition-colors">
                    <Download className="h-3.5 w-3.5" />
                  </div>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {dynamicAmenities.map((item: any, idx: number) => {
                const IconComp = getAmenityIcon(item.icon, item.name);
                return (
                  <div
                    key={`amenity-${idx}`}
                    className="rounded-[28px] border border-slate-100 bg-slate-50/70 p-8 text-center transition duration-300 hover:bg-white hover:shadow-lg hover:-translate-y-1"
                  >
                    <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-[#f12131] text-white shadow-md">
                      <IconComp className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-bold text-[#29247c]">{item.name}</h3>
                    <p className="mt-3 text-xs leading-relaxed text-slate-500">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* =========================================================
              TECHNICAL SPECIFICATIONS (IF CONFIGURED IN CMS)
          ========================================================= */}
          {project.specifications &&
            typeof project.specifications === 'object' &&
            Object.entries(project.specifications).some(
              ([_, val]) => val && String(val).trim() !== ''
            ) && (
              <>
                <hr className="my-20 border-t border-slate-100" />
                <div>
                  <div className="mb-10">
                    <h2 className="text-3xl font-extrabold text-[#29247c] sm:text-4xl">
                      Technical specifications
                    </h2>
                    <p className="mt-2 text-sm text-slate-500 font-medium">
                      Built with premium structural engineering, branded materials, and rigorous quality standards.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {Object.entries(project.specifications)
                      .filter(([_, val]) => val && String(val).trim() !== '')
                      .map(([key, val]: [string, any], idx: number) => {
                        const IconComp =
                          key === 'structure'
                            ? Building
                            : key === 'flooring'
                            ? Layers
                            : key === 'doors'
                            ? Shield
                            : key === 'windows'
                            ? Maximize
                            : key === 'electrical'
                            ? Zap
                            : key === 'plumbing'
                            ? Waves
                            : key === 'kitchen'
                            ? Sparkles
                            : Wrench;

                        const title = key.charAt(0).toUpperCase() + key.slice(1);
                        return (
                          <div
                            key={idx}
                            className="rounded-[24px] border border-slate-100 bg-white p-6 shadow-xs hover:shadow-md transition"
                          >
                            <div className="mb-4 flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-[#f12131]">
                                <IconComp className="h-5 w-5" />
                              </div>
                              <h4 className="font-extrabold text-[#29247c]">{title}</h4>
                            </div>
                            <p className="text-xs leading-relaxed text-slate-600 font-medium">
                              {String(val)}
                            </p>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </>
            )}

          <hr className="my-20 border-t border-slate-100" />

          {/* =========================================================
              MEDIA SECTION: PHOTOS, PLANS, VIDEO, STREET VIEW
          ========================================================= */}
          <div>
            <div className="mb-10 flex flex-wrap items-center justify-between gap-6">
              <h2 className="text-3xl font-extrabold text-[#29247c] sm:text-4xl">
                Media
              </h2>

              {/* 4 Tabs Pill Bar */}
              <div className="flex flex-wrap items-center gap-3">
                {[
                  { label: 'Photos', icon: PhotoIcon },
                  { label: 'Plans', icon: PlanIcon },
                  { label: 'Video', icon: VideoIcon },
                  { label: 'Street View', icon: StreetIcon },
                ].map((tab) => {
                  const IconComp = tab.icon;
                  const isActive = activeMediaTab === tab.label;
                  return (
                    <button
                      key={tab.label}
                      onClick={() => setActiveMediaTab(tab.label)}
                      suppressHydrationWarning
                      className={`flex h-11 items-center gap-2 rounded-full px-6 text-sm font-extrabold transition-all duration-300 ${
                        isActive
                          ? 'bg-[#f12131] text-white shadow-md'
                          : 'border border-slate-200 bg-white text-slate-700 hover:border-[#f12131] hover:text-[#f12131]'
                      }`}
                    >
                      <IconComp className="h-4 w-4" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
                       {/* TAB 1: PHOTOS CAROUSEL (GLITCH-FREE CONTINUOUS INFINITE STREAM OR SINGLE PHOTO) */}
            {activeMediaTab === 'Photos' && (
              projectPhotos.length <= 1 ? (
                <div className="relative mx-auto max-w-4xl overflow-hidden rounded-[32px] border border-slate-100 shadow-xl my-4">
                  <div
                    onClick={() => openLightbox(0, 'photos')}
                    className="group relative h-[380px] sm:h-[480px] lg:h-[520px] w-full cursor-pointer overflow-hidden"
                  >
                    <img
                      src={projectPhotos[0]?.src || project?.image || '/images/projects/apt_lenid.jpg'}
                      alt={projectPhotos[0]?.title || project?.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-5 right-5 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-slate-800 shadow-lg backdrop-blur-xs transition-transform group-hover:scale-110">
                      <Maximize className="h-5 w-5" />
                    </div>
                    <div className="absolute bottom-5 left-5 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-xs font-semibold uppercase tracking-wider text-white/80">Click to expand</p>
                      <p className="text-base font-bold">{projectPhotos[0]?.title || project?.name}</p>
                    </div>
                  </div>
                </div>
              ) : (() => {
                const N = projectPhotos.length;
                const extendedPhotos = [
                  ...projectPhotos,
                  ...projectPhotos,
                  ...projectPhotos,
                ];
                const cardWidth =
                  carouselWidth > 0
                    ? Math.min(800, carouselWidth * 0.72)
                    : 600;
                const gap = 24;
                const baseTranslateX =
                  carouselWidth > 0
                    ? carouselWidth / 2 -
                      (photoVirtualIndex * (cardWidth + gap) + cardWidth / 2)
                    : 0;
                const finalTranslateX = baseTranslateX + dragOffset;

                return (
                  <div
                    ref={carouselContainerRef}
                    onPointerDown={(e) => handlePointerDown(e.clientX)}
                    onPointerMove={(e) => handlePointerMove(e.clientX)}
                    onPointerUp={() => handlePointerUp('photos')}
                    onPointerLeave={() => handlePointerUp('photos')}
                    onContextMenu={(e) => e.preventDefault()}
                    className="relative w-full overflow-hidden py-6 select-none cursor-grab active:cursor-grabbing"
                  >
                    <div
                      style={{
                        transform: `translateX(${finalTranslateX}px)`,
                        transition:
                          isDragging || !allowTransition
                            ? 'none'
                            : 'transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)',
                        width: 'max-content',
                      }}
                      className="flex gap-6 items-center will-change-transform"
                    >
                      {extendedPhotos.map((photo, i) => {
                        const isActive = i === photoVirtualIndex;
                        const realIndex = i % N;

                        return (
                          <div
                            key={`photo-clone-${i}`}
                            style={{ width: cardWidth }}
                            onClick={() => {
                              if (hasDraggedRef.current) return;
                              if (isActive) {
                                openLightbox(realIndex, 'photos');
                              } else {
                                setPhotoVirtualIndex(i);
                              }
                            }}
                            className={`
                              relative
                              shrink-0
                              h-[360px]
                              sm:h-[460px]
                              lg:h-[500px]
                              rounded-[32px]
                              overflow-hidden
                              cursor-pointer
                              transition-all
                              duration-500
                              ${
                                isActive
                                  ? 'opacity-100 shadow-2xl scale-100 z-10'
                                  : 'opacity-35 hover:opacity-60 scale-[0.95] z-0'
                              }
                            `}
                          >
                            <img
                              src={photo.src}
                              alt={photo.title}
                              className="h-full w-full object-cover pointer-events-none transition-transform duration-700 hover:scale-105"
                            />

                            {!isActive && (
                              <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px] transition-colors" />
                            )}

                            {isActive && (
                              <div className="absolute bottom-5 right-5 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-slate-800 shadow-lg backdrop-blur-xs transition-transform hover:scale-110">
                                <Maximize className="h-5 w-5" />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()
            )}

            {/* TAB 2: PLANS CAROUSEL OR EMPTY STATE */}
            {activeMediaTab === 'Plans' && (
              projectPlans.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-[32px] border border-slate-100 bg-slate-50/70 p-12 sm:p-16 text-center my-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-[#f12131] shadow-md mb-4">
                    <PlanIcon className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-[#29247c]">
                    Floor Plans & Layout Master Blueprints
                  </h3>
                  <p className="mt-2 max-w-md text-sm text-slate-500 leading-relaxed">
                    Detailed architectural blueprints, layout boundaries, and stage dimensions for {project.name} are available upon request.
                  </p>
                  <div className="mt-6 flex flex-wrap justify-center gap-3">
                    {Boolean(project.brochureUrl && project.brochureUrl.trim() !== '') && (
                      <button
                        type="button"
                        onClick={() => {
                          window.dispatchEvent(
                            new CustomEvent('kpn_open_brochure_modal', {
                              detail: {
                                brochureUrl: project.brochureUrl,
                                projectName: project.name,
                              },
                            })
                          );
                        }}
                        className="inline-flex items-center gap-2 rounded-full bg-[#f12131] px-6 py-3 text-xs font-extrabold text-white shadow-md hover:bg-red-600 transition cursor-pointer"
                      >
                        <Download className="h-4 w-4" />
                        <span>Download Brochure</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setIsBookingModalOpen(true)}
                      className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 text-xs font-extrabold text-slate-800 shadow-xs hover:bg-slate-50 transition cursor-pointer"
                    >
                      <span>Explore Unit Availability</span>
                    </button>
                  </div>
                </div>
              ) : projectPlans.length === 1 ? (
                <div className="relative mx-auto max-w-4xl overflow-hidden rounded-[32px] border border-slate-100 shadow-xl my-4">
                  <div
                    onClick={() => openLightbox(0, 'plans')}
                    className="group relative h-[380px] sm:h-[480px] lg:h-[520px] w-full cursor-pointer overflow-hidden bg-slate-50"
                  >
                    <img
                      src={projectPlans[0].src}
                      alt={projectPlans[0].title}
                      className="h-full w-full object-contain p-4 transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-5 right-5 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-slate-800 shadow-lg backdrop-blur-xs transition-transform group-hover:scale-110">
                      <Maximize className="h-5 w-5" />
                    </div>
                    <div className="absolute bottom-5 left-5 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-xs font-semibold uppercase tracking-wider text-white/80">Click to expand</p>
                      <p className="text-base font-bold">{projectPlans[0].title}</p>
                    </div>
                  </div>
                </div>
              ) : (() => {
                const N = projectPlans.length;
                const extendedPlans = [
                  ...projectPlans,
                  ...projectPlans,
                  ...projectPlans,
                ];
                const cardWidth =
                  carouselWidth > 0
                    ? Math.min(800, carouselWidth * 0.72)
                    : 600;
                const gap = 24;
                const baseTranslateX =
                  carouselWidth > 0
                    ? carouselWidth / 2 -
                      (planVirtualIndex * (cardWidth + gap) + cardWidth / 2)
                    : 0;
                const finalTranslateX = baseTranslateX + dragOffset;

                return (
                  <div
                    ref={carouselContainerRef}
                    onPointerDown={(e) => handlePointerDown(e.clientX)}
                    onPointerMove={(e) => handlePointerMove(e.clientX)}
                    onPointerUp={() => handlePointerUp('plans')}
                    onPointerLeave={() => handlePointerUp('plans')}
                    onContextMenu={(e) => e.preventDefault()}
                    className="relative w-full overflow-hidden py-6 select-none cursor-grab active:cursor-grabbing"
                  >
                    <div
                      style={{
                        transform: `translateX(${finalTranslateX}px)`,
                        transition:
                          isDragging || !allowTransition
                            ? 'none'
                            : 'transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)',
                        width: 'max-content',
                      }}
                      className="flex gap-6 items-center will-change-transform"
                    >
                      {extendedPlans.map((plan, i) => {
                        const isActive = i === planVirtualIndex;
                        const realIndex = i % N;

                        return (
                          <div
                            key={`plan-clone-${i}`}
                            style={{ width: cardWidth }}
                            onClick={() => {
                              if (hasDraggedRef.current) return;
                              if (isActive) {
                                openLightbox(realIndex, 'plans');
                              } else {
                                setPlanVirtualIndex(i);
                              }
                            }}
                            className={`
                              relative
                              shrink-0
                              h-[360px]
                              sm:h-[460px]
                              lg:h-[500px]
                              rounded-[32px]
                              overflow-hidden
                              cursor-pointer
                              transition-all
                              duration-500
                              ${
                                isActive
                                  ? 'opacity-100 shadow-2xl scale-100 z-10'
                                  : 'opacity-35 hover:opacity-60 scale-[0.95] z-0'
                              }
                            `}
                          >
                            <img
                              src={plan.src}
                              alt={plan.title}
                              className="h-full w-full object-cover pointer-events-none transition-transform duration-700 hover:scale-105"
                            />

                            {!isActive && (
                              <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px] transition-colors" />
                            )}

                            {isActive && (
                              <div className="absolute bottom-5 right-5 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-slate-800 shadow-lg backdrop-blur-xs transition-transform hover:scale-110">
                                <Maximize className="h-5 w-5" />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()
            )}

            {/* TAB 3: VIDEO */}
            {activeMediaTab === 'Video' && (
              project.walkthroughVideoUrl && project.walkthroughVideoUrl.trim() !== '' ? (
                <div className="relative overflow-hidden rounded-[32px] border border-slate-100 shadow-xl my-4">
                  {!isVideoPlaying ? (
                    <div className="group relative h-[450px] sm:h-[550px] w-full">
                      <img
                        src={project.image}
                        alt="Video cover"
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/30" />
                      
                      {/* Big Red Play Button */}
                      <button
                        onClick={() => setIsVideoPlaying(true)}
                        aria-label="Play Project Video Walkthrough"
                        suppressHydrationWarning
                        className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#f12131] text-white shadow-2xl transition-transform duration-300 hover:scale-115 hover:bg-[#d81928] cursor-pointer"
                      >
                        <Play className="h-8 w-8 fill-current ml-1" />
                      </button>
                    </div>
                  ) : (
                    <div className="relative h-[450px] sm:h-[550px] w-full bg-black">
                      {(() => {
                        const videoUrl = project.walkthroughVideoUrl || '';
                        const ytMatch = videoUrl.match(
                          /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/
                        );
                        if (ytMatch) {
                          return (
                            <iframe
                              title={`${project.name} Walkthrough Video`}
                              src={`https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1`}
                              className="h-full w-full border-0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          );
                        }
                        const vimeoMatch = videoUrl.match(/vimeo\.com\/(?:video\/)?([0-9]+)/);
                        if (vimeoMatch) {
                          return (
                            <iframe
                              title={`${project.name} Walkthrough Video`}
                              src={`https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`}
                              className="h-full w-full border-0"
                              allow="autoplay; fullscreen; picture-in-picture"
                              allowFullScreen
                            />
                          );
                        }
                        return (
                          <video
                            controls
                            autoPlay
                            className="h-full w-full object-contain"
                          >
                            <source
                              src={videoUrl}
                              type="video/mp4"
                            />
                            Your browser does not support the video tag.
                          </video>
                        );
                      })()}
                    </div>
                  )}
                </div>
              ) : (
                <div className="relative overflow-hidden rounded-[32px] border border-slate-100 shadow-xl bg-gradient-to-br from-[#29247c] to-[#18154b] text-white p-12 sm:p-16 text-center my-4">
                  <div className="relative z-10 mx-auto max-w-lg space-y-4">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md">
                      <VideoIcon className="h-8 w-8" />
                    </div>
                    <h3 className="text-2xl font-extrabold sm:text-3xl">Walkthrough Video</h3>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      A live video walkthrough for {project.name} is being produced. Schedule a guided site visit with our property consultant or explore unit availability online.
                    </p>
                    <div className="pt-4 flex flex-wrap justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => setIsBookingModalOpen(true)}
                        className="rounded-full bg-[#f12131] px-7 py-3.5 text-xs font-extrabold text-white shadow-lg hover:bg-[#d81928] transition-all hover:scale-105 active:scale-95 cursor-pointer"
                      >
                        Explore Units & Book
                      </button>
                    </div>
                  </div>
                </div>
              )
            )}

            {/* TAB 4: 360 STREET VIEW */}
            {activeMediaTab === 'Street View' && (
              project.streetViewUrl && project.streetViewUrl.trim() !== '' ? (
                <div className="h-[480px] sm:h-[600px] w-full overflow-hidden rounded-[32px] border border-slate-100 shadow-xl my-4">
                  <iframe
                    title={`${project.name} 360 Interactive Street View`}
                    src={project.streetViewUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              ) : project.mapEmbedUrl && project.mapEmbedUrl.trim() !== '' ? (
                <div className="h-[480px] sm:h-[600px] w-full overflow-hidden rounded-[32px] border border-slate-100 shadow-xl my-4">
                  <iframe
                    title={`${project.name} Location Map`}
                    src={project.mapEmbedUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              ) : (
                <div className="relative overflow-hidden rounded-[32px] border border-slate-100 shadow-xl bg-gradient-to-br from-slate-900 to-[#29247c] text-white p-12 sm:p-16 text-center my-4">
                  <div className="relative z-10 mx-auto max-w-lg space-y-4">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md">
                      <StreetIcon className="h-8 w-8" />
                    </div>
                    <h3 className="text-2xl font-extrabold sm:text-3xl">360° Interactive Street View</h3>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      360° Virtual tour for {project.name} is available on-site during your scheduled visit. Navigate directly to the project address using Google Maps below.
                    </p>
                    <div className="pt-4 flex flex-wrap justify-center gap-3">
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                          project.address || `${project.name} ${project.location}`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full bg-[#f12131] px-7 py-3.5 text-xs font-extrabold text-white shadow-lg hover:bg-[#d81928] transition-all hover:scale-105 active:scale-95 cursor-pointer"
                      >
                        <MapPin className="h-4 w-4" />
                        <span>Get Directions to Site</span>
                      </a>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>

          <hr className="my-20 border-t border-slate-100" />

          {/* =========================================================
              LOCATION & MAP
          ========================================================= */}
          <div className="overflow-hidden">
            <h2 className="mb-12 text-3xl font-extrabold text-[#29247c] sm:text-4xl">
              Location
            </h2>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
              {/* ADDRESS & TRANSPORT (SLIDES IN FROM LEFT) */}
              <FadeIn direction="left" distance={40} duration={0.8} className="space-y-8 rounded-[32px] border border-slate-100 bg-white p-8 shadow-sm sm:p-10 lg:col-span-6">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                    ADDRESS
                  </p>
                  <div className="mt-4 flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
                    <p className="max-w-[280px] text-2xl font-extrabold leading-tight text-[#29247c]">
                      {project.address || `${project.name}, ${project.location}`}
                    </p>

                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        project.address || `${project.name} ${project.location}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex h-12 items-center gap-3 rounded-full border border-slate-200 bg-white pl-6 pr-2 text-sm font-bold text-slate-900 shadow-xs transition hover:shadow-md"
                    >
                      <span>Get Direction</span>
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f12131] text-white transition-transform group-hover:rotate-45">
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </a>
                  </div>
                </div>

                <hr className="border-t border-slate-100" />

                <div className="space-y-6">
                  <h3 className="text-lg font-extrabold text-[#29247c]">
                    Key transport & landmarks
                  </h3>

                  <div className="grid grid-cols-2 gap-x-8 gap-y-5 text-sm">
                    {nearbyLandmarks.map((item: any, idx: number) => {
                      const name =
                        typeof item === 'string'
                          ? item
                          : item.name || item.title || item.location || 'Landmark';
                      const distance =
                        typeof item === 'string'
                          ? ''
                          : item.distance || item.dist || '';
                      return (
                        <div key={idx}>
                          <p className="text-xs font-semibold text-slate-400">{name}</p>
                          <p className="text-base font-extrabold text-slate-900">
                            {distance || 'Nearby'}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </FadeIn>

              {/* LOCATION MAP (SLIDES IN FROM RIGHT) */}
              <FadeIn direction="right" distance={40} duration={0.8} delay={0.1} className="h-[480px] overflow-hidden rounded-[32px] border border-slate-100 bg-slate-100 shadow-md sm:h-[580px] lg:col-span-6">
                <iframe
                  title={`${project.name} Location Map`}
                  src={
                    project.mapEmbedUrl && !project.mapEmbedUrl.includes('!6m8')
                      ? project.mapEmbedUrl
                      : "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3889.7854619438317!2d80.06316277578278!3d12.857147717326888!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a52f77864f14c27%3A0x882a1708f519543e!2sUrapakkam%2C%20Chennai%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                  }
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </FadeIn>
            </div>
          </div>

          <hr className="my-20 border-t border-slate-100" />

          {/* =========================================================
              REQUEST INFORMATION FORM & BOTTOM NAVIGATION
          ========================================================= */}
          <FadeIn direction="up">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="mb-10 text-3xl font-extrabold text-[#29247c] sm:text-4xl">
                Request more information
              </h2>

              {inquirySubmitted ? (
                <div className="rounded-[28px] border border-emerald-200 bg-emerald-50/90 p-8 text-center shadow-sm animate-in fade-in duration-300">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md">
                    ✓
                  </div>
                  <h3 className="text-xl font-extrabold text-[#29247c]">
                    Thank you! Your enquiry has been received.
                  </h3>
                  <p className="mt-2 text-sm text-slate-600">
                    Our sales team will get in touch with you shortly regarding {project.name}.
                  </p>
                  <button
                    type="button"
                    suppressHydrationWarning
                    onClick={() => {
                      setInquirySubmitted(false);
                      setInquiryFirstName('');
                      setInquiryLastName('');
                      setInquiryPhone('');
                      setInquiryEmail('');
                      setInquiryMessage('');
                    }}
                    className="mt-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-2.5 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50 transition"
                  >
                    Send another inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleInquirySubmit} noValidate className="space-y-5 text-left">
                  {inquiryError && (
                    <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-700">
                      {inquiryError}
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <input
                        type="text"
                        required
                        placeholder="First Name*"
                        value={inquiryFirstName}
                        onChange={(e) => handleInquiryFirstNameChange(e.target.value)}
                        onBlur={() => {
                          setInquiryFieldErrors((prev) => ({
                            ...prev,
                            firstName: validateName(inquiryFirstName, 'First name').error,
                          }));
                        }}
                        suppressHydrationWarning
                        className={`h-14 w-full rounded-full border px-7 text-sm font-semibold text-slate-800 outline-none placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-[#f12131]/30 ${
                          inquiryFieldErrors.firstName
                            ? 'border-red-400 bg-red-50/40 text-red-900'
                            : 'border-0 bg-slate-100/80'
                        }`}
                      />
                      {inquiryFieldErrors.firstName && (
                        <p className="mt-1.5 px-4 text-xs font-semibold text-red-600 animate-in fade-in duration-200">
                          {inquiryFieldErrors.firstName}
                        </p>
                      )}
                    </div>

                    <div>
                      <input
                        type="text"
                        placeholder="Last Name"
                        value={inquiryLastName}
                        onChange={(e) => handleInquiryLastNameChange(e.target.value)}
                        onBlur={() => {
                          if (inquiryLastName.trim()) {
                            setInquiryFieldErrors((prev) => ({
                              ...prev,
                              lastName: validateName(inquiryLastName, 'Last name').error,
                            }));
                          }
                        }}
                        suppressHydrationWarning
                        className={`h-14 w-full rounded-full border px-7 text-sm font-semibold text-slate-800 outline-none placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-[#f12131]/30 ${
                          inquiryFieldErrors.lastName
                            ? 'border-red-400 bg-red-50/40 text-red-900'
                            : 'border-0 bg-slate-100/80'
                        }`}
                      />
                      {inquiryFieldErrors.lastName && (
                        <p className="mt-1.5 px-4 text-xs font-semibold text-red-600 animate-in fade-in duration-200">
                          {inquiryFieldErrors.lastName}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <PhoneInputWithCountry
                        variant="pill"
                        phone={inquiryPhone}
                        selectedCountry={inquiryCountry}
                        onPhoneChange={handleInquiryPhoneChange}
                        onCountryChange={(c) => {
                          setInquiryCountry(c);
                          if (inquiryPhone) {
                            setInquiryFieldErrors((prev) => ({
                              ...prev,
                              phone: validatePhone(inquiryPhone, c, true).error,
                            }));
                          }
                        }}
                        error={inquiryFieldErrors.phone}
                        required
                        onBlur={() => {
                          setInquiryFieldErrors((prev) => ({
                            ...prev,
                            phone: validatePhone(inquiryPhone, inquiryCountry, true).error,
                          }));
                        }}
                      />
                    </div>

                    <div>
                      <input
                        type="email"
                        required
                        placeholder="Email Address* (e.g. name@gmail.com)"
                        value={inquiryEmail}
                        onChange={(e) => handleInquiryEmailChange(e.target.value)}
                        onBlur={() => {
                          setInquiryFieldErrors((prev) => ({
                            ...prev,
                            email: validateEmail(inquiryEmail, true).error,
                          }));
                        }}
                        pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.com"
                        title="Email must include '@' and end with '.com' (e.g. name@gmail.com)"
                        suppressHydrationWarning
                        className={`h-14 w-full rounded-full border px-7 text-sm font-semibold text-slate-800 outline-none placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-[#f12131]/30 ${
                          inquiryFieldErrors.email
                            ? 'border-red-400 bg-red-50/40 text-red-900'
                            : 'border-0 bg-slate-100/80'
                        }`}
                      />
                      {inquiryFieldErrors.email && (
                        <p className="mt-1.5 px-4 text-xs font-semibold text-red-600 animate-in fade-in duration-200">
                          {inquiryFieldErrors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <textarea
                    rows={4}
                    placeholder="Message or specific requirements (optional)..."
                    value={inquiryMessage}
                    onChange={(e) => setInquiryMessage(e.target.value)}
                    suppressHydrationWarning
                    className="w-full resize-none rounded-[28px] border-0 bg-slate-100/80 p-7 text-sm font-semibold text-slate-800 outline-none placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-[#f12131]/30"
                  />

                  <div className="flex justify-center pt-2">
                    <button
                      type="submit"
                      disabled={isSubmittingInquiry}
                      suppressHydrationWarning
                      className="group flex h-14 items-center gap-5 rounded-full border border-slate-200 bg-white pl-8 pr-2 text-sm font-extrabold text-slate-900 shadow-md transition hover:shadow-lg disabled:opacity-60 cursor-pointer"
                    >
                      <span>{isSubmittingInquiry ? 'Submitting...' : 'Submit Inquiry'}</span>
                      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f12131] text-white transition-transform duration-300 group-hover:translate-x-1">
                        <ArrowRight className="h-5 w-5" />
                      </span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </FadeIn>

          {/* Bottom Project Navigation */}
            <div className="mt-24">
              <div className="flex items-center justify-between rounded-full border border-slate-200 bg-white p-2 sm:px-8 sm:py-4 shadow-sm">
                <Link
                  href={`/projects/${prevProject.slug}`}
                  className="flex items-center gap-2 text-sm font-extrabold text-slate-800 transition hover:text-[#f12131]"
                >
                  <ArrowLeft className="h-4 w-4 text-[#f12131]" />
                  <span>previous project</span>
                </Link>

                <Link
                  href={`/projects/${nextProject.slug}`}
                  className="flex items-center gap-2 text-sm font-extrabold text-slate-800 transition hover:text-[#f12131]"
                >
                  <span>next project</span>
                  <ChevronRight className="h-4 w-4 text-[#f12131]" />
                </Link>
              </div>
            </div>
            {/* =========================================================
              FAQ SECTION (Matching kpndemos.netlify.app/faqs design)
            ========================================================= */}
            <div className="mt-24 pt-12">
              {/* Header: Centered Label Badge & Large Heading */}
              <div className="mx-auto max-w-4xl text-center">
                <FadeIn direction="up" distance={30}>
                <RunningPillBadge text="FIND YOUR ANSWERS" />
                  <h2 className="mt-6 text-4xl font-extrabold tracking-tight text-[#382b88] sm:text-5xl lg:text-[64px] lg:leading-[1.05]">
                    Read most frequent
                    <br />
                    questions
                  </h2>
                </FadeIn>
              </div>

              {/* Accordion Items Stream with Left Purple Icon Badge & Right Chevron */}
              <div className="mx-auto mt-16 max-w-4xl space-y-0">
                {dynamicFaqs.map((faq: any, index: number) => {
                  const isOpen = openFaqIndex === index;
                  return (
                    <FadeIn
                      key={index}
                      direction="up"
                      distance={20}
                      delay={index * 0.06}
                    >
                      <div className="border-b border-slate-200/80 py-6 transition-colors">
                        <button
                          type="button"
                          suppressHydrationWarning
                          onClick={() =>
                            setOpenFaqIndex(isOpen ? null : index)
                          }
                          className="flex w-full items-start justify-between gap-6 text-left"
                        >
                          {/* Question Badge Icon + Question Text */}
                          <div className="flex items-center gap-5 sm:gap-6">
                            <div
                              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white shadow-sm transition-colors duration-300 ${
                                isOpen ? 'bg-[#f12131]' : 'bg-[#382b88]'
                              }`}
                            >
                              <HelpCircle className="h-6 w-6" />
                            </div>
                            <span className="text-lg font-bold text-slate-900 sm:text-xl md:text-[22px]">
                              {faq.question}
                            </span>
                          </div>

                          {/* Right Chevron Indicator */}
                          <span className="mt-2 text-slate-500 transition-transform duration-300">
                            {isOpen ? (
                              <ChevronUp className="h-5 w-5 text-[#382b88]" />
                            ) : (
                              <ChevronRight className="h-5 w-5 text-slate-400" />
                            )}
                          </span>
                        </button>

                        {/* Collapsible Answer */}
                        <motion.div
                          initial={false}
                          animate={{
                            height: isOpen ? 'auto' : 0,
                            opacity: isOpen ? 1 : 0,
                          }}
                          transition={{
                            duration: 0.35,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          className="overflow-hidden"
                        >
                          <div className="pl-16 sm:pl-17 pr-6 pt-4 text-base font-normal leading-relaxed text-slate-600 sm:text-lg">
                            {faq.answer}
                          </div>
                        </motion.div>
                      </div>
                    </FadeIn>
                  );
                })}
              </div>
            </div>

        </div>
      </section>

      {/* =============================================================
          FULLSCREEN LIGHTBOX MODAL (Matching Screenshot 2)
      ============================================================= */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-[9999] flex flex-col justify-between bg-black/92 p-4 sm:p-6 backdrop-blur-sm animate-in fade-in duration-200">
          {/* Top Bar: Counter on left, Controls on right */}
          <div className="flex items-center justify-between text-white">
            <div className="text-sm font-medium tracking-wider text-white/80">
              {lightboxIndex + 1} / {activeLightboxItems.length}
            </div>

            <div className="flex items-center gap-3">
              {/* Zoom Button */}
              <button
                onClick={() => setIsZoomed(!isZoomed)}
                aria-label="Toggle zoom"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
              >
                {isZoomed ? <ZoomOut className="h-5 w-5" /> : <ZoomIn className="h-5 w-5" />}
              </button>

              {/* Share Button */}
              <button
                onClick={handleShare}
                aria-label="Share project"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
              >
                <Share2 className="h-5 w-5" />
              </button>

              {/* Close (X) Button */}
              <button
                onClick={closeLightbox}
                aria-label="Close fullscreen lightbox"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Main Image Area with Left & Right Chevrons & Real-time Drag Animation */}
          <div
            onPointerDown={(e) => handleLightboxPointerDown(e.clientX)}
            onPointerMove={(e) => handleLightboxPointerMove(e.clientX)}
            onPointerUp={() => handleLightboxPointerUp(activeLightboxItems.length)}
            onPointerLeave={() => handleLightboxPointerUp(activeLightboxItems.length)}
            onContextMenu={(e) => e.preventDefault()}
            className="relative flex flex-1 items-center justify-center overflow-hidden my-4 select-none cursor-grab active:cursor-grabbing"
          >
            {/* Left Chevron */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevLightboxImage();
              }}
              aria-label="Previous photo"
              className="absolute left-2 sm:left-6 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-xs transition-all hover:bg-white/25 hover:scale-110"
            >
              <ChevronLeft className="h-7 w-7" />
            </button>

            {/* Active Display Image with Real-time Drag & Smooth Slide Transition */}
            <div
              style={{
                transform: `translateX(${lightboxDragOffset}px) scale(${isZoomed ? 1.5 : 1})`,
                transition: isLightboxDragging
                  ? 'none'
                  : 'transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)',
              }}
              className="relative will-change-transform"
            >
              <img
                src={activeLightboxItems[lightboxIndex].src}
                alt={activeLightboxItems[lightboxIndex].title}
                className="max-h-[75vh] sm:max-h-[82vh] max-w-[90vw] object-contain rounded-2xl shadow-2xl pointer-events-none"
              />
            </div>

            {/* Right Chevron */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextLightboxImage();
              }}
              aria-label="Next photo"
              className="absolute right-2 sm:right-6 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-xs transition-all hover:bg-white/25 hover:scale-110"
            >
              <ChevronRight className="h-7 w-7" />
            </button>
          </div>

          {/* Bottom Title / Caption */}
          <div className="text-center">
            <p className="text-sm font-medium text-white/90">
              {activeLightboxItems[lightboxIndex].title}
            </p>
          </div>
        </div>
      )}

      {/* Interactive Unit Booking Modal */}
      <UnitBookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        project={project}
      />
    </>
  );
}
