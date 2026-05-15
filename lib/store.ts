import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  MOCK_STUDENTS, 
  MOCK_UPDATES, 
  MOCK_TIMELINE, 
  type Student, 
  type Update, 
  type TimelineEvent 
} from './mock-data';

interface ParentUser {
  phone: string;
  name: string;
  childIds: string[];
}

interface TeacherUser {
  phone: string;
  name: string;
  subjects: string[];
}

// Mock Database
export const REGISTERED_PARENTS: ParentUser[] = [
  { phone: '9841000000', name: 'Singha Tamang', childIds: ['1', '2'] },
  { phone: '9841111111', name: 'Maya Shrestha', childIds: ['1'] }
];

export const REGISTERED_TEACHERS: TeacherUser[] = [
  { phone: '9800000000', name: 'Mrs. Sharma', subjects: ['Mathematics', 'Science'] },
  { phone: '9801111111', name: 'Mr. Adhikari', subjects: ['Nepali', 'History'] }
];

interface AppState {
  userRole: 'parent' | 'teacher';
  isLoggedIn: boolean;
  currentUser: ParentUser | TeacherUser | null;
  hasCompletedOnboarding: boolean;
  language: 'en' | 'ne';
  students: Student[];
  updates: Update[];
  timeline: TimelineEvent[];
  
  // Actions
  login: (phone: string, role: 'parent' | 'teacher') => boolean;
  logout: () => void;
  completeOnboarding: () => void;
  setUserRole: (role: 'parent' | 'teacher') => void;
  setLanguage: (lang: 'en' | 'ne') => void;
  addUpdate: (update: Update) => void;
  addTimelineEvent: (event: TimelineEvent) => void;
  updateStudentSkills: (studentId: string, strength?: string, weakness?: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      userRole: 'parent',
      isLoggedIn: false,
      currentUser: null,
      hasCompletedOnboarding: false,
      language: 'en',
      students: MOCK_STUDENTS,
      updates: MOCK_UPDATES,
      timeline: MOCK_TIMELINE,

      login: (phone, role) => {
        if (role === 'parent') {
          const parent = REGISTERED_PARENTS.find(p => p.phone === phone);
          if (parent) {
            set({ isLoggedIn: true, currentUser: parent, userRole: 'parent' });
            return true;
          }
        } else {
          const teacher = REGISTERED_TEACHERS.find(t => t.phone === phone);
          if (teacher) {
            set({ isLoggedIn: true, currentUser: teacher, userRole: 'teacher' });
            return true;
          }
        }
        return false;
      },

      logout: () => set({ isLoggedIn: false, currentUser: null }),

      completeOnboarding: () => set({ hasCompletedOnboarding: true }),

      setUserRole: (role) => set({ userRole: role }),
      
      setLanguage: (lang) => set({ language: lang }),

      addUpdate: (update) => set((state) => ({
        updates: [update, ...state.updates]
      })),

      addTimelineEvent: (event) => set((state) => ({
        timeline: [event, ...state.timeline]
      })),

      updateStudentSkills: (studentId, strength, weakness) => set((state) => ({
        students: state.students.map(s => {
          if (s.id === studentId) {
            return {
              ...s,
              strengths: strength ? [...new Set([...s.strengths, strength])] : s.strengths,
              weaknesses: weakness ? [...new Set([...s.weaknesses, weakness])] : s.weaknesses,
            };
          }
          return s;
        })
      }))
    }),
    {
      name: 'edulink-storage',
    }
  )
);
