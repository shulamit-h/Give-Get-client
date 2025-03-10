
// types.ts
export type User = {
  id: number;
  userName: string;
  email: string;
  phoneNumber: string;
  score: number;
  talentsOffered: TalentUserDto[];  // עדכון לסוג המתאים
  talentsWanted: TalentUserDto[];   // עדכון לסוג המתאים
  age: number;
  gender: 'Male' | 'Female';
  desc: string;
  isActive: boolean;
  profileImage: string;
  isAdmin: boolean | null;
};

export type TalentUserDto = {
  talentId: number;
  isOffered: boolean;
};

export interface Talent {
  id: number;
  talentName: string;
  parentCategory: number;
}

export interface TalentUser {
  id: number;
  talentId: number;
  isOffered: boolean;
}