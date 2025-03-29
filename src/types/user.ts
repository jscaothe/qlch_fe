export interface IUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'manager' | 'staff';
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
}

export interface ICreateUserDto {
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'manager' | 'staff';
  status: 'active' | 'inactive';
  password: string;
}

export interface IUpdateUserDto {
  name?: string;
  email?: string;
  phone?: string;
  role?: 'admin' | 'manager' | 'staff';
  status?: 'active' | 'inactive';
  password?: string;
}

export interface IUserQuery {
  page: number;
  limit: number;
  search?: string;
  role?: string;
  status?: string;
}

export interface IUserResponse {
  data: {
    users: IUser[];
    total: number;
    page: number;
    limit: number;
  }
}

export interface UserFilters {
  search: string;
  role?: 'admin' | 'manager' | 'staff';
  status?: 'active' | 'inactive';
  page: number;
  limit: number;
}

export interface UserStats {
  total: number;
  active: number;
  inactive: number;
  byRole: {
    admin: number;
    manager: number;
    staff: number;
  };
} 