export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      categorias_servico: {
        Row: {
          ativo: boolean | null
          atualizado_em: string | null
          atualizado_por: string | null
          categoria_pai_id: string | null
          client_id: string | null
          criado_em: string | null
          criado_por: string | null
          descricao: string | null
          grupo_id: string | null
          id: string
          nome: string
          ordem_exibicao: number | null
          sla_id: string | null
          tipo: string
          usuario_responsavel_id: string | null
        }
        Insert: {
          ativo?: boolean | null
          atualizado_em?: string | null
          atualizado_por?: string | null
          categoria_pai_id?: string | null
          client_id?: string | null
          criado_em?: string | null
          criado_por?: string | null
          descricao?: string | null
          grupo_id?: string | null
          id?: string
          nome: string
          ordem_exibicao?: number | null
          sla_id?: string | null
          tipo: string
          usuario_responsavel_id?: string | null
        }
        Update: {
          ativo?: boolean | null
          atualizado_em?: string | null
          atualizado_por?: string | null
          categoria_pai_id?: string | null
          client_id?: string | null
          criado_em?: string | null
          criado_por?: string | null
          descricao?: string | null
          grupo_id?: string | null
          id?: string
          nome?: string
          ordem_exibicao?: number | null
          sla_id?: string | null
          tipo?: string
          usuario_responsavel_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "categorias_servico_atualizado_por_fkey"
            columns: ["atualizado_por"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "categorias_servico_categoria_pai_id_fkey"
            columns: ["categoria_pai_id"]
            isOneToOne: false
            referencedRelation: "categorias_servico"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "categorias_servico_cliente_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "categorias_servico_criado_por_fkey"
            columns: ["criado_por"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "categorias_servico_grupo_id_fkey"
            columns: ["grupo_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "categorias_servico_sla_id_fkey"
            columns: ["sla_id"]
            isOneToOne: false
            referencedRelation: "slas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "categorias_servico_usuario_responsavel_id_fkey"
            columns: ["usuario_responsavel_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          address: string
          created_at: string
          description: string | null
          email: string
          id: string
          name: string
          phone: string
          status: string
          updated_at: string
        }
        Insert: {
          address: string
          created_at?: string
          description?: string | null
          email: string
          id?: string
          name: string
          phone: string
          status?: string
          updated_at?: string
        }
        Update: {
          address?: string
          created_at?: string
          description?: string | null
          email?: string
          id?: string
          name?: string
          phone?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      cmdb_ativos: {
        Row: {
          ambiente: string | null
          atributos_customizados: Json | null
          atualizado_em: string | null
          atualizado_por: string | null
          auditoria_status: string | null
          business_criticality: string | null
          capacidade: Json | null
          centro_de_custo: string | null
          certificados: Json | null
          ciclo_vida_esperado: number | null
          classificacao_dados: string | null
          client_id: string | null
          compliance: Json | null
          componentes: Json | null
          contrato_id: string | null
          criado_em: string | null
          criado_por: string | null
          data_aquisicao: string | null
          data_garantia_fim: string | null
          data_garantia_inicio: string | null
          data_instalacao: string | null
          data_retirada: string | null
          departamento_id: string | null
          dependencias: Json | null
          descricao: string | null
          dono_negocio_id: string | null
          fabricante_id: string | null
          grupo_responsavel_id: string | null
          host_parent_id: string | null
          id: string
          ips: Json | null
          localizacao_id: string | null
          mac_addresses: Json | null
          modelo: string | null
          nivel_acesso: string | null
          nome: string
          numero_serie: string | null
          observacoes_negocio: string | null
          parent_id: string | null
          patrimonio: string | null
          politica_retirada: string | null
          prazo_renovacao: string | null
          proprietario_id: string | null
          proxima_auditoria: string | null
          relacionado_a_chamados: boolean | null
          requer_criptografia: boolean | null
          servicos_dependentes: Json | null
          sistema_operacional: string | null
          situacao_legal: string | null
          sla_esperado: string | null
          software_instalado: Json | null
          status_operacional: string | null
          tags: Json | null
          taxa_depreciacao: number | null
          tickets_ativos: Json | null
          tipo_aquisicao: string | null
          tipo_id: string | null
          ultima_auditoria: string | null
          valor_aquisicao: number | null
          valor_atual: number | null
          valor_residual: number | null
          versao: number | null
          versao_firmware: string | null
          virtualizacao_tipo: string | null
          vulnerabilidades_conhecidas: string | null
        }
        Insert: {
          ambiente?: string | null
          atributos_customizados?: Json | null
          atualizado_em?: string | null
          atualizado_por?: string | null
          auditoria_status?: string | null
          business_criticality?: string | null
          capacidade?: Json | null
          centro_de_custo?: string | null
          certificados?: Json | null
          ciclo_vida_esperado?: number | null
          classificacao_dados?: string | null
          client_id?: string | null
          compliance?: Json | null
          componentes?: Json | null
          contrato_id?: string | null
          criado_em?: string | null
          criado_por?: string | null
          data_aquisicao?: string | null
          data_garantia_fim?: string | null
          data_garantia_inicio?: string | null
          data_instalacao?: string | null
          data_retirada?: string | null
          departamento_id?: string | null
          dependencias?: Json | null
          descricao?: string | null
          dono_negocio_id?: string | null
          fabricante_id?: string | null
          grupo_responsavel_id?: string | null
          host_parent_id?: string | null
          id?: string
          ips?: Json | null
          localizacao_id?: string | null
          mac_addresses?: Json | null
          modelo?: string | null
          nivel_acesso?: string | null
          nome: string
          numero_serie?: string | null
          observacoes_negocio?: string | null
          parent_id?: string | null
          patrimonio?: string | null
          politica_retirada?: string | null
          prazo_renovacao?: string | null
          proprietario_id?: string | null
          proxima_auditoria?: string | null
          relacionado_a_chamados?: boolean | null
          requer_criptografia?: boolean | null
          servicos_dependentes?: Json | null
          sistema_operacional?: string | null
          situacao_legal?: string | null
          sla_esperado?: string | null
          software_instalado?: Json | null
          status_operacional?: string | null
          tags?: Json | null
          taxa_depreciacao?: number | null
          tickets_ativos?: Json | null
          tipo_aquisicao?: string | null
          tipo_id?: string | null
          ultima_auditoria?: string | null
          valor_aquisicao?: number | null
          valor_atual?: number | null
          valor_residual?: number | null
          versao?: number | null
          versao_firmware?: string | null
          virtualizacao_tipo?: string | null
          vulnerabilidades_conhecidas?: string | null
        }
        Update: {
          ambiente?: string | null
          atributos_customizados?: Json | null
          atualizado_em?: string | null
          atualizado_por?: string | null
          auditoria_status?: string | null
          business_criticality?: string | null
          capacidade?: Json | null
          centro_de_custo?: string | null
          certificados?: Json | null
          ciclo_vida_esperado?: number | null
          classificacao_dados?: string | null
          client_id?: string | null
          compliance?: Json | null
          componentes?: Json | null
          contrato_id?: string | null
          criado_em?: string | null
          criado_por?: string | null
          data_aquisicao?: string | null
          data_garantia_fim?: string | null
          data_garantia_inicio?: string | null
          data_instalacao?: string | null
          data_retirada?: string | null
          departamento_id?: string | null
          dependencias?: Json | null
          descricao?: string | null
          dono_negocio_id?: string | null
          fabricante_id?: string | null
          grupo_responsavel_id?: string | null
          host_parent_id?: string | null
          id?: string
          ips?: Json | null
          localizacao_id?: string | null
          mac_addresses?: Json | null
          modelo?: string | null
          nivel_acesso?: string | null
          nome?: string
          numero_serie?: string | null
          observacoes_negocio?: string | null
          parent_id?: string | null
          patrimonio?: string | null
          politica_retirada?: string | null
          prazo_renovacao?: string | null
          proprietario_id?: string | null
          proxima_auditoria?: string | null
          relacionado_a_chamados?: boolean | null
          requer_criptografia?: boolean | null
          servicos_dependentes?: Json | null
          sistema_operacional?: string | null
          situacao_legal?: string | null
          sla_esperado?: string | null
          software_instalado?: Json | null
          status_operacional?: string | null
          tags?: Json | null
          taxa_depreciacao?: number | null
          tickets_ativos?: Json | null
          tipo_aquisicao?: string | null
          tipo_id?: string | null
          ultima_auditoria?: string | null
          valor_aquisicao?: number | null
          valor_atual?: number | null
          valor_residual?: number | null
          versao?: number | null
          versao_firmware?: string | null
          virtualizacao_tipo?: string | null
          vulnerabilidades_conhecidas?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cmdb_ativos_atualizado_por_fkey"
            columns: ["atualizado_por"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cmdb_ativos_cliente_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cmdb_ativos_contrato_id_fkey"
            columns: ["contrato_id"]
            isOneToOne: false
            referencedRelation: "contratos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cmdb_ativos_criado_por_fkey"
            columns: ["criado_por"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cmdb_ativos_dono_negocio_id_fkey"
            columns: ["dono_negocio_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cmdb_ativos_fabricante_id_fkey"
            columns: ["fabricante_id"]
            isOneToOne: false
            referencedRelation: "fabricantes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cmdb_ativos_grupo_responsavel_id_fkey"
            columns: ["grupo_responsavel_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cmdb_ativos_host_parent_id_fkey"
            columns: ["host_parent_id"]
            isOneToOne: false
            referencedRelation: "cmdb_ativos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cmdb_ativos_localizacao_id_fkey"
            columns: ["localizacao_id"]
            isOneToOne: false
            referencedRelation: "localizacoes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cmdb_ativos_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "cmdb_ativos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cmdb_ativos_proprietario_id_fkey"
            columns: ["proprietario_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      contratos: {
        Row: {
          client_id: string | null
          created_at: string | null
          data_fim: string | null
          data_inicio: string | null
          fabricante_id: string | null
          fornecedor_id: string | null
          id: string
          localizacao_id: string | null
          nome_contrato: string | null
          nota_fiscal_arquivo: string | null
          nota_fiscal_data: string | null
          nota_fiscal_numero: string | null
          nota_fiscal_valor: number | null
          numero_contrato: string
          provedor_servico: string | null
          renovacao_automatica: boolean | null
          termos_contratuais: string | null
          updated_at: string | null
          usuario_responsavel_id: string | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          data_fim?: string | null
          data_inicio?: string | null
          fabricante_id?: string | null
          fornecedor_id?: string | null
          id?: string
          localizacao_id?: string | null
          nome_contrato?: string | null
          nota_fiscal_arquivo?: string | null
          nota_fiscal_data?: string | null
          nota_fiscal_numero?: string | null
          nota_fiscal_valor?: number | null
          numero_contrato: string
          provedor_servico?: string | null
          renovacao_automatica?: boolean | null
          termos_contratuais?: string | null
          updated_at?: string | null
          usuario_responsavel_id?: string | null
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          data_fim?: string | null
          data_inicio?: string | null
          fabricante_id?: string | null
          fornecedor_id?: string | null
          id?: string
          localizacao_id?: string | null
          nome_contrato?: string | null
          nota_fiscal_arquivo?: string | null
          nota_fiscal_data?: string | null
          nota_fiscal_numero?: string | null
          nota_fiscal_valor?: number | null
          numero_contrato?: string
          provedor_servico?: string | null
          renovacao_automatica?: boolean | null
          termos_contratuais?: string | null
          updated_at?: string | null
          usuario_responsavel_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contratos_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contratos_fabricante_id_fkey"
            columns: ["fabricante_id"]
            isOneToOne: false
            referencedRelation: "fabricantes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contratos_fornecedor_id_fkey"
            columns: ["fornecedor_id"]
            isOneToOne: false
            referencedRelation: "fornecedores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contratos_localizacao_id_fkey"
            columns: ["localizacao_id"]
            isOneToOne: false
            referencedRelation: "localizacoes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contratos_usuario_responsavel_id_fkey"
            columns: ["usuario_responsavel_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      fabricantes: {
        Row: {
          contato_suporte: string | null
          created_at: string | null
          id: string
          nome: string
          pais_origem: string | null
          updated_at: string | null
        }
        Insert: {
          contato_suporte?: string | null
          created_at?: string | null
          id?: string
          nome: string
          pais_origem?: string | null
          updated_at?: string | null
        }
        Update: {
          contato_suporte?: string | null
          created_at?: string | null
          id?: string
          nome?: string
          pais_origem?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      fornecedores: {
        Row: {
          cnpj: string | null
          contato_responsavel: string | null
          created_at: string | null
          email_contato: string | null
          endereco: string | null
          id: string
          nome: string
          observacoes: string | null
          site: string | null
          telefone_contato: string | null
          updated_at: string | null
        }
        Insert: {
          cnpj?: string | null
          contato_responsavel?: string | null
          created_at?: string | null
          email_contato?: string | null
          endereco?: string | null
          id?: string
          nome: string
          observacoes?: string | null
          site?: string | null
          telefone_contato?: string | null
          updated_at?: string | null
        }
        Update: {
          cnpj?: string | null
          contato_responsavel?: string | null
          created_at?: string | null
          email_contato?: string | null
          endereco?: string | null
          id?: string
          nome?: string
          observacoes?: string | null
          site?: string | null
          telefone_contato?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      groups: {
        Row: {
          client_id: string | null
          created_at: string
          description: string | null
          dias_semana: number[] | null
          fim_turno: string | null
          id: string
          inicio_turno: string | null
          name: string
          responsible_user_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          client_id?: string | null
          created_at?: string
          description?: string | null
          dias_semana?: number[] | null
          fim_turno?: string | null
          id?: string
          inicio_turno?: string | null
          name: string
          responsible_user_id?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          client_id?: string | null
          created_at?: string
          description?: string | null
          dias_semana?: number[] | null
          fim_turno?: string | null
          id?: string
          inicio_turno?: string | null
          name?: string
          responsible_user_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "groups_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "groups_responsible_user_id_fkey"
            columns: ["responsible_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      incidentes: {
        Row: {
          anexos: Json | null
          atendente_id: string | null
          ativos_envolvidos: Json | null
          atualizado_em: string | null
          atualizado_por: string | null
          canal_origem: string | null
          categoria_id: string | null
          client_id: string | null
          criado_em: string | null
          criado_por: string | null
          data_abertura: string | null
          data_limite_resolucao: string | null
          data_limite_resposta: string | null
          descricao: string | null
          grupo_responsavel_id: string | null
          id: string
          impacto: string | null
          notas_internas: string | null
          numero: string
          origem_id: string | null
          prioridade: string | null
          sla_id: string | null
          solicitante_id: string | null
          status: string
          tags: Json | null
          tipo: string
          titulo: string
          urgencia: string | null
        }
        Insert: {
          anexos?: Json | null
          atendente_id?: string | null
          ativos_envolvidos?: Json | null
          atualizado_em?: string | null
          atualizado_por?: string | null
          canal_origem?: string | null
          categoria_id?: string | null
          client_id?: string | null
          criado_em?: string | null
          criado_por?: string | null
          data_abertura?: string | null
          data_limite_resolucao?: string | null
          data_limite_resposta?: string | null
          descricao?: string | null
          grupo_responsavel_id?: string | null
          id?: string
          impacto?: string | null
          notas_internas?: string | null
          numero: string
          origem_id?: string | null
          prioridade?: string | null
          sla_id?: string | null
          solicitante_id?: string | null
          status?: string
          tags?: Json | null
          tipo?: string
          titulo: string
          urgencia?: string | null
        }
        Update: {
          anexos?: Json | null
          atendente_id?: string | null
          ativos_envolvidos?: Json | null
          atualizado_em?: string | null
          atualizado_por?: string | null
          canal_origem?: string | null
          categoria_id?: string | null
          client_id?: string | null
          criado_em?: string | null
          criado_por?: string | null
          data_abertura?: string | null
          data_limite_resolucao?: string | null
          data_limite_resposta?: string | null
          descricao?: string | null
          grupo_responsavel_id?: string | null
          id?: string
          impacto?: string | null
          notas_internas?: string | null
          numero?: string
          origem_id?: string | null
          prioridade?: string | null
          sla_id?: string | null
          solicitante_id?: string | null
          status?: string
          tags?: Json | null
          tipo?: string
          titulo?: string
          urgencia?: string | null
        }
        Relationships: []
      }
      incidentes_chat_mensagens: {
        Row: {
          arquivo_url: string | null
          autor_tipo: string
          criado_em: string
          criado_por: string
          id: string
          incidente_id: string
          mensagem: string
          tipo_arquivo: string | null
        }
        Insert: {
          arquivo_url?: string | null
          autor_tipo: string
          criado_em?: string
          criado_por: string
          id?: string
          incidente_id: string
          mensagem: string
          tipo_arquivo?: string | null
        }
        Update: {
          arquivo_url?: string | null
          autor_tipo?: string
          criado_em?: string
          criado_por?: string
          id?: string
          incidente_id?: string
          mensagem?: string
          tipo_arquivo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "incidentes_chat_mensagens_incidente_id_fkey"
            columns: ["incidente_id"]
            isOneToOne: false
            referencedRelation: "incidentes"
            referencedColumns: ["id"]
          },
        ]
      }
      incidentes_logs: {
        Row: {
          acao: string
          criado_em: string
          id: string
          incidente_id: string
          tipo: string | null
          usuario_id: string | null
        }
        Insert: {
          acao: string
          criado_em?: string
          id?: string
          incidente_id: string
          tipo?: string | null
          usuario_id?: string | null
        }
        Update: {
          acao?: string
          criado_em?: string
          id?: string
          incidente_id?: string
          tipo?: string | null
          usuario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "incidentes_logs_incidente_id_fkey"
            columns: ["incidente_id"]
            isOneToOne: false
            referencedRelation: "incidentes"
            referencedColumns: ["id"]
          },
        ]
      }
      kb_artigos: {
        Row: {
          anexos: Json | null
          artigo_relacionado_ids: string[] | null
          atualizado_em: string | null
          categoria_id: string | null
          conteudo: string
          criado_em: string | null
          criado_por: string | null
          id: string
          status: string | null
          tags: Json | null
          titulo: string
          visibilidade: string | null
        }
        Insert: {
          anexos?: Json | null
          artigo_relacionado_ids?: string[] | null
          atualizado_em?: string | null
          categoria_id?: string | null
          conteudo: string
          criado_em?: string | null
          criado_por?: string | null
          id?: string
          status?: string | null
          tags?: Json | null
          titulo: string
          visibilidade?: string | null
        }
        Update: {
          anexos?: Json | null
          artigo_relacionado_ids?: string[] | null
          atualizado_em?: string | null
          categoria_id?: string | null
          conteudo?: string
          criado_em?: string | null
          criado_por?: string | null
          id?: string
          status?: string | null
          tags?: Json | null
          titulo?: string
          visibilidade?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "kb_artigos_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "kb_categorias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "kb_artigos_criado_por_fkey"
            columns: ["criado_por"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      kb_categorias: {
        Row: {
          atualizado_em: string | null
          criado_em: string | null
          descricao: string | null
          id: string
          nome: string
          ordem: number | null
          parent_id: string | null
        }
        Insert: {
          atualizado_em?: string | null
          criado_em?: string | null
          descricao?: string | null
          id?: string
          nome: string
          ordem?: number | null
          parent_id?: string | null
        }
        Update: {
          atualizado_em?: string | null
          criado_em?: string | null
          descricao?: string | null
          id?: string
          nome?: string
          ordem?: number | null
          parent_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "kb_categorias_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "kb_categorias"
            referencedColumns: ["id"]
          },
        ]
      }
      kb_feedback: {
        Row: {
          artigo_id: string | null
          avaliacao: string | null
          comentario: string | null
          data: string | null
          id: string
          usuario_id: string | null
        }
        Insert: {
          artigo_id?: string | null
          avaliacao?: string | null
          comentario?: string | null
          data?: string | null
          id?: string
          usuario_id?: string | null
        }
        Update: {
          artigo_id?: string | null
          avaliacao?: string | null
          comentario?: string | null
          data?: string | null
          id?: string
          usuario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "kb_feedback_artigo_id_fkey"
            columns: ["artigo_id"]
            isOneToOne: false
            referencedRelation: "kb_artigos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "kb_feedback_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      kb_visualizacoes: {
        Row: {
          artigo_id: string | null
          data_acesso: string | null
          id: string
          usuario_id: string | null
        }
        Insert: {
          artigo_id?: string | null
          data_acesso?: string | null
          id?: string
          usuario_id?: string | null
        }
        Update: {
          artigo_id?: string | null
          data_acesso?: string | null
          id?: string
          usuario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "kb_visualizacoes_artigo_id_fkey"
            columns: ["artigo_id"]
            isOneToOne: false
            referencedRelation: "kb_artigos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "kb_visualizacoes_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      localizacoes: {
        Row: {
          client_id: string | null
          coordenadas: string | null
          created_at: string | null
          id: string
          nome: string
          parent_id: string | null
          tipo: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          client_id?: string | null
          coordenadas?: string | null
          created_at?: string | null
          id?: string
          nome: string
          parent_id?: string | null
          tipo?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          client_id?: string | null
          coordenadas?: string | null
          created_at?: string | null
          id?: string
          nome?: string
          parent_id?: string | null
          tipo?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "localizacoes_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "localizacoes_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "localizacoes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "localizacoes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      mudanca_aprovacoes: {
        Row: {
          aprovador_id: string
          atualizado_em: string | null
          criado_em: string | null
          data_aprovacao: string | null
          id: string
          justificativa: string | null
          mudanca_id: string
          nivel_aprovacao: number | null
          status_aprovacao: string
        }
        Insert: {
          aprovador_id: string
          atualizado_em?: string | null
          criado_em?: string | null
          data_aprovacao?: string | null
          id?: string
          justificativa?: string | null
          mudanca_id: string
          nivel_aprovacao?: number | null
          status_aprovacao?: string
        }
        Update: {
          aprovador_id?: string
          atualizado_em?: string | null
          criado_em?: string | null
          data_aprovacao?: string | null
          id?: string
          justificativa?: string | null
          mudanca_id?: string
          nivel_aprovacao?: number | null
          status_aprovacao?: string
        }
        Relationships: [
          {
            foreignKeyName: "mudanca_aprovacoes_mudanca_id_fkey"
            columns: ["mudanca_id"]
            isOneToOne: false
            referencedRelation: "mudancas"
            referencedColumns: ["id"]
          },
        ]
      }
      mudanca_chat_mensagens: {
        Row: {
          arquivo_url: string | null
          autor_tipo: string
          criado_em: string
          criado_por: string
          id: string
          mensagem: string
          mudanca_id: string
          tipo_arquivo: string | null
        }
        Insert: {
          arquivo_url?: string | null
          autor_tipo?: string
          criado_em?: string
          criado_por: string
          id?: string
          mensagem: string
          mudanca_id: string
          tipo_arquivo?: string | null
        }
        Update: {
          arquivo_url?: string | null
          autor_tipo?: string
          criado_em?: string
          criado_por?: string
          id?: string
          mensagem?: string
          mudanca_id?: string
          tipo_arquivo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mudanca_chat_mensagens_mudanca_id_fkey"
            columns: ["mudanca_id"]
            isOneToOne: false
            referencedRelation: "mudancas"
            referencedColumns: ["id"]
          },
        ]
      }
      mudanca_evidencias: {
        Row: {
          criado_em: string | null
          criado_por: string
          etapa_workflow: string | null
          id: string
          mime_type: string | null
          mudanca_id: string
          nome_arquivo: string
          tamanho_bytes: number | null
          tipo: string
          url_arquivo: string
        }
        Insert: {
          criado_em?: string | null
          criado_por: string
          etapa_workflow?: string | null
          id?: string
          mime_type?: string | null
          mudanca_id: string
          nome_arquivo: string
          tamanho_bytes?: number | null
          tipo: string
          url_arquivo: string
        }
        Update: {
          criado_em?: string | null
          criado_por?: string
          etapa_workflow?: string | null
          id?: string
          mime_type?: string | null
          mudanca_id?: string
          nome_arquivo?: string
          tamanho_bytes?: number | null
          tipo?: string
          url_arquivo?: string
        }
        Relationships: [
          {
            foreignKeyName: "mudanca_evidencias_mudanca_id_fkey"
            columns: ["mudanca_id"]
            isOneToOne: false
            referencedRelation: "mudancas"
            referencedColumns: ["id"]
          },
        ]
      }
      mudanca_logs: {
        Row: {
          acao: string
          criado_em: string
          descricao: string | null
          id: string
          mudanca_id: string
          tipo: string | null
          usuario_id: string | null
        }
        Insert: {
          acao: string
          criado_em?: string
          descricao?: string | null
          id?: string
          mudanca_id: string
          tipo?: string | null
          usuario_id?: string | null
        }
        Update: {
          acao?: string
          criado_em?: string
          descricao?: string | null
          id?: string
          mudanca_id?: string
          tipo?: string | null
          usuario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mudanca_logs_mudanca_id_fkey"
            columns: ["mudanca_id"]
            isOneToOne: false
            referencedRelation: "mudancas"
            referencedColumns: ["id"]
          },
        ]
      }
      mudanca_tipos: {
        Row: {
          aprovacao_automatica: boolean | null
          ativo: boolean | null
          codigo: string
          criado_em: string | null
          descricao: string | null
          id: string
          nivel_risco_maximo: string | null
          nome: string
          requer_aprovacao: boolean | null
          sla_horas: number
        }
        Insert: {
          aprovacao_automatica?: boolean | null
          ativo?: boolean | null
          codigo: string
          criado_em?: string | null
          descricao?: string | null
          id?: string
          nivel_risco_maximo?: string | null
          nome: string
          requer_aprovacao?: boolean | null
          sla_horas: number
        }
        Update: {
          aprovacao_automatica?: boolean | null
          ativo?: boolean | null
          codigo?: string
          criado_em?: string | null
          descricao?: string | null
          id?: string
          nivel_risco_maximo?: string | null
          nome?: string
          requer_aprovacao?: boolean | null
          sla_horas?: number
        }
        Relationships: []
      }
      mudanca_workflow: {
        Row: {
          criado_em: string | null
          data_fim: string | null
          data_inicio: string | null
          etapa: string
          evidencias: Json | null
          id: string
          mudanca_id: string
          observacoes: string | null
          ordem: number
          responsavel_id: string | null
          status: string
        }
        Insert: {
          criado_em?: string | null
          data_fim?: string | null
          data_inicio?: string | null
          etapa: string
          evidencias?: Json | null
          id?: string
          mudanca_id: string
          observacoes?: string | null
          ordem: number
          responsavel_id?: string | null
          status: string
        }
        Update: {
          criado_em?: string | null
          data_fim?: string | null
          data_inicio?: string | null
          etapa?: string
          evidencias?: Json | null
          id?: string
          mudanca_id?: string
          observacoes?: string | null
          ordem?: number
          responsavel_id?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "mudanca_workflow_mudanca_id_fkey"
            columns: ["mudanca_id"]
            isOneToOne: false
            referencedRelation: "mudancas"
            referencedColumns: ["id"]
          },
        ]
      }
      mudancas: {
        Row: {
          anexos: Json | null
          aprovacao_necessaria: boolean | null
          aprovador_id: string | null
          atendente_id: string | null
          ativos_envolvidos: Json | null
          atualizado_em: string | null
          atualizado_por: string | null
          canal_origem: string | null
          categoria_id: string | null
          cis_impactados: Json | null
          classificacao_risco: string | null
          client_id: string | null
          criado_em: string | null
          criado_por: string | null
          data_abertura: string | null
          data_aprovacao: string | null
          data_execucao_planejada: string | null
          data_limite_resolucao: string | null
          data_limite_resposta: string | null
          data_sla_limite: string | null
          descricao: string | null
          evidencias: Json | null
          grupo_responsavel_id: string | null
          id: string
          impacto: string | null
          impacto_estimado: string | null
          incidentes_relacionados: Json | null
          janela_manutencao_fim: string | null
          janela_manutencao_inicio: string | null
          justificativa_negocio: string | null
          justificativa_tecnica: string | null
          notas_internas: string | null
          numero: string
          origem_id: string | null
          plano_implementacao: string | null
          plano_rollback: string | null
          plano_testes: string | null
          prioridade: string | null
          problemas_relacionados: Json | null
          responsavel_tecnico_id: string | null
          riscos_identificados: string | null
          sla_id: string | null
          sla_prazo_horas: number | null
          sla_tipo: string | null
          solicitante_id: string | null
          status: string
          tags: Json | null
          testes_realizados: string | null
          tipo: string
          tipo_mudanca: string | null
          titulo: string
          urgencia: string | null
        }
        Insert: {
          anexos?: Json | null
          aprovacao_necessaria?: boolean | null
          aprovador_id?: string | null
          atendente_id?: string | null
          ativos_envolvidos?: Json | null
          atualizado_em?: string | null
          atualizado_por?: string | null
          canal_origem?: string | null
          categoria_id?: string | null
          cis_impactados?: Json | null
          classificacao_risco?: string | null
          client_id?: string | null
          criado_em?: string | null
          criado_por?: string | null
          data_abertura?: string | null
          data_aprovacao?: string | null
          data_execucao_planejada?: string | null
          data_limite_resolucao?: string | null
          data_limite_resposta?: string | null
          data_sla_limite?: string | null
          descricao?: string | null
          evidencias?: Json | null
          grupo_responsavel_id?: string | null
          id?: string
          impacto?: string | null
          impacto_estimado?: string | null
          incidentes_relacionados?: Json | null
          janela_manutencao_fim?: string | null
          janela_manutencao_inicio?: string | null
          justificativa_negocio?: string | null
          justificativa_tecnica?: string | null
          notas_internas?: string | null
          numero: string
          origem_id?: string | null
          plano_implementacao?: string | null
          plano_rollback?: string | null
          plano_testes?: string | null
          prioridade?: string | null
          problemas_relacionados?: Json | null
          responsavel_tecnico_id?: string | null
          riscos_identificados?: string | null
          sla_id?: string | null
          sla_prazo_horas?: number | null
          sla_tipo?: string | null
          solicitante_id?: string | null
          status?: string
          tags?: Json | null
          testes_realizados?: string | null
          tipo?: string
          tipo_mudanca?: string | null
          titulo: string
          urgencia?: string | null
        }
        Update: {
          anexos?: Json | null
          aprovacao_necessaria?: boolean | null
          aprovador_id?: string | null
          atendente_id?: string | null
          ativos_envolvidos?: Json | null
          atualizado_em?: string | null
          atualizado_por?: string | null
          canal_origem?: string | null
          categoria_id?: string | null
          cis_impactados?: Json | null
          classificacao_risco?: string | null
          client_id?: string | null
          criado_em?: string | null
          criado_por?: string | null
          data_abertura?: string | null
          data_aprovacao?: string | null
          data_execucao_planejada?: string | null
          data_limite_resolucao?: string | null
          data_limite_resposta?: string | null
          data_sla_limite?: string | null
          descricao?: string | null
          evidencias?: Json | null
          grupo_responsavel_id?: string | null
          id?: string
          impacto?: string | null
          impacto_estimado?: string | null
          incidentes_relacionados?: Json | null
          janela_manutencao_fim?: string | null
          janela_manutencao_inicio?: string | null
          justificativa_negocio?: string | null
          justificativa_tecnica?: string | null
          notas_internas?: string | null
          numero?: string
          origem_id?: string | null
          plano_implementacao?: string | null
          plano_rollback?: string | null
          plano_testes?: string | null
          prioridade?: string | null
          problemas_relacionados?: Json | null
          responsavel_tecnico_id?: string | null
          riscos_identificados?: string | null
          sla_id?: string | null
          sla_prazo_horas?: number | null
          sla_tipo?: string | null
          solicitante_id?: string | null
          status?: string
          tags?: Json | null
          testes_realizados?: string | null
          tipo?: string
          tipo_mudanca?: string | null
          titulo?: string
          urgencia?: string | null
        }
        Relationships: []
      }
      problema_chat_mensagens: {
        Row: {
          arquivo_url: string | null
          autor_tipo: string
          criado_em: string
          criado_por: string
          id: string
          mensagem: string
          problema_id: string
          tipo_arquivo: string | null
        }
        Insert: {
          arquivo_url?: string | null
          autor_tipo?: string
          criado_em?: string
          criado_por: string
          id?: string
          mensagem: string
          problema_id: string
          tipo_arquivo?: string | null
        }
        Update: {
          arquivo_url?: string | null
          autor_tipo?: string
          criado_em?: string
          criado_por?: string
          id?: string
          mensagem?: string
          problema_id?: string
          tipo_arquivo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "problema_chat_mensagens_problema_id_fkey"
            columns: ["problema_id"]
            isOneToOne: false
            referencedRelation: "problemas"
            referencedColumns: ["id"]
          },
        ]
      }
      problema_logs: {
        Row: {
          acao: string
          criado_em: string
          descricao: string | null
          id: string
          problema_id: string
          tipo: string | null
          usuario_id: string | null
        }
        Insert: {
          acao: string
          criado_em?: string
          descricao?: string | null
          id?: string
          problema_id: string
          tipo?: string | null
          usuario_id?: string | null
        }
        Update: {
          acao?: string
          criado_em?: string
          descricao?: string | null
          id?: string
          problema_id?: string
          tipo?: string | null
          usuario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "problema_logs_problema_id_fkey"
            columns: ["problema_id"]
            isOneToOne: false
            referencedRelation: "problemas"
            referencedColumns: ["id"]
          },
        ]
      }
      problemas: {
        Row: {
          anexos: Json | null
          atendente_id: string | null
          ativos_envolvidos: Json | null
          atualizado_em: string | null
          atualizado_por: string | null
          canal_origem: string | null
          categoria_id: string | null
          causa_raiz: string | null
          client_id: string | null
          criado_em: string | null
          criado_por: string | null
          data_abertura: string | null
          data_limite_resolucao: string | null
          data_limite_resposta: string | null
          descricao: string | null
          grupo_responsavel_id: string | null
          id: string
          impacto: string | null
          incidentes_relacionados: Json | null
          mudancas_relacionadas: Json | null
          notas_internas: string | null
          numero: string
          origem_id: string | null
          prioridade: string | null
          sla_id: string | null
          solicitante_id: string | null
          solucao_permanente: string | null
          solucao_temporaria: string | null
          status: string
          tags: Json | null
          tipo: string
          titulo: string
          urgencia: string | null
        }
        Insert: {
          anexos?: Json | null
          atendente_id?: string | null
          ativos_envolvidos?: Json | null
          atualizado_em?: string | null
          atualizado_por?: string | null
          canal_origem?: string | null
          categoria_id?: string | null
          causa_raiz?: string | null
          client_id?: string | null
          criado_em?: string | null
          criado_por?: string | null
          data_abertura?: string | null
          data_limite_resolucao?: string | null
          data_limite_resposta?: string | null
          descricao?: string | null
          grupo_responsavel_id?: string | null
          id?: string
          impacto?: string | null
          incidentes_relacionados?: Json | null
          mudancas_relacionadas?: Json | null
          notas_internas?: string | null
          numero: string
          origem_id?: string | null
          prioridade?: string | null
          sla_id?: string | null
          solicitante_id?: string | null
          solucao_permanente?: string | null
          solucao_temporaria?: string | null
          status?: string
          tags?: Json | null
          tipo?: string
          titulo: string
          urgencia?: string | null
        }
        Update: {
          anexos?: Json | null
          atendente_id?: string | null
          ativos_envolvidos?: Json | null
          atualizado_em?: string | null
          atualizado_por?: string | null
          canal_origem?: string | null
          categoria_id?: string | null
          causa_raiz?: string | null
          client_id?: string | null
          criado_em?: string | null
          criado_por?: string | null
          data_abertura?: string | null
          data_limite_resolucao?: string | null
          data_limite_resposta?: string | null
          descricao?: string | null
          grupo_responsavel_id?: string | null
          id?: string
          impacto?: string | null
          incidentes_relacionados?: Json | null
          mudancas_relacionadas?: Json | null
          notas_internas?: string | null
          numero?: string
          origem_id?: string | null
          prioridade?: string | null
          sla_id?: string | null
          solicitante_id?: string | null
          solucao_permanente?: string | null
          solucao_temporaria?: string | null
          status?: string
          tags?: Json | null
          tipo?: string
          titulo?: string
          urgencia?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          department: string | null
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          department?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          department?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      requisicao_chat_mensagens: {
        Row: {
          arquivo_url: string | null
          autor_tipo: string
          criado_em: string
          criado_por: string
          id: string
          mensagem: string
          requisicao_id: string
          tipo_arquivo: string | null
        }
        Insert: {
          arquivo_url?: string | null
          autor_tipo: string
          criado_em?: string
          criado_por: string
          id?: string
          mensagem: string
          requisicao_id: string
          tipo_arquivo?: string | null
        }
        Update: {
          arquivo_url?: string | null
          autor_tipo?: string
          criado_em?: string
          criado_por?: string
          id?: string
          mensagem?: string
          requisicao_id?: string
          tipo_arquivo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "requisicao_chat_mensagens_criado_por_fkey"
            columns: ["criado_por"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "requisicao_chat_mensagens_requisicao_id_fkey"
            columns: ["requisicao_id"]
            isOneToOne: false
            referencedRelation: "solicitacoes"
            referencedColumns: ["id"]
          },
        ]
      }
      requisicao_logs: {
        Row: {
          acao: string
          criado_em: string
          id: string
          requisicao_id: string
          tipo: string | null
          usuario_id: string | null
        }
        Insert: {
          acao: string
          criado_em?: string
          id?: string
          requisicao_id: string
          tipo?: string | null
          usuario_id?: string | null
        }
        Update: {
          acao?: string
          criado_em?: string
          id?: string
          requisicao_id?: string
          tipo?: string | null
          usuario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "requisicao_logs_requisicao_id_fkey"
            columns: ["requisicao_id"]
            isOneToOne: false
            referencedRelation: "solicitacoes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "requisicao_logs_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      slas: {
        Row: {
          aplica_a: Database["public"]["Enums"]["sla_tipo_aplicacao"] | null
          ativo: boolean | null
          atualizado_em: string | null
          atualizado_por: string | null
          client_id: string | null
          criado_em: string | null
          criado_por: string | null
          descricao: string | null
          grupo_id: string | null
          id: string
          nome: string
          observacoes: string | null
          prioridade: string | null
          tempo_resolucao_min: number
          tempo_resposta_min: number
          tipo_aplicacao: string
        }
        Insert: {
          aplica_a?: Database["public"]["Enums"]["sla_tipo_aplicacao"] | null
          ativo?: boolean | null
          atualizado_em?: string | null
          atualizado_por?: string | null
          client_id?: string | null
          criado_em?: string | null
          criado_por?: string | null
          descricao?: string | null
          grupo_id?: string | null
          id?: string
          nome: string
          observacoes?: string | null
          prioridade?: string | null
          tempo_resolucao_min: number
          tempo_resposta_min: number
          tipo_aplicacao: string
        }
        Update: {
          aplica_a?: Database["public"]["Enums"]["sla_tipo_aplicacao"] | null
          ativo?: boolean | null
          atualizado_em?: string | null
          atualizado_por?: string | null
          client_id?: string | null
          criado_em?: string | null
          criado_por?: string | null
          descricao?: string | null
          grupo_id?: string | null
          id?: string
          nome?: string
          observacoes?: string | null
          prioridade?: string | null
          tempo_resolucao_min?: number
          tempo_resposta_min?: number
          tipo_aplicacao?: string
        }
        Relationships: [
          {
            foreignKeyName: "slas_atualizado_por_fkey"
            columns: ["atualizado_por"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "slas_cliente_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "slas_criado_por_fkey"
            columns: ["criado_por"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "slas_grupo_id_fkey"
            columns: ["grupo_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      solicitacoes: {
        Row: {
          anexos: Json | null
          atendente_id: string | null
          ativos_envolvidos: Json | null
          atualizado_em: string | null
          atualizado_por: string | null
          avaliacao_usuario: number | null
          canal_origem: string | null
          categoria_id: string | null
          client_id: string | null
          criado_em: string | null
          criado_por: string | null
          data_abertura: string | null
          data_fechamento: string | null
          data_limite_resolucao: string | null
          data_limite_resposta: string | null
          data_primeiro_contato: string | null
          data_resolucao: string | null
          descricao: string | null
          grupo_responsavel_id: string | null
          id: string
          impacto: string | null
          notas_internas: string | null
          numero: string
          origem_id: string | null
          prioridade: string | null
          sla_id: string | null
          solicitante_id: string | null
          status: string | null
          tags: Json | null
          tipo: string | null
          titulo: string
          urgencia: string | null
        }
        Insert: {
          anexos?: Json | null
          atendente_id?: string | null
          ativos_envolvidos?: Json | null
          atualizado_em?: string | null
          atualizado_por?: string | null
          avaliacao_usuario?: number | null
          canal_origem?: string | null
          categoria_id?: string | null
          client_id?: string | null
          criado_em?: string | null
          criado_por?: string | null
          data_abertura?: string | null
          data_fechamento?: string | null
          data_limite_resolucao?: string | null
          data_limite_resposta?: string | null
          data_primeiro_contato?: string | null
          data_resolucao?: string | null
          descricao?: string | null
          grupo_responsavel_id?: string | null
          id?: string
          impacto?: string | null
          notas_internas?: string | null
          numero: string
          origem_id?: string | null
          prioridade?: string | null
          sla_id?: string | null
          solicitante_id?: string | null
          status?: string | null
          tags?: Json | null
          tipo?: string | null
          titulo: string
          urgencia?: string | null
        }
        Update: {
          anexos?: Json | null
          atendente_id?: string | null
          ativos_envolvidos?: Json | null
          atualizado_em?: string | null
          atualizado_por?: string | null
          avaliacao_usuario?: number | null
          canal_origem?: string | null
          categoria_id?: string | null
          client_id?: string | null
          criado_em?: string | null
          criado_por?: string | null
          data_abertura?: string | null
          data_fechamento?: string | null
          data_limite_resolucao?: string | null
          data_limite_resposta?: string | null
          data_primeiro_contato?: string | null
          data_resolucao?: string | null
          descricao?: string | null
          grupo_responsavel_id?: string | null
          id?: string
          impacto?: string | null
          notas_internas?: string | null
          numero?: string
          origem_id?: string | null
          prioridade?: string | null
          sla_id?: string | null
          solicitante_id?: string | null
          status?: string | null
          tags?: Json | null
          tipo?: string | null
          titulo?: string
          urgencia?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "solicitacoes_atendente_id_fkey"
            columns: ["atendente_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "solicitacoes_atualizado_por_fkey"
            columns: ["atualizado_por"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "solicitacoes_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "categorias_servico"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "solicitacoes_cliente_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "solicitacoes_criado_por_fkey"
            columns: ["criado_por"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "solicitacoes_grupo_responsavel_id_fkey"
            columns: ["grupo_responsavel_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "solicitacoes_origem_id_fkey"
            columns: ["origem_id"]
            isOneToOne: false
            referencedRelation: "solicitacoes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "solicitacoes_sla_id_fkey"
            columns: ["sla_id"]
            isOneToOne: false
            referencedRelation: "slas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "solicitacoes_solicitante_id_fkey"
            columns: ["solicitante_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      tickets: {
        Row: {
          assigned_to: string | null
          client_name: string | null
          created_at: string
          description: string | null
          id: string
          priority: Database["public"]["Enums"]["ticket_priority"]
          requester_id: string | null
          resolved_at: string | null
          sla_due_date: string | null
          status: Database["public"]["Enums"]["ticket_status"]
          ticket_number: string
          title: string
          type: Database["public"]["Enums"]["ticket_type"]
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          client_name?: string | null
          created_at?: string
          description?: string | null
          id?: string
          priority?: Database["public"]["Enums"]["ticket_priority"]
          requester_id?: string | null
          resolved_at?: string | null
          sla_due_date?: string | null
          status?: Database["public"]["Enums"]["ticket_status"]
          ticket_number: string
          title: string
          type?: Database["public"]["Enums"]["ticket_type"]
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          client_name?: string | null
          created_at?: string
          description?: string | null
          id?: string
          priority?: Database["public"]["Enums"]["ticket_priority"]
          requester_id?: string | null
          resolved_at?: string | null
          sla_due_date?: string | null
          status?: Database["public"]["Enums"]["ticket_status"]
          ticket_number?: string
          title?: string
          type?: Database["public"]["Enums"]["ticket_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tickets_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_groups: {
        Row: {
          created_at: string
          group_id: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          group_id: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          group_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_groups_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_groups_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          azure_id: string | null
          azure_tenant_id: string | null
          client_id: string | null
          created_at: string
          department: string | null
          email: string
          id: string
          name: string
          phone: string | null
          role: string
          status: string
          updated_at: string
        }
        Insert: {
          azure_id?: string | null
          azure_tenant_id?: string | null
          client_id?: string | null
          created_at?: string
          department?: string | null
          email: string
          id?: string
          name: string
          phone?: string | null
          role?: string
          status?: string
          updated_at?: string
        }
        Update: {
          azure_id?: string | null
          azure_tenant_id?: string | null
          client_id?: string | null
          created_at?: string
          department?: string | null
          email?: string
          id?: string
          name?: string
          phone?: string | null
          role?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      mudanca_stats: {
        Row: {
          mudancas_emergenciais: number | null
          mudancas_normais: number | null
          mudancas_padrao: number | null
          mudancas_rollback: number | null
          mudancas_sla_vencido: number | null
          mudancas_sucesso: number | null
          tempo_medio_aprovacao_horas: number | null
          total_mudancas: number | null
        }
        Relationships: []
      }
      problema_stats: {
        Row: {
          problemas_abertos: number | null
          problemas_alta_prioridade: number | null
          problemas_criticos: number | null
          problemas_em_andamento: number | null
          problemas_fechados: number | null
          problemas_pendentes: number | null
          problemas_resolvidos: number | null
          problemas_vencidos: number | null
          tempo_medio_resolucao_horas: number | null
          total_problemas: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_current_user_client_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_user_client_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_admin_or_client_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_admin_user: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_client_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_technician_admin_or_client_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_technician_or_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "client_admin" | "manager" | "technician" | "user"
      sla_tipo_aplicacao: "incidente" | "solicitacao" | "problema"
      ticket_priority: "low" | "medium" | "high" | "critical"
      ticket_status: "open" | "in_progress" | "pending" | "resolved" | "closed"
      ticket_type: "incident" | "request" | "problem" | "change"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "client_admin", "manager", "technician", "user"],
      sla_tipo_aplicacao: ["incidente", "solicitacao", "problema"],
      ticket_priority: ["low", "medium", "high", "critical"],
      ticket_status: ["open", "in_progress", "pending", "resolved", "closed"],
      ticket_type: ["incident", "request", "problem", "change"],
    },
  },
} as const
