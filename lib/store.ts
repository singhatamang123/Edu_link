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
import { createClient } from './supabase';

const supabase = createClient();

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

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: string;
  senderName: string;
}

interface AppState {
  userRole: 'parent' | 'teacher';
  isLoggedIn: boolean;
  currentUser: ParentUser | TeacherUser | null;
  hasCompletedOnboarding: boolean;
  language: 'en' | 'ne';
  students: Student[];
  updates: Update[];
  timeline: TimelineEvent[];
  messages: Message[];
  
  // Actions
  loginWithEmail: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  registerWithEmail: (email: string, pass: string, name: string, role: 'parent' | 'teacher') => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  completeOnboarding: () => Promise<void>;
  updateProfile: (name: string) => void;
  setUserRole: (role: 'parent' | 'teacher') => void;
  setLanguage: (lang: 'en' | 'ne') => void;
  addUpdate: (update: Update) => void;
  addTimelineEvent: (event: TimelineEvent) => void;
  updateStudentSkills: (studentId: string, strength?: string, weakness?: string) => void;
  sendMessage: (text: string, receiverId: string) => void;
  fetchInitialData: () => Promise<void>;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      userRole: 'parent',
      isLoggedIn: false,
      currentUser: null,
      hasCompletedOnboarding: false,
      language: 'en',
      students: MOCK_STUDENTS,
      updates: MOCK_UPDATES,
      timeline: MOCK_TIMELINE,
      messages: [],

      loginWithEmail: async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) return { success: false, error: error.message };

        // Load Profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profile) {
          set({ 
            isLoggedIn: true, 
            currentUser: {
              phone: profile.phone || '',
              name: profile.full_name,
              childIds: profile.child_ids || [],
              subjects: profile.subjects || []
            }, 
            userRole: profile.role,
            hasCompletedOnboarding: true
          });
        }
        return { success: true };
      },

      registerWithEmail: async (email, password, name, role) => {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) return { success: false, error: error.message };
        if (!data.user) return { success: false, error: 'Signup failed' };

        // Create Profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([{
            id: data.user.id,
            phone: '', // No phone required now
            full_name: name,
            role: role,
            child_ids: role === 'parent' ? ['s1', 's2'] : [],
            subjects: role === 'teacher' ? ['General'] : []
          }]);

        if (profileError) return { success: false, error: profileError.message };

        set({ 
          isLoggedIn: true, 
          currentUser: { phone: '', name, childIds: role === 'parent' ? ['s1', 's2'] : [], subjects: role === 'teacher' ? ['General'] : [] }, 
          userRole: role,
          hasCompletedOnboarding: true 
        });

        return { success: true };
      },

      logout: () => set({ isLoggedIn: false, currentUser: null }),

      completeOnboarding: async () => {
        const { currentUser, userRole } = get();
        if (currentUser) {
          // Final save to Supabase
          await supabase.from('profiles').upsert([{
            id: currentUser.phone, // Using phone as ID for simplicity in this dev phase
            phone: currentUser.phone,
            full_name: currentUser.name,
            role: userRole,
            child_ids: userRole === 'parent' ? ['s1', 's2'] : [], // Assign mock kids for now
            subjects: userRole === 'teacher' ? ['General'] : []
          }], { onConflict: 'phone' });
        }
        set({ hasCompletedOnboarding: true });
      },

      updateProfile: (name) => set((state) => {
        if (!state.currentUser) return state;
        return {
          currentUser: { ...state.currentUser, name }
        };
      }),

      setUserRole: (role) => set({ userRole: role }),
      
      setLanguage: (lang) => set({ language: lang }),

      addUpdate: async (update) => {
        set((state) => ({ updates: [update, ...state.updates] }));
        
        // Save to Supabase
        await supabase.from('updates').insert([{
          student_id: update.studentId,
          teacher_name: update.teacherName,
          subject: update.subject,
          message: update.message,
          type: update.type
        }]);
      },

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
      })),

      sendMessage: async (text, receiverId) => {
        const { currentUser } = get();
        if (!currentUser) return;
        
        const newMessage: Message = {
          id: Date.now().toString(),
          senderId: currentUser.phone,
          senderName: currentUser.name,
          receiverId,
          text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        
        set((state) => ({
          messages: [...state.messages, newMessage]
        }));

        // Save to Supabase
        await supabase.from('messages').insert([{
          sender_id: currentUser.phone,
          receiver_id: receiverId,
          text: text
        }]);
      },

      fetchInitialData: async () => {
        // Fetch Students
        const { data: students } = await supabase.from('students').select('*');
        if (students) set({ students });

        // Fetch Updates
        const { data: updates } = await supabase.from('updates').select('*').order('created_at', { ascending: false });
        if (updates) set({ updates });

        // Fetch Messages
        const { data: messages } = await supabase.from('messages').select('*').order('created_at', { ascending: true });
        if (messages) {
          set({ 
            messages: messages.map(m => ({
              id: m.id,
              senderId: m.sender_id,
              receiverId: m.receiver_id,
              text: m.text,
              senderName: '', // Would normally fetch from profiles
              timestamp: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }))
          });
        }
      }
    }),
    {
      name: 'edulink-storage',
    }
  )
);
