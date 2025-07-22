
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useProblemaLogs } from '@/hooks/useProblemaLogs';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ProblemaLogsProps {
  problemaId: string;
}

export const ProblemaLogs = ({ problemaId }: ProblemaLogsProps) => {
  const { data: logs = [], isLoading } = useProblemaLogs(problemaId);

  if (isLoading) {
    return <div>Carregando histórico...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Alterações</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {logs.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              Nenhuma alteração registrada ainda
            </p>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="border-l-2 border-muted pl-4 pb-4">
                <div className="flex items-center gap-2 mb-2">
                  {log.tipo && (
                    <Badge variant="outline" className="text-xs">
                      {log.tipo}
                    </Badge>
                  )}
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(log.criado_em), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                  </span>
                </div>
                <p className="text-sm">{log.acao}</p>
                {log.descricao && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {log.descricao}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
