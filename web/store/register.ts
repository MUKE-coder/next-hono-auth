import { z } from 'zod';
import { create } from 'zustand';
import { getProfileByTrackingNumber } from '@/actions/users';
import { persist } from 'zustand/middleware';
import { personalInfoSchema } from '@/app/(auth)/auth/register/components/steps/StepTwo';

// Types for User Creation (Step 1)
interface UserCreationData {
  surname: string;
  otherNames?: string;
  nin?: string;
  phone: string;
  email?: string;
  password?: string;
  category:
    | 'PUBLIC_SERVICE'
    | 'PRIVATE_SECTOR'
    | 'NON_PROFIT'
    | 'RETIRED'
    | 'CLINICS';
}

// Types for Profile Updates (Steps 2-4)
type PersonalInfoData = z.infer<typeof personalInfoSchema>;

interface WorkplaceInfoData {
  regionId?: string;
  voteNameId?: string;
  title?: string;
  employeeNo?: string;
  workplaceAddress?: string;
}

interface JobDetailsData {
  presentSalary?: number;
  computerNumber?: string;
  category?: string;
}

interface Region {
  id: string;
  name: string;
  coordinator: string;
  contact?: string;
  email?: string;
}

interface VoteName {
  id: string;
  name: string;
  voteCode: string;
  regionId: string;
}

interface RegistrationState {
  // User creation data (Step 1)
  userCreationData: Partial<UserCreationData>;

  // Profile update data (Steps 2-4)
  personalInfoData: Partial<PersonalInfoData>;
  workplaceInfoData: Partial<WorkplaceInfoData>;
  jobDetailsData: Partial<JobDetailsData>;

  // Form state
  currentStep: number;
  completedSteps: number[];
  userId?: string;
  profileId?: string;
  trackingNumber?: string;
  memberNumber?: string;
  isLoading: boolean;
  error?: string;

  // Reference data
  regions: Region[];
  voteNames: VoteName[];

  // Step 1 Actions - User Creation
  setUserCreationData: (data: Partial<UserCreationData>) => void;

  // Step 2-4 Actions - Profile Updates
  setPersonalInfoData: (data: Partial<PersonalInfoData>) => void;
  setWorkplaceInfoData: (data: Partial<WorkplaceInfoData>) => void;
  setJobDetailsData: (data: Partial<JobDetailsData>) => void;

  // Form navigation
  setCurrentStep: (step: number) => void;
  addCompletedStep: (step: number) => void;

  // State management
  setUserId: (id: string) => void;
  setProfileId: (id: string) => void;
  setTrackingNumber: (number: string) => void;
  setMemberNumber: (number: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error?: string) => void;

  // Reference data
  setRegions: (regions: Region[]) => void;
  setVoteNames: (voteNames: VoteName[]) => void;
  getVoteNamesByRegion: (regionId: string) => VoteName[];
  setCompletedSteps: (steps: number[]) => void; // 👈 NEW

    // Utility functions
    reset: () => void;
    resumeRegistration: (trackingNumber: string) => Promise<{
      userId:string
      profileId: string;
      nextStep: number;
    } | null>;
  }

