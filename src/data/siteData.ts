export const navigationLinks = [
  { label: 'Home', href: '/' },
  {
    label: 'Pages',
    children: [
      { label: 'About Us', href: '/about-us' },
      { label: 'Why Choose Us', href: '/why-choose-us' },
      { label: 'Our Awards', href: '/our-awards' },
      { label: 'Celebrations', href: '/celebrations' },
      // { label: 'Our Team', href: '/our-team' },
      { label: 'Careers', href: '/careers' },
      // { label: 'FAQs', href: '/faqs' },
    ],
  },
  {
    label: 'Associate',
    children: [
      { label: 'Investors', href: '/investors' },
      { label: 'Our Venture', href: '/our-ventures' },
      {label: 'Joint Development', href: '/joint-development'},
      {label: 'Industrial', href: '/industrial'},
      { label: 'NRI Services', href: '/nri' },
      { label: 'Channel Partners', href: '/channel-partners' },
    ],
  },
  // { label: 'Services', href: '#services' },
  { label: 'Projects', href: '/projects' },
  { label: 'Blogs', href: '/blogs' },
  { label: 'Contact', href: '/contact-us' },
];

export const servicesData = [
  {
    id: '01',
    title: 'Sales & Marketing',
    description: 'Building a real estate development is a complicated task requiring both deep understanding of buyer outreach, strategic branding, and high-conversion sales channels.',
    image: '/images/services/service1.jpg',
    href: '/projects',
  },
  {
    id: '02',
    title: 'Architecture & Design',
    description: 'We believe good architecture is a crucial foundation that influences the overall performance and long-term structural value of a real estate development.',
    image: '/images/services/service2.jpg',
    href: '/projects',
  },
  {
    id: '03',
    title: 'Construction Management',
    description: 'From design to operations, we love to solve complex challenges and exceed expectations with modern engineering practices and industry-leading safety standards.',
    image: '/images/services/service3.jpg',
    href: '/projects',
  },
  {
    id: '04',
    title: 'Investment & Capital',
    description: 'We are focused on improving the way capital projects get done, ensuring transparent joint ventures, capital security, and maximum investor appreciation.',
    image: '/images/services/service4.jpg',
    href: '/investors',
  },
  {
    id: '05',
    title: 'Project Management',
    description: 'Our comprehensive estimates and rigorous project management methodologies ensure timely project delivery without compromising on quality or aesthetics.',
    image: '/images/services/service5.jpg',
    href: '/projects',
  },
  {
    id: '06',
    title: 'Real Estate Development',
    description: 'We offer end-to-end real estate development solutions, crafting integrated community landmarks that deliver lasting value to homeowners and investors.',
    image: '/images/services/service6.jpg',
    href: '/projects',
  },
];
export const featuresData = [
  {
    num: '01',
    title: 'Modern, eco-friendly homes',
    description: 'Our goal is zero incidents and our lost time frequency rate is industry leading.',
    image: '/images/diffrent/img1.png',
  },
  {
    num: '02',
    title: 'Client-centered approach',
    description: 'We work with both investors and developers to create landmarks that make an impact.',
    image: '/images/diffrent/img2.png',
  },
  {
    num: '03',
    title: 'Community-focused living',
    description: 'Our multi-skilled team provides innovative, forward-thinking solutions.',
    image: '/images/diffrent/img3.png',
  },
  {
    num: '04',
    title: 'Sustainable architecture',
    description: 'We maintain this by ensuring transparency and professional conduct in every aspect.',
    image: '/images/diffrent/img4.png',
  },
];

export interface ProjectItem {
  id: string;
  name: string;
  slug: string;
  location: string;
  bhk: string;
  type: 'Apartments' | 'Plots' | 'Commercial' | 'Industrial' | 'Villas';
  status: 'Ongoing' | 'Completed' | 'Upcoming';
  budget: string;
  image: string;
  address?: string;
  description?: string;
  plotSizes?: string;
  proximityDetails?: string[];
  locationAdvantages?: {
    schoolsColleges?: string[];
    hospitals?: string[];
    publicFacilities?: string[];
    corporateOffices?: string[];
  };
  highlights?: string[];
  brochureUrl?: string;
  streetViewUrl?: string;
  mapEmbedUrl?: string;
  blocks?: any[];
  plots?: any[];
  totalBlocks?: number;
  totalFloors?: number;
  totalUnits?: number;
  availableUnits?: number;
  bookedUnits?: number;
  soldUnits?: number;
}

