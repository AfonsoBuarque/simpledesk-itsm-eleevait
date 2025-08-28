
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  BookOpen, 
  Star, 
  Plus, 
  ThumbsUp, 
  Eye,
  Filter,
  Tag,
  Edit,
  Trash2,
  FolderPlus,
  X
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useKnowledgeBase } from '@/hooks/useKnowledgeBase';
import NewArticleDialog from './NewArticleDialog';
import NewCategoryDialog from './NewCategoryDialog';
import EditArticleDialog from './EditArticleDialog';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const KnowledgeBase = () => {
  const { 
    articles, 
    categories, 
    loading, 
    updateArticle, 
    deleteArticle, 
    recordView, 
    submitFeedback 
  } = useKnowledgeBase();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [editingArticle, setEditingArticle] = useState<any>(null);
  const [viewingArticle, setViewingArticle] = useState<any>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'publicado': return 'bg-green-100 text-green-800';
      case 'rascunho': return 'bg-yellow-100 text-yellow-800';
      case 'arquivado': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getVisibilityColor = (visibilidade: string) => {
    switch (visibilidade) {
      case 'publico': return 'bg-blue-100 text-blue-800';
      case 'interno': return 'bg-purple-100 text-purple-800';
      case 'restrito': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.conteudo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || article.categoria_id === selectedCategory;
    const matchesStatus = !selectedStatus || article.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const publishedArticles = filteredArticles.filter(article => article.status === 'publicado');
  const draftArticles = filteredArticles.filter(article => article.status === 'rascunho');

  const popularArticles = [...publishedArticles]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 5);

  const handleArticleClick = async (article: any) => {
    await recordView(article.id);
    setViewingArticle(article);
  };

  const handleLike = async (articleId: string) => {
    await submitFeedback(articleId, 'positivo');
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Carregando base de conhecimento...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Base de Conhecimento</h1>
        <div className="flex gap-2">
          <NewCategoryDialog
            trigger={
              <Button variant="outline" className="bg-green-50 hover:bg-green-100">
                <FolderPlus className="h-4 w-4 mr-2" />
                Nova Categoria
              </Button>
            }
            categories={categories}
          />
          <NewArticleDialog
            trigger={
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Novo Artigo
              </Button>
            }
            categories={categories}
          />
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar artigos, procedimentos, soluções..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">Todas as categorias</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.nome}
                  </option>
                ))}
              </select>
              <select
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="">Todos os status</option>
                <option value="publicado">Publicado</option>
                <option value="rascunho">Rascunho</option>
                <option value="arquivado">Arquivado</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3">
          <Tabs defaultValue="articles" className="space-y-4">
            <TabsList>
              <TabsTrigger value="articles">Artigos ({publishedArticles.length})</TabsTrigger>
              <TabsTrigger value="categories">Categorias ({categories.length})</TabsTrigger>
              <TabsTrigger value="drafts">Rascunhos ({draftArticles.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="articles" className="space-y-4">
              {publishedArticles.length === 0 ? (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center py-8">
                      <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Nenhum artigo publicado encontrado.</p>
                      <p className="text-sm text-gray-500">Crie seu primeiro artigo para começar.</p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                publishedArticles.map((article) => (
                  <Card key={article.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 
                              className="text-lg font-semibold text-blue-600 hover:text-blue-800 cursor-pointer"
                              onClick={() => handleArticleClick(article)}
                            >
                              {article.titulo}
                            </h3>
                            <Badge className={getStatusColor(article.status)}>
                              {article.status}
                            </Badge>
                            <Badge className={getVisibilityColor(article.visibilidade)}>
                              {article.visibilidade}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                            <span>Por {article.autor}</span>
                            <span>•</span>
                            <span>
                              Atualizado em {format(new Date(article.atualizado_em || article.criado_em), 'dd/MM/yyyy', { locale: ptBR })}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {article.views} visualizações
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mb-3">
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <ThumbsUp className="h-3 w-3" />
                              {article.likes}
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleLike(article.id)}
                              className="text-xs"
                            >
                              Útil
                            </Button>
                          </div>
                          {article.tags && article.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {article.tags.map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          {article.categoria && (
                            <Badge className="bg-blue-100 text-blue-800">
                              {article.categoria.nome}
                            </Badge>
                          )}
                           <div className="flex gap-1">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => setEditingArticle(article)}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-red-600"
                              onClick={() => deleteArticle(article.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="categories">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categories.length === 0 ? (
                  <div className="col-span-2">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center py-8">
                          <FolderPlus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600">Nenhuma categoria encontrada.</p>
                          <p className="text-sm text-gray-500">Crie sua primeira categoria para organizar os artigos.</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  categories.map((category) => (
                    <Card key={category.id} className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <BookOpen className="h-8 w-8 text-blue-600" />
                            <div>
                              <h3 className="font-semibold">{category.nome}</h3>
                              {category.descricao && (
                                <p className="text-sm text-gray-600">{category.descricao}</p>
                              )}
                              <p className="text-sm text-gray-600">{category.article_count} artigos</p>
                            </div>
                          </div>
                          <Badge className="bg-blue-100 text-blue-800">
                            {category.article_count}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="drafts">
              <div className="space-y-4">
                {draftArticles.length === 0 ? (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center py-8">
                        <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">Nenhum rascunho encontrado.</p>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  draftArticles.map((article) => (
                    <Card key={article.id}>
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold mb-2">{article.titulo}</h3>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span>Por {article.autor}</span>
                              <span>•</span>
                              <span>
                                Última edição: {format(new Date(article.atualizado_em || article.criado_em), 'dd/MM/yyyy', { locale: ptBR })}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setEditingArticle(article)}
                            >
                              Editar
                            </Button>
                            <Button 
                              size="sm"
                              onClick={() => updateArticle(article.id, { status: 'publicado' })}
                            >
                              Publicar
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Popular Articles */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                Mais Populares
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {popularArticles.length === 0 ? (
                <p className="text-sm text-gray-600">Nenhum artigo popular ainda.</p>
              ) : (
                popularArticles.map((article, index) => (
                  <div key={article.id} className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                       <p 
                        className="text-sm font-medium text-blue-600 hover:text-blue-800 cursor-pointer"
                        onClick={() => handleArticleClick(article)}
                      >
                        {article.titulo}
                      </p>
                      <p className="text-xs text-gray-600 flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {article.views} visualizações
                      </p>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Estatísticas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total de Artigos</span>
                <span className="font-semibold">{articles.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Publicados</span>
                <span className="font-semibold text-green-600">{publishedArticles.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Em Rascunho</span>
                <span className="font-semibold text-yellow-600">{draftArticles.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Categorias</span>
                <span className="font-semibold">{categories.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Visualizações Totais</span>
                <span className="font-semibold">
                  {articles.reduce((total, article) => total + (article.views || 0), 0)}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Article Dialog */}
      {editingArticle && (
        <EditArticleDialog
          article={editingArticle}
          isOpen={!!editingArticle}
          onClose={() => setEditingArticle(null)}
          categories={categories}
        />
      )}

      {/* View Article Dialog */}
      {viewingArticle && (
        <Dialog open={!!viewingArticle} onOpenChange={() => setViewingArticle(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">{viewingArticle.titulo}</DialogTitle>
              <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
                <span>Por {viewingArticle.autor}</span>
                <span>•</span>
                <span>
                  Atualizado em {format(new Date(viewingArticle.atualizado_em || viewingArticle.criado_em), 'dd/MM/yyyy', { locale: ptBR })}
                </span>
                {viewingArticle.categoria && (
                  <>
                    <span>•</span>
                    <Badge className="bg-blue-100 text-blue-800">
                      {viewingArticle.categoria.nome}
                    </Badge>
                  </>
                )}
              </div>
            </DialogHeader>
            
            <div className="mt-6 px-2">
              <div 
                className="text-gray-800 leading-relaxed space-y-4"
                style={{
                  whiteSpace: 'pre-wrap',
                  lineHeight: '1.6',
                  fontSize: '16px'
                }}
              >
                {viewingArticle.conteudo.split('\n').map((paragraph: string, index: number) => {
                  if (paragraph.trim() === '') return <br key={index} />;
                  
                  // Check if it's a heading (starts with #)
                  if (paragraph.startsWith('# ')) {
                    return <h1 key={index} className="text-2xl font-bold mt-6 mb-4 text-gray-900">{paragraph.substring(2)}</h1>;
                  }
                  if (paragraph.startsWith('## ')) {
                    return <h2 key={index} className="text-xl font-semibold mt-5 mb-3 text-gray-900">{paragraph.substring(3)}</h2>;
                  }
                  if (paragraph.startsWith('### ')) {
                    return <h3 key={index} className="text-lg font-medium mt-4 mb-2 text-gray-900">{paragraph.substring(4)}</h3>;
                  }
                  
                  // Check if it's a list item
                  if (paragraph.trim().startsWith('- ') || paragraph.trim().startsWith('* ')) {
                    return (
                      <div key={index} className="flex items-start gap-2 mb-2">
                        <span className="text-blue-600 mt-1">•</span>
                        <span>{paragraph.trim().substring(2)}</span>
                      </div>
                    );
                  }
                  
                  // Check if it's a numbered list
                  if (/^\d+\./.test(paragraph.trim())) {
                    const match = paragraph.trim().match(/^(\d+)\.\s*(.*)$/);
                    if (match) {
                      return (
                        <div key={index} className="flex items-start gap-2 mb-2">
                          <span className="text-blue-600 font-medium min-w-[20px]">{match[1]}.</span>
                          <span>{match[2]}</span>
                        </div>
                      );
                    }
                  }
                  
                  // Regular paragraph
                  return <p key={index} className="mb-4 text-justify">{paragraph}</p>;
                })}
              </div>
            </div>

            {viewingArticle.tags && viewingArticle.tags.length > 0 && (
              <div className="mt-6 pt-4 border-t">
                <h4 className="text-sm font-medium mb-2">Tags:</h4>
                <div className="flex flex-wrap gap-1">
                  {viewingArticle.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 pt-4 border-t flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Eye className="h-4 w-4" />
                  {viewingArticle.views} visualizações
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <ThumbsUp className="h-4 w-4" />
                  {viewingArticle.likes} likes
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleLike(viewingArticle.id)}
              >
                <ThumbsUp className="h-4 w-4 mr-1" />
                Útil
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default KnowledgeBase;