// UNMU Regions Data (Updated for new structure)
const REGIONS: Region[] = [
  // Central Uganda
  {
    id: 'central_buganda',
    name: 'Central Buganda Districts and Hospitals',
    coordinator: 'Fatia Nasaka',
    email: 'fatianassaka@gmail.com',
  },
  {
    id: 'north_buganda',
    name: 'North Buganda Districts and Hospitals',
    coordinator: 'Namisanvu Allen',
  },
  {
    id: 'east_buganda',
    name: 'East Buganda Districts and Hospitals',
    coordinator: 'Kulabako Maria',
  },
  {
    id: 'north_west_buganda',
    name: 'North West Buganda Districts and Hospitals',
    coordinator: 'Ndyanabo Evans',
  },
  {
    id: 'south_west_buganda',
    name: 'South West Buganda Districts and Hospitals',
    coordinator: 'Nakanwagi Jacenta',
  },
  {
    id: 'south_buganda',
    name: 'South Buganda Districts and Hospital',
    coordinator: 'Namulondo Harriet',
  },

  // Western Uganda
  {
    id: 'north_rwenzori',
    name: 'North Rwenzori Districts and Hospitals',
    coordinator: 'Barugahare Robenson',
  },
  {
    id: 'south_rwenzori',
    name: 'South Rwenzori Districts and Hospitals',
    coordinator: 'Kalembe Kelet Bogere',
    contact: '0782347134, 0702347134',
  },
  {
    id: 'east_rwenzori',
    name: 'East Rwenzori Districts and Hospitals',
    coordinator: 'Ajoku Yona',
  },
  {
    id: 'north_ankole',
    name: 'North Ankole Districts and Hospitals',
    coordinator: 'Natuhwera Chrispus',
    contact: '0782555957',
  },
  {
    id: 'south_ankole',
    name: 'South Ankole Districts and Hospitals',
    coordinator: 'Kamahunde Shiffra',
  },
  {
    id: 'central_ankole',
    name: 'Central Ankole Districts and Hospitals',
    coordinator: 'Arinaitwe Rodgers',
  },
  {
    id: 'kigezi_north',
    name: 'Kigezi North Region Districts and Hospitals',
    coordinator: 'Akampurira Dickson',
  },
  {
    id: 'kigezi_south',
    name: 'Kigezi South Region Districts and Hospitals',
    coordinator: 'Arinaitwe B. Edward',
  },
  {
    id: 'south_bunyoro',
    name: 'South Bunyoro Districts and Hospitals',
    coordinator: 'Magezi James',
  },
  {
    id: 'north_bunyoro',
    name: 'North Bunyoro Districts and Hospitals',
    coordinator: 'Akello Florence',
  },

  // Eastern Uganda
  {
    id: 'sebei',
    name: 'Sebei Districts and Hospitals',
    coordinator: 'Kariong Michael',
  },
  {
    id: 'busoga_south',
    name: 'Busoga South Districts and Hospitals',
    coordinator: 'Buyinza Godfrey',
  },
  {
    id: 'busoga_north',
    name: 'Busoga North Districts and Hospitals',
    coordinator: 'Batani John',
  },
  {
    id: 'east_teso',
    name: 'East Teso Districts and Hospitals',
    coordinator: 'Amongi Margaret',
    contact: '0774773497',
    email: 'margyamongin@gmail.com',
  },
  {
    id: 'central_teso',
    name: 'Central Teso Districts and Hospitals',
    coordinator: 'Okullu Sylus',
    contact: '0772635666',
    email: 'ageo1922@yahoo.com',
  },
  {
    id: 'north_teso',
    name: 'North Teso Districts and Hospitals',
    coordinator: 'Asio Dorothy',
    contact: '0782994251',
    email: 'asiodorothy@gmail.com',
  },
  {
    id: 'bukedi',
    name: 'Bukedi Districts and Hospitals',
    coordinator: 'Agembi Stella',
    contact: '0782900955',
    email: 'stella.agembi@gmail.com',
  },
  {
    id: 'bugisu',
    name: 'Bugisu Districts and Hospitals',
    coordinator: 'Taaka Esther',
    contact: '0772468831',
    email: 'taakaesther3@gmail.com',
  },
  {
    id: 'south_karamoja',
    name: 'South Karamoja Districts and Hospitals',
    coordinator: 'Akello Evalyne',
    email: 'Akellomary1978@gmail.com',
  },
  {
    id: 'central_karamoja',
    name: 'Central Karamoja Districts and Hospitals',
    coordinator: 'OWor Alice Oyella',
    email: 'oworalice@gmail.com',
  },
  {
    id: 'north_karamoja',
    name: 'North Karamoja Districts and Hospitals',
    coordinator: 'Apio Florence',
  },

  // Northern Uganda
  {
    id: 'acholi_west',
    name: 'Acholi West Districts and Hospitals',
    coordinator: 'Aciro Josephene',
  },
  {
    id: 'acholi_east',
    name: 'Acholi East Districts and Hospitals',
    coordinator: 'Moding Celestine',
  },
  {
    id: 'lango_west',
    name: 'Lango West Districts and Hospitals',
    coordinator: 'Akello Medina',
  },
  {
    id: 'lango_east',
    name: 'Lango East Districts and Hospitals',
    coordinator: 'Adong Petua',
  },
  {
    id: 'central_west_nile',
    name: 'Central West Nile Districts and Hospitals',
    coordinator: 'Andezu Sally',
  },
  {
    id: 'north_west_nile',
    name: 'North West Nile Districts and Hospitals',
    coordinator: 'Kaatimala Siasa',
    contact: '0774500941',
    email: 'siasakadimala03@gmail.com',
  },
  {
    id: 'south_north_west_nile',
    name: 'South North West Nile Districts and Hospitals',
    coordinator: 'Akumu Agnes',
  },
];