const rawProjectsData: ProjectItem[] = [
  // -------------------------------------------------------------
  // 6 OFFICIAL APARTMENTS FROM KPN PROMOTERS
  // -------------------------------------------------------------
  {
    id: '01',
    name: 'KPN LeNid',
    slug: 'kpn-lenid',
    location: 'Urapakkam, Chennai',
    address: 'No. 48, Karanai Puducherry Rd, Urapakkam, Chennai',
    bhk: '1 & 2 BHK',
    type: 'Apartments',
    status: 'Ongoing',
    budget: '₹ 19L Onwards',
    image: '/images/projects/apt_lenid.jpg',
    streetViewUrl: 'https://www.google.com/maps/embed?pb=!4v1680000000000!6m8!1m7!1sCAoSLEFGMVFpcE1mX1h3Q1pfcG5oQ09oV2RjSGFxTXlhZFl0b2pfaEZfN0p4WGZZ!2m2!1d12.8571477!2d80.0631628!3f120!4f0!5f0.7820865974627469',
  },
  {
    id: '02',
    name: 'DGM Monica Residency',
    slug: 'dgm-monica-residency',
    location: 'Guduvanchery, Chennai',
    address: 'Near GST Road, Guduvanchery / Urapakkam, Chennai',
    bhk: '1 & 2 BHK (639 - 996 Sq.Ft.)',
    type: 'Apartments',
    status: 'Ongoing',
    budget: '₹ 30L Onwards',
    image: '/images/projects/apt_dgm_monica.jpg',
    brochureUrl: '/brouchure/DGM Monika Brouchure (4).pdf',
    description: 'DGM Monica Residency offers premium 1 & 2 BHK ready-to-move apartment residences in Guduvanchery. Built with RCC framed structure, 100% Vaastu compliance, smart lifts, power backup, CCTV security, and premium specifications including Vitrified tile flooring, Teak wood doors, and UPVC sliding windows.',
    highlights: [
      '1 & 2 BHK Ready-to-Move Apartments (639 - 996 Sq.Ft.)',
      '100% Vaastu Compliant Architecture',
      'Smart Passenger Lift & 5kVA Power Backup for Common Area',
      'CCTV Surveillance & Video Door Phone for Each Flat',
      'Anti-skid Balcony Tiles & Vitrified Nano-Tech Interior Flooring',
      'Teak Wood Main Door Frame with Godrej Locks',
      'Proximity to Guduvanchery Railway Station & Kilambakkam Bus Terminus',
    ],
    proximityDetails: [
      '450 Mtrs to Velammal International School',
      '650 Mtrs to Neelan Matriculation School',
      '2 Kms to Guduvanchery Railway Station',
      '6 Kms to Kilambakkam Bus Terminus',
    ],
    locationAdvantages: {
      schoolsColleges: [
        'Velammal International School - 450 Meters',
        'Neelan Matriculation School - 650 Meters',
        'Sri Vishwa Vidyalaya Higher Secondary School',
        'SMN Park School - 3.6 Kms',
        'Holy Sai International School',
        'Shikshaa Kidz-E-Techno & Shikshaa Litera Mount School',
      ],
      hospitals: [
        'Deepam Hospital',
        'SRM Hospital',
        'Arokiya Annai Hospital',
        'One Health Hospital',
      ],
      publicFacilities: [
        'Guduvanchery Railway Station - 2 Kms',
        'Fashion Factory - 2.5 Kms',
        'Zudio Guduvanchery - 3.1 Kms',
        'Max - 3.6 Kms',
        'Vandalur Zoo - 5.6 Kms',
        'Kilambakkam Bus Terminus - 6 Kms',
      ],
      corporateOffices: [
        'ZOHO Corporation - 6 Kms',
        'Sriram Gateway - 10 Kms',
        'Ford India Pvt. Ltd. - 12 Kms',
        'Renault Nissan Technology & Business Centre - 18 Kms',
        'Infosys - 18 Kms',
      ],
    },
    streetViewUrl: 'https://www.google.com/maps/embed?pb=!4v1680000000000!6m8!1m7!1sCAoSLEFGMVFpcE1mX1h3Q1pfcG5oQ09oV2RjSGFxTXlhZFl0b2pfaEZfN0p4WGZZ!2m2!1d12.8571477!2d80.0631628!3f120!4f0!5f0.7820865974627469',
  },
  {
    id: '03',
    name: 'SP2K Serenity Skyline',
    slug: 'sp2k-serenity-skyline',
    location: 'Urapakkam, Chennai',
    address: 'Karanai Puducherry Main Road, Urapakkam, Chennai',
    bhk: '1 & 2 BHK',
    type: 'Apartments',
    status: 'Upcoming',
    budget: '₹ 38L Onwards',
    image: '/images/projects/apt_sp2k_serenity.jpg',
    streetViewUrl: 'https://www.google.com/maps/embed?pb=!4v1680000000000!6m8!1m7!1sCAoSLEFGMVFpcE1mX1h3Q1pfcG5oQ09oV2RjSGFxTXlhZFl0b2pfaEZfN0p4WGZZ!2m2!1d12.8571477!2d80.0631628!3f120!4f0!5f0.7820865974627469',
  },
  {
    id: '04',
    name: 'Royal Oak',
    slug: 'royal-oak',
    location: 'Urapakkam, Chennai',
    address: 'Opp. Railway Station, Urapakkam, Chennai',
    bhk: '2 BHK',
    type: 'Apartments',
    status: 'Ongoing',
    budget: '₹ 48L Onwards',
    image: '/images/projects/apt_royal_oak.jpg',
    streetViewUrl: 'https://www.google.com/maps/embed?pb=!4v1680000000000!6m8!1m7!1sCAoSLEFGMVFpcE1mX1h3Q1pfcG5oQ09oV2RjSGFxTXlhZFl0b2pfaEZfN0p4WGZZ!2m2!1d12.8571477!2d80.0631628!3f120!4f0!5f0.7820865974627469',
  },
  {
    id: '05',
    name: 'KPN Vijayalakshmi',
    slug: 'kpn-vijayalakshmi',
    location: 'Urapakkam, Chennai',
    address: 'Near Kilambakkam Bus Terminus, Urapakkam, Chennai',
    bhk: '2 BHK',
    type: 'Apartments',
    status: 'Ongoing',
    budget: '₹ 54L Onwards',
    image: '/images/projects/apt_vijayalakshmi.jpg',
    streetViewUrl: 'https://www.google.com/maps/embed?pb=!4v1680000000000!6m8!1m7!1sCAoSLEFGMVFpcE1mX1h3Q1pfcG5oQ09oV2RjSGFxTXlhZFl0b2pfaEZfN0p4WGZZ!2m2!1d12.8571477!2d80.0631628!3f120!4f0!5f0.7820865974627469',
  },
  {
    id: '06',
    name: 'KPN Enclave',
    slug: 'kpn-enclave',
    location: 'Urapakkam, Chennai',
    address: 'Adhanur Main Road, Urapakkam, Chennai',
    bhk: '2 BHK',
    type: 'Apartments',
    status: 'Ongoing',
    budget: '₹ 45L Onwards',
    image: '/images/projects/apt_kpn_enclave.jpg',
    streetViewUrl: 'https://www.google.com/maps/embed?pb=!4v1680000000000!6m8!1m7!1sCAoSLEFGMVFpcE1mX1h3Q1pfcG5oQ09oV2RjSGFxTXlhZFl0b2pfaEZfN0p4WGZZ!2m2!1d12.8571477!2d80.0631628!3f120!4f0!5f0.7820865974627469',
  },

  // -------------------------------------------------------------
  // 8 OFFICIAL PLOTS FROM KPN PROMOTERS
  // -------------------------------------------------------------
  {
    id: '07',
    name: 'KPN Marvel Township',
    slug: 'kpn-marvel-township',
    location: 'Urapakkam, Chennai',
    address: 'Near Karanai Puducherry Main Road, Urapakkam, Chennai (Just 10 Mins from GST Road)',
    bhk: 'Plots (458 - 2171 Sq.Ft.)',
    type: 'Plots',
    status: 'Ongoing',
    budget: '₹ 2799/Sq.Ft',
    image: '/images/projects/plot_marvel.jpg',
    plotSizes: '458 - 2171 Sq.Ft.',
    brochureUrl: '/brouchure/Marvel Township Broucher.pdf',
    description: 'KPN Marvel Township offers premium residential township and villa plots across Phase I, Phase II & Phase III in Urapakkam, situated just 10 minutes from GST Road and 5 km from Kilambakkam Bus Terminus. Designed for seamless lifestyle living with black top roads, LED street lights, mini theatre, parks, yoga zone, walking tracks, and children play area.',
    highlights: [
      'Township & Villa Plots Promising A Seamless Lifestyle Experience',
      'Just 10 Mins from GST Road & 5 Km from Kilambakkam Bus Terminus',
      'Phase I, II & III Layouts with Extents from 458 to 2171 Sq.Ft.',
      'Amenities: Mini Theatre, Park, Yoga Zone, Health Centre & Walking Track',
      'Infrastructure: Black Top Roads, LED Street Lights, Food Court & Super Market',
      'High Appreciation Expected up to 50% in 2 Years',
      '100% Clear Documentation & Immediate Registration Available',
    ],
    proximityDetails: [
      '5 Km to GST Main Road',
      '5 Km to Kilambakkam Bus Terminus',
      '6 Km to Urapakkam Railway Station',
      '4.1 Km to Velammal Vidyashram',
      '7 Km to Zoho Corporation',
    ],
    locationAdvantages: {
      schoolsColleges: [
        'Velammal Vidyashram - 4.1 Km',
        'SRM Public School - 5 Km',
        'Crescent School - 7.5 Km',
        'Crescent College - 7.5 Km',
        'Tagore Engineering College - 6 Km',
        'SRM University - 9 Km',
      ],
      hospitals: [
        'Tagore Hospital - 6 Km',
        'Deepam Hospital - 6 Km',
        'Annai Arokiya Hospital - 6 Km',
        'RKP Multi-Speciality Hospital',
        'SRM Hospital - 9 Km',
        'One Health Hospital - 7.5 Km',
      ],
      publicFacilities: [
        'GST Main Road - 5 Km',
        'Kilambakkam Bus Terminus - 5 Km',
        'Urapakkam Railway Station - 6 Km',
        'Guduvancheri Railway Station - 7 Km',
        'Vandalur - Kelambakkam Road - 7 Km',
        'Outer Ring Road - 8 Km',
      ],
      corporateOffices: [
        'Redim Information Systems - 6 Km',
        'Zoho Corporation - 7 Km',
        'Accenture - 10 Km',
        'Sutherland - 10 Km',
        'Sriram Gateway - 11 Km',
        'Mahindra World City - 15 Km',
      ],
    },
    streetViewUrl: 'https://www.google.com/maps/embed?pb=!4v1680000000000!6m8!1m7!1sCAoSLEFGMVFpcE1mX1h3Q1pfcG5oQ09oV2RjSGFxTXlhZFl0b2pfaEZfN0p4WGZZ!2m2!1d12.8571477!2d80.0631628!3f120!4f0!5f0.7820865974627469',
  },
  {
    id: '08',
    name: 'Sri Bhavai Amman Nagar II',
    slug: 'sri-bhavai-amman-nagar-ii',
    location: 'Urapakkam, Chennai',
    address: 'Near Bhavai Amman Temple, Urapakkam, Chennai',
    bhk: 'Plots',
    type: 'Plots',
    status: 'Ongoing',
    budget: '₹ 4999/Sq.Ft',
    image: '/images/projects/plot_sri_bhavai_amman.png',
    streetViewUrl: 'https://www.google.com/maps/embed?pb=!4v1680000000000!6m8!1m7!1sCAoSLEFGMVFpcE1mX1h3Q1pfcG5oQ09oV2RjSGFxTXlhZFl0b2pfaEZfN0p4WGZZ!2m2!1d12.8571477!2d80.0631628!3f120!4f0!5f0.7820865974627469',
  },
  {
    id: '09',
    name: 'Sri Ranga Nagar',
    slug: 'sri-ranga-nagar',
    location: 'Nenmeli, Chengalpattu',
    address: 'Nenmeli, Near Tirukazhukundram Road SH-58 & Chengalpattu - Thiruporur Road, Chengalpattu, Chennai',
    bhk: 'Plots (447 - 1536 Sq.Ft.)',
    type: 'Plots',
    status: 'Ongoing',
    budget: '₹ 3299/Sq.Ft',
    image: '/images/projects/plot_sri_ranga_nagar.png',
    plotSizes: '447 - 1536 Sq.Ft.',
    brochureUrl: '/brouchure/SriRangaNagar-4-Page.pdf',
    description: 'Sri Ranga Nagar by Ranga Realty & KPN Promoters features 71 premium residential plots in Nenmeli, Chengalpattu with sizes ranging from 447 to 1536 Sq.Ft. Perfectly planned with 30 ft and 23 ft wide black top roads, LED street lighting, storm water drainage, 24/7 security, gated community infrastructure, and 100% Vaastu compliance near key educational institutions, hospitals, and transit points.',
    highlights: [
      'Gated Community Residential Plots with 24/7 Security & CCTV',
      '71 Well-Planned Plots with Extents Ranging from 447 to 1536 Sq.Ft.',
      '30 Feet & 23 Feet Wide Black Top Roads with LED Street Lights',
      'Underground Storm Water Drainage System & Fully Compounded Layout',
      '100% Vaastu Compliant Layout Plan with Clear Titles',
      'Just 2 Mins to Nenmeli Bus Stop & Athena Global School CBSE',
      'Easy Connectivity to Chengalpattu Railway Junction, Bus Stand & GST Road',
    ],
    proximityDetails: [
      '2 Mins to Nenmeli Bus Stop',
      '2 Mins to Athena Global School (CBSE)',
      '10 Mins to Chengalpattu Town Limit & Police Station',
      '12 Mins to Chengalpattu Railway Junction & New Bus Stand',
      '10 Mins to Chengalpattu Government Hospital & Medical College',
    ],
    locationAdvantages: {
      schoolsColleges: [
        'Athena Global School CBSE School - 2 Mins',
        'Sree Gokulam Public School - 5 Mins',
        'St. Ann\'s Matric Hr. Sec. School - 10 Mins',
        'Chengalpattu Medical College - 10 Mins',
        'St. Joseph\'s Matric Hr. Sec. School - 12 Mins',
        'Govt. Law College & Vidhya Sagar Women\'s College',
      ],
      hospitals: [
        'Siva Hospital 24 X 7 - 7 Mins',
        'Athveka Multispeciality Clinic - 9 Mins',
        'JJ Multi Speciality Hospital - 10 Mins',
        'Chengalpattu Government Hospital - 10 Mins',
        'Medway JSP Hospital - 12 Mins',
      ],
      publicFacilities: [
        'Nenmeli Bus Stop - 2 Mins',
        'Chengalpattu Police Station - 10 Mins',
        'Chengalpattu Railway Station - 12 Mins',
        'Chengalpattu New Bus Stand - 12 Mins',
        'Chengalpattu Bypass Bus Stand - 15 Mins',
        'SIDCO Industrial Estate, Thandarai',
      ],
      corporateOffices: [
        'Mahindra World City - 15 Mins',
        'SIDCO Industrial Estate, Thandarai',
        'Rahamath Shopping Mall - 8 Mins',
        'Lathaa Cinemas - 8 Mins',
        'SRK Cinemas - 10 Mins',
        'D-Mart Chengalpattu - 20 Mins',
      ],
    },
    streetViewUrl: 'https://www.google.com/maps/embed?pb=!4v1680000000000!6m8!1m7!1sCAoSLEFGMVFpcE1mX1h3Q1pfcG5oQ09oV2RjSGFxTXlhZFl0b2pfaEZfN0p4WGZZ!2m2!1d12.8571477!2d80.0631628!3f120!4f0!5f0.7820865974627469',
  },
  {
    id: '10',
    name: 'KPN Omega Town',
    slug: 'kpn-omega-town',
    location: 'Guduvanchery, Chennai',
    address: 'Nellikuppam Road, Guduvanchery, Chennai',
    bhk: 'Plots',
    type: 'Plots',
    status: 'Ongoing',
    budget: '₹ 2799/Sq.Ft',
    image: '/images/projects/plot_omega.jpg',
    streetViewUrl: 'https://www.google.com/maps/embed?pb=!4v1680000000000!6m8!1m7!1sCAoSLEFGMVFpcE1mX1h3Q1pfcG5oQ09oV2RjSGFxTXlhZFl0b2pfaEZfN0p4WGZZ!2m2!1d12.8571477!2d80.0631628!3f120!4f0!5f0.7820865974627469',
  },
  {
    id: '11',
    name: 'AVP Kanagam Avenue',
    slug: 'avp-kanagam-avenue',
    location: 'Guduvanchery, Chennai',
    address: 'Govindarajapuram, Guduvanchery (Close Proximity to GST Road), Chennai',
    bhk: 'Plots (1000 - 1733 Sq.Ft.)',
    type: 'Plots',
    status: 'Ongoing',
    budget: '₹ 4500/Sq.Ft',
    image: '/images/projects/plot_avp_kanagam_avenue.jpg',
    plotSizes: '1000 - 1733 Sq.Ft.',
    brochureUrl: '/brouchure/AVP Kanagam Avenue Brouchure (1) (1).pdf',
    description: 'AVP Kanagam Avenue features premium CMDA & RERA approved residential plots strategically positioned along GST Road in Guduvanchery. Offering exceptional value appreciation, close proximity to Kilambakkam Bus Terminus, Chennai Metro Phase 2 extension, and elevated corridors.',
    highlights: [
      '5 Minutes Drive off GST Road',
      'Directly on the road connecting Guduvanchery junction with Tiruporur',
      'Velammal and SRM CBSE Schools at walkable distance',
      'Proposed Mufassil Bus stand provides major regional connectivity',
      'Proximity to upcoming 250 Acre commercial hub with malls, hotels & schools',
      'Upcoming Metro Connectivity & 18.4 km Elevated Corridor',
      'Proximity to Kilambakkam Kalaignar Centenary Bus Terminus & Railway Station',
    ],
    proximityDetails: [
      '5 Mins to GST Road',
      '1.5 Kms to Velammal Vidyashram',
      '2.8 Kms to SRM Public School',
      '6 Kms to Guduvanchery Railway Station',
      '9 Kms to Kilambakkam Bus Terminus',
    ],
    locationAdvantages: {
      schoolsColleges: [
        'Velammal Vidyashram School - 1.5 Kms',
        'SRM Public School - 2.8 Kms',
        'St. Mary\'s Matriculation School - 3.6 Kms',
        'SRM University - 8 Kms',
        'Crescent College - 9 Kms',
      ],
      hospitals: [
        'Deepam Hospital',
        'SRM Hospital',
        'Arokiya Annai Hospital',
        'One Health Hospital',
      ],
      publicFacilities: [
        'Fashion Factory - 6 Kms',
        'Guduvanchery Railway Station - 6 Kms',
        'Zudio Guduvanchery - 8 Kms',
        'Max - 8 Kms',
        'Kilambakkam Bus Terminus - 9 Kms',
        'Vandalur Zoo - 10 Kms',
      ],
      corporateOffices: [
        'ZOHO Corporation - 7 Kms',
        'Sriram Gateway - 11 Kms',
        'Ford India Pvt. Ltd. - 12 Kms',
        'Infosys - 17 Kms',
        'Renault Nissan Technology & Business Centre - 17 Kms',
      ],
    },
    streetViewUrl: 'https://www.google.com/maps/embed?pb=!4v1680000000000!6m8!1m7!1sCAoSLEFGMVFpcE1mX1h3Q1pfcG5oQ09oV2RjSGFxTXlhZFl0b2pfaEZfN0p4WGZZ!2m2!1d12.8571477!2d80.0631628!3f120!4f0!5f0.7820865974627469',
  },
  {
    id: '12',
    name: 'AVP Kanagam Nagar',
    slug: 'avp-kanagam-nagar',
    location: 'Guduvanchery, Chennai',
    address: 'S.No 347/11A of Karanaipuducherry, Kalivanthapattu Village, Maraimalai Nagar Municipality, Chengalpet / Guduvanchery, Chennai',
    bhk: 'Plots (714 - 2106 Sq.Ft.)',
    type: 'Plots',
    status: 'Ongoing',
    budget: '₹ 3500/Sq.Ft',
    image: '/images/projects/plot_avp_kanagam_nagar.jpg',
    plotSizes: '714 - 2106 Sq.Ft.',
    brochureUrl: '/brouchure/AVP Kanagam Nagar - 4 Side.pdf',
    description: 'AVP Kanagam Nagar offers premium DTCP & RERA approved residential layout plots (Approval No: 213/2025, 10/2026; TNRERA/35/LO/4519/2025) located in Kalivanthapattu, Guduvanchery, just 15 minutes from GST Road. Spanning Phase I & Phase II, this project provides ideal plot extents ranging from 714 to 2106 Sq.Ft., surrounded by top educational institutions, transport hubs, and rapid commercial corridors.',
    highlights: [
      'DTCP & RERA Approved Layout (TNRERA/35/LO/4519/2025)',
      '15 Minutes from GST Road, Guduvanchery',
      'Phase I & Phase II plots ranging from 714 to 2106 Sq.Ft.',
      'Located along Guduvanchery - Thiruporur (Nellikuppam) Main Road',
      'Walking distance / Proximity to Velammal Vidhyashram & SRM University',
      'Close to Kilambakkam Bus Terminus & Guduvanchery Bus Terminus',
      'Nearby major industrial & tech hubs including Bosch, Zoho Corp, Ford & Mahindra World City SEZ',
    ],
    proximityDetails: [
      '15 Mins to GST Road',
      'Near Velammal Vidhyashram',
      'Near SRM University & SRM Rural Health Centre',
      'Proximity to Kilambakkam Bus Terminus',
    ],
    locationAdvantages: {
      schoolsColleges: [
        'Velammal Vidhyashram School',
        'SRM Public School',
        'SRM University',
        'Crescent Engineering College',
        'VIT Chennai',
        'FIITJEE Global School',
        'Sri Ramanujar Engineering College',
        'Orchids The International School',
        'TNPESU',
      ],
      hospitals: [
        'SRM Rural Health Centre',
        'SRM Hospital',
      ],
      publicFacilities: [
        'Guduvanchery Bus Terminus',
        'Kilambakkam Bus Terminus',
        'Arignar Anna Zoological Park (Vandalur Zoo)',
        'Hotel Junior Kuppanna',
        'Tamilnadu Police Academy',
      ],
      corporateOffices: [
        'ZOHO Corp',
        'Bosch',
        'Ford',
        'Mahindra World City SEZ',
      ],
    },
    streetViewUrl: 'https://www.google.com/maps/embed?pb=!4v1680000000000!6m8!1m7!1sCAoSLEFGMVFpcE1mX1h3Q1pfcG5oQ09oV2RjSGFxTXlhZFl0b2pfaEZfN0p4WGZZ!2m2!1d12.8571477!2d80.0631628!3f120!4f0!5f0.7820865974627469',
  },
  {
    id: '13',
    name: 'KPN Thulir',
    slug: 'kpn-thulir',
    location: 'S.P. Kovil, Chennai',
    address: 'Singaperumal Koil Main Road, Chennai',
    bhk: 'Plots',
    type: 'Plots',
    status: 'Ongoing',
    budget: '₹ 2099/Sq.Ft',
    image: '/images/projects/plot_kpn_thulir.jpeg',
    streetViewUrl: 'https://www.google.com/maps/embed?pb=!4v1680000000000!6m8!1m7!1sCAoSLEFGMVFpcE1mX1h3Q1pfcG5oQ09oV2RjSGFxTXlhZFl0b2pfaEZfN0p4WGZZ!2m2!1d12.8571477!2d80.0631628!3f120!4f0!5f0.7820865974627469',
  },
  {
    id: '14',
    name: 'KPN Sri Sai Baba Nagar',
    slug: 'kpn-sri-sai-baba-nagar',
    location: 'Karanaikattur, Chennai',
    address: 'Karanai Kattur Main Road, Chennai',
    bhk: 'Plots',
    type: 'Plots',
    status: 'Ongoing',
    budget: '₹ 999/Sq.Ft',
    image: '/images/projectimg/KPN-SAI-BABA-NAGAR.jpg',
    streetViewUrl: 'https://www.google.com/maps/embed?pb=!4v1680000000000!6m8!1m7!1sCAoSLEFGMVFpcE1mX1h3Q1pfcG5oQ09oV2RjSGFxTXlhZFl0b2pfaEZfN0p4WGZZ!2m2!1d12.8571477!2d80.0631628!3f120!4f0!5f0.7820865974627469',
  },
  {
    id: 'd1aa0874-25c1-471b-a9e5-263b0780fec6',
    name: 'KPN Hindhu Avenue',
    slug: 'kpn-hindhu-avenue',
    location: 'Urapakkam, Chennai',
    address: 'Hindhu Avenue, Urapakkam, Chennai',
    bhk: '2 & 3 BHK Villa',
    type: 'Villas',
    status: 'Ongoing',
    budget: '₹ 45L Onwards',
    image: '/images/projectimg/KPN-Hindu-Avenue.jpg',
    streetViewUrl: 'https://www.google.com/maps/embed?pb=!4v1680000000000!6m8!1m7!1sCAoSLEFGMVFpcE1mX1h3Q1pfcG5oQ09oV2RjSGFxTXlhZFl0b2pfaEZfN0p4WGZZ!2m2!1d12.8571477!2d80.0631628!3f120!4f0!5f0.7820865974627469',
  },
  {
    id: '16',
    name: 'KPN Platinum City',
    slug: 'kpn-platinum-city',
    location: 'Karanaipuducheri, Chennai',
    address: 'Karanaipuducheri Main Road, Chennai',
    bhk: 'Plots',
    type: 'Plots',
    status: 'Ongoing',
    budget: '₹ 2499/Sq.Ft',
    image: '/images/projectimg/KPN-Platinum-City.jpg',
    streetViewUrl: 'https://www.google.com/maps/embed?pb=!4v1680000000000!6m8!1m7!1sCAoSLEFGMVFpcE1mX1h3Q1pfcG5oQ09oV2RjSGFxTXlhZFl0b2pfaEZfN0p4WGZZ!2m2!1d12.8571477!2d80.0631628!3f120!4f0!5f0.7820865974627469',
  },
  {
    id: '4e42e16b-1483-425f-8623-955178cd360f',
    name: 'KPN Sairam Nagar',
    slug: 'kpn-sairam-nagar',
    location: 'Urapakkam, Chennai',
    address: 'Sairam Nagar, Urapakkam, Chennai',
    bhk: '2 & 3 BHK Villa',
    type: 'Villas',
    status: 'Ongoing',
    budget: '₹ 52L Onwards',
    image: '/images/projectimg/KPN-Sai-Ram-Nagar.jpg',
    streetViewUrl: 'https://www.google.com/maps/embed?pb=!4v1680000000000!6m8!1m7!1sCAoSLEFGMVFpcE1mX1h3Q1pfcG5oQ09oV2RjSGFxTXlhZFl0b2pfaEZfN0p4WGZZ!2m2!1d12.8571477!2d80.0631628!3f120!4f0!5f0.7820865974627469',
  },
  {
    id: '18',
    name: 'KPN Krishna Nagar',
    slug: 'kpn-krishna-nagar',
    location: 'Urapakkam, Chennai',
    address: 'Krishna Nagar, Urapakkam, Chennai',
    bhk: 'Plots',
    type: 'Plots',
    status: 'Ongoing',
    budget: '₹ 3200/Sq.Ft',
    image: '/images/projectimg/KPN-KRISHNA-NAGAR.jpg',
    streetViewUrl: 'https://www.google.com/maps/embed?pb=!4v1680000000000!6m8!1m7!1sCAoSLEFGMVFpcE1mX1h3Q1pfcG5oQ09oV2RjSGFxTXlhZFl0b2pfaEZfN0p4WGZZ!2m2!1d12.8571477!2d80.0631628!3f120!4f0!5f0.7820865974627469',
  },
  {
    id: 'f7ca68af-2cd2-4304-8175-f446ade2ae0a',
    name: 'KPN Grand',
    slug: 'kpn-grand',
    location: 'Karanaipuducheri, Chennai',
    address: 'KPN Grand, Karanaipuducheri, Chennai',
    bhk: '2 & 3 BHK Villa',
    type: 'Villas',
    status: 'Ongoing',
    budget: '₹ 58L Onwards',
    image: '/images/projectimg/KPN-GRAND.jpg',
    streetViewUrl: 'https://www.google.com/maps/embed?pb=!4v1680000000000!6m8!1m7!1sCAoSLEFGMVFpcE1mX1h3Q1pfcG5oQ09oV2RjSGFxTXlhZFl0b2pfaEZfN0p4WGZZ!2m2!1d12.8571477!2d80.0631628!3f120!4f0!5f0.7820865974627469',
  },
  {
    id: '20',
    name: 'KPN Silverwood',
    slug: 'kpn-silverwood',
    location: 'Urapakkam, Chennai',
    address: 'Silverwood Avenue, Urapakkam, Chennai',
    bhk: '2 BHK',
    type: 'Apartments',
    status: 'Ongoing',
    budget: '₹ 42L Onwards',
    image: '/images/projectimg/KPN-SILVERWOOD.jpg',
    streetViewUrl: 'https://www.google.com/maps/embed?pb=!4v1680000000000!6m8!1m7!1sCAoSLEFGMVFpcE1mX1h3Q1pfcG5oQ09oV2RjSGFxTXlhZFl0b2pfaEZfN0p4WGZZ!2m2!1d12.8571477!2d80.0631628!3f120!4f0!5f0.7820865974627469',
  },
  {
    id: '21',
    name: 'KPN Sri Bhavani Amman Nagar',
    slug: 'kpn-sri-bhavani-amman-nagar',
    location: 'Karanaipuducheri, Chennai',
    address: 'Karanaipuducheri Main Road, Chennai',
    bhk: 'Plots',
    type: 'Plots',
    status: 'Ongoing',
    budget: '₹ 3899/Sq.Ft',
    image: '/images/projectimg/KPN-SRI-BHAVANI-AMMAN-NAGAR.jpg',
    streetViewUrl: 'https://www.google.com/maps/embed?pb=!4v1680000000000!6m8!1m7!1sCAoSLEFGMVFpcE1mX1h3Q1pfcG5oQ09oV2RjSGFxTXlhZFl0b2pfaEZfN0p4WGZZ!2m2!1d12.8571477!2d80.0631628!3f120!4f0!5f0.7820865974627469',
  },
];

