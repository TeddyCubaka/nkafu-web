export interface Agent {
  id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  mobile: string;
  mail: string | null;
  address: string;
  organizationId: string | null;
  userId: string;
  createdAt: string; // ISO Date
  updatedAt: string; // ISO Date
  updatedByUserId: string | null;
  createdByUserId: string | null;
  isDeleted: boolean;
  meta: Record<string, any>; // Pour des données supplémentaires non spécifiées
  wallets: Wallet[] | undefined;
  user: User;
}

export interface Wallet {
  id: string;
  solde: number;
  agentId: string;
  currencyId: string;
  canBeNegative: boolean;
  createdAt: string; // ISO Date
  isDeleted: boolean;
  meta: Record<string, any>; // Pour des données supplémentaires non spécifiées
  currency: Currency;
}

export interface Currency {
  id: string;
  name: string;
  symbol: string;
  formatKey: string;
  exchangeRate: number;
  createdAt: string | null; // ISO Date ou null
  updatedAt: string | null; // ISO Date ou null
  updatedByUserId: string | null;
  createdByUserId: string | null;
  isDeleted: boolean;
  meta: Record<string, any>; // Pour des données supplémentaires non spécifiées
}

export interface User {
  id: string;
  name: string;
  mail: string | null;
  mobile: string;
  password: string;
  isRoot: boolean;
  isActive: boolean;
  mustRenewPassword: boolean;
  allowedDeviceNumber: number;
  roleId: string | null;
  createdAt: string; // ISO Date
  updatedAt: string; // ISO Date
  updatedByUserId: string | null;
  createdByUserId: string | null;
  isDeleted: boolean;
  meta: Record<string, any>; // Pour des données supplémentaires non spécifiées
}
