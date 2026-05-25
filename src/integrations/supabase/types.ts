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
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          acao_id: string
          created_at?: string | null
          id?: string
          is_exemplo?: boolean | null
          observacao?: string | null
          status: string
          tenant_id?: string
          updated_at?: string | null
        }
        Update: {
          acao_id?: string
          created_at?: string | null
          id?: string
          is_exemplo?: boolean | null
          observacao?: string | null
          status?: string
          tenant_id?: string
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
          tenant_id: string
          tipo: string
        }
        Insert: {
          conteudo: string
          created_at?: string
          dados_utilizados?: Json | null
          id?: string
          referencia: string
          tenant_id?: string
          tipo: string
        }
        Update: {
          conteudo?: string
          created_at?: string
          dados_utilizados?: Json | null
          id?: string
          referencia?: string
          tenant_id?: string
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
          tenant_id: string
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
          tenant_id?: string
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
          tenant_id?: string
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
          tenant_id: string
          tipo: string
        }
        Insert: {
          ano_referencia?: string | null
          arquivo_url?: string | null
          created_at?: string
          id?: string
          nome_arquivo: string
          resumo_ia?: string | null
          tenant_id?: string
          tipo: string
        }
        Update: {
          ano_referencia?: string | null
          arquivo_url?: string | null
          created_at?: string
          id?: string
          nome_arquivo?: string
          resumo_ia?: string | null
          tenant_id?: string
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
          tenant_id: string
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
          tenant_id?: string
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
          tenant_id?: string
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
          tenant_id: string
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
          tenant_id?: string
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
          tenant_id?: string
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
          tenant_id: string
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
          tenant_id?: string
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
          tenant_id?: string
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
          tenant_id: string
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
          tenant_id?: string
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
          tenant_id?: string
          tipo?: string
        }
        Relationships: []
      }
      rma_cras: {
        Row: {
          a1_total_familias_paif: number
          a2_novas_familias_paif: number
          arquivo_url: string | null
          b1_extrema_pobreza: number
          b2_bolsa_familia: number
          b3_bolsa_familia_descumprimento: number
          b4_membros_bpc: number
          b5_trabalho_infantil: number
          b6_acolhimento: number
          c1_atendimentos_particularizados: number
          c2_encaminhados_cadunico_inclusao: number
          c3_encaminhados_cadunico_atualizacao: number
          c4_encaminhados_bpc: number
          c5_encaminhados_creas: number
          c6_visitas_domiciliares: number
          c7_auxilio_natalidade: number
          c8_auxilio_funeral: number
          c9_outros_beneficios_eventuais: number
          competencia: string
          created_at: string
          criado_por: string | null
          d1_familias_paif_grupos: number
          d2_scfv_0_6: number
          d3_scfv_7_14: number
          d4_scfv_15_17: number
          d5_scfv_idosos: number
          d6_palestras_oficinas: number
          d7_scfv_pcd: number
          d8_scfv_18_59: number
          id: string
          observacoes: string | null
          origem: Database["public"]["Enums"]["origem_dado"]
          tenant_id: string
          unidade_id: string
          updated_at: string
          versao: number
          vigente: boolean
        }
        Insert: {
          a1_total_familias_paif?: number
          a2_novas_familias_paif?: number
          arquivo_url?: string | null
          b1_extrema_pobreza?: number
          b2_bolsa_familia?: number
          b3_bolsa_familia_descumprimento?: number
          b4_membros_bpc?: number
          b5_trabalho_infantil?: number
          b6_acolhimento?: number
          c1_atendimentos_particularizados?: number
          c2_encaminhados_cadunico_inclusao?: number
          c3_encaminhados_cadunico_atualizacao?: number
          c4_encaminhados_bpc?: number
          c5_encaminhados_creas?: number
          c6_visitas_domiciliares?: number
          c7_auxilio_natalidade?: number
          c8_auxilio_funeral?: number
          c9_outros_beneficios_eventuais?: number
          competencia: string
          created_at?: string
          criado_por?: string | null
          d1_familias_paif_grupos?: number
          d2_scfv_0_6?: number
          d3_scfv_7_14?: number
          d4_scfv_15_17?: number
          d5_scfv_idosos?: number
          d6_palestras_oficinas?: number
          d7_scfv_pcd?: number
          d8_scfv_18_59?: number
          id?: string
          observacoes?: string | null
          origem?: Database["public"]["Enums"]["origem_dado"]
          tenant_id: string
          unidade_id: string
          updated_at?: string
          versao?: number
          vigente?: boolean
        }
        Update: {
          a1_total_familias_paif?: number
          a2_novas_familias_paif?: number
          arquivo_url?: string | null
          b1_extrema_pobreza?: number
          b2_bolsa_familia?: number
          b3_bolsa_familia_descumprimento?: number
          b4_membros_bpc?: number
          b5_trabalho_infantil?: number
          b6_acolhimento?: number
          c1_atendimentos_particularizados?: number
          c2_encaminhados_cadunico_inclusao?: number
          c3_encaminhados_cadunico_atualizacao?: number
          c4_encaminhados_bpc?: number
          c5_encaminhados_creas?: number
          c6_visitas_domiciliares?: number
          c7_auxilio_natalidade?: number
          c8_auxilio_funeral?: number
          c9_outros_beneficios_eventuais?: number
          competencia?: string
          created_at?: string
          criado_por?: string | null
          d1_familias_paif_grupos?: number
          d2_scfv_0_6?: number
          d3_scfv_7_14?: number
          d4_scfv_15_17?: number
          d5_scfv_idosos?: number
          d6_palestras_oficinas?: number
          d7_scfv_pcd?: number
          d8_scfv_18_59?: number
          id?: string
          observacoes?: string | null
          origem?: Database["public"]["Enums"]["origem_dado"]
          tenant_id?: string
          unidade_id?: string
          updated_at?: string
          versao?: number
          vigente?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "rma_cras_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rma_cras_unidade_id_fkey"
            columns: ["unidade_id"]
            isOneToOne: false
            referencedRelation: "unidades"
            referencedColumns: ["id"]
          },
        ]
      }
      rma_creas: {
        Row: {
          a1_total_casos_paefi: number
          a2_novos_casos_paefi: number
          abordagem_oferta: boolean
          arquivo_url: string | null
          b1_bolsa_familia: number
          b2_membros_bpc: number
          b3_trabalho_infantil: number
          b4_acolhimento: number
          b5_substancias_psicoativas: number
          b6_fem_0_12: number
          b6_fem_13_17: number
          b6_fem_18_59: number
          b6_fem_60_mais: number
          b6_masc_0_12: number
          b6_masc_13_17: number
          b6_masc_18_59: number
          b6_masc_60_mais: number
          b6_total_vitimados: number
          b7_mse_meio_aberto: number
          c1_fem_0_6: number
          c1_fem_13_17: number
          c1_fem_7_12: number
          c1_masc_0_6: number
          c1_masc_13_17: number
          c1_masc_7_12: number
          c1_total: number
          c2_fem_0_6: number
          c2_fem_13_17: number
          c2_fem_7_12: number
          c2_masc_0_6: number
          c2_masc_13_17: number
          c2_masc_7_12: number
          c2_total: number
          c3_fem_0_6: number
          c3_fem_13_17: number
          c3_fem_7_12: number
          c3_masc_0_6: number
          c3_masc_13_17: number
          c3_masc_7_12: number
          c3_total: number
          c4_fem_0_6: number
          c4_fem_13_17: number
          c4_fem_7_12: number
          c4_masc_0_6: number
          c4_masc_13_17: number
          c4_masc_7_12: number
          c4_total: number
          c5_fem_0_12: number
          c5_fem_13_17: number
          c5_masc_0_12: number
          c5_masc_13_17: number
          c5_total: number
          competencia: string
          created_at: string
          criado_por: string | null
          d1_fem: number
          d1_masc: number
          d1_total: number
          d2_fem: number
          d2_masc: number
          d2_total: number
          e1_fem_0_12: number
          e1_fem_13_17: number
          e1_fem_18_59: number
          e1_fem_60_mais: number
          e1_masc_0_12: number
          e1_masc_13_17: number
          e1_masc_18_59: number
          e1_masc_60_mais: number
          e1_total: number
          e2_fem_0_12: number
          e2_fem_13_17: number
          e2_fem_18_59: number
          e2_fem_60_mais: number
          e2_masc_0_12: number
          e2_masc_13_17: number
          e2_masc_18_59: number
          e2_masc_60_mais: number
          e2_total: number
          f1_mulheres_adultas: number
          g1_fem_0_12: number
          g1_fem_13_17: number
          g1_fem_18_59: number
          g1_fem_60_mais: number
          g1_masc_0_12: number
          g1_masc_13_17: number
          g1_masc_18_59: number
          g1_masc_60_mais: number
          g1_total: number
          h1_discriminacao_orientacao: number
          i1_fem_0_12: number
          i1_fem_13_17: number
          i1_fem_18_59: number
          i1_fem_60_mais: number
          i1_masc_0_12: number
          i1_masc_13_17: number
          i1_masc_18_59: number
          i1_masc_60_mais: number
          i1_total: number
          id: string
          j1_total_mse: number
          j2_total_la: number
          j3_total_psc: number
          j4_fem: number
          j4_masc: number
          j4_total: number
          j5_fem: number
          j5_masc: number
          j5_total: number
          j6_fem: number
          j6_masc: number
          j6_total: number
          k1_fem_0_12: number
          k1_fem_13_17: number
          k1_fem_18_59: number
          k1_fem_60_mais: number
          k1_masc_0_12: number
          k1_masc_13_17: number
          k1_masc_18_59: number
          k1_masc_60_mais: number
          k1_total: number
          k2_trabalho_infantil: number
          k3_exploracao_sexual: number
          k4_drogas_criancas: number
          k5_drogas_adultos: number
          k6_migrantes: number
          l1_total_abordagens: number
          m1_atendimentos_individualizados: number
          m2_atendimentos_grupo: number
          m3_encaminhadas_cras: number
          m4_visitas_domiciliares: number
          mse_oferta: boolean
          observacoes: string | null
          origem: Database["public"]["Enums"]["origem_dado"]
          tenant_id: string
          unidade_id: string
          updated_at: string
          versao: number
          vigente: boolean
        }
        Insert: {
          a1_total_casos_paefi?: number
          a2_novos_casos_paefi?: number
          abordagem_oferta?: boolean
          arquivo_url?: string | null
          b1_bolsa_familia?: number
          b2_membros_bpc?: number
          b3_trabalho_infantil?: number
          b4_acolhimento?: number
          b5_substancias_psicoativas?: number
          b6_fem_0_12?: number
          b6_fem_13_17?: number
          b6_fem_18_59?: number
          b6_fem_60_mais?: number
          b6_masc_0_12?: number
          b6_masc_13_17?: number
          b6_masc_18_59?: number
          b6_masc_60_mais?: number
          b6_total_vitimados?: number
          b7_mse_meio_aberto?: number
          c1_fem_0_6?: number
          c1_fem_13_17?: number
          c1_fem_7_12?: number
          c1_masc_0_6?: number
          c1_masc_13_17?: number
          c1_masc_7_12?: number
          c1_total?: number
          c2_fem_0_6?: number
          c2_fem_13_17?: number
          c2_fem_7_12?: number
          c2_masc_0_6?: number
          c2_masc_13_17?: number
          c2_masc_7_12?: number
          c2_total?: number
          c3_fem_0_6?: number
          c3_fem_13_17?: number
          c3_fem_7_12?: number
          c3_masc_0_6?: number
          c3_masc_13_17?: number
          c3_masc_7_12?: number
          c3_total?: number
          c4_fem_0_6?: number
          c4_fem_13_17?: number
          c4_fem_7_12?: number
          c4_masc_0_6?: number
          c4_masc_13_17?: number
          c4_masc_7_12?: number
          c4_total?: number
          c5_fem_0_12?: number
          c5_fem_13_17?: number
          c5_masc_0_12?: number
          c5_masc_13_17?: number
          c5_total?: number
          competencia: string
          created_at?: string
          criado_por?: string | null
          d1_fem?: number
          d1_masc?: number
          d1_total?: number
          d2_fem?: number
          d2_masc?: number
          d2_total?: number
          e1_fem_0_12?: number
          e1_fem_13_17?: number
          e1_fem_18_59?: number
          e1_fem_60_mais?: number
          e1_masc_0_12?: number
          e1_masc_13_17?: number
          e1_masc_18_59?: number
          e1_masc_60_mais?: number
          e1_total?: number
          e2_fem_0_12?: number
          e2_fem_13_17?: number
          e2_fem_18_59?: number
          e2_fem_60_mais?: number
          e2_masc_0_12?: number
          e2_masc_13_17?: number
          e2_masc_18_59?: number
          e2_masc_60_mais?: number
          e2_total?: number
          f1_mulheres_adultas?: number
          g1_fem_0_12?: number
          g1_fem_13_17?: number
          g1_fem_18_59?: number
          g1_fem_60_mais?: number
          g1_masc_0_12?: number
          g1_masc_13_17?: number
          g1_masc_18_59?: number
          g1_masc_60_mais?: number
          g1_total?: number
          h1_discriminacao_orientacao?: number
          i1_fem_0_12?: number
          i1_fem_13_17?: number
          i1_fem_18_59?: number
          i1_fem_60_mais?: number
          i1_masc_0_12?: number
          i1_masc_13_17?: number
          i1_masc_18_59?: number
          i1_masc_60_mais?: number
          i1_total?: number
          id?: string
          j1_total_mse?: number
          j2_total_la?: number
          j3_total_psc?: number
          j4_fem?: number
          j4_masc?: number
          j4_total?: number
          j5_fem?: number
          j5_masc?: number
          j5_total?: number
          j6_fem?: number
          j6_masc?: number
          j6_total?: number
          k1_fem_0_12?: number
          k1_fem_13_17?: number
          k1_fem_18_59?: number
          k1_fem_60_mais?: number
          k1_masc_0_12?: number
          k1_masc_13_17?: number
          k1_masc_18_59?: number
          k1_masc_60_mais?: number
          k1_total?: number
          k2_trabalho_infantil?: number
          k3_exploracao_sexual?: number
          k4_drogas_criancas?: number
          k5_drogas_adultos?: number
          k6_migrantes?: number
          l1_total_abordagens?: number
          m1_atendimentos_individualizados?: number
          m2_atendimentos_grupo?: number
          m3_encaminhadas_cras?: number
          m4_visitas_domiciliares?: number
          mse_oferta?: boolean
          observacoes?: string | null
          origem?: Database["public"]["Enums"]["origem_dado"]
          tenant_id: string
          unidade_id: string
          updated_at?: string
          versao?: number
          vigente?: boolean
        }
        Update: {
          a1_total_casos_paefi?: number
          a2_novos_casos_paefi?: number
          abordagem_oferta?: boolean
          arquivo_url?: string | null
          b1_bolsa_familia?: number
          b2_membros_bpc?: number
          b3_trabalho_infantil?: number
          b4_acolhimento?: number
          b5_substancias_psicoativas?: number
          b6_fem_0_12?: number
          b6_fem_13_17?: number
          b6_fem_18_59?: number
          b6_fem_60_mais?: number
          b6_masc_0_12?: number
          b6_masc_13_17?: number
          b6_masc_18_59?: number
          b6_masc_60_mais?: number
          b6_total_vitimados?: number
          b7_mse_meio_aberto?: number
          c1_fem_0_6?: number
          c1_fem_13_17?: number
          c1_fem_7_12?: number
          c1_masc_0_6?: number
          c1_masc_13_17?: number
          c1_masc_7_12?: number
          c1_total?: number
          c2_fem_0_6?: number
          c2_fem_13_17?: number
          c2_fem_7_12?: number
          c2_masc_0_6?: number
          c2_masc_13_17?: number
          c2_masc_7_12?: number
          c2_total?: number
          c3_fem_0_6?: number
          c3_fem_13_17?: number
          c3_fem_7_12?: number
          c3_masc_0_6?: number
          c3_masc_13_17?: number
          c3_masc_7_12?: number
          c3_total?: number
          c4_fem_0_6?: number
          c4_fem_13_17?: number
          c4_fem_7_12?: number
          c4_masc_0_6?: number
          c4_masc_13_17?: number
          c4_masc_7_12?: number
          c4_total?: number
          c5_fem_0_12?: number
          c5_fem_13_17?: number
          c5_masc_0_12?: number
          c5_masc_13_17?: number
          c5_total?: number
          competencia?: string
          created_at?: string
          criado_por?: string | null
          d1_fem?: number
          d1_masc?: number
          d1_total?: number
          d2_fem?: number
          d2_masc?: number
          d2_total?: number
          e1_fem_0_12?: number
          e1_fem_13_17?: number
          e1_fem_18_59?: number
          e1_fem_60_mais?: number
          e1_masc_0_12?: number
          e1_masc_13_17?: number
          e1_masc_18_59?: number
          e1_masc_60_mais?: number
          e1_total?: number
          e2_fem_0_12?: number
          e2_fem_13_17?: number
          e2_fem_18_59?: number
          e2_fem_60_mais?: number
          e2_masc_0_12?: number
          e2_masc_13_17?: number
          e2_masc_18_59?: number
          e2_masc_60_mais?: number
          e2_total?: number
          f1_mulheres_adultas?: number
          g1_fem_0_12?: number
          g1_fem_13_17?: number
          g1_fem_18_59?: number
          g1_fem_60_mais?: number
          g1_masc_0_12?: number
          g1_masc_13_17?: number
          g1_masc_18_59?: number
          g1_masc_60_mais?: number
          g1_total?: number
          h1_discriminacao_orientacao?: number
          i1_fem_0_12?: number
          i1_fem_13_17?: number
          i1_fem_18_59?: number
          i1_fem_60_mais?: number
          i1_masc_0_12?: number
          i1_masc_13_17?: number
          i1_masc_18_59?: number
          i1_masc_60_mais?: number
          i1_total?: number
          id?: string
          j1_total_mse?: number
          j2_total_la?: number
          j3_total_psc?: number
          j4_fem?: number
          j4_masc?: number
          j4_total?: number
          j5_fem?: number
          j5_masc?: number
          j5_total?: number
          j6_fem?: number
          j6_masc?: number
          j6_total?: number
          k1_fem_0_12?: number
          k1_fem_13_17?: number
          k1_fem_18_59?: number
          k1_fem_60_mais?: number
          k1_masc_0_12?: number
          k1_masc_13_17?: number
          k1_masc_18_59?: number
          k1_masc_60_mais?: number
          k1_total?: number
          k2_trabalho_infantil?: number
          k3_exploracao_sexual?: number
          k4_drogas_criancas?: number
          k5_drogas_adultos?: number
          k6_migrantes?: number
          l1_total_abordagens?: number
          m1_atendimentos_individualizados?: number
          m2_atendimentos_grupo?: number
          m3_encaminhadas_cras?: number
          m4_visitas_domiciliares?: number
          mse_oferta?: boolean
          observacoes?: string | null
          origem?: Database["public"]["Enums"]["origem_dado"]
          tenant_id?: string
          unidade_id?: string
          updated_at?: string
          versao?: number
          vigente?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "rma_creas_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rma_creas_unidade_id_fkey"
            columns: ["unidade_id"]
            isOneToOne: false
            referencedRelation: "unidades"
            referencedColumns: ["id"]
          },
        ]
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
      unidade_indicadores_mensais: {
        Row: {
          atendimentos_realizados: number | null
          capacidade_descricao_mes: string | null
          capacidade_nominal: number | null
          competencia: string
          created_at: string
          criado_por: string | null
          id: string
          observacoes: string | null
          tenant_id: string
          unidade_id: string
          updated_at: string
        }
        Insert: {
          atendimentos_realizados?: number | null
          capacidade_descricao_mes?: string | null
          capacidade_nominal?: number | null
          competencia: string
          created_at?: string
          criado_por?: string | null
          id?: string
          observacoes?: string | null
          tenant_id: string
          unidade_id: string
          updated_at?: string
        }
        Update: {
          atendimentos_realizados?: number | null
          capacidade_descricao_mes?: string | null
          capacidade_nominal?: number | null
          competencia?: string
          created_at?: string
          criado_por?: string | null
          id?: string
          observacoes?: string | null
          tenant_id?: string
          unidade_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "unidade_indicadores_mensais_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "unidade_indicadores_mensais_unidade_id_fkey"
            columns: ["unidade_id"]
            isOneToOne: false
            referencedRelation: "unidades"
            referencedColumns: ["id"]
          },
        ]
      }
      unidades: {
        Row: {
          ativo: boolean | null
          capacidade_descricao: string | null
          codigo_cadsuas: string | null
          complexidade: Database["public"]["Enums"]["complexidade_tipo"] | null
          created_at: string | null
          endereco: string | null
          equipe_total_profissionais: number
          id: string
          nome: string
          publico_atendido: string | null
          rede: Database["public"]["Enums"]["rede_tipo"] | null
          servicos: string[]
          telefone: string | null
          tenant_id: string
          tipo: string
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          capacidade_descricao?: string | null
          codigo_cadsuas?: string | null
          complexidade?: Database["public"]["Enums"]["complexidade_tipo"] | null
          created_at?: string | null
          endereco?: string | null
          equipe_total_profissionais?: number
          id?: string
          nome: string
          publico_atendido?: string | null
          rede?: Database["public"]["Enums"]["rede_tipo"] | null
          servicos?: string[]
          telefone?: string | null
          tenant_id: string
          tipo: string
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          capacidade_descricao?: string | null
          codigo_cadsuas?: string | null
          complexidade?: Database["public"]["Enums"]["complexidade_tipo"] | null
          created_at?: string | null
          endereco?: string | null
          equipe_total_profissionais?: number
          id?: string
          nome?: string
          publico_atendido?: string | null
          rede?: Database["public"]["Enums"]["rede_tipo"] | null
          servicos?: string[]
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
      has_any_role: { Args: never; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin_sistema: { Args: never; Returns: boolean }
      is_gestor_or_above: { Args: never; Returns: boolean }
      user_can_edit_unidade: {
        Args: { unidade_uuid: string }
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
      complexidade_tipo: "basica" | "media" | "alta"
      origem_dado: "manual" | "importacao_pdf" | "importacao_csv"
      rede_tipo: "direta" | "indireta"
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
      complexidade_tipo: ["basica", "media", "alta"],
      origem_dado: ["manual", "importacao_pdf", "importacao_csv"],
      rede_tipo: ["direta", "indireta"],
    },
  },
} as const
