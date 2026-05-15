export interface Student {
  id: string;
  name: string;
  image: string;
  grade: string;
  section: string;
  status: string;
  statusType: 'positive' | 'neutral' | 'attention';
  strengths: string[];
  weaknesses: string[];
  attendance: string;
}

export interface TimelineEvent {
  id: string;
  studentId: string;
  date: string;
  title: string;
  description: string;
  type: 'achievement' | 'behavior' | 'academic' | 'notice';
  icon: string;
}

export interface Update {
  id: string;
  teacherName: string;
  subject: string;
  message: string;
  time: string;
  type: 'progress' | 'behavior' | 'announcement';
  image?: string;
  studentId: string;
}

export const MOCK_STUDENTS: Student[] = [
  {
    id: '1',
    name: 'Aarav Tamang',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aarav',
    grade: 'Grade 3',
    section: 'Section A',
    status: 'Good progress this week',
    statusType: 'positive',
    strengths: ['Mathematics', 'Problem Solving', 'Teamwork'],
    weaknesses: ['Nepali Handwriting', 'Punctuality'],
    attendance: '95%'
  },
  {
    id: '2',
    name: 'Ishani Gurung',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ishani',
    grade: 'Grade 1',
    section: 'Section B',
    status: 'Needs help with Math',
    statusType: 'attention',
    strengths: ['Creativity', 'Science', 'Singing'],
    weaknesses: ['Number Recognition', 'Focus'],
    attendance: '88%'
  }
];

export const MOCK_TIMELINE: TimelineEvent[] = [
  {
    id: 't1',
    studentId: '1',
    date: 'May 14, 2026',
    title: 'Outstanding Math Quiz',
    description: 'Aarav scored 10/10 in today\'s multiplication quiz. Great job!',
    type: 'achievement',
    icon: 'star'
  },
  {
    id: 't2',
    studentId: '1',
    date: 'May 12, 2026',
    title: 'Helping Classmates',
    description: 'He was observed helping a peer understand a science concept during group work.',
    type: 'behavior',
    icon: 'heart'
  },
  {
    id: 't3',
    studentId: '1',
    date: 'May 10, 2026',
    title: 'Improve Handwriting',
    description: 'Teacher noted that Aarav needs to focus more on his Nepali alphabet shapes.',
    type: 'academic',
    icon: 'edit'
  },
  {
    id: 't4',
    studentId: '2',
    date: 'May 13, 2026',
    title: 'Science Fair Project',
    description: 'Ishani created a beautiful model of a plant cell using recycled materials.',
    type: 'achievement',
    icon: 'flask'
  }
];

export const MOCK_UPDATES: Update[] = [
  {
    id: '101',
    teacherName: 'Mrs. Sharma',
    subject: 'Mathematics',
    message: 'Aarav showed excellent participation in Math today. He solved the complex fraction problems very quickly!',
    time: '2 hours ago',
    type: 'progress',
    studentId: '1'
  },
  {
    id: '102',
    teacherName: 'Mr. Adhikari',
    subject: 'Science',
    message: 'Ishani was very curious during the plant experiment. She asked very thoughtful questions about photosynthesis.',
    time: '5 hours ago',
    type: 'progress',
    studentId: '2'
  }
];
