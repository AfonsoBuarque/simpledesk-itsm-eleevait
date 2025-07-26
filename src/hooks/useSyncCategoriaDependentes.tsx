
import { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { Categoria } from "@/types/categoria";
import { SolicitacaoFormData } from "@/types/solicitacao";

/**
 * Sincroniza dependentes da categoria na criação da requisição:
 *  - client_id (opcional)
 *  - sla_id (opcional)
 *  - grupo_responsavel_id (opcional)
 */
export function useSyncCategoriaDependentes(
  form: UseFormReturn<SolicitacaoFormData>,
  categorias: Categoria[]
) {
  const categoriaId = form.watch("categoria_id");

  useEffect(() => {
    if (categoriaId && categorias.length > 0) {
      const categoria = categorias.find((cat) => cat.id === categoriaId);
      if (!categoria) return;

      // Cliente
      if (categoria.client_id) {
        form.setValue("client_id", categoria.client_id, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
      }

      // SLA (ou limpá-la se não houver)
      if (categoria.sla_id) {
        form.setValue("sla_id", categoria.sla_id, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
      } else {
        form.setValue("sla_id", "", { shouldValidate: true, shouldDirty: true, shouldTouch: true });
      }

      // Grupo responsável
      if (categoria.grupo_id) {
        form.setValue("grupo_responsavel_id", categoria.grupo_id, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
      }

      // Forçar validação dos campos vinculados
      form.trigger(["client_id", "sla_id", "grupo_responsavel_id"]);
    }
  }, [categoriaId, categorias, form]);
}