const createApartmentBlocks = () => [
  {
    blockId: 'A',
    blockName: 'Tower A',
    totalFloors: 4,
    floorPlanImages: [],
    floors: [
      {
        floorNumber: 1,
        floorName: '1st Floor',
        units: [
          { unitId: 'A101', unitNumber: '101', bhk: 2, bathrooms: 2, size: 850, unitType: '2 BHK Luxury', facing: 'East', status: 'available' as const },
          { unitId: 'A102', unitNumber: '102', bhk: 2, bathrooms: 2, size: 875, unitType: '2 BHK Premium', facing: 'North', status: 'available' as const },
          { unitId: 'A103', unitNumber: '103', bhk: 1, bathrooms: 1, size: 560, unitType: '1 BHK Smart', facing: 'East', status: 'booked' as const },
          { unitId: 'A104', unitNumber: '104', bhk: 2, bathrooms: 2, size: 890, unitType: '2 BHK Corner', facing: 'West', status: 'available' as const },
        ],
      },
      {
        floorNumber: 2,
        floorName: '2nd Floor',
        units: [
          { unitId: 'A201', unitNumber: '201', bhk: 2, bathrooms: 2, size: 850, unitType: '2 BHK Luxury', facing: 'East', status: 'available' as const },
          { unitId: 'A202', unitNumber: '202', bhk: 2, bathrooms: 2, size: 875, unitType: '2 BHK Premium', facing: 'North', status: 'sold' as const },
          { unitId: 'A203', unitNumber: '203', bhk: 1, bathrooms: 1, size: 560, unitType: '1 BHK Smart', facing: 'East', status: 'available' as const },
          { unitId: 'A204', unitNumber: '204', bhk: 3, bathrooms: 2, size: 1250, unitType: '3 BHK Royal', facing: 'North-East', status: 'available' as const },
        ],
      },
      {
        floorNumber: 3,
        floorName: '3rd Floor',
        units: [
          { unitId: 'A301', unitNumber: '301', bhk: 2, bathrooms: 2, size: 850, unitType: '2 BHK Luxury', facing: 'East', status: 'available' as const },
          { unitId: 'A302', unitNumber: '302', bhk: 2, bathrooms: 2, size: 875, unitType: '2 BHK Premium', facing: 'North', status: 'available' as const },
          { unitId: 'A303', unitNumber: '303', bhk: 1, bathrooms: 1, size: 560, unitType: '1 BHK Smart', facing: 'East', status: 'available' as const },
          { unitId: 'A304', unitNumber: '304', bhk: 2, bathrooms: 2, size: 890, unitType: '2 BHK Corner', facing: 'West', status: 'booked' as const },
        ],
      },
      {
        floorNumber: 4,
        floorName: '4th Floor',
        units: [
          { unitId: 'A401', unitNumber: '401', bhk: 3, bathrooms: 3, size: 1350, unitType: '3 BHK Penthouse', facing: 'East', status: 'available' as const },
          { unitId: 'A402', unitNumber: '402', bhk: 3, bathrooms: 3, size: 1400, unitType: '3 BHK Penthouse', facing: 'North', status: 'available' as const },
          { unitId: 'A403', unitNumber: '403', bhk: 2, bathrooms: 2, size: 900, unitType: '2 BHK Luxury', facing: 'West', status: 'booked' as const },
          { unitId: 'A404', unitNumber: '404', bhk: 3, bathrooms: 3, size: 1380, unitType: '3 BHK Royal', facing: 'North-East', status: 'available' as const },
        ],
      },
    ],
  },
  {
    blockId: 'B',
    blockName: 'Tower B',
    totalFloors: 3,
    floorPlanImages: [],
    floors: [
      {
        floorNumber: 1,
        floorName: '1st Floor',
        units: [
          { unitId: 'B101', unitNumber: '101', bhk: 2, bathrooms: 2, size: 920, unitType: '2 BHK Luxury', facing: 'East', status: 'available' as const },
          { unitId: 'B102', unitNumber: '102', bhk: 2, bathrooms: 2, size: 920, unitType: '2 BHK Luxury', facing: 'West', status: 'available' as const },
          { unitId: 'B103', unitNumber: '103', bhk: 3, bathrooms: 2, size: 1200, unitType: '3 BHK Elite', facing: 'North', status: 'available' as const },
        ],
      },
      {
        floorNumber: 2,
        floorName: '2nd Floor',
        units: [
          { unitId: 'B201', unitNumber: '201', bhk: 2, bathrooms: 2, size: 920, unitType: '2 BHK Luxury', facing: 'East', status: 'available' as const },
          { unitId: 'B202', unitNumber: '202', bhk: 2, bathrooms: 2, size: 920, unitType: '2 BHK Luxury', facing: 'West', status: 'sold' as const },
          { unitId: 'B203', unitNumber: '203', bhk: 3, bathrooms: 2, size: 1200, unitType: '3 BHK Elite', facing: 'North', status: 'available' as const },
        ],
      },
      {
        floorNumber: 3,
        floorName: '3rd Floor',
        units: [
          { unitId: 'B301', unitNumber: '301', bhk: 2, bathrooms: 2, size: 950, unitType: '2 BHK Luxury', facing: 'East', status: 'available' as const },
          { unitId: 'B302', unitNumber: '302', bhk: 3, bathrooms: 2, size: 1250, unitType: '3 BHK Royal', facing: 'West', status: 'available' as const },
          { unitId: 'B303', unitNumber: '303', bhk: 3, bathrooms: 3, size: 1350, unitType: '3 BHK Elite', facing: 'North', status: 'available' as const },
        ],
      },
    ],
  },
];