// Sample Vote Names (Updated structure)
const VOTE_NAMES: VoteName[] = [
  // Central Buganda
  {
    id: 'mulago_405',
    name: 'Mulago Specialized National Referral Hospital',
    voteCode: '405',
    regionId: 'central_buganda',
  },
  {
    id: 'kawempe_406',
    name: 'Kawempe National Referral Hospital',
    voteCode: '406',
    regionId: 'central_buganda',
  },
  {
    id: 'butabika_407',
    name: 'Butabika National Referral Hospital',
    voteCode: '407',
    regionId: 'central_buganda',
  },
  {
    id: 'uhi_408',
    name: 'Uganda Heart Institute',
    voteCode: '408',
    regionId: 'central_buganda',
  },
  {
    id: 'uci_409',
    name: 'Uganda Cancer Institute',
    voteCode: '409',
    regionId: 'central_buganda',
  },
  // Western Uganda
  {
    id: 'mbarara_410',
    name: 'Mbarara Regional Referral Hospital',
    voteCode: '410',
    regionId: 'central_ankole',
  },
  {
    id: 'fort_portal_411',
    name: 'Fort Portal Regional Referral Hospital',
    voteCode: '411',
    regionId: 'north_rwenzori',
  },
  {
    id: 'kabale_412',
    name: 'Kabale Regional Referral Hospital',
    voteCode: '412',
    regionId: 'kigezi_south',
  },
  // Eastern Uganda
  {
    id: 'mbale_413',
    name: 'Mbale Regional Referral Hospital',
    voteCode: '413',
    regionId: 'bugisu',
  },
  {
    id: 'soroti_414',
    name: 'Soroti Regional Referral Hospital',
    voteCode: '414',
    regionId: 'central_teso',
  },
  {
    id: 'jinja_415',
    name: 'Jinja Regional Referral Hospital',
    voteCode: '415',
    regionId: 'busoga_south',
  },
  // Northern Uganda
  {
    id: 'gulu_416',
    name: 'Gulu Regional Referral Hospital',
    voteCode: '416',
    regionId: 'acholi_west',
  },
  {
    id: 'lira_417',
    name: 'Lira Regional Referral Hospital',
    voteCode: '417',
    regionId: 'lango_west',
  },
  {
    id: 'arua_418',
    name: 'Arua Regional Referral Hospital',
    voteCode: '418',
    regionId: 'central_west_nile',
  },
];

