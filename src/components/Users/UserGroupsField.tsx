
import React from 'react';
import { Control } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Group } from '@/types/user';

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

interface UserGroupsFieldProps {
  control: Control<UserFormData>;
  groups: Group[];
}

export const UserGroupsField = ({ control, groups }: UserGroupsFieldProps) => {
  return (
    <FormField
      control={control}
      name="groups"
      render={({ field }) => {
        const currentGroups = field.value || [];
        
        return (
          <FormItem>
            <FormLabel>Grupos</FormLabel>
            <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto border rounded-md p-3 bg-background">
              {groups.length === 0 ? (
                <div className="col-span-2 text-sm text-gray-500 text-center py-2">
                  Nenhum grupo disponível
                </div>
              ) : (
                groups.map((group) => (
                  <div key={group.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`group-${group.id}`}
                      checked={currentGroups.includes(group.id)}
                      onCheckedChange={(checked) => {
                        let newGroups;
                        if (checked) {
                          newGroups = [...currentGroups, group.id];
                        } else {
                          newGroups = currentGroups.filter(id => id !== group.id);
                        }
                        field.onChange(newGroups);
                      }}
                    />
                    <label
                      htmlFor={`group-${group.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {group.name}
                    </label>
                  </div>
                ))
              )}
            </div>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};