const createPlots = () => {
  const sizes = [600, 800, 1000, 1200, 1200, 1500, 1800, 2400];
  const facings = ['East', 'North', 'East', 'North-East', 'West'];
  return Array.from({ length: 28 }, (_, i) => {
    const plotNum = i + 1;
    const isBooked = plotNum === 4 || plotNum === 11 || plotNum === 19 || plotNum === 25;
    const isSold = plotNum === 7 || plotNum === 14 || plotNum === 21;
    return {
      plotId: `P-${plotNum}`,
      plotNumber: `${plotNum}`,
      size: sizes[i % sizes.length],
      facing: facings[i % facings.length],
      status: (isSold ? 'sold' : isBooked ? 'booked' : 'available') as 'available' | 'booked' | 'sold',
    };
  });
};

const createVillaBlocks = () => [
  {
    blockId: 'V1',
    blockName: 'Enclave A (Palm Grove)',
    totalFloors: 2,
    floorPlanImages: [],
    floors: [
      {
        floorNumber: 1,
        floorName: 'Ground Level',
        units: [
          { unitId: 'VA-01', unitNumber: 'A-01', bhk: 3, bathrooms: 3, size: 1850, unitType: '3 BHK Duplex Villa', facing: 'East', status: 'available' as const },
          { unitId: 'VA-02', unitNumber: 'A-02', bhk: 3, bathrooms: 3, size: 1920, unitType: '3 BHK Duplex Villa', facing: 'North', status: 'available' as const },
          { unitId: 'VA-03', unitNumber: 'A-03', bhk: 4, bathrooms: 4, size: 2200, unitType: '4 BHK Grand Villa', facing: 'East', status: 'booked' as const },
          { unitId: 'VA-04', unitNumber: 'A-04', bhk: 4, bathrooms: 4, size: 2350, unitType: '4 BHK Corner Villa', facing: 'North-East', status: 'available' as const },
        ],
      },
      {
        floorNumber: 2,
        floorName: 'Upper Level & Terrace',
        units: [
          { unitId: 'VA-05', unitNumber: 'A-05', bhk: 3, bathrooms: 3, size: 1850, unitType: '3 BHK Duplex Villa', facing: 'East', status: 'available' as const },
          { unitId: 'VA-06', unitNumber: 'A-06', bhk: 3, bathrooms: 3, size: 1950, unitType: '3 BHK Duplex Villa', facing: 'West', status: 'sold' as const },
          { unitId: 'VA-07', unitNumber: 'A-07', bhk: 4, bathrooms: 4, size: 2400, unitType: '4 BHK Grand Villa', facing: 'North', status: 'available' as const },
        ],
      },
    ],
  },
  {
    blockId: 'V2',
    blockName: 'Enclave B (Royal Greens)',
    totalFloors: 2,
    floorPlanImages: [],
    floors: [
      {
        floorNumber: 1,
        floorName: 'Ground Level',
        units: [
          { unitId: 'VB-01', unitNumber: 'B-01', bhk: 3, bathrooms: 3, size: 2100, unitType: '3 BHK Duplex Villa', facing: 'East', status: 'available' as const },
          { unitId: 'VB-02', unitNumber: 'B-02', bhk: 4, bathrooms: 4, size: 2600, unitType: '4 BHK Royal Villa', facing: 'North', status: 'available' as const },
          { unitId: 'VB-03', unitNumber: 'B-03', bhk: 4, bathrooms: 4, size: 2850, unitType: '4 BHK Presidential Villa', facing: 'North-East', status: 'available' as const },
        ],
      },
      {
        floorNumber: 2,
        floorName: 'Upper Level & Terrace',
        units: [
          { unitId: 'VB-04', unitNumber: 'B-04', bhk: 3, bathrooms: 3, size: 2100, unitType: '3 BHK Duplex Villa', facing: 'East', status: 'booked' as const },
          { unitId: 'VB-05', unitNumber: 'B-05', bhk: 4, bathrooms: 4, size: 2750, unitType: '4 BHK Royal Villa', facing: 'North', status: 'available' as const },
        ],
      },
    ],
  },
];

