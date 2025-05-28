
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { CategoriaFormData } from '@/types/categoria';
import BasicCategoriaFields from './BasicCategoriaFields';
import CategoriaRelationshipFields from './CategoriaRelationshipFields';
import CategoriaConfigFields from './CategoriaConfigFields';

interface CategoriaFormFieldsProps {
  form: UseFormReturn<CategoriaFormData>;
}

const CategoriaFormFields = ({ form }: CategoriaFormFieldsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <BasicCategoriaFields form={form} />
      <CategoriaRelationshipFields form={form} />
      <CategoriaConfigFields form={form} />
    </div>
  );
};

export default CategoriaFormFields;
