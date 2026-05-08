import type { Timestamp } from 'firebase/firestore';

export type Confederation = 'CONMEBOL' | 'UEFA' | 'CONCACAF' | 'AFC' | 'CAF' | 'OFC';

export type StickerSection =
  | 'cover'
  | 'hosts'
  | 'stadiums'
  | 'legends'
  | 'team'
  | 'special'
  | 'fanfest';

export type StickerType = 'player' | 'team' | 'legend' | 'special' | 'host' | 'stadium' | 'cover';

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string;
  photoURL: string | null;
  fcmToken?: string | null;
  locale?: 'pt-BR' | 'en' | 'es';
  createdAt: Timestamp | Date;
  updatedAt?: Timestamp | Date;
}

export interface CollectionEntry {
  stickerId: string;
  quantity: number;
  obtainedAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
}

export interface Team {
  id: string;
  code: string; // BRA, ARG, USA...
  namePt: string;
  nameEn: string;
  nameEs: string;
  flagUrl: string;
  groupStage?: string; // 'A', 'B', ...
  confederation: Confederation;
  isHost: boolean;
  coachName?: string;
  order: number; // ordem na seção
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
  id: string; // ex: "FWC1", "BRA1"
  number: number;
  code: string;
  type: StickerType;
  section: StickerSection;
  teamId?: string;
  playerId?: string;
  isFoil: boolean;
  imageUrl?: string;
  label?: string;
}

export interface Group {
  id: string;
  name: string;
  inviteCode: string;
  createdBy: string;
  createdAt: Timestamp | Date;
  memberIds: string[];
}

export interface GroupMember {
  userId: string;
  role: 'owner' | 'admin' | 'member';
  joinedAt: Timestamp | Date;
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
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
}

export interface AppNotification {
  id: string;
  type: 'trade_match' | 'trade_accepted' | 'trade_done' | 'group_invite' | 'achievement';
  message: string;
  data?: Record<string, unknown>;
  read: boolean;
  createdAt: Timestamp | Date;
}

export interface MatchSuggestion {
  id: string;
  groupId: string;
  partnerUserId: string;
  partnerName: string;
  iCanGive: string[]; // stickerIds
  iCanGet: string[]; // stickerIds
  score: number; // qualidade do match
  updatedAt: Timestamp | Date;
}