const createVillaPlots = () => [
  { plotId: 'villa-V-01', plotNumber: 'V-01', size: 1850, facing: 'East', status: 'available' as const },
  { plotId: 'villa-V-02', plotNumber: 'V-02', size: 1950, facing: 'North', status: 'available' as const },
  { plotId: 'villa-V-03', plotNumber: 'V-03', size: 2250, facing: 'East', status: 'booked' as const },
  { plotId: 'villa-V-04', plotNumber: 'V-04', size: 2400, facing: 'North-East', status: 'available' as const },
  { plotId: 'villa-V-05', plotNumber: 'V-05', size: 1850, facing: 'West', status: 'sold' as const },
  { plotId: 'villa-V-06', plotNumber: 'V-06', size: 2100, facing: 'East', status: 'available' as const },
  { plotId: 'villa-V-07', plotNumber: 'V-07', size: 2650, facing: 'North', status: 'available' as const },
  { plotId: 'villa-V-08', plotNumber: 'V-08', size: 2850, facing: 'North-East', status: 'available' as const },
  { plotId: 'villa-V-09', plotNumber: 'V-09', size: 1900, facing: 'East', status: 'available' as const },
  { plotId: 'villa-V-10', plotNumber: 'V-10', size: 2500, facing: 'West', status: 'booked' as const },
  { plotId: 'villa-V-11', plotNumber: 'V-11', size: 2100, facing: 'North', status: 'available' as const },
  { plotId: 'villa-V-12', plotNumber: 'V-12', size: 3100, facing: 'East', status: 'available' as const },
];

