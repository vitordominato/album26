import type { FieldValue, Timestamp } from 'firebase/firestore';

export type FsTimestamp = Timestamp | Date | FieldValue;

export type Confederation = 'CONMEBOL' | 'UEFA' | 'CONCACAF' | 'AFC' | 'CAF' | 'OFC';

export type StickerSection = 'fwc' | 'team' | 'extras';

export type StickerType = 'player' | 'team' | 'special' | 'fwc' | 'extra';

export type ExtraTier = 'regular' | 'bronze' | 'silver' | 'gold';

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string;
  photoURL: string | null;
  fcmToken?: string | null;
  locale?: 'pt-BR' | 'en' | 'es';
  createdAt: FsTimestamp;
  updatedAt?: FsTimestamp;
}

export interface CollectionEntry {
  stickerId: string;
  quantity: number;
  obtainedAt: FsTimestamp;
  updatedAt: FsTimestamp;
}

export interface Team {
  id: string;
  code: string; // BRA, ARG, USA...
  namePt: string;
  nameEn: string;
  nameEs: string;
  flagUrl: string;
  groupStage: string; // 'A' a 'L'
  confederation: Confederation;
  isHost: boolean;
  coachName?: string;
  order: number;
}

export interface Player {
  id: string;
  teamId: string;
  name: string;
  position: 'GK' | 'DEF' | 'MID' | 'FWD' | 'COACH';
  jerseyNumber?: number;
  photoUrl?: string;
}

export interface Sticker {
  id: string; // ex: "FWC-1", "BRA-13", "EXTRA-7-GOLD"
  number: number; // posição absoluta no álbum
  code: string; // ex: "FWC-1", "BRA-13", "EXTRA-7"
  type: StickerType;
  section: StickerSection;
  teamId?: string;
  teamSlot?: number; // 1 a 20 dentro da página da seleção
  playerId?: string;
  isFoil: boolean;
  isMcDonalds?: boolean; // #13 de cada seleção, exclusivo McDonald's
  extraTier?: ExtraTier; // só para 'extras'
  groupStage?: string; // grupo da copa quando aplicável
  imageUrl?: string;
  label?: string;
}

export interface Group {
  id: string;
  name: string;
  inviteCode: string;
  createdBy: string;
  createdAt: FsTimestamp;
  memberIds: string[];
}

export interface GroupMember {
  userId: string;
  role: 'owner' | 'admin' | 'member';
  joinedAt: FsTimestamp;
  displayName: string;
  photoURL: string | null;
}

export type TradeStatus = 'pending' | 'accepted' | 'rejected' | 'done' | 'cancelled';

export interface Trade {
  id: string;
  groupId: string;
  fromUserId: string;
  toUserId: string;
  fromUserName: string;
  toUserName: string;
  status: TradeStatus;
  offerStickerIds: string[]; // figurinhas que o `from` oferece
  requestStickerIds: string[]; // figurinhas que o `from` quer
  message?: string;
  createdAt: FsTimestamp;
  updatedAt: FsTimestamp;
}

export interface AppNotification {
  id: string;
  type: 'trade_match' | 'trade_accepted' | 'trade_done' | 'group_invite' | 'achievement';
  message: string;
  data?: Record<string, unknown>;
  read: boolean;
  createdAt: FsTimestamp;
}

export interface MatchSuggestion {
  id: string;
  groupId: string;
  partnerUserId: string;
  partnerName: string;
  iCanGive: string[]; // stickerIds
  iCanGet: string[]; // stickerIds
  score: number; // qualidade do match
  updatedAt: FsTimestamp;
}
