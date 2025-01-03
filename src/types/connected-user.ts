export type ConnectUser = {
  id: string;
  name: string;
  mail: string | null;
  mobile: string;
  isRoot: boolean;
  isActive: boolean;
  mustRenewPassword: boolean;
  allowedDeviceNumber: number;
  roleId: string | null;
  agent: null | {
    fullName: string;
    mobile: string;
    address: string;
    userId: string;
    wallets: {
      id: string;
      solde: number;
      currency: {
        id: string;
        name: string;
        symbol: string;
        formatKey: string;
        exchangeRate: number;
      }[];
    }[];
  };
};
