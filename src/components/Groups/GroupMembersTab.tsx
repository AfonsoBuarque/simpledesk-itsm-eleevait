
import React, { useCallback, useEffect, useState } from "react";
import { UserPlus, UserMinus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useUsers } from "@/hooks/useUsers";
import { useGroups } from "@/hooks/useGroups";
import { useGroupUserOperations } from "@/hooks/useGroupUserOperations";
import { AddGroupMembersDialog } from "./AddGroupMembersDialog";

interface GroupMembersTabProps {
  groupId: string;
}

export const GroupMembersTab: React.FC<GroupMembersTabProps> = ({ groupId }) => {
  const { users, getUserGroups, refreshUsers } = useUsers();
  const { removeUserFromGroup, refreshGroups } = useGroups();
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    const result = await Promise.all(
      users.map(async (user) => {
        const groups = await getUserGroups(user.id);
        return groups.some((g) => g.id === groupId)
          ? user
          : null;
      })
    );
    setMembers(result.filter(Boolean));
    setLoading(false);
  }, [users, groupId, getUserGroups]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers, showAddDialog]);

  const handleRemove = async (userId: string) => {
    await removeUserFromGroup(groupId, userId);
    await fetchMembers();
    refreshGroups();
    refreshUsers();
  };

  const handleAdd = async (userIds: string[]) => {
    const { addUserToGroup } = useGroups();
    for (const userId of userIds) {
      await addUserToGroup(groupId, userId);
    }
    await fetchMembers();
    refreshGroups();
    refreshUsers();
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <span className="font-medium text-lg">Membros do Grupo</span>
        <Button onClick={() => setShowAddDialog(true)} variant="secondary" size="sm">
          <UserPlus className="w-4 h-4" />
          Adicionar Membros
        </Button>
      </div>
      {loading ? (
        <div>Carregando membros...</div>
      ) : members.length === 0 ? (
        <div className="text-gray-500">Nenhum membro neste grupo.</div>
      ) : (
        <div className="flex flex-col gap-2">
          {members.map((user) => (
            <div key={user.id} className="flex items-center justify-between border rounded px-3 py-2 bg-muted">
              <div>
                <span className="font-medium">{user.name}</span>{" "}
                <span className="text-xs text-gray-400">({user.email})</span>
                {user.role && (
                  <Badge className="ml-2 text-xs">{user.role}</Badge>
                )}
              </div>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="text-red-500"
                title="Remover do grupo"
                onClick={() => handleRemove(user.id)}
              >
                <UserMinus className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <AddGroupMembersDialog
        open={showAddDialog}
        onOpenChange={(open) => setShowAddDialog(open)}
        addedUserIds={members.map((u) => u.id)}
        onAdd={handleAdd}
      />
    </div>
  );
};
