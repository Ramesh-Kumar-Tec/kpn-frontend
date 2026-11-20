'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import InnerPageHero from '@/components/sections/InnerPageHero';
import FadeIn from '@/components/animation/FadeIn';
import RunningPillBadge from '@/components/ui/RunningPillBadge';
import {
  Mail,
  MapPin,
  ArrowRight,
  X,
  Calendar,
  Clock,
  Briefcase,
  CheckCircle2,
} from 'lucide-react';

interface JobPosition {
  id: string;
  type: string;
  title: string;
  location: string;
  timing: string;
  summary: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  outroText: string;
}

export default function CareersPage() {
  const [selectedJob, setSelectedJob] = useState<JobPosition | null>(null);

  // Lock body & html scroll completely when popup modal is open
  useEffect(() => {
    if (selectedJob) {
      const originalHtmlOverflow = document.documentElement.style.overflow;
      const originalBodyOverflow = document.body.style.overflow;

      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';

      return () => {
        document.documentElement.style.overflow = originalHtmlOverflow;
        document.body.style.overflow = originalBodyOverflow;
      };
    }
  }, [selectedJob]);

  const jobs: JobPosition[] = [
    {
      id: '01',
      type: 'FULL TIME',
      title: 'HR Business Partner',
      location: 'London, England',
      timing: '09:00 am - 05:00pm',
      summary:
        "We help transform the world's most important businesses into vigorous, agile organizations that anticipate the unpredictable, adapt rapidly to disruption and outcompete their opposition.",
      description:
        "You'll work closely with cross-functional teams including product managers, developers, and marketing to create designs that align with user needs and business goals.",
      responsibilities: [
        'Design and prototype user interfaces for web and mobile applications.',
        'Conduct user research, create personas, and develop wireframes and user flows.',
        'Collaborate with developers to ensure seamless implementation of designs.',
        'Maintain design consistency through style guides, design systems, and best practices.',
        'Test and refine designs based on user feedback and usability testing.',
      ],
      requirements: [
        'Proven experience as a UX/UI Designer with a strong portfolio of design projects.',
        'Proficiency in design tools such as Figma, Sketch, or Adobe XD.',
        'Understanding of user-centered design principles and responsive design.',
        'Strong communication skills and the ability to collaborate with diverse teams.',
        'Attention to detail and a passion for creating excellent user experiences.',
      ],
      outroText:
        "If you're passionate about designing exceptional digital experiences, we'd love to hear from you!",
    },
    {
      id: '02',
      type: 'FULL TIME',
      title: 'Financial Reporting Accountant',
      location: 'Miami, USA',
      timing: '09:00 am - 05:00pm',
      summary:
        'Oversee comprehensive financial operations, management accounting, statutory reporting, and asset valuation across real estate investments and development portfolios.',
      description:
        'You will handle end-to-end management reporting, audit preparation, tax filing advisory, cash flow forecasting, and developer joint-venture accounting.',
      responsibilities: [
        'Prepare monthly, quarterly, and annual financial statements in compliance with GAAP/IFRS.',
        'Analyze project development budgets, construction drawdowns, and revenue recognition.',
        'Coordinate external audit engagements and regulatory compliance filings.',
        'Manage escrow accounting and buyer transaction settlement reconciliations.',
        'Deliver strategic financial insight to executive leadership for new land acquisitions.',
      ],
      requirements: [
        'Bachelor’s degree in Accounting, Finance, or CPA / CA equivalent accreditation.',
        '3+ years of experience in financial reporting, real estate accounting, or audit.',
        'Proficiency in ERP accounting suites (SAP, Oracle, QuickBooks, or Zoho Books).',
        'Exceptional attention to detail with deep analytical problem-solving capabilities.',
        'Strong integrity, compliance discipline, and team collaboration skills.',
      ],
      outroText:
        'Join our finance team and steer the economic growth of landmark real estate ventures!',
    },
    {
      id: '03',
      type: 'FULL TIME',
      title: 'Sales Enablement Manager',
      location: 'London, England',
      timing: '09:00 am - 05:00pm',
      summary:
        'Empower property consulting teams, channel partners, and NRI sales divisions with cutting-edge collateral, market insights, and conversion enablement programs.',
      description:
        'Bridge product strategy and customer outreach by crafting buyer toolkits, customer journey frameworks, and high-conversion real estate sales playbooks.',
      responsibilities: [
        'Develop training programs, onboarding modules, and sales decks for high-value properties.',
        'Partner with marketing to deliver localized collateral, walkthroughs, and buyer guides.',
        'Optimize CRM pipelines, lead scoring workflows, and customer engagement metrics.',
        'Organize channel partner summits, investor webinars, and property expo roadshows.',
        'Gather direct buyer feedback to continuously refine product presentation and pricing pitch.',
      ],
      requirements: [
        'Demonstrated success in sales enablement, training, or real estate business development.',
        'Strong mastery of CRM workflows (Salesforce, HubSpot, or Zoho CRM) and sales analytics.',
        'Outstanding public speaking, storytelling, and negotiation coaching skills.',
        'Ability to translate complex project specifications into compelling buyer propositions.',
        'Proactive leadership with an appetite for high-energy growth environments.',
      ],
      outroText:
        'Help shape the sales culture and drive record-breaking property sales across key regions!',
    },
    {
      id: '04',
      type: 'FULL TIME',
      title: 'Senior UX Researcher',
      location: 'Las Vegas, USA',
      timing: '09:00 am - 05:00pm',
      summary:
        'Uncover deep buyer psychology, customer expectations, and digital interaction touchpoints to build world-class property discovery platforms.',
      description:
        'Champion the voice of property seekers, investors, and homeowners through qualitative field studies, usability testing labs, and quantitative behavioral analytics.',
      responsibilities: [
        'Plan and execute end-to-end qualitative interviews, field tests, and usability sessions.',
        'Synthesize findings into actionable journey maps, mental models, and UX requirements.',
        'Collaborate with design and product teams to validate wireframes, portals, and interactive tools.',
        'Establish UX research repositories and benchmark digital customer satisfaction scores.',
        'Advocate user-centered decisions across web portals, mobile apps, and booking workflows.',
      ],
      requirements: [
        '5+ years conducting UX research for digital consumer platforms or enterprise portals.',
        'Mastery of research methodologies: contextual inquiry, diary studies, card sorting, A/B testing.',
        'Expertise in tools such as Maze, UserTesting, Dovetail, Hotjar, and Google Analytics.',
        'Strong empathy, active listening, and compelling executive presentation skills.',
        'Degree in Human-Computer Interaction, Cognitive Science, Psychology, or related field.',
      ],
      outroText:
        'Empower millions of home seekers with intuitive, transparent, and joyful digital experiences!',
    },
    {
      id: '05',
      type: 'FULL TIME',
      title: 'Product Manager',
      location: 'Manchester, England',
      timing: '09:00 am - 05:00pm',
      summary:
        'Lead the innovation roadmap for digital real estate discovery, CRM integrations, interactive master plans, and smart client relationship platforms.',
      description:
        'Own the complete product lifecycle from concept to launch, aligning technical engineering, marketing, and commercial real estate goals into scalable features.',
      responsibilities: [
        'Define product vision, feature backlog, sprint roadmaps, and measurable OKRs.',
        'Work closely with software engineers, UX designers, and stakeholders to ship features on time.',
        'Monitor user acquisition, funnel drop-offs, search conversions, and portal engagement.',
        'Lead agile ceremonies, user story mapping, and feature release communications.',
        'Benchmark competitor solutions and evaluate emerging PropTech capabilities.',
      ],
      requirements: [
        '3+ years of product management experience delivering web or mobile applications.',
        'Solid grounding in agile frameworks, user analytics, and technical architecture.',
        'Data-driven mindset with proven ability to derive insights from SQL, Mixpanel, or GA4.',
        'Strong cross-functional leadership and stakeholder management abilities.',
        'Passion for real estate technology, PropTech innovation, and customer-first design.',
      ],
      outroText:
        'Drive the next generation of PropTech products that redefine how people invest in property!',
    },
    {
      id: '06',
      type: 'FULL TIME',
      title: 'Lifecycle Campaign Manager',
      location: 'London, England',
      timing: '09:00 am - 05:00pm',
      summary:
        'Architect multichannel retention, nurturing, and lifecycle marketing campaigns across WhatsApp, Email, SMS, and digital touchpoints.',
      description:
        'Build automated customer journeys that turn first-time property inquiries into long-term loyal homeowners and recurring real estate investors.',
      responsibilities: [
        'Design automated nurture flows for newly registered leads, site visit bookings, and investors.',
        'A/B test subject lines, email copy, CTA buttons, and interactive campaign creatives.',
        'Segment audiences based on budget preferences, location interests, and engagement scores.',
        'Collaborate with the creative team to craft engaging newsletters, market reports, and launch alerts.',
        'Track deliverability, open rates, CTRs, and downstream sales attribution.',
      ],
      requirements: [
        '3+ years experience in CRM marketing, lifecycle automation, or email marketing.',
        'Hands-on expertise with platforms like Klaviyo, Braze, Customer.io, HubSpot, or Mailchimp.',
        'Strong copywriting, storytelling, and audience segmentation skills.',
        'Working knowledge of HTML/CSS email templates and deliverability best practices.',
        'Analytical rigor with focus on conversion optimization and ROI.',
      ],
      outroText:
        'Be the creative catalyst connecting ambitious homebuyers with their dream destinations!',
    },
  ];

  return (
    <div className="w-full overflow-hidden bg-white">
      <Navbar variant="hero" />

      {/* Hero Section */}
      <InnerPageHero
        breadcrumbAtTop={true}
        tagline="BUILD YOUR CAREER WITH US"
        title="Careers at KPN Promoters"
        subtitle="Work With Passion, Grow With Chennai's Leading Real Estate Brand"
        breadcrumb="Home / About KPN / Careers"
        description="Join a dynamic, forward-thinking team dedicated to transforming Chennai's real estate landscape. Explore our open positions and discover your potential."
        image="/images/core-bc.jpg"
      />

      {/* Main Careers Section */}
      <section className="bg-white px-4 py-20 sm:px-6 lg:px-12 lg:py-28">
        <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-12">
          {/* Section Header */}
          <div className="mb-14 lg:mb-20">
            <FadeIn direction="up">
              <RunningPillBadge text="JOIN OUR TEAM" className="mb-6" />
              <h2 className="text-4xl font-extrabold tracking-tight text-[#29247c] sm:text-5xl lg:text-6xl">
                Make your next <br className="hidden sm:inline" />
                career move
              </h2>
            </FadeIn>
          </div>

          {/* Two-Column Layout */}
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-14 items-start">
            {/* Left Card: Opportunities with us */}
            <div className="lg:col-span-4">
              <FadeIn direction="right">
                <div className="relative overflow-hidden rounded-[36px] bg-slate-900 text-white p-8 sm:p-10 shadow-xl min-h-[480px] flex flex-col justify-between">
                  {/* Background overlay image with dark tint */}
                  <div
                    className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity"
                    style={{
                      backgroundImage: `url('/images/team/team-1.jpg')`,
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-[#29247c]/90 via-[#29247c]/95 to-slate-950" />

                  {/* Top Red Icon */}
                  <div className="relative z-10">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f12131] text-white shadow-lg shadow-red-500/30">
                      <Mail className="h-7 w-7" />
                    </div>
                  </div>

                  {/* Center Content */}
                  <div className="relative z-10 mt-8 space-y-4">
                    <h3 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                      Opportunities <br />
                      with us
                    </h3>
                    <p className="text-sm font-medium leading-relaxed text-slate-300">
                      We are always up to discover new talents, kindly mail us your resume and portfolio link to
                    </p>
                    <a
                      href="mailto:kpnsalesteam@gmail.com"
                      className="block text-base sm:text-lg font-extrabold text-[#f12131] hover:text-red-400 transition-colors break-all"
                    >
                      kpnsalesteam@gmail.com
                    </a>
                  </div>

                  {/* Bottom Action Button */}
                  <div className="relative z-10 mt-8">
                    <Link
                      href="/contact-us"
                      className="group inline-flex items-center gap-3 rounded-full bg-white pl-7 pr-2 py-2 text-sm font-extrabold text-slate-900 shadow-md transition-all duration-300 hover:bg-slate-100 hover:shadow-xl hover:scale-105"
                    >
                      <span>Contact Us</span>
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f12131] text-white transition-transform duration-300 group-hover:rotate-45">
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </Link>
                  </div>
                </div>
              </FadeIn>
            </div>

            {/* Right Job Positions List */}
            <div className="lg:col-span-8">
              <FadeIn direction="left">
                <div className="divide-y divide-slate-100 rounded-[32px] border border-slate-100 bg-white shadow-sm overflow-hidden">
                  {jobs.map((job) => (
                    <button
                      key={job.id}
                      type="button"
                      onClick={() => setSelectedJob(job)}
                      className="group w-full text-left flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 sm:px-8 sm:py-7 transition-all duration-300 hover:bg-slate-50/80 cursor-pointer focus:outline-none"
                    >
                      {/* Left: Badge + Title */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
                        <span className="w-fit rounded-full bg-slate-100 px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-wider text-slate-700 transition-colors group-hover:bg-[#f12131] group-hover:text-white">
                          {job.type}
                        </span>
                        <h4 className="text-lg sm:text-xl font-bold text-slate-900 transition-colors group-hover:text-[#29247c]">
                          {job.title}
                        </h4>
                      </div>

                      {/* Right: Location */}
                      <div className="flex items-center gap-2 text-sm font-semibold text-slate-600 sm:shrink-0">
                        <MapPin className="h-4 w-4 text-[#f12131]" />
                        <span>{job.location}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          JOB DETAILS POPUP MODAL (EXACT MATCH TO REFERENCE)
      ========================================================= */}
      <AnimatePresence>
        {selectedJob && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedJob(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Dialog Shell with rounded corners and clipped overflow */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10 flex max-h-[85vh] w-full max-w-4xl flex-col overflow-hidden rounded-[32px] sm:rounded-[40px] bg-white shadow-2xl"
            >
              {/* Floating Close Button */}
              <button
                type="button"
                onClick={() => setSelectedJob(null)}
                aria-label="Close details"
                className="absolute right-6 top-6 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-colors hover:bg-slate-200 hover:text-slate-900 cursor-pointer shadow-xs"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Scrollable Content Container (Scrollbar stays securely inside) */}
              <div className="custom-modal-scrollbar overflow-y-auto p-6 sm:p-10 lg:p-12 pr-6 sm:pr-10 lg:pr-12">
                {/* Title & Top Meta Section */}
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start pr-8">
                  {/* Left Header Title + Summary */}
                  <div className="lg:col-span-8 space-y-4">
                    <h2 className="text-3xl font-extrabold tracking-tight text-[#1a1442] sm:text-4xl lg:text-5xl">
                      {selectedJob.title}
                    </h2>
                    <p className="text-sm sm:text-base font-medium leading-relaxed text-slate-600">
                      {selectedJob.summary}
                    </p>
                  </div>

                  {/* Right Meta Badges + Apply Button */}
                  <div className="lg:col-span-4 space-y-4 rounded-2xl bg-slate-50 p-5 sm:p-6 border border-slate-100">
                    <div className="flex items-center gap-3 text-xs sm:text-sm font-bold text-slate-700">
                      <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
                      <span>{selectedJob.type === 'FULL TIME' ? 'Full time' : selectedJob.type}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs sm:text-sm font-bold text-slate-700">
                      <Clock className="h-4 w-4 text-slate-400 shrink-0" />
                      <span>{selectedJob.timing}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs sm:text-sm font-bold text-slate-700">
                      <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                      <span>{selectedJob.location}</span>
                    </div>

                    <div className="pt-2">
                      <a
                        href={`mailto:kpnsalesteam@gmail.com?subject=Application for position: ${encodeURIComponent(selectedJob.title)}`}
                        className="group inline-flex items-center justify-between w-full rounded-full border border-slate-200 bg-white px-5 py-2.5 text-xs sm:text-sm font-extrabold text-slate-900 shadow-xs transition-all duration-300 hover:border-[#f12131] hover:shadow-md active:scale-98"
                      >
                        <span>Apply Now</span>
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f12131] text-white transition-transform duration-300 group-hover:scale-110">
                          <ArrowRight className="h-3.5 w-3.5" />
                        </span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <hr className="my-8 border-t border-slate-100" />

                {/* Main Content Sections */}
                <div className="space-y-8">
                  {/* Job Description */}
                  <div className="space-y-3">
                    <h3 className="text-xl sm:text-2xl font-extrabold text-[#29247c]">
                      Job description
                    </h3>
                    <p className="text-sm sm:text-base font-normal leading-relaxed text-slate-600">
                      {selectedJob.description}
                    </p>
                  </div>

                  {/* Key Responsibilities */}
                  <div className="space-y-3">
                    <h3 className="text-xl sm:text-2xl font-extrabold text-[#29247c]">
                      Key Responsibilities:
                    </h3>
                    <ul className="space-y-2.5 text-sm sm:text-base font-normal text-slate-600">
                      {selectedJob.responsibilities.map((resp, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <span className="mt-2 h-1.5 w-1.5 rounded-[2px] bg-[#29247c] shrink-0" />
                          <span>{resp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Requirements */}
                  <div className="space-y-3">
                    <h3 className="text-xl sm:text-2xl font-extrabold text-[#29247c]">
                      Requirements:
                    </h3>
                    <ul className="space-y-2.5 text-sm sm:text-base font-normal text-slate-600">
                      {selectedJob.requirements.map((req, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <span className="mt-2 h-1.5 w-1.5 rounded-[2px] bg-[#29247c] shrink-0" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Outro Callout */}
                  <div className="pt-2 pb-4">
                    <p className="text-sm sm:text-base font-bold text-[#29247c]">
                      {selectedJob.outroText}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
