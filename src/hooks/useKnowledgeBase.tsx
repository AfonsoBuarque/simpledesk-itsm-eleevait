
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useUserData } from './useUserData';
import { toast } from '@/components/ui/use-toast';

export interface KBArticle {
  id: string;
  titulo: string;
  conteudo: string;
  categoria_id?: string;
  client_id?: string;
  tags?: string[];
  status: 'rascunho' | 'publicado' | 'arquivado';
  visibilidade: 'publico' | 'interno' | 'restrito';
  artigo_relacionado_ids?: string[];
  anexos?: any;
  criado_por?: string;
  criado_em: string;
  atualizado_em?: string;
  categoria?: KBCategory;
  cliente?: { name: string };
  autor?: string;
  views?: number;
  likes?: number;
}

export interface KBCategory {
  id: string;
  nome: string;
  descricao?: string;
  parent_id?: string;
  ordem: number;
  criado_em: string;
  atualizado_em?: string;
  children?: KBCategory[];
  article_count?: number;
}

export interface KBFeedback {
  id: string;
  artigo_id: string;
  usuario_id: string;
  avaliacao: 'positivo' | 'negativo';
  comentario?: string;
  data: string;
}

export const useKnowledgeBase = () => {
  const { profile, user } = useAuth();
  const { userData } = useUserData(user?.id);
  const [articles, setArticles] = useState<KBArticle[]>([]);
  const [categories, setCategories] = useState<KBCategory[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchArticles = async () => {
    try {
      const { data, error } = await supabase
        .from('kb_artigos')
        .select(`
          *,
          categoria:categoria_id(nome),
          autor:criado_por(name),
          cliente:client_id(name)
        `)
        .order('criado_em', { ascending: false });

      if (error) throw error;

      // Buscar estatísticas de visualizações e feedback
      const articlesWithStats = await Promise.all(
        (data || []).map(async (article) => {
          const [viewsResult, feedbackResult] = await Promise.all([
            supabase
              .from('kb_visualizacoes')
              .select('id')
              .eq('artigo_id', article.id),
            supabase
              .from('kb_feedback')
              .select('avaliacao')
              .eq('artigo_id', article.id)
              .eq('avaliacao', 'positivo')
          ]);

          return {
            ...article,
            views: viewsResult.data?.length || 0,
            likes: feedbackResult.data?.length || 0,
            categoria: article.categoria,
            autor: article.autor?.name || 'Desconhecido',
            tags: Array.isArray(article.tags) ? article.tags : []
          } as KBArticle;
        })
      );

      setArticles(articlesWithStats);
    } catch (error) {
      console.error('Erro ao buscar artigos:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar artigos da base de conhecimento.",
        variant: "destructive"
      });
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('kb_categorias')
        .select('*')
        .order('ordem', { ascending: true });

      if (error) throw error;

      // Buscar contagem de artigos por categoria
      const categoriesWithCount = await Promise.all(
        (data || []).map(async (category) => {
          const { data: articleCount } = await supabase
            .from('kb_artigos')
            .select('id')
            .eq('categoria_id', category.id)
            .eq('status', 'publicado');

          return {
            ...category,
            article_count: articleCount?.length || 0
          } as KBCategory;
        })
      );

      setCategories(categoriesWithCount);
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar categorias.",
        variant: "destructive"
      });
    }
  };

  const createArticle = async (articleData: Partial<KBArticle>) => {
    try {
      const insertData = {
        titulo: articleData.titulo!,
        conteudo: articleData.conteudo!,
        categoria_id: articleData.categoria_id && articleData.categoria_id !== '' ? articleData.categoria_id : null,
        client_id: userData?.client_id || null,
        tags: articleData.tags || [],
        status: articleData.status || 'rascunho',
        visibilidade: articleData.visibilidade || 'interno',
        artigo_relacionado_ids: articleData.artigo_relacionado_ids,
        anexos: articleData.anexos,
        criado_por: profile?.id
      };

      const { data, error } = await supabase
        .from('kb_artigos')
        .insert(insertData)
        .select()
        .single();

      if (error) throw error;

      await fetchArticles();
      toast({
        title: "Sucesso",
        description: "Artigo criado com sucesso."
      });

      return data;
    } catch (error) {
      console.error('Erro ao criar artigo:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar artigo.",
        variant: "destructive"
      });
      throw error;
    }
  };

  const updateArticle = async (id: string, articleData: Partial<KBArticle>) => {
    try {
      const updateData = {
        ...(articleData.titulo && { titulo: articleData.titulo }),
        ...(articleData.conteudo && { conteudo: articleData.conteudo }),
        ...(articleData.categoria_id !== undefined && { categoria_id: articleData.categoria_id }),
        ...(articleData.tags && { tags: articleData.tags }),
        ...(articleData.status && { status: articleData.status }),
        ...(articleData.visibilidade && { visibilidade: articleData.visibilidade }),
        ...(articleData.artigo_relacionado_ids && { artigo_relacionado_ids: articleData.artigo_relacionado_ids }),
        ...(articleData.anexos && { anexos: articleData.anexos })
      };

      const { error } = await supabase
        .from('kb_artigos')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      await fetchArticles();
      toast({
        title: "Sucesso",
        description: "Artigo atualizado com sucesso."
      });
    } catch (error) {
      console.error('Erro ao atualizar artigo:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar artigo.",
        variant: "destructive"
      });
      throw error;
    }
  };

  const deleteArticle = async (id: string) => {
    try {
      const { error } = await supabase
        .from('kb_artigos')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchArticles();
      toast({
        title: "Sucesso",
        description: "Artigo excluído com sucesso."
      });
    } catch (error) {
      console.error('Erro ao excluir artigo:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir artigo.",
        variant: "destructive"
      });
      throw error;
    }
  };

  const createCategory = async (categoryData: { nome: string; descricao?: string; parent_id?: string; ordem?: number }) => {
    try {
      const insertData = {
        nome: categoryData.nome,
        descricao: categoryData.descricao,
        parent_id: categoryData.parent_id,
        ordem: categoryData.ordem || 0
      };

      const { data, error } = await supabase
        .from('kb_categorias')
        .insert(insertData)
        .select()
        .single();

      if (error) throw error;

      await fetchCategories();
      toast({
        title: "Sucesso",
        description: "Categoria criada com sucesso."
      });

      return data;
    } catch (error) {
      console.error('Erro ao criar categoria:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar categoria.",
        variant: "destructive"
      });
      throw error;
    }
  };

  const recordView = async (articleId: string) => {
    if (!profile?.id) return;

    try {
      await supabase
        .from('kb_visualizacoes')
        .insert({
          artigo_id: articleId,
          usuario_id: profile.id
        });
    } catch (error) {
      console.error('Erro ao registrar visualização:', error);
    }
  };

  const submitFeedback = async (articleId: string, avaliacao: 'positivo' | 'negativo', comentario?: string) => {
    if (!profile?.id) return;

    try {
      await supabase
        .from('kb_feedback')
        .insert({
          artigo_id: articleId,
          usuario_id: profile.id,
          avaliacao,
          comentario
        });

      toast({
        title: "Sucesso",
        description: "Feedback enviado com sucesso."
      });
    } catch (error) {
      console.error('Erro ao enviar feedback:', error);
      toast({
        title: "Erro",
        description: "Erro ao enviar feedback.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchArticles(), fetchCategories()]);
      setLoading(false);
    };

    fetchData();
  }, []);

  return {
    articles,
    categories,
    loading,
    createArticle,
    updateArticle,
    deleteArticle,
    createCategory,
    recordView,
    submitFeedback,
    refetch: () => Promise.all([fetchArticles(), fetchCategories()])
  };
};
