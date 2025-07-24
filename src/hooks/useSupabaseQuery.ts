import { supabase } from '../integrations/supabase/client';

export function useSupabaseQuery() {
  // Função genérica para consultas SELECT
  const selectQuery = async <T>(
    table: string, 
    columns: string = '*', 
    filters?: {column: string, value: any}[],
    options?: {
      orderBy?: string,
      limit?: number,
      joins?: {table: string, on: string}[]
    }
  ) => {
    try {
      let query = supabase.from(table).select(columns);
      
      // Aplicar filtros
      if (filters && filters.length > 0) {
        filters.forEach(filter => {
          query = query.eq(filter.column, filter.value);
        });
      }
      
      // Aplicar ordenação
      if (options?.orderBy) {
        const [column, direction] = options.orderBy.split('.');
        query = query.order(column, { ascending: direction === 'asc' });
      }
      
      // Aplicar limite
      if (options?.limit) {
        query = query.limit(options.limit);
      }
      
      const { data, error } = await query;
      
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  };

  // Função genérica para inserções
  const insertQuery = async <T>(
    table: string,
    data: any
  ) => {
    try {
      const { data: result, error } = await supabase
        .from(table)
        .insert(data)
        .select();
      
      return { data: result, error };
    } catch (error) {
      return { data: null, error };
    }
  };

  // Função genérica para atualizações
  const updateQuery = async <T>(
    table: string,
    data: any,
    filters: {column: string, value: any}[]
  ) => {
    try {
      let query = supabase.from(table).update(data);
      
      // Aplicar filtros
      if (filters && filters.length > 0) {
        filters.forEach(filter => {
          query = query.eq(filter.column, filter.value);
        });
      }
      
      const { data: result, error } = await query.select();
      
      return { data: result, error };
    } catch (error) {
      return { data: null, error };
    }
  };

  // Função genérica para exclusões
  const deleteQuery = async (
    table: string,
    filters: {column: string, value: any}[]
  ) => {
    try {
      let query = supabase.from(table).delete();
      
      // Aplicar filtros
      if (filters && filters.length > 0) {
        filters.forEach(filter => {
          query = query.eq(filter.column, filter.value);
        });
      }
      
      const { error } = await query;
      
      return { error };
    } catch (error) {
      return { error };
    }
  };

  return {
    selectQuery,
    insertQuery,
    updateQuery,
    deleteQuery
  };
}