export const projectsData: ProjectItem[] = rawProjectsData.map((p) => {
  if (p.type === 'Apartments') {
    const blocks = p.blocks || createApartmentBlocks();
    return {
      ...p,
      blocks,
      plots: p.plots || [],
      totalBlocks: blocks.length,
      totalFloors: 4,
      totalUnits: 25,
      availableUnits: 19,
      bookedUnits: 3,
      soldUnits: 3,
    };
  } else if (p.type === 'Villas') {
    const blocks = p.blocks || createVillaBlocks();
    const plots = p.plots || createVillaPlots();
    return {
      ...p,
      blocks,
      plots,
      totalBlocks: blocks.length,
      totalFloors: 2,
      totalUnits: 12,
      availableUnits: 8,
      bookedUnits: 2,
      soldUnits: 2,
    };
  } else {
    const plots = p.plots || createPlots();
    return {
      ...p,
      blocks: p.blocks || [],
      plots,
      totalBlocks: 1,
      totalFloors: 1,
      totalUnits: plots.length,
      availableUnits: plots.filter((pl) => pl.status === 'available').length,
      bookedUnits: plots.filter((pl) => pl.status === 'booked').length,
      soldUnits: plots.filter((pl) => pl.status === 'sold').length,
    };
  }
});

export const teamData = [
  {
    name: 'Johan Sanford',
    role: 'Executive Assistant',
    image: '/images/team/team-1.jpg',
  },
  {
    name: 'Floyd Miles',
    role: 'Director of Architecture',
    image: '/images/team/team-2.jpg',
  },
  {
    name: 'Dennis Daniels',
    role: 'Founder & CEO',
    image: '/images/team/team-3.jpg',
  },
  {
    name: 'Leslie Alexander',
    role: 'Development Manager',
    image: '/images/team/team-4.jpg',
  },
];
export const testimonialsData = [
  {
    title: "Excellent experience!",
    quote: "A wonderful experience! They knew what they were doing and were incredibly knowledgeable throughout the process.",
    author: "Floyd Miles",
    role: "Bond Projects Coordinator",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80",
    rating: 5,
  },
  {
    title: "Totally Impressed!",
    quote: "I asked to have the area rebuilt and they were very prompt! Mud and texture came out great! Would highly recommend!",
    author: "Ronald Benson",
    role: "Marketing Director",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
    rating: 5,
  },
  {
    title: "Excellent Communication",
    quote: "We like the facilities & maintenance services here so much that we have even referred it to our relatives.",
    author: "John McConnor",
    role: "Senior Marketing Manager",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80",
    rating: 5,
  },
  {
    title: "Highly Recommended",
    quote: "Your team were great to work with on our basement remodel! I will definitely be working with them for future projects!",
    author: "Alena Fisher",
    role: "Senior Marketing Manager",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80",
    rating: 5,
  },
];

