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
          mes_referencia?: string
          pobreza?: number | null
          total_familias?: number | null
          updated_at?: string
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
      profiles: {
        Row: {
          avatar_url: string | null
          cargo: string | null
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          cargo?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          cargo?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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
          quantidade?: number | null
          responsavel?: string | null
          tipo?: string
        }
        Relationships: []
      }
      rma_cras: {
        Row: {
          atendimentos_individualizados: number | null
          beneficio_funeral: number | null
          beneficio_natalidade: number | null
          beneficio_vulnerabilidade: number | null
          busca_ativa: boolean | null
          busca_ativa_quantidade: number | null
          created_at: string
          descumprimento_condicionalidades: number | null
          encaminhamentos: number | null
          equipamento_id: string
          familias_acompanhamento_paif: number | null
          familias_grupos_paif: number | null
          id: string
          mes_referencia: string
          novas_familias_paif: number | null
          observacoes: string | null
          scfv_criancas: number | null
          scfv_idosos: number | null
          updated_at: string
          visitas_domiciliares: number | null
        }
        Insert: {
          atendimentos_individualizados?: number | null
          beneficio_funeral?: number | null
          beneficio_natalidade?: number | null
          beneficio_vulnerabilidade?: number | null
          busca_ativa?: boolean | null
          busca_ativa_quantidade?: number | null
          created_at?: string
          descumprimento_condicionalidades?: number | null
          encaminhamentos?: number | null
          equipamento_id: string
          familias_acompanhamento_paif?: number | null
          familias_grupos_paif?: number | null
          id?: string
          mes_referencia: string
          novas_familias_paif?: number | null
          observacoes?: string | null
          scfv_criancas?: number | null
          scfv_idosos?: number | null
          updated_at?: string
          visitas_domiciliares?: number | null
        }
        Update: {
          atendimentos_individualizados?: number | null
          beneficio_funeral?: number | null
          beneficio_natalidade?: number | null
          beneficio_vulnerabilidade?: number | null
          busca_ativa?: boolean | null
          busca_ativa_quantidade?: number | null
          created_at?: string
          descumprimento_condicionalidades?: number | null
          encaminhamentos?: number | null
          equipamento_id?: string
          familias_acompanhamento_paif?: number | null
          familias_grupos_paif?: number | null
          id?: string
          mes_referencia?: string
          novas_familias_paif?: number | null
          observacoes?: string | null
          scfv_criancas?: number | null
          scfv_idosos?: number | null
          updated_at?: string
          visitas_domiciliares?: number | null
        }
        Relationships: []
      }
      rma_creas: {
        Row: {
          abuso_sexual: number | null
          adolescentes_mse_la: number | null
          adolescentes_mse_psc: number | null
          atendimentos_individualizados: number | null
          created_at: string
          encaminhamentos: number | null
          equipamento_id: string
          exploracao_sexual: number | null
          familias_acompanhamento_paefi: number | null
          id: string
          mes_referencia: string
          negligencia_abandono: number | null
          novas_familias_paefi: number | null
          observacoes: string | null
          outras_violacoes: number | null
          pessoas_abordagem_social: number | null
          trabalho_infantil: number | null
          updated_at: string
          violencia_fisica: number | null
          violencia_psicologica: number | null
          vitimas_adolescentes: number | null
          vitimas_adultos: number | null
          vitimas_criancas: number | null
          vitimas_idosos: number | null
        }
        Insert: {
          abuso_sexual?: number | null
          adolescentes_mse_la?: number | null
          adolescentes_mse_psc?: number | null
          atendimentos_individualizados?: number | null
          created_at?: string
          encaminhamentos?: number | null
          equipamento_id: string
          exploracao_sexual?: number | null
          familias_acompanhamento_paefi?: number | null
          id?: string
          mes_referencia: string
          negligencia_abandono?: number | null
          novas_familias_paefi?: number | null
          observacoes?: string | null
          outras_violacoes?: number | null
          pessoas_abordagem_social?: number | null
          trabalho_infantil?: number | null
          updated_at?: string
          violencia_fisica?: number | null
          violencia_psicologica?: number | null
          vitimas_adolescentes?: number | null
          vitimas_adultos?: number | null
          vitimas_criancas?: number | null
          vitimas_idosos?: number | null
        }
        Update: {
          abuso_sexual?: number | null
          adolescentes_mse_la?: number | null
          adolescentes_mse_psc?: number | null
          atendimentos_individualizados?: number | null
          created_at?: string
          encaminhamentos?: number | null
          equipamento_id?: string
          exploracao_sexual?: number | null
          familias_acompanhamento_paefi?: number | null
          id?: string
          mes_referencia?: string
          negligencia_abandono?: number | null
          novas_familias_paefi?: number | null
          observacoes?: string | null
          outras_violacoes?: number | null
          pessoas_abordagem_social?: number | null
          trabalho_infantil?: number | null
          updated_at?: string
          violencia_fisica?: number | null
          violencia_psicologica?: number | null
          vitimas_adolescentes?: number | null
          vitimas_adultos?: number | null
          vitimas_criancas?: number | null
          vitimas_idosos?: number | null
        }
        Relationships: []
      }
      rma_rede_indireta: {
        Row: {
          atividades_realizadas: number | null
          created_at: string
          desligamentos: number | null
          encaminhamentos_realizados: number | null
          encaminhamentos_recebidos: number | null
          equipamento_id: string
          id: string
          lista_espera: number | null
          mes_referencia: string
          novas_insercoes: number | null
          observacoes: string | null
          total_atendidos: number | null
          updated_at: string
        }
        Insert: {
          atividades_realizadas?: number | null
          created_at?: string
          desligamentos?: number | null
          encaminhamentos_realizados?: number | null
          encaminhamentos_recebidos?: number | null
          equipamento_id: string
          id?: string
          lista_espera?: number | null
          mes_referencia: string
          novas_insercoes?: number | null
          observacoes?: string | null
          total_atendidos?: number | null
          updated_at?: string
        }
        Update: {
          atividades_realizadas?: number | null
          created_at?: string
          desligamentos?: number | null
          encaminhamentos_realizados?: number | null
          encaminhamentos_recebidos?: number | null
          equipamento_id?: string
          id?: string
          lista_espera?: number | null
          mes_referencia?: string
          novas_insercoes?: number | null
          observacoes?: string | null
          total_atendidos?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          equipamentos_vinculados: string[] | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          equipamentos_vinculados?: string[] | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          equipamentos_vinculados?: string[] | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "gestor" | "tecnico" | "coordenador"
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
      app_role: ["gestor", "tecnico", "coordenador"],
    },
  },
} as const
