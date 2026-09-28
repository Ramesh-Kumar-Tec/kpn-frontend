'use client';

import React, { useState, useEffect } from 'react';
import {
  Building2,
  X,
  CheckCircle2,
  Calendar,
  Phone,
  Mail,
  User,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Send,
  Loader2,
} from 'lucide-react';
import { submitEnquiry } from '@/lib/cmsClient';
import { Block, Unit, Plot } from '@/components/admin/InventoryManager';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import PhoneInputWithCountry from '@/components/ui/PhoneInputWithCountry';
import { Country, DEFAULT_COUNTRY } from '@/lib/countryCodes';
import { cleanName, validateName, cleanEmail, validateEmail, validatePhone } from '@/lib/formValidation';

interface UnitBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: {
    id?: string;
    _id?: string;
    name: string;
    slug: string;
    propertyType?: string;
    type?: string;
    location?: string;
    budget?: string;
    blocks?: Block[];
    plots?: Plot[];
    layoutImages?: string[];
  };
}

export default function UnitBookingModal({
  isOpen,
  onClose,
  project,
}: UnitBookingModalProps) {
  const isVillas =
    project?.propertyType?.toLowerCase() === 'villas' ||
    project?.type?.toLowerCase() === 'villas';

  const isPlots =
    !isVillas &&
    (project?.propertyType === 'Plots' ||
      project?.type === 'Plots' ||
      (Array.isArray(project?.plots) && project.plots.length > 0 && (!project?.blocks || project.blocks.length === 0)));

  // Fallback demo blocks for Apartments
  const defaultBlocks: Block[] = [
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
            { unitId: 'A101', unitNumber: '101', bhk: 2, bathrooms: 2, size: 850, unitType: '2 BHK Luxury', facing: 'East', status: 'available' },
            { unitId: 'A102', unitNumber: '102', bhk: 2, bathrooms: 2, size: 875, unitType: '2 BHK Premium', facing: 'North', status: 'available' },
            { unitId: 'A103', unitNumber: '103', bhk: 1, bathrooms: 1, size: 560, unitType: '1 BHK Smart', facing: 'East', status: 'booked' },
            { unitId: 'A104', unitNumber: '104', bhk: 2, bathrooms: 2, size: 890, unitType: '2 BHK Corner', facing: 'West', status: 'available' },
          ],
        },
        {
          floorNumber: 2,
          floorName: '2nd Floor',
          units: [
            { unitId: 'A201', unitNumber: '201', bhk: 2, bathrooms: 2, size: 850, unitType: '2 BHK Luxury', facing: 'East', status: 'available' },
            { unitId: 'A202', unitNumber: '202', bhk: 2, bathrooms: 2, size: 875, unitType: '2 BHK Premium', facing: 'North', status: 'sold' },
            { unitId: 'A203', unitNumber: '203', bhk: 1, bathrooms: 1, size: 560, unitType: '1 BHK Smart', facing: 'East', status: 'available' },
            { unitId: 'A204', unitNumber: '204', bhk: 3, bathrooms: 2, size: 1250, unitType: '3 BHK Royal', facing: 'North-East', status: 'available' },
          ],
        },
        {
          floorNumber: 3,
          floorName: '3rd Floor',
          units: [
            { unitId: 'A301', unitNumber: '301', bhk: 2, bathrooms: 2, size: 850, unitType: '2 BHK Luxury', facing: 'East', status: 'available' },
            { unitId: 'A302', unitNumber: '302', bhk: 2, bathrooms: 2, size: 875, unitType: '2 BHK Premium', facing: 'North', status: 'available' },
            { unitId: 'A303', unitNumber: '303', bhk: 1, bathrooms: 1, size: 560, unitType: '1 BHK Smart', facing: 'East', status: 'available' },
            { unitId: 'A304', unitNumber: '304', bhk: 2, bathrooms: 2, size: 890, unitType: '2 BHK Corner', facing: 'West', status: 'booked' },
          ],
        },
        {
          floorNumber: 4,
          floorName: '4th Floor',
          units: [
            { unitId: 'A401', unitNumber: '401', bhk: 3, bathrooms: 3, size: 1350, unitType: '3 BHK Penthouse', facing: 'East', status: 'available' },
            { unitId: 'A402', unitNumber: '402', bhk: 3, bathrooms: 3, size: 1400, unitType: '3 BHK Penthouse', facing: 'North', status: 'available' },
            { unitId: 'A403', unitNumber: '403', bhk: 2, bathrooms: 2, size: 900, unitType: '2 BHK Luxury', facing: 'West', status: 'booked' },
            { unitId: 'A404', unitNumber: '404', bhk: 3, bathrooms: 3, size: 1380, unitType: '3 BHK Royal', facing: 'North-East', status: 'available' },
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
            { unitId: 'B101', unitNumber: '101', bhk: 2, bathrooms: 2, size: 920, unitType: '2 BHK Luxury', facing: 'East', status: 'available' },
            { unitId: 'B102', unitNumber: '102', bhk: 2, bathrooms: 2, size: 920, unitType: '2 BHK Luxury', facing: 'West', status: 'available' },
            { unitId: 'B103', unitNumber: '103', bhk: 3, bathrooms: 2, size: 1200, unitType: '3 BHK Elite', facing: 'North', status: 'available' },
          ],
        },
        {
          floorNumber: 2,
          floorName: '2nd Floor',
          units: [
            { unitId: 'B201', unitNumber: '201', bhk: 2, bathrooms: 2, size: 920, unitType: '2 BHK Luxury', facing: 'East', status: 'available' },
            { unitId: 'B202', unitNumber: '202', bhk: 2, bathrooms: 2, size: 920, unitType: '2 BHK Luxury', facing: 'West', status: 'sold' },
            { unitId: 'B203', unitNumber: '203', bhk: 3, bathrooms: 2, size: 1200, unitType: '3 BHK Elite', facing: 'North', status: 'available' },
          ],
        },
        {
          floorNumber: 3,
          floorName: '3rd Floor',
          units: [
            { unitId: 'B301', unitNumber: '301', bhk: 2, bathrooms: 2, size: 950, unitType: '2 BHK Luxury', facing: 'East', status: 'available' },
            { unitId: 'B302', unitNumber: '302', bhk: 3, bathrooms: 2, size: 1250, unitType: '3 BHK Royal', facing: 'West', status: 'available' },
            { unitId: 'B303', unitNumber: '303', bhk: 3, bathrooms: 3, size: 1350, unitType: '3 BHK Elite', facing: 'North', status: 'available' },
          ],
        },
      ],
    },
  ];

  // Fallback demo blocks for Villas (Enclaves & Duplex Levels)
  const defaultVillaBlocks: Block[] = [
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
            { unitId: 'VA-01', unitNumber: 'A-01', bhk: 3, bathrooms: 3, size: 1850, unitType: '3 BHK Duplex Villa', facing: 'East', status: 'available' },
            { unitId: 'VA-02', unitNumber: 'A-02', bhk: 3, bathrooms: 3, size: 1920, unitType: '3 BHK Duplex Villa', facing: 'North', status: 'available' },
            { unitId: 'VA-03', unitNumber: 'A-03', bhk: 4, bathrooms: 4, size: 2200, unitType: '4 BHK Grand Villa', facing: 'East', status: 'booked' },
            { unitId: 'VA-04', unitNumber: 'A-04', bhk: 4, bathrooms: 4, size: 2350, unitType: '4 BHK Corner Villa', facing: 'North-East', status: 'available' },
          ],
        },
        {
          floorNumber: 2,
          floorName: 'Upper Level & Terrace',
          units: [
            { unitId: 'VA-05', unitNumber: 'A-05', bhk: 3, bathrooms: 3, size: 1850, unitType: '3 BHK Duplex Villa', facing: 'East', status: 'available' },
            { unitId: 'VA-06', unitNumber: 'A-06', bhk: 3, bathrooms: 3, size: 1950, unitType: '3 BHK Duplex Villa', facing: 'West', status: 'sold' },
            { unitId: 'VA-07', unitNumber: 'A-07', bhk: 4, bathrooms: 4, size: 2400, unitType: '4 BHK Grand Villa', facing: 'North', status: 'available' },
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
            { unitId: 'VB-01', unitNumber: 'B-01', bhk: 3, bathrooms: 3, size: 2100, unitType: '3 BHK Duplex Villa', facing: 'East', status: 'available' },
            { unitId: 'VB-02', unitNumber: 'B-02', bhk: 4, bathrooms: 4, size: 2600, unitType: '4 BHK Royal Villa', facing: 'North', status: 'available' },
            { unitId: 'VB-03', unitNumber: 'B-03', bhk: 4, bathrooms: 4, size: 2850, unitType: '4 BHK Presidential Villa', facing: 'North-East', status: 'available' },
          ],
        },
        {
          floorNumber: 2,
          floorName: 'Upper Level & Terrace',
          units: [
            { unitId: 'VB-04', unitNumber: 'B-04', bhk: 3, bathrooms: 3, size: 2100, unitType: '3 BHK Duplex Villa', facing: 'East', status: 'booked' },
            { unitId: 'VB-05', unitNumber: 'B-05', bhk: 4, bathrooms: 4, size: 2750, unitType: '4 BHK Royal Villa', facing: 'North', status: 'available' },
          ],
        },
      ],
    },
  ];

  // Fallback demo plots if plots haven't been seeded yet
  const defaultPlots: Plot[] = Array.from({ length: 28 }, (_, i) => {
    const plotNum = i + 1;
    const sizes = [600, 800, 1000, 1200, 1200, 1500, 1800, 2400];
    const facings = ['East', 'North', 'East', 'North-East', 'West'];
    const isBooked = plotNum === 4 || plotNum === 11 || plotNum === 19 || plotNum === 25;
    const isSold = plotNum === 7 || plotNum === 14 || plotNum === 21;
    return {
      plotId: `P-${plotNum}`,
      plotNumber: `${plotNum}`,
      size: sizes[i % sizes.length],
      facing: facings[i % facings.length],
      status: isSold ? 'sold' : isBooked ? 'booked' : 'available',
    };
  });

  const defaultVillaPlots: Plot[] = [
    { plotId: 'villa-V-01', plotNumber: 'V-01', size: 1850, facing: 'East', status: 'available' },
    { plotId: 'villa-V-02', plotNumber: 'V-02', size: 1950, facing: 'North', status: 'available' },
    { plotId: 'villa-V-03', plotNumber: 'V-03', size: 2250, facing: 'East', status: 'booked' },
    { plotId: 'villa-V-04', plotNumber: 'V-04', size: 2400, facing: 'North-East', status: 'available' },
    { plotId: 'villa-V-05', plotNumber: 'V-05', size: 1850, facing: 'West', status: 'sold' },
    { plotId: 'villa-V-06', plotNumber: 'V-06', size: 2100, facing: 'East', status: 'available' },
    { plotId: 'villa-V-07', plotNumber: 'V-07', size: 2650, facing: 'North', status: 'available' },
    { plotId: 'villa-V-08', plotNumber: 'V-08', size: 2850, facing: 'North-East', status: 'available' },
  ];

  const activeBlocks: Block[] =
    Array.isArray(project?.blocks) && project.blocks.length > 0
      ? project.blocks
      : isVillas
      ? defaultVillaBlocks
      : defaultBlocks;

  const activePlots: Plot[] =
    Array.isArray(project?.plots) && project.plots.length > 0
      ? project.plots
      : isVillas
      ? defaultVillaPlots
      : defaultPlots;

  // Step state: 1 = Selection (dropdowns & units), 2 = Enquiry Form
  const [step, setStep] = useState<1 | 2>(1);

  // Selection state
  const [selectedBlockId, setSelectedBlockId] = useState<string>('');
  const [selectedFloorNumber, setSelectedFloorNumber] = useState<number>(1);
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [selectedPlot, setSelectedPlot] = useState<Plot | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<Country>(DEFAULT_COUNTRY);
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; phone?: string; email?: string }>({});

  const handleNameChange = (val: string) => {
    const cleaned = cleanName(val);
    setName(cleaned);
    if (fieldErrors.name) {
      setFieldErrors((prev) => ({ ...prev, name: validateName(cleaned).error }));
    }
  };

  const handleEmailChange = (val: string) => {
    const cleaned = cleanEmail(val);
    setEmail(cleaned);
    if (fieldErrors.email) {
      setFieldErrors((prev) => ({ ...prev, email: validateEmail(cleaned, true).error }));
    }
  };

  const handlePhoneChange = (val: string) => {
    setPhone(val);
    if (fieldErrors.phone) {
      setFieldErrors((prev) => ({ ...prev, phone: validatePhone(val, selectedCountry, true).error }));
    }
  };

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      const originalPaddingRight = document.body.style.paddingRight;
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;

      document.body.style.overflow = 'hidden';
      if (scrollBarWidth > 0) {
        document.body.style.paddingRight = `${scrollBarWidth}px`;
      }

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          resetModal();
          onClose();
        }
      };

      window.addEventListener('keydown', handleKeyDown);

      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.paddingRight = originalPaddingRight;
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen]);

  // Set initial selected block & floor
  useEffect(() => {
    if (activeBlocks.length > 0) {
      const exists = activeBlocks.some((b) => b.blockId === selectedBlockId);
      if (!selectedBlockId || !exists) {
        const first = activeBlocks[0];
        setSelectedBlockId(first.blockId);
        if (first.floors && first.floors.length > 0) {
          setSelectedFloorNumber(Number(first.floors[0].floorNumber));
        }
      }
    }
  }, [activeBlocks, selectedBlockId]);

  // Current selected block and floor
  const currentBlock = activeBlocks.find((b) => b.blockId === selectedBlockId) || activeBlocks[0];
  const currentFloors = currentBlock?.floors || [];
  const currentFloor =
    currentFloors.find((f) => Number(f.floorNumber) === Number(selectedFloorNumber)) || currentFloors[0];

  // When block changes from dropdown, sync floor
  const handleBlockChange = (newBlockId: string) => {
    setSelectedBlockId(newBlockId);
    const targetBlock = activeBlocks.find((b) => b.blockId === newBlockId);
    if (targetBlock?.floors && targetBlock.floors.length > 0) {
      setSelectedFloorNumber(Number(targetBlock.floors[0].floorNumber));
    }
    setSelectedUnit(null);
  };

  // When floor changes from dropdown
  const handleFloorChange = (newFloorNum: number) => {
    setSelectedFloorNumber(Number(newFloorNum));
    setSelectedUnit(null);
  };

  // When an available unit is clicked
  const handleSelectUnit = (unit: Unit) => {
    if (unit.status !== 'available') return;
    setSelectedUnit(unit);
    setSelectedPlot(null);
    const itemType = isVillas ? 'Villa' : 'Unit';
    setMessage(
      `Hello KPN Team, I am interested in booking ${itemType} ${unit.unitNumber} (${currentBlock?.blockName || 'Tower'}, ${currentFloor?.floorName || 'Floor'}, ${unit.bhk} BHK) at ${project.name}. Please share availability and pricing details.`
    );
  };

  const handleSelectPlot = (plot: Plot) => {
    if (plot.status !== 'available') return;
    setSelectedPlot(plot);
    setSelectedUnit(null);
    const itemType = isVillas ? 'Villa' : 'Plot';
    setMessage(
      `Hello KPN Team, I am interested in booking ${itemType} ${plot.plotNumber} (${plot.size} Sq.Ft, ${plot.facing || 'East'} Facing) at ${project.name}. Please share availability and pricing details.`
    );
  };

  const handleNextStep = () => {
    if (!selectedUnit && !selectedPlot) return;
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const nameRes = validateName(name);
    const emailRes = validateEmail(email, true);
    const phoneRes = validatePhone(phone, selectedCountry, true);

    const newErrors = {
      name: nameRes.error,
      email: emailRes.error,
      phone: phoneRes.error,
    };
    setFieldErrors(newErrors);

    if (!nameRes.isValid || !emailRes.isValid || !phoneRes.isValid) {
      setSubmitError('Please correct the highlighted errors before submitting.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const unitLabel = selectedUnit
        ? `${isVillas ? 'Villa ' : ''}${selectedUnit.unitNumber}`
        : selectedPlot
        ? `${isVillas ? 'Villa ' : 'Plot '}${selectedPlot.plotNumber}`
        : 'Unit Enquiry';

      const blockLabel = selectedUnit ? currentBlock?.blockName : '';
      const floorLabel = selectedUnit ? currentFloor?.floorName : '';
      const unitTypeLabel = selectedUnit ? `${selectedUnit.bhk} BHK${isVillas ? ' Villa' : ''}` : isVillas ? 'Villa' : 'Plot';

      await submitEnquiry({
        name: name.trim(),
        phone: `${selectedCountry.dialCode} ${phone.trim()}`,
        email: email.trim(),
        projectId: project._id || project.id,
        projectName: project.name,
        block: blockLabel,
        floor: floorLabel,
        unitNumber: unitLabel,
        unitType: unitTypeLabel,
        message: `${message}${preferredDate ? ` | Preferred Site Visit: ${preferredDate}` : ''}`,
        source: 'Unit Booking Navigator',
      });

      setIsSubmitted(true);
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to submit enquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetModal = () => {
    setStep(1);
    setSelectedUnit(null);
    setSelectedPlot(null);
    setIsSubmitted(false);
    setSubmitError(null);
    setFieldErrors({});
    setSelectedCountry(DEFAULT_COUNTRY);
  };

  // Lock background scrolling completely when modal is open and handle ESC key
  useEffect(() => {
    if (!isOpen) return;

    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    const originalBodyPaddingRight = document.body.style.paddingRight;

    // Compensate for scrollbar width to prevent layout shift
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        resetModal();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.body.style.paddingRight = originalBodyPaddingRight;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          resetModal();
          onClose();
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-3 sm:p-5 backdrop-blur-md animate-in fade-in duration-200 overscroll-contain"
    >
      <div className="relative flex flex-col w-full max-w-lg sm:max-w-xl rounded-[32px] bg-white shadow-2xl border border-slate-100 max-h-[92vh] overflow-hidden overscroll-contain">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#f12131] text-white shadow-md shadow-red-500/20">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-[#29247c]">
                  {project.name}
                </h3>
                <span className="rounded-full bg-red-50 text-[#f12131] px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider border border-red-200/60">
                  {isVillas ? 'Luxury Villas' : isPlots ? 'Plots Layout' : 'Apartment Units'}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                {step === 1
                  ? isVillas
                    ? 'Step 1: Select Enclave & Level, then choose an available villa'
                    : isPlots
                    ? 'Step 1: Browse master layout & choose your preferred plot'
                    : 'Step 1: Select Tower & Floor, then choose an available unit'
                  : 'Step 2: Enter contact details to submit your booking enquiry'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              resetModal();
              onClose();
            }}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors shadow-xs"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 overscroll-contain">
          {/* SUCCESS SCREEN */}
          {isSubmitted ? (
            <div className="py-12 px-4 text-center space-y-5 max-w-lg mx-auto">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 mx-auto border border-emerald-200 shadow-lg shadow-emerald-500/10">
                <CheckCircle2 className="h-10 w-10" />
              </div>

              <div>
                <h4 className="text-2xl font-black text-[#29247c]">
                  Enquiry Submitted Successfully!
                </h4>
                <p className="text-sm font-semibold text-slate-600 mt-2">
                  Thank you, <strong className="text-slate-900">{name}</strong>. Your enquiry for{' '}
                  <span className="text-[#f12131] font-black">
                    {selectedUnit
                      ? `Unit ${selectedUnit.unitNumber} (${currentBlock?.blockName}, ${currentFloor?.floorName})`
                      : `Plot ${selectedPlot?.plotNumber}`}
                  </span>{' '}
                  at {project.name} has been received.
                </p>
                <p className="text-xs text-slate-400 mt-1 font-medium">
                  Our sales specialist will contact you shortly at <strong>{phone}</strong>.
                </p>
              </div>

              <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={`https://wa.me/919840999999?text=${encodeURIComponent(
                    `Hello KPN Promoters, I just enquired for ${
                      selectedUnit ? `Unit ${selectedUnit.unitNumber}` : `Plot ${selectedPlot?.plotNumber}`
                    } at ${project.name}. Please connect with me.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-xs font-extrabold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition-all"
                >
                  <span>Chat on WhatsApp</span>
                  <ArrowRight className="h-4 w-4" />
                </a>

                <button
                  type="button"
                  onClick={resetModal}
                  className="flex w-full sm:w-auto items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Explore Other Units
                </button>
              </div>
            </div>
          ) : step === 1 ? (
            /* =========================================================
                STEP 1: DROPDOWNS (TOWER/BLOCK + FLOOR) & UNITS GRID
            ========================================================= */
            <div className="space-y-6">
              {isPlots ? (
                /* PLOTS SECTION */
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">
                      Select Available Plot ({activePlots.filter((p) => p.status === 'available').length} Available)
                    </h4>
                    <div className="flex items-center gap-4 text-xs font-bold">
                      <span className="flex items-center gap-1.5 text-emerald-700">
                        <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Available
                      </span>
                      <span className="flex items-center gap-1.5 text-amber-700">
                        <span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> Booked
                      </span>
                      <span className="flex items-center gap-1.5 text-red-700">
                        <span className="h-2.5 w-2.5 rounded-full bg-red-500" /> Sold
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-h-[380px] overflow-y-auto p-1">
                    {activePlots.map((plot) => {
                      const isAvail = plot.status === 'available';
                      const isSelected = selectedPlot?.plotId === plot.plotId;

                      return (
                        <button
                          key={plot.plotId}
                          type="button"
                          disabled={!isAvail}
                          onClick={() => handleSelectPlot(plot)}
                          className={`flex flex-col items-center justify-center rounded-2xl p-4 border-2 transition-all text-center ${
                            isSelected
                              ? 'border-[#00a86b] bg-[#e6f7f0] shadow-md ring-2 ring-[#00a86b]/30 scale-102'
                              : isAvail
                              ? 'border-[#00a86b]/40 bg-[#f0faf5] hover:border-[#00a86b] hover:bg-[#e6f7f0] cursor-pointer'
                              : plot.status === 'booked'
                              ? 'border-amber-200 bg-amber-50/50 opacity-60 cursor-not-allowed'
                              : 'border-slate-200 bg-slate-100 opacity-40 cursor-not-allowed'
                          }`}
                        >
                          <span className="text-base font-black text-slate-900">
                            Plot {plot.plotNumber}
                          </span>
                          <span className="text-xs text-slate-600 font-bold mt-1">
                            {plot.size} sq.ft
                          </span>
                          <span className="text-[10px] text-slate-400 font-semibold">
                            {plot.facing || 'East'} Facing
                          </span>
                          <span
                            className={`mt-2 rounded-full px-2.5 py-0.5 text-[9px] font-black uppercase ${
                              isAvail
                                ? 'bg-emerald-200 text-emerald-900'
                                : plot.status === 'booked'
                                ? 'bg-amber-200 text-amber-900'
                                : 'bg-slate-200 text-slate-700'
                            }`}
                          >
                            {plot.status}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* APARTMENTS & VILLAS: TOWER/BLOCK/ENCLAVE DROPDOWN + FLOOR/LEVEL DROPDOWN + UNITS GRID */
                <div className="space-y-6">
                  {/* TWO DROPDOWNS: TOWER/ENCLAVE & FLOOR/LEVEL SIDE BY SIDE */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Tower / Block / Enclave Dropdown */}
                    <div>
                      <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">
                        {isVillas ? 'Select Villa Enclave / Phase' : 'Select Tower / Block'}
                      </label>
                      <Select
                        value={selectedBlockId}
                        onValueChange={(val) => handleBlockChange(val)}
                      >
                        <SelectTrigger className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-800 outline-none focus:border-[#29247c] focus:ring-2 focus:ring-[#29247c]/20 shadow-xs cursor-pointer">
                          <SelectValue placeholder="Select Block / Tower" />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border border-slate-100 bg-white p-1.5 shadow-xl max-h-72">
                          {activeBlocks.map((b) => {
                            const availCount = (b.floors || []).reduce(
                              (acc, f) =>
                                acc +
                                (f.units?.filter((u) => u.status === 'available').length || 0),
                              0
                            );
                            return (
                              <SelectItem key={b.blockId} value={b.blockId} className="text-xs font-bold py-2.5">
                                <div className="flex items-center justify-between w-full gap-4">
                                  <span>{b.blockName}</span>
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                                    {availCount} Available
                                  </span>
                                </div>
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Floor / Level Dropdown */}
                    <div>
                      <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">
                        {isVillas ? 'Select Level / Floor' : 'Select Floor'}
                      </label>
                      <Select
                        value={String(selectedFloorNumber)}
                        onValueChange={(val) => handleFloorChange(Number(val))}
                      >
                        <SelectTrigger className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-800 outline-none focus:border-[#f12131] focus:ring-2 focus:ring-[#f12131]/20 shadow-xs cursor-pointer">
                          <SelectValue placeholder="Select Floor" />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border border-slate-100 bg-white p-1.5 shadow-xl max-h-72">
                          {currentFloors.map((fl) => {
                            const availCount = (fl.units || []).filter(
                              (u) => u.status === 'available'
                            ).length;
                            return (
                              <SelectItem key={fl.floorNumber} value={String(fl.floorNumber)} className="text-xs font-bold py-2.5">
                                <div className="flex items-center justify-between w-full gap-4">
                                  <span>{fl.floorName}</span>
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                                    {availCount} Available
                                  </span>
                                </div>
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* UNITS / VILLAS SECTION */}
                  <div className="space-y-3 pt-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs sm:text-sm font-black uppercase tracking-wider text-[#29247c]">
                        {currentFloor?.floorName.toUpperCase()} {isVillas ? 'VILLAS' : 'UNITS'}
                      </h4>
                      <div className="flex items-center gap-3 sm:gap-4 text-xs font-bold">
                        <span className="flex items-center gap-1.5 text-emerald-700">
                          <span className="h-2 w-2 rounded-full bg-emerald-500" /> Available
                        </span>
                        <span className="flex items-center gap-1.5 text-amber-700">
                          <span className="h-2 w-2 rounded-full bg-amber-500" /> Booked
                        </span>
                        <span className="flex items-center gap-1.5 text-red-700">
                          <span className="h-2 w-2 rounded-full bg-red-500" /> Sold
                        </span>
                      </div>
                    </div>

                    {/* Units Grid */}
                    {currentFloor?.units && currentFloor.units.length > 0 ? (
                      <div
                        key={`grid-${currentBlock?.blockId || ''}-${currentFloor?.floorNumber || ''}`}
                        className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 max-h-[380px] overflow-y-auto p-1"
                      >
                        {currentFloor.units.map((unit, idx) => {
                          const isAvail = unit.status === 'available';
                          const isSelected = selectedUnit?.unitId === unit.unitId;

                          return (
                            <button
                              key={`${currentBlock?.blockId || ''}-${currentFloor?.floorNumber || ''}-${unit.unitId || unit.unitNumber || idx}`}
                              type="button"
                              disabled={!isAvail}
                              onClick={() => handleSelectUnit(unit)}
                              className={`flex flex-col items-center justify-center rounded-2xl p-4 border-2 transition-all text-center relative cursor-pointer ${
                                isSelected
                                  ? 'border-[#00a86b] bg-[#e6f7f0] shadow-md ring-2 ring-[#00a86b]/40 scale-102'
                                  : isAvail
                                  ? 'border-[#00a86b]/50 bg-[#f2faf6] hover:border-[#00a86b] hover:bg-[#e6f7f0] hover:shadow-xs'
                                  : unit.status === 'booked'
                                  ? 'border-amber-300 bg-amber-50/50 opacity-70 cursor-not-allowed'
                                  : 'border-slate-200 bg-slate-100 opacity-40 cursor-not-allowed'
                              }`}
                            >
                              <span className="text-lg font-black text-slate-900">
                                {unit.unitNumber}
                              </span>
                              <span className="text-xs font-bold text-slate-700 mt-1">
                                {unit.bhk} BHK
                              </span>
                              <span className="text-[10px] text-slate-500 font-semibold mt-0.5">
                                {unit.size} sq.ft • {unit.facing || 'East'}
                              </span>

                              <span
                                className={`mt-2.5 rounded-full px-2.5 py-0.5 text-[9px] font-black uppercase ${
                                  isAvail
                                    ? 'bg-[#a3e6cb] text-[#006039]'
                                    : unit.status === 'booked'
                                    ? 'bg-amber-200 text-amber-900'
                                    : 'bg-slate-200 text-slate-700'
                                }`}
                              >
                                {unit.status}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-xs text-slate-400 font-medium">
                        No units registered on this floor.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Bottom Bar: Selected indicator & Next Button */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-slate-100">
                <div className="text-xs">
                  {selectedUnit ? (
                    <div className="flex items-center gap-2">
                      <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="font-bold text-slate-700">
                        Selected:{' '}
                        <strong className="text-[#29247c] font-black">
                          {isVillas ? `Villa ${selectedUnit.unitNumber}` : `Unit ${selectedUnit.unitNumber}`}
                        </strong>{' '}
                        ({currentBlock?.blockName}, {currentFloor?.floorName}, {selectedUnit.bhk} BHK)
                      </span>
                    </div>
                  ) : selectedPlot ? (
                    <div className="flex items-center gap-2">
                      <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="font-bold text-slate-700">
                        Selected:{' '}
                        <strong className="text-[#29247c] font-black">
                          {isVillas ? `Villa ${selectedPlot.plotNumber}` : `Plot ${selectedPlot.plotNumber}`}
                        </strong>{' '}
                        ({selectedPlot.size} sq.ft)
                      </span>
                    </div>
                  ) : (
                    <span className="text-slate-400 font-medium italic">
                      {isVillas
                        ? 'Click an available villa above to proceed'
                        : isPlots
                        ? 'Click an available plot above to proceed'
                        : 'Click an available unit above to proceed'}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  disabled={!selectedUnit && !selectedPlot}
                  onClick={handleNextStep}
                  className="flex items-center justify-center gap-2 rounded-full bg-[#f12131] px-8 py-3 text-xs font-black text-white shadow-md shadow-red-500/20 hover:bg-[#d81928] hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                >
                  <span>
                    {selectedUnit
                      ? isVillas
                        ? `Proceed to Book Villa ${selectedUnit.unitNumber}`
                        : `Proceed to Book Unit ${selectedUnit.unitNumber}`
                      : selectedPlot
                      ? isVillas
                        ? `Proceed to Book Villa ${selectedPlot.plotNumber}`
                        : `Proceed to Book Plot ${selectedPlot.plotNumber}`
                      : 'Next: Enter Details'}
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : (
            /* =========================================================
                STEP 2: SECOND SCREENSHOT MODULE (ENQUIRY FORM)
            ========================================================= */
            <div className="space-y-6 max-w-xl mx-auto">
              {/* Back Button & Header */}
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#29247c] transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to Unit Selection</span>
                </button>

                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  Step 2 of 2
                </span>
              </div>

              {/* Selected Unit Summary Card (Styled like Screenshot 2) */}
              <div className="rounded-3xl border border-dashed border-indigo-200 bg-indigo-50/40 p-5 text-center space-y-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-[#f12131] shadow-xs mx-auto border border-red-100">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-base font-black text-[#29247c]">
                    {selectedUnit
                      ? `${isVillas ? 'Villa' : 'Unit'} ${selectedUnit.unitNumber} (${selectedUnit.bhk} BHK • ${selectedUnit.size} Sq.Ft)`
                      : `${isVillas ? 'Villa' : 'Plot'} ${selectedPlot?.plotNumber} (${selectedPlot?.size} Sq.Ft)`}
                  </h4>
                  <p className="text-xs text-slate-500 font-medium">
                    {selectedUnit
                      ? `${currentBlock?.blockName || (isVillas ? 'Enclave' : 'Tower')} • ${currentFloor?.floorName || (isVillas ? 'Level' : 'Floor')} • ${
                          selectedUnit.facing || 'East'
                        } Facing`
                      : `${selectedPlot?.facing || 'East'} Facing • Residential Plot`}
                  </p>
                </div>
              </div>

              {/* Booking Form (Matches Screenshot 2) */}
              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                <h4 className="text-xs font-black uppercase tracking-wider text-[#29247c]">
                  SELECT A UNIT TO PROCEED
                </h4>

                {submitError && (
                  <div className="rounded-2xl border border-red-200 bg-red-50 p-3 text-xs font-bold text-red-700">
                    ⚠️ {submitError}
                  </div>
                )}

                {/* FULL NAME */}
                <div>
                  <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">
                    FULL NAME*
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      onBlur={() => {
                        setFieldErrors((prev) => ({
                          ...prev,
                          name: validateName(name).error,
                        }));
                      }}
                      placeholder="e.g. Anand Kumar"
                      className={`h-12 w-full rounded-2xl border bg-white pl-11 pr-4 text-xs sm:text-sm font-semibold text-slate-800 outline-none focus:ring-2 shadow-xs ${
                        fieldErrors.name
                          ? 'border-red-400 bg-red-50/30 focus:border-red-500 focus:ring-red-400/20'
                          : 'border-slate-200 focus:border-[#f12131] focus:ring-[#f12131]/20'
                      }`}
                    />
                  </div>
                  {fieldErrors.name && (
                    <p className="mt-1.5 px-2 text-xs font-semibold text-red-600 animate-in fade-in duration-200">
                      {fieldErrors.name}
                    </p>
                  )}
                </div>

                {/* PHONE NUMBER */}
                <div>
                  <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">
                    PHONE NUMBER*
                  </label>
                  <PhoneInputWithCountry
                    phone={phone}
                    selectedCountry={selectedCountry}
                    onPhoneChange={handlePhoneChange}
                    onCountryChange={(c) => {
                      setSelectedCountry(c);
                      if (phone) {
                        setFieldErrors((prev) => ({
                          ...prev,
                          phone: validatePhone(phone, c, true).error,
                        }));
                      }
                    }}
                    error={fieldErrors.phone}
                    required
                    onBlur={() => {
                      setFieldErrors((prev) => ({
                        ...prev,
                        phone: validatePhone(phone, selectedCountry, true).error,
                      }));
                    }}
                  />
                </div>

                {/* EMAIL ADDRESS */}
                <div>
                  <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">
                    EMAIL ADDRESS*
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => handleEmailChange(e.target.value)}
                      onBlur={() => {
                        setFieldErrors((prev) => ({
                          ...prev,
                          email: validateEmail(email, true).error,
                        }));
                      }}
                      pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.com"
                      title="Email must include '@' and end with '.com' (e.g. name@gmail.com)"
                      placeholder="e.g. anand@gmail.com"
                      className={`h-12 w-full rounded-2xl border bg-white pl-11 pr-4 text-xs sm:text-sm font-semibold text-slate-800 outline-none focus:ring-2 shadow-xs ${
                        fieldErrors.email
                          ? 'border-red-400 bg-red-50/30 focus:border-red-500 focus:ring-red-400/20'
                          : 'border-slate-200 focus:border-[#f12131] focus:ring-[#f12131]/20'
                      }`}
                    />
                  </div>
                  {fieldErrors.email && (
                    <p className="mt-1.5 px-2 text-xs font-semibold text-red-600 animate-in fade-in duration-200">
                      {fieldErrors.email}
                    </p>
                  )}
                </div>

                {/* PREFERRED SITE VISIT DATE */}
                <div>
                  <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">
                    PREFERRED SITE VISIT DATE
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="date"
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-xs sm:text-sm font-semibold text-slate-800 outline-none focus:border-[#f12131] focus:ring-2 focus:ring-[#f12131]/20 shadow-xs"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  suppressHydrationWarning
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#f12131] px-6 text-xs sm:text-sm font-black text-white shadow-lg shadow-red-500/25 hover:bg-[#d81928] transition-all disabled:opacity-50 cursor-pointer mt-2"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  <span>
                    {selectedUnit
                      ? `Book Unit ${selectedUnit.unitNumber} Now`
                      : selectedPlot
                      ? `Book Plot ${selectedPlot.plotNumber} Now`
                      : 'Submit Booking Enquiry'}
                  </span>
                </button>

                {/* Footer Trust Badges */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-bold">
                  <span className="flex items-center gap-1.5 text-emerald-700">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                    Verified RERA Inventory
                  </span>
                  <span className="text-slate-500">100% Free Consultation</span>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
