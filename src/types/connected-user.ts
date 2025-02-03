export interface ConnectedUser {
  id: string;
  name: string | null;
  mail: string | null;
  mobile: string | null;
  isRoot: boolean | null;
  isActive: boolean | null;
  isStaff: boolean | null;
  mustRenewPassword: boolean;
  allowedDeviceNumber: number;
  roleId: null | string;
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
  userDevices: any[];
  role: {
    id: string;
    name: string;
  } | null;
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
