
import React from 'react';
import { Control } from 'react-hook-form';
import { UserBasicFields } from './UserBasicFields';
import { UserRoleFields } from './UserRoleFields';
import { UserClientField } from './UserClientField';
import { UserGroupsField } from './UserGroupsField';

interface Client {
  id: string;
  name: string;
}

interface Group {
  id: string;
  name: string;
}

interface UserFormData {
  name?: string;
  email?: string;
  phone?: string;
  department?: string;
  role?: string;
  client_id?: string;
  status?: 'active' | 'inactive';
  groups?: string[];
}

interface UserFormFieldsProps {
  control: Control<UserFormData>;
  clients: Client[];
  groups?: Group[];
}

export const UserFormFields = ({ control, clients, groups = [] }: UserFormFieldsProps) => {
  return (
    <>
      <UserBasicFields control={control} />
      <UserRoleFields control={control} />
      <UserClientField control={control} clients={clients} />
      <UserGroupsField control={control} groups={groups} />
    </>
  );
};