export interface BlogPostItem {
  id: string;
  slug: string;
  category: string;
  date: string;
  title: string;
  image: string;
  bannerImage?: string;
  excerpt: string;
  content: string[];
  galleryImages?: string[];
  quoteText?: string;
  quoteAuthor?: string;
}

export const blogData: BlogPostItem[] = [
  {
    id: '01',
    slug: 'why-urapakkam-is-the-next-real-estate-hotspot-in-chennai',
    category: 'Real Estate Trends',
    date: 'Jul 01, 2025',
    title: 'Why Urapakkam is the Next Real Estate Hotspot in Chennai',
    image: '/images/blog/kpn_blog_1_urapakkam_hotspot.jpg',
    bannerImage: '/images/blog/kpn_blog_1_urapakkam_hotspot.jpg',
    excerpt: 'Discover why Urapakkam is rapidly emerging as Chennai’s premier investment destination, driven by Kilambakkam Bus Terminus (KCBT), GST Road connectivity, and superior appreciation rates.',
    content: [
      'Chennai’s real estate horizon is rapidly expanding southwards, and Urapakkam has positioned itself as the crown jewel of this transformation. Once considered a peaceful suburban enclave, Urapakkam is now a bustling urban corridor seamlessly linking major commercial corridors with premium residential developments.',
      'The operational launch of the Kilambakkam Bus Terminus (KCBT) has revolutionized regional transit. Located just minutes away from Urapakkam, this modern transport terminal connects over 100,000 daily commuters to all corners of Tamil Nadu. Additionally, the Urapakkam Suburban Railway Station and proximity to the Outer Ring Road (ORR) ensure swift transit to the Chennai International Airport in under 30 minutes.',
      'With leading IT parks such as MEPZ Tambaram, Mahindra World City, and Siruseri SIPCOT located within easy driving distance, Urapakkam has become the preferred residential choice for working professionals seeking affordable housing without sacrificing connectivity.',
      'Over the past three years, land and apartment values in Urapakkam have appreciated by over 25-35%. The influx of working families has created consistent rental demand, offering property owners rental yields between 4.5% to 6% annually.',
      'From reputed educational institutions such as SRM University, Crescent University, and Delhi Public School, to multi-specialty healthcare centers like SRM General Hospital and Hindu Mission Hospital, Urapakkam provides a wholesome living ecosystem for multi-generational families.',
    ],
    galleryImages: [
      '/images/projects/project_1.jpg',
      '/images/projects/project_2.jpg',
    ],
  },
  {
    id: '02',
    slug: 'top-5-reasons-to-invest-in-dtcp-rera-approved-plots-in-urapakkam',
    category: 'Plots & Land',
    date: 'Jul 05, 2025',
    title: 'Top 5 Reasons to Invest in a DTCP & RERA Approved Plots in Urapakkam',
    image: '/images/blog/kpn_blog_2_dtcp_rera_plots.jpg',
    bannerImage: '/images/blog/kpn_blog_2_dtcp_rera_plots.jpg',
    excerpt: 'Investing in land requires security and growth. Here are the top 5 reasons why buying DTCP and TNRERA approved plots in Urapakkam guarantees maximum returns and zero legal risk.',
    content: [
      'Land ownership has always been the cornerstone of wealth creation in India. In rapidly growing corridors like Urapakkam, investing in legally vetted, DTCP and TNRERA approved plots is the smartest choice for discerning investors and homebuilders.',
      '1. 100% Legal Transparency & Clear Titles: DTCP (Directorate of Town and Country Planning) approval ensures that the layout conforms to strict government town planning norms. Combined with TNRERA registration, buyers receive complete legal immunity against title disputes, unauthorized encroachments, and layout violations.',
      '2. Exceptional Capital Appreciation: While built apartments experience structural depreciation over decades, land values in prime suburban growth zones like Urapakkam appreciate exponentially. Plotted developments along the GST corridor consistently outperform traditional fixed-income investments.',
      '3. Total Architectural Freedom: Plotted land gives you the autonomy to construct your dream independent villa at your own pace, tailored precisely to your family’s architectural tastes, vaastu preferences, and spatial requirements.',
      '4. Plug-and-Play Infrastructure: Modern DTCP-approved layouts developed by reputable promoters like KPN Promoters come equipped with wide blacktop tar roads, sweet potable groundwater, underground drainage provisions, electricity lines, and 24/7 security.',
      '5. Hassle-Free Bank Loan Approvals: Because DTCP & RERA plots satisfy every statutory norm, top nationalized and private banks (such as SBI, HDFC, ICICI, and LIC HFL) readily provide up to 75-80% plot purchase and construction financing with competitive interest rates.',
    ],
    galleryImages: [
      '/images/projects/project_3.jpg',
      '/images/projects/project_4.jpg',
    ],
  },
  {
    id: '03',
    slug: 'complete-guide-to-buying-a-flat-in-chennai-budget-loans-and-legal-checklist',
    category: 'Buying Guide',
    date: 'Jul 10, 2025',
    title: 'Complete Guide to Buying a Flat in Chennai: Budget, Loans, and Legal Checklist',
    image: '/images/blog/kpn_blog_3_guide_buying_flat.jpg',
    bannerImage: '/images/blog/kpn_blog_3_guide_buying_flat.jpg',
    excerpt: 'A step-by-step master checklist for Chennai homebuyers covering true budget estimation, home loan eligibility, and must-verify legal documents before signing.',
    content: [
      'Purchasing an apartment in Chennai represents one of the most significant financial and emotional milestones in a person’s life. Navigating this journey smoothly requires thorough due diligence across budgeting, loan structuring, and legal compliance.',
      'Step 1: Estimating Your True Budget: Beyond the base square-foot price quoted by developers, factor in mandatory statutory costs: 7% Stamp Duty, 2% Registration charges, 1%-5% GST (for under-construction projects), corpus fund, covered car parking, and EB/water meter deposits. Planning for an extra 10-15% buffer ensures zero financial stress during handover.',
      'Step 2: Optimizing Home Loans: Secure a home loan pre-approval before finalizing your property. This clarifies your exact borrowing capacity and empowers you to negotiate effectively. Maintain a CIBIL score above 750 to unlock the lowest interest rates and minimal processing fees.',
      'Step 3: Crucial Legal Documents Checklist: Before paying any booking advance, demand and verify: Parent Deed (tracing ownership for at least 30 years), Encumbrance Certificate (EC for 30+ years with nil encumbrances), CMDA/DTCP Building Plan Approval, Patta & Chitta, and the all-important TNRERA Project Registration Certificate.',
      'Step 4: Understanding UDS (Undivided Share of Land): Ensure that your sale agreement specifies a clear, proportionate Undivided Share (UDS). A higher UDS percentage directly translates to greater underlying land equity and superior long-term asset value.',
      'Step 5: Builder Track Record & Handover Commitment: Partner exclusively with trusted developers like KPN Promoters who have a proven legacy of on-time delivery, structural excellence, and transparent customer service.',
    ],
    galleryImages: [
      '/images/projects/project_5.jpg',
      '/images/projects/project_6.jpg',
    ],
  },
  {
    id: '04',
    slug: 'why-2-bhk-apartments-are-the-most-popular-choice-among-chennai-homebuyers-in-2025',
    category: 'Apartments',
    date: 'Jul 15, 2025',
    title: 'Why 2 BHK Apartments Are the Most Popular Choice Among Chennai Homebuyers in 2025',
    image: '/images/blog/kpn_blog_4_2bhk_popular_choice.jpg',
    bannerImage: '/images/blog/kpn_blog_4_2bhk_popular_choice.jpg',
    excerpt: 'Explore why 2 BHK configurations dominate Chennai’s residential real estate market, delivering the perfect balance of budget, comfort, and investment liquidity.',
    content: [
      'In 2025, residential real estate data across Chennai reveals an unmistakable trend: 2 BHK apartments account for more than 60% of all residential home transactions. From young IT couples to retirees, the two-bedroom layout has proven to be the undisputed favorite.',
      'The Ideal Balance of Space and Budget: A well-designed 2 BHK apartment (typically 750 to 950 sq. ft.) provides ample living space for nuclear families, accommodating a master bedroom, children/guest room, spacious living-dining hall, and modern kitchen without the hefty price tag of a 3 BHK.',
      'Manageable EMIs & Lower Maintenance: For first-time homebuyers, keeping monthly loan repayments within a comfortable 30-40% bracket of household income is essential. A 2 BHK requires lower down payment capital and significantly less monthly association maintenance charges, property taxes, and utility bills.',
      'High Rental Yield and Liquidity: If you ever decide to upgrade or relocate, 2 BHK homes enjoy the fastest tenant absorption rates in Chennai. Professionals working along the GST Road and OMR corridors actively seek compact 2 BHK rentals, guaranteeing steady passive rental income and minimal vacancy periods.',
      'Superior Resale Potential: Because 2 BHK flats sit squarely in the affordable-to-mid-income bracket, the secondary resale market is perpetually active. Selling a 2 BHK apartment is considerably faster and less price-elastic than finding buyers for luxury multi-crore penthouses.',
    ],
    galleryImages: [
      '/images/projects/project_1.jpg',
      '/images/projects/project_2.jpg',
    ],
  },
  {
    id: '05',
    slug: 'under-construction-vs-ready-to-move-what-should-you-choose-in-chennai',
    category: 'Buying Guide',
    date: 'Jul 20, 2025',
    title: 'Under-Construction vs Ready-to-Move: What Should You Choose in Chennai?',
    image: '/images/blog/kpn_blog_5_under_construction_vs_ready.jpg',
    bannerImage: '/images/blog/kpn_blog_5_under_construction_vs_ready.jpg',
    excerpt: 'Weighing the pros and cons of under-construction vs ready-to-move properties in Chennai. Compare costs, GST implications, possession timelines, and risk factors.',
    content: [
      'One of the biggest dilemmas confronting Chennai homebuyers is deciding between booking an under-construction home versus buying a ready-to-move-in apartment. Both avenues possess distinct advantages depending on your personal cash flow, timeline, and risk profile.',
      'Under-Construction: Lower Capital Outlay & Flexible Cash Flow: Booking during initial launch or construction phases offers price discounts of 10% to 20% compared to finished inventory. Construction-linked payment plans allow buyers to disburse funds in stages as construction milestones are verified, making financing significantly easier.',
      'Ready-to-Move: Immediate Possession & Zero Uncertainty: The foremost benefit of ready-to-move homes is immediate occupancy. You save instant rental expenses, eliminate construction delay anxieties, and get to physically inspect the exact room dimensions, natural ventilation, and view from your balcony before finalizing.',
      'GST Tax Advantages: Under Indian tax law, ready-to-move properties that have received their Completion Certificate (CC) are 100% exempt from Goods and Services Tax (GST). For under-construction apartments, GST applies at 1% for affordable housing or 5% for non-affordable units.',
      'The Verdict: If you are currently paying high house rent and require immediate accommodation, a ready-to-move home like KPN LeNid provides instant peace of mind. Conversely, if you are looking for maximum capital appreciation and staged payment flexibility, an early-stage project offers superior investment ROI.',
    ],
    galleryImages: [
      '/images/projects/project_3.jpg',
      '/images/projects/project_4.jpg',
    ],
  },
  {
    id: '06',
    slug: 'flats-vs-independent-houses-vs-plots-complete-comparison-for-chennai-buyers',
    category: 'Property Comparison',
    date: 'Jul 25, 2025',
    title: 'Flats vs Independent Houses vs Plots: Complete Comparison for Chennai Buyers',
    image: '/images/blog/kpn_blog_6_flats_vs_houses_vs_plots.jpg',
    bannerImage: '/images/blog/kpn_blog_6_flats_vs_houses_vs_plots.jpg',
    excerpt: 'A comprehensive side-by-side comparison of apartments, independent villas, and residential plots in Chennai to help you choose the ideal asset for your lifestyle.',
    content: [
      'As Chennai’s urban footprint expands, property seekers are presented with three primary asset classes: apartments (flats), independent houses (villas), and residential plots. Selecting the right option requires evaluating lifestyle preferences, long-term capital goals, and maintenance commitments.',
      'Apartments: Community Living & Modern Convenience: Flats within gated communities offer turnkey convenience. Residents benefit from shared lifestyle amenities such as 24/7 security, power backup, children’s play zones, and landscaped parks without shouldering sole maintenance responsibility. They are ideal for busy professionals seeking security and community camaraderie.',
      'Independent Houses: Supreme Privacy & Land Ownership: An independent home or villa provides unhindered privacy, personal terrace rights, and the freedom to modify or extend your living spaces as your family grows. You own 100% of the land beneath your feet, representing a timeless symbol of pride and family heritage.',
      'Residential Plots: Maximum Capital Appreciation & Design Freedom: Plotted land developments have consistently recorded the highest annualized growth rates in Chennai’s suburban corridors. Plots require minimal maintenance, zero recurring association costs, and allow you to construct a custom residence whenever your finances align.',
      'Summary Recommendation: Choose an Apartment if you prioritize immediate community amenities, centralized security, and zero maintenance hassle. Choose an Independent House if you value complete autonomy, private terrace living, and full land ownership. Choose a Plot if your primary objective is high-yield long-term capital appreciation with low entry costs and complete architectural freedom.',
    ],
    galleryImages: [
      '/images/projects/project_5.jpg',
      '/images/projects/project_6.jpg',
    ],
  },
];

