import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, BookOpen, Clock, Eye, ExternalLink, FileText, HelpCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface KnowledgeArticle {
  id: string;
  titulo: string;
  conteudo: string;
  categoria: string;
  tags?: string[];
  criado_em: string;
  atualizado_em: string;
  visualizacoes?: number;
}

export const KnowledgeBaseSearch: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<KnowledgeArticle | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 3;

  // Buscar artigos da base de conhecimento
  const { data: articles, isLoading, error } = useQuery({
    queryKey: ['knowledge-base-articles', user?.id, searchTerm],
    queryFn: async () => {
      if (!user?.id) return [];

      try {
        let query = supabase
          .from('kb_artigos')
          .select(`
            *,
            categoria:categoria_id(nome)
          `)
          .eq('status', 'publicado')
          .order('criado_em', { ascending: false });

        if (searchTerm.trim()) {
          query = query.or(`titulo.ilike.%${searchTerm}%,conteudo.ilike.%${searchTerm}%`);
        }

        const { data, error } = await query;

        if (error) {
          console.error('Error fetching knowledge base articles:', error);
          throw error;
        }

        // Buscar estatísticas de visualizações para cada artigo
        const articlesWithStats = await Promise.all(
          (data || []).map(async (article) => {
            const { data: viewsData } = await supabase
              .from('kb_visualizacoes')
              .select('id')
              .eq('artigo_id', article.id);

            return {
              id: article.id,
              titulo: article.titulo || 'Sem título',
              conteudo: article.conteudo || 'Sem conteúdo',
              categoria: article.categoria?.nome || 'Geral',
              tags: Array.isArray(article.tags) ? article.tags.filter((tag): tag is string => typeof tag === 'string') : [],
              criado_em: article.criado_em,
              atualizado_em: article.atualizado_em || article.criado_em,
              visualizacoes: viewsData?.length || 0
            };
          })
        );

        return articlesWithStats;
      } catch (err) {
        console.error('Erro ao buscar artigos:', err);
        return [];
      }
    },
    enabled: !!user?.id,
  });

  // Filtrar artigos baseado no termo de busca (se não filtrado no servidor)
  const filteredArticles = useMemo(() => {
    if (!articles) return [];
    
    if (!searchTerm.trim()) return articles;
    
    const searchLower = searchTerm.toLowerCase();
    return articles.filter(article => 
      article.titulo.toLowerCase().includes(searchLower) ||
      article.conteudo.toLowerCase().includes(searchLower) ||
      article.categoria.toLowerCase().includes(searchLower) ||
      article.tags?.some(tag => typeof tag === 'string' && tag.toLowerCase().includes(searchLower))
    );
  }, [articles, searchTerm]);

  // Calcular paginação
  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
  const startIndex = (currentPage - 1) * articlesPerPage;
  const endIndex = startIndex + articlesPerPage;
  const currentArticles = filteredArticles.slice(startIndex, endIndex);

  // Reset página quando busca muda
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // A busca é reativa através do useQuery
  };

  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  const handleViewArticle = (article: KnowledgeArticle) => {
    setSelectedArticle(article);
    // Em produção, aqui incrementaria as visualizações no Supabase
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho e Busca */}
      <Card className="border shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-xl">
            <BookOpen className="h-5 w-5 text-blue-600" />
            Base de Conhecimento
          </CardTitle>
          <p className="text-gray-600">
            Encontre artigos, tutoriais e soluções para suas dúvidas
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Buscar artigos por título, conteúdo ou categoria..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              <Search className="h-4 w-4 mr-2" />
              Buscar
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Resultados */}
      <div className="space-y-4">
        {filteredArticles.length > 0 ? (
          <>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                {filteredArticles.length} artigo{filteredArticles.length !== 1 ? 's' : ''} encontrado{filteredArticles.length !== 1 ? 's' : ''}
                {searchTerm && ` para "${searchTerm}"`}
                {totalPages > 1 && ` • Página ${currentPage} de ${totalPages}`}
              </p>
            </div>
            
            <div className="grid gap-4">
              {currentArticles.map((article) => (
                <Card key={article.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 
                        className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                        onClick={() => handleViewArticle(article)}
                      >
                        {article.titulo}
                      </h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewArticle(article)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {truncateContent(article.conteudo)}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                          {article.categoria}
                        </Badge>
                        
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Eye className="h-4 w-4" />
                          <span>{article.visualizacoes || 0} visualizações</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Clock className="h-4 w-4" />
                        <span>
                          {format(new Date(article.atualizado_em), 'dd/MM/yyyy', { locale: ptBR })}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Paginação */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Anterior
                </Button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 p-0 ${
                        currentPage === page 
                          ? "bg-blue-600 text-white hover:bg-blue-700" 
                          : "hover:bg-blue-50"
                      }`}
                    >
                      {page}
                    </Button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1"
                >
                  Próxima
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? 'Nenhum artigo encontrado' : 'Nenhum artigo disponível'}
              </h3>
              <p className="text-gray-600">
                {searchTerm 
                  ? `Não encontramos artigos para "${searchTerm}". Tente outros termos de busca.`
                  : 'Não há artigos da base de conhecimento disponíveis no momento.'
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Modal de Visualização do Artigo */}
      {selectedArticle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl max-h-[90vh] overflow-y-auto w-full">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedArticle.titulo}
                </h2>
                <Button
                  variant="ghost"
                  onClick={() => setSelectedArticle(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </Button>
              </div>
              <div className="flex items-center gap-4 mt-3">
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  {selectedArticle.categoria}
                </Badge>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Clock className="h-4 w-4" />
                  <span>
                    Atualizado em {format(new Date(selectedArticle.atualizado_em), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                  </span>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="prose max-w-none">
                <div dangerouslySetInnerHTML={{ __html: selectedArticle.conteudo.replace(/\n/g, '<br>') }} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
