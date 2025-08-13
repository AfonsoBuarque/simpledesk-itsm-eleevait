
import React, { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useUsers } from "@/hooks/useUsers";

interface AddGroupMembersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  addedUserIds: string[];
  onAdd: (userIds: string[]) => Promise<void>;
}

export const AddGroupMembersDialog: React.FC<AddGroupMembersDialogProps> = ({ open, onOpenChange, addedUserIds, onAdd }) => {
  const { users, loading } = useUsers();
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Reset paginação ao abrir/buscar
  useEffect(() => {
    if (open) setPage(1);
  }, [open]);
  useEffect(() => {
    setPage(1);
  }, [search, addedUserIds]);

  const availableUsers = useMemo(() => {
    const term = search.trim().toLowerCase();
    return users
      .filter((u) => !addedUserIds.includes(u.id))
      .filter((u) =>
        term.length === 0 ||
        u.name.toLowerCase().includes(term) ||
        u.email.toLowerCase().includes(term)
      )
      .sort((a, b) => a.name.localeCompare(b.name, "pt-BR", { sensitivity: "base" }));
  }, [users, addedUserIds, search]);

  const total = availableUsers.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = (page - 1) * pageSize;
  const end = Math.min(start + pageSize, total);
  const paginatedUsers = availableUsers.slice(start, end);

  const handleToggle = (userId: string) => {
    setSelected((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleAdd = async () => {
    await onAdd(selected);
    setSelected([]);
    setSearch("");
    setPage(1);
    onOpenChange(false);
  };

  const goToPage = (p: number) => {
    if (p < 1 || p > totalPages) return;
    setPage(p);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg w-full">
        <DialogHeader>
          <DialogTitle>Adicionar Membros ao Grupo</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-3 w-full min-w-0 overflow-hidden">
          <div className="flex items-center gap-2 w-full min-w-0">
            <Input
              className="w-full min-w-0"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nome ou email..."
            />
            <Button
              type="button"
              variant="secondary"
              onClick={() => setPage(1)}
              aria-label="Buscar usuário"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>

          {loading ? (
            <div>Carregando usuários...</div>
          ) : total === 0 ? (
            <div className="text-sm text-muted-foreground">Nenhum usuário encontrado.</div>
          ) : (
            <>
              <div className="text-xs text-muted-foreground">Mostrando {start + 1}-{end} de {total}</div>
              <div className="flex flex-col gap-2 max-h-80 overflow-auto pr-1 w-full min-w-0">
                {paginatedUsers.map((user) => (
                  <label key={user.id} className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={selected.includes(user.id)}
                      onCheckedChange={() => handleToggle(user.id)}
                    />
                    <span>
                      {user.name} <span className="text-xs text-muted-foreground">({user.email})</span>
                    </span>
                  </label>
                ))}
              </div>

              {totalPages > 1 && (
                <Pagination className="mt-1 overflow-x-auto">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); goToPage(page - 1); }} />
                    </PaginationItem>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <PaginationItem key={p}>
                        <PaginationLink
                          href="#"
                          isActive={p === page}
                          onClick={(e) => { e.preventDefault(); goToPage(p); }}
                        >
                          {p}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext href="#" onClick={(e) => { e.preventDefault(); goToPage(page + 1); }} />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-3 w-full">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleAdd} disabled={selected.length === 0}>Adicionar {selected.length > 0 ? `(${selected.length})` : ""}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