export interface AwardItem {
  id: string;
  year: string;
  title: string;
  organization: string;
  image: string;
}

export const awardsData: AwardItem[] = [
  {
    id: '01',
    year: '2024',
    title: 'FPA Home Expo 2024',
    organization: 'By Flat Promoters Association',
    image: '/images/awards/FPA-Home-Expo-2024.png',
  },
  {
    id: '02',
    year: '2023',
    title: 'FPA Home Expo 2023',
    organization: 'By Flat Promoters Association',
    image: '/images/awards/FPA-Home-Expo-2023.png',
  },
  {
    id: '03',
    year: '2025',
    title: 'Trusted Developer of the Year',
    organization: 'By Economic Times Achievers of Tamil Nadu',
    image: '/images/awards/Trusted-Developer-2025.png',
  },
  {
    id: '04',
    year: '2017',
    title: 'Best Builder Award',
    organization: 'Top Commercial & Residential Builder',
    image: '/images/awards/Best-Builder-2017.png',
  },
  {
    id: '05',
    year: '2019',
    title: 'Business Growth Award',
    organization: 'Excellence in Real Estate Development',
    image: '/images/awards/Business-Growth-2019.png',
  },
  {
    id: '06',
    year: '2021',
    title: 'Business Growth Award',
    organization: 'Outstanding Achievement in Housing',
    image: '/images/awards/Business-Growth-2021.png',
  },
  {
    id: '07',
    year: '2024',
    title: 'LIC Business Meet Award',
    organization: 'Outstanding Performance & Partnership',
    image: '/images/awards/LIC-Business-Meet-2024.png',
  },
  {
    id: '08',
    year: '2024',
    title: 'Township Developers of the Year',
    organization: 'Integrated Township Excellence',
    image: '/images/awards/Township-Developers-2024.png',
  },
  {
    id: '09',
    year: '2024',
    title: 'Life Membership Certificate',
    organization: 'Flat Promoters Association',
    image: '/images/awards/Life-Membership-Certificate.png',
  },
];