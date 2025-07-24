import { useState } from 'react';
import { handleError, handleSuccess } from '../utils/errorHandler';

interface UseGenericFormProps<T, R> {
  initialValues: T;
  onSubmit: (values: T) => Promise<R>;
  onSuccess?: (result: R) => void;
  successMessage?: string;
  validationSchema?: (values: T) => Record<string, string> | null;
}

export function useGenericForm<T extends Record<string, any>, R>({
  initialValues,
  onSubmit,
  onSuccess,
  successMessage = 'Operação realizada com sucesso',
  validationSchema
}: UseGenericFormProps<T, R>) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [field]: value }));
    
    // Limpar erro do campo quando ele é alterado
    if (errors[field as string]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field as string];
        return newErrors;
      });
    }
  };

  const validate = () => {
    if (!validationSchema) return true;
    
    const validationErrors = validationSchema(values);
    if (validationErrors) {
      setErrors(validationErrors);
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!validate()) return;
    
    setIsSubmitting(true);
    
    try {
      const result = await onSubmit(values);
      handleSuccess(successMessage);
      
      if (onSuccess) {
        onSuccess(result);
      }
      
      return result;
    } catch (error) {
      handleError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
  };

  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    resetForm,
    setValues
  };
}