export const useRegistrationStore = create<RegistrationState>()(
  persist(
    (set, get) => ({
      // Initial state
      userCreationData: {},
      personalInfoData: {},
      workplaceInfoData: {},
      jobDetailsData: {},

      currentStep: 1,
      completedSteps: [],
      isLoading: false,

      regions: REGIONS,
      voteNames: VOTE_NAMES,

      // Step 1 - User Creation
      setUserCreationData: (data) =>
        set((state) => ({
          userCreationData: { ...state.userCreationData, ...data },
        })),

      // Steps 2-4 - Profile Updates
      setPersonalInfoData: (data) =>
        set((state) => ({
          personalInfoData: { ...state.personalInfoData, ...data },
        })),

      setWorkplaceInfoData: (data) =>
        set((state) => ({
          workplaceInfoData: { ...state.workplaceInfoData, ...data },
        })),

      setJobDetailsData: (data) =>
        set((state) => ({
          jobDetailsData: { ...state.jobDetailsData, ...data },
        })),

      // Form navigation
      setCurrentStep: (step) => set({ currentStep: step }),

      addCompletedStep: (step) =>
        set((state) => ({
          completedSteps: [
            ...state.completedSteps.filter((s) => s !== step),
            step,
          ],
        })),

      // State management
      setUserId: (id) => set({ userId: id }),
      setProfileId: (id) => set({ profileId: id }),
      setTrackingNumber: (number) => set({ trackingNumber: number }),
      setMemberNumber: (number) => set({ memberNumber: number }),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      setCompletedSteps: (steps) =>
        set(() => ({
          completedSteps: [...new Set(steps)].sort((a, b) => a - b),
        })),
      // Reference data
      setRegions: (regions) => set({ regions }),
      setVoteNames: (voteNames) => set({ voteNames }),

      getVoteNamesByRegion: (regionId) => {
        const { voteNames } = get();
        return voteNames.filter((vn) => vn.regionId === regionId);
      },

      // Utility functions
      reset: () =>
        set({
          userCreationData: {},
          personalInfoData: {},
          workplaceInfoData: {},
          jobDetailsData: {},
          currentStep: 1,
          completedSteps: [],
          userId: undefined,
          profileId: undefined,
          trackingNumber: undefined,
          memberNumber: undefined,
          isLoading: false,
          error: undefined,
        }),

      resumeRegistration: async (trackingNumber) => {
        set({ isLoading: true, error: undefined });

        try {
          // Fetch the profile data from your API
          const profileData = await getProfileByTrackingNumber(trackingNumber);
          console.log('profile data 😂😂😂😂😂', profileData);
          const profile = profileData.data.profile;

          if (!profileData) {
            set({ error: 'No registration found with this tracking number' });
            return null;
          }

    // Determine which steps are completed based on available data
    const completedSteps: number[] = [1]; // Step 1 (user creation) is always completed if profile exists
    
    // Check if step 2 (personal info) is completed
    const hasPersonalInfo = !!(
      profile.gender && 
      profile.dateOfBirth && 
      profile.homeAddress && 
      profile.district
    );
    if (hasPersonalInfo) completedSteps.push(2);
    
    // Check if step 3 (workplace info) is completed  
    const hasWorkplaceInfo = !!(
      profile.regionId && 
      profile.voteNameId
    );
    if (hasWorkplaceInfo) completedSteps.push(3);
    
    // Check if step 4 (job details) is completed
    const hasJobDetails = !!(
      profile.presentSalary || 
      profile.computerNumber
    );
    if (hasJobDetails) completedSteps.push(4);
    console.log("✅✅✅✅",completedSteps)
    let nextStep = profile.lastStep ? profile.lastStep + 1 : 1;
    
    // Update the store state with the retrieved data
    const data = set({
      trackingNumber,
      userId: profile.userId,
      profileId: profile.id,
      memberNumber: profile.memberNumber,
      userCreationData: {
        surname: profile.user?.surname || "",
        otherNames: profile.user?.otherNames || "",
        nin: profile.user?.nin || "",
        phone: profile.user?.phone || "",
        email: profile.user?.email || "",
        category: profile.category,
      },
      personalInfoData: {
        gender: profile.gender || "",
        dateOfBirth: profile.dateOfBirth || "",
        homeAddress: profile.homeAddress || "",
        district: profile.district || "",
        ninNumber: profile.ninNumber || "",
      },
      workplaceInfoData: {
        regionId: profile.regionId || "",
        voteNameId: profile.voteNameId || "",
        title: profile.title || "",
        employeeNo: profile.employeeNo || "",
        workplaceAddress: profile.workplaceAddress || "",
      },
      jobDetailsData: {
        presentSalary: profile.presentSalary || undefined,
        computerNumber: profile.computerNumber || "",
      },
       completedSteps: Array.isArray(completedSteps) ? completedSteps : [],
      currentStep: nextStep,
      isLoading: false,
      error: undefined,
    });
    
    return {
      profileId: profile.id,
      nextStep: nextStep,
      data
    };
  } catch (error) {
    console.error("Resume registration error:", error);
    
    let errorMessage = "Failed to resume registration";
    
    if (error instanceof Error) {
      // Handle specific error types
      if (error.message.includes("not found")) {
        errorMessage = "No registration found with this tracking number";
      } else if (error.message.includes("network") || error.message.includes("fetch")) {
        errorMessage = "Network error. Please check your connection and try again";
      } else {
        errorMessage = error.message;
      }
    }
    
    set({ 
      error: errorMessage, 
      isLoading: false 
    });
    return null;
  }
},

      }),
      {
        name: "unmu-registration",
        partialize: (state) => ({
          userCreationData: state.userCreationData,
          personalInfoData: state.personalInfoData,
          workplaceInfoData: state.workplaceInfoData,
          jobDetailsData: state.jobDetailsData,
          currentStep: state.currentStep,
          completedSteps: state.completedSteps,
          userId: state.userId,
          profileId: state.profileId,
          trackingNumber: state.trackingNumber,
          memberNumber: state.memberNumber,
        }),
      }
    )
  );

// Utility functions for tracking number generation
export const generateTrackingNumber = (): string => {
  // Generate 8-digit tracking number
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, '0');
  return (timestamp.slice(-5) + random).slice(0, 8);
};

// Utility functions for member number generation
export const generateMemberNumber = (
  category: string,
  voteCode: string,
  sequence: number,
  gender: 'MALE' | 'FEMALE',
): string => {
  const genderPrefix = gender === 'MALE' ? 'M' : 'F';
  const paddedSequence = sequence.toString().padStart(5, '0');

  // Map category to prefix
  const categoryPrefix =
    {
      PUBLIC_SERVICE: 'GU',
      PRIVATE_SECTOR: 'PS',
      NON_PROFIT: 'NFP',
      RETIRED: 'RTD',
      CLINICS: 'CL',
    }[category] || 'GU';

  return `${categoryPrefix}-${voteCode}-${paddedSequence}-${genderPrefix}`;
};

export const parseMemberNumber = (memberNumber: string) => {
  const parts = memberNumber.split('-');
  if (parts.length !== 4) return null;

  return {
    categoryPrefix: parts[0],
    voteCode: parts[1],
    sequence: parseInt(parts[2]),
    genderPrefix: parts[3],
    gender: parts[3] === 'M' ? 'MALE' : ('FEMALE' as 'MALE' | 'FEMALE'),
  };
};
