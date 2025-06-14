
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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

  const handleToggle = (userId: string) => {
    setSelected((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleAdd = async () => {
    await onAdd(selected);
    setSelected([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar Membros ao Grupo</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          {loading ? (
            <div>Carregando usuários...</div>
          ) : (
            <>
              {users
                .filter((u) => !addedUserIds.includes(u.id))
                .map((user) => (
                  <label key={user.id} className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={selected.includes(user.id)}
                      onCheckedChange={() => handleToggle(user.id)}
                    />
                    <span>{user.name} <span className="text-xs text-gray-500">({user.email})</span></span>
                  </label>
                ))}
              {users.filter((u) => !addedUserIds.includes(u.id)).length === 0 && (
                <div className="text-gray-500 text-sm">Todos os usuários já são membros deste grupo.</div>
              )}
            </>
          )}
        </div>
        <div className="flex justify-end gap-2 pt-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleAdd} disabled={selected.length === 0}>Adicionar {selected.length > 0 ? `(${selected.length})` : ""}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
