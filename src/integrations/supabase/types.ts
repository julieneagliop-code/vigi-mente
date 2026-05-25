export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      acoes_plano_status: {
        Row: {
          acao_id: string
          created_at: string | null
          id: string
          is_exemplo: boolean | null
          observacao: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          acao_id: string
          created_at?: string | null
          id?: string
          is_exemplo?: boolean | null
          observacao?: string | null
          status: string
          updated_at?: string | null
        }
        Update: {
          acao_id?: string
          created_at?: string | null
          id?: string
          is_exemplo?: boolean | null
          observacao?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      analises_ia: {
        Row: {
          conteudo: string
          created_at: string
          dados_utilizados: Json | null
          id: string
          referencia: string
          tipo: string
        }
        Insert: {
          conteudo: string
          created_at?: string
          dados_utilizados?: Json | null
          id?: string
          referencia: string
          tipo: string
        }
        Update: {
          conteudo?: string
          created_at?: string
          dados_utilizados?: Json | null
          id?: string
          referencia?: string
          tipo?: string
        }
        Relationships: []
      }
      dados_cadunico: {
        Row: {
          acima_linha_pobreza: number | null
          beneficiarios_bolsa_familia: number | null
          beneficiarios_bpc: number | null
          cadastro_atualizado: number | null
          cadastro_desatualizado: number | null
          created_at: string
          extrema_pobreza: number | null
          familias_rurais: number | null
          familias_urbanas: number | null
          id: string
          is_exemplo: boolean | null
          mes_referencia: string
          pobreza: number | null
          total_familias: number | null
          updated_at: string
        }
        Insert: {
          acima_linha_pobreza?: number | null
          beneficiarios_bolsa_familia?: number | null
          beneficiarios_bpc?: number | null
          cadastro_atualizado?: number | null
          cadastro_desatualizado?: number | null
          created_at?: string
          extrema_pobreza?: number | null
          familias_rurais?: number | null
          familias_urbanas?: number | null
          id?: string
          is_exemplo?: boolean | null
          mes_referencia: string
          pobreza?: number | null
          total_familias?: number | null
          updated_at?: string
        }
        Update: {
          acima_linha_pobreza?: number | null
          beneficiarios_bolsa_familia?: number | null
          beneficiarios_bpc?: number | null
          cadastro_atualizado?: number | null
          cadastro_desatualizado?: number | null
          created_at?: string
          extrema_pobreza?: number | null
          familias_rurais?: number | null
          familias_urbanas?: number | null
          id?: string
          is_exemplo?: boolean | null
          mes_referencia?: string
          pobreza?: number | null
          total_familias?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      dados_importados_arquivos: {
        Row: {
          created_at: string
          dados_extraidos: Json
          equipamento_id: string | null
          id: string
          mes_referencia: string | null
          nome_arquivo: string
          status: string
          tipo_arquivo: string
          tipo_dados: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          dados_extraidos: Json
          equipamento_id?: string | null
          id?: string
          mes_referencia?: string | null
          nome_arquivo: string
          status?: string
          tipo_arquivo: string
          tipo_dados: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          dados_extraidos?: Json
          equipamento_id?: string | null
          id?: string
          mes_referencia?: string | null
          nome_arquivo?: string
          status?: string
          tipo_arquivo?: string
          tipo_dados?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      documentos_enviados: {
        Row: {
          ano_referencia: string | null
          arquivo_url: string | null
          created_at: string
          id: string
          nome_arquivo: string
          resumo_ia: string | null
          tipo: string
        }
        Insert: {
          ano_referencia?: string | null
          arquivo_url?: string | null
          created_at?: string
          id?: string
          nome_arquivo: string
          resumo_ia?: string | null
          tipo: string
        }
        Update: {
          ano_referencia?: string | null
          arquivo_url?: string | null
          created_at?: string
          id?: string
          nome_arquivo?: string
          resumo_ia?: string | null
          tipo?: string
        }
        Relationships: []
      }
      equipe_profissionais: {
        Row: {
          atualizado_por: string | null
          carga_horaria_semanal: number | null
          cargo_funcao: string
          created_at: string
          data_admissao: string | null
          data_desligamento: string | null
          equipamento_id: string
          formacao: string
          id: string
          nome_completo: string
          observacoes: string | null
          status: string
          updated_at: string
          vinculo: string
        }
        Insert: {
          atualizado_por?: string | null
          carga_horaria_semanal?: number | null
          cargo_funcao: string
          created_at?: string
          data_admissao?: string | null
          data_desligamento?: string | null
          equipamento_id: string
          formacao: string
          id?: string
          nome_completo: string
          observacoes?: string | null
          status?: string
          updated_at?: string
          vinculo: string
        }
        Update: {
          atualizado_por?: string | null
          carga_horaria_semanal?: number | null
          cargo_funcao?: string
          created_at?: string
          data_admissao?: string | null
          data_desligamento?: string | null
          equipamento_id?: string
          formacao?: string
          id?: string
          nome_completo?: string
          observacoes?: string | null
          status?: string
          updated_at?: string
          vinculo?: string
        }
        Relationships: []
      }
      execucao_financeira: {
        Row: {
          ano_referencia: string
          categoria: string
          created_at: string | null
          id: string
          is_exemplo: boolean | null
          updated_at: string | null
          valor_executado: number
          valor_previsto: number
        }
        Insert: {
          ano_referencia: string
          categoria: string
          created_at?: string | null
          id?: string
          is_exemplo?: boolean | null
          updated_at?: string | null
          valor_executado?: number
          valor_previsto?: number
        }
        Update: {
          ano_referencia?: string
          categoria?: string
          created_at?: string | null
          id?: string
          is_exemplo?: boolean | null
          updated_at?: string | null
          valor_executado?: number
          valor_previsto?: number
        }
        Relationships: []
      }
      historico_analises_ia: {
        Row: {
          created_at: string | null
          dados_utilizados: Json | null
          id: string
          pergunta_original: string
          resposta_ia: string
          tipo: string
          titulo: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          dados_utilizados?: Json | null
          id?: string
          pergunta_original: string
          resposta_ia: string
          tipo: string
          titulo: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          dados_utilizados?: Json | null
          id?: string
          pergunta_original?: string
          resposta_ia?: string
          tipo?: string
          titulo?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      ocorrencias: {
        Row: {
          created_at: string | null
          data_ocorrencia: string
          descricao: string
          equipamento_id: string
          gravidade: string
          id: string
          is_exemplo: boolean | null
          status: string
          tipo: string
          titulo: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          data_ocorrencia: string
          descricao: string
          equipamento_id: string
          gravidade: string
          id?: string
          is_exemplo?: boolean | null
          status?: string
          tipo: string
          titulo: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          data_ocorrencia?: string
          descricao?: string
          equipamento_id?: string
          gravidade?: string
          id?: string
          is_exemplo?: boolean | null
          status?: string
          tipo?: string
          titulo?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          cargo: string | null
          created_at: string
          display_name: string | null
          id: string
          tenant_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          cargo?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          tenant_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          cargo?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          tenant_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      registros_rapidos: {
        Row: {
          bairro: string | null
          created_at: string
          data_registro: string
          descricao: string
          equipamento_id: string
          familia_individuo: string | null
          id: string
          is_exemplo: boolean | null
          quantidade: number | null
          responsavel: string | null
          tipo: string
        }
        Insert: {
          bairro?: string | null
          created_at?: string
          data_registro?: string
          descricao: string
          equipamento_id: string
          familia_individuo?: string | null
          id?: string
          is_exemplo?: boolean | null
          quantidade?: number | null
          responsavel?: string | null
          tipo: string
        }
        Update: {
          bairro?: string | null
          created_at?: string
          data_registro?: string
          descricao?: string
          equipamento_id?: string
          familia_individuo?: string | null
          id?: string
          is_exemplo?: boolean | null
          quantidade?: number | null
          responsavel?: string | null
          tipo?: string
        }
        Relationships: []
      }
      tenants: {
        Row: {
          ativo: boolean | null
          cnpj: string | null
          created_at: string | null
          id: string
          municipio_ibge: string | null
          nome: string
          uf: string | null
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          cnpj?: string | null
          created_at?: string | null
          id?: string
          municipio_ibge?: string | null
          nome: string
          uf?: string | null
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          cnpj?: string | null
          created_at?: string | null
          id?: string
          municipio_ibge?: string | null
          nome?: string
          uf?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      unidades: {
        Row: {
          ativo: boolean | null
          created_at: string | null
          endereco: string | null
          id: string
          nome: string
          telefone: string | null
          tenant_id: string
          tipo: string
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string | null
          endereco?: string | null
          id?: string
          nome: string
          telefone?: string | null
          tenant_id: string
          tipo: string
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          created_at?: string | null
          endereco?: string | null
          id?: string
          nome?: string
          telefone?: string | null
          tenant_id?: string
          tipo?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "unidades_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      usuario_unidades: {
        Row: {
          unidade_id: string
          user_id: string
        }
        Insert: {
          unidade_id: string
          user_id: string
        }
        Update: {
          unidade_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_unidades_unidade_id_fkey"
            columns: ["unidade_id"]
            isOneToOne: false
            referencedRelation: "unidades"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      current_tenant_id: { Args: never; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      user_has_unidade: { Args: { unidade_uuid: string }; Returns: boolean }
    }
    Enums: {
      app_role:
        | "gestor"
        | "tecnico"
        | "coordenador"
        | "admin_sistema"
        | "visualizador"
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
      app_role: [
        "gestor",
        "tecnico",
        "coordenador",
        "admin_sistema",
        "visualizador",
      ],
    },
  },
} as const
