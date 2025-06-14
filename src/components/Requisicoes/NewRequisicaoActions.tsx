
import React from "react";
import { Button } from "@/components/ui/button";

interface NewRequisicaoActionsProps {
  isLoading: boolean;
  onCancel: () => void;
}

export const NewRequisicaoActions = ({
  isLoading,
  onCancel,
}: NewRequisicaoActionsProps) => (
  <div className="flex justify-end space-x-2 pt-4">
    <Button
      type="button"
      variant="outline"
      onClick={onCancel}
      disabled={isLoading}
    >
      Cancelar
    </Button>
    <Button type="submit" disabled={isLoading}>
      {isLoading ? "Criando..." : "Criar Requisição"}
    </Button>
  </div>
);
