export interface ConnectedUser {
  id: string;
  name: string;
  mail: string | null;
  mobile: string;
  isRoot: boolean;
  isActive: boolean;
  mustRenewPassword: boolean;
  allowedDeviceNumber: number;
  roleId: string | null;
  createdAt: string;
  updatedAt: string;
  updatedByUserId: string | null;
  createdByUserId: string | null;
  isDeleted: boolean;
  meta: {
    logs: {
      [year: string]: {
        [month: string]: string[];
      };
    };
  };
  userDevices: any[]; // Spécifier un type plus précis si nécessaire
  agent: Agent | null;
  role: {
    id: string;
    name: string;
  };
}

export interface Agent {
  id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  mobile: string;
  mail: string | null;
  address: string;
  organizationId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  updatedByUserId: string | null;
  createdByUserId: string | null;
  isDeleted: boolean;
  meta: Record<string, any>;
  wallets: Wallet[];
  organization: Organization;
}

export interface Wallet {
  id: string;
  solde: number;
  agentId: string;
  currencyId: string;
  canBeNegative: boolean;
  createdAt: string;
  updatedAt: string;
  updatedByUserId: string | null;
  createdByUserId: string | null;
  isDeleted: boolean;
  meta: Record<string, any>;
  currency: Currency;
}

export interface Currency {
  id: string;
  name: string;
  symbol: string;
  formatKey: string;
  exchangeRate: number;
  createdAt: string | null;
  updatedAt: string;
  updatedByUserId: string | null;
  createdByUserId: string | null;
  isDeleted: boolean;
  meta: Record<string, any>;
}

export interface Organization {
  id: string;
  name: string;
  photo: string;
  createdAt: string;
  updatedAt: string;
  updatedByUserId: string | null;
  createdByUserId: string | null;
  isDeleted: boolean;
  meta: Record<string, any>;
}
