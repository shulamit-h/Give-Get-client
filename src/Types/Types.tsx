// types.ts
export type User = {
    id: number;
    userName: string;
    email: string;
    phoneNumber: string;
    score: number;
    talentsOffered: string[];  // או סוג אחר אם תרצה להיות יותר ספציפי
    talentsWanted: string[];   // אותו דבר
    age: number;
    gender: 'Male' | 'Female';
    desc: string;
    isActive: boolean;
    profileImage: string;
    isAdmin: boolean | null;
  };
  