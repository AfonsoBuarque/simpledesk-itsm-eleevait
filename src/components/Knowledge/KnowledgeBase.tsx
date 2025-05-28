
import React from 'react';
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
  Tag
} from 'lucide-react';

const KnowledgeBase = () => {
  const articles = [
    {
      id: 'KB001',
      title: 'Como configurar acesso VPN corporativa',
      category: 'Rede',
      status: 'Publicado',
      author: 'João Silva',
      views: 1250,
      likes: 45,
      lastUpdated: '2024-01-10',
      tags: ['VPN', 'Rede', 'Acesso Remoto'],
      rating: 4.8
    },
    {
      id: 'KB002',
      title: 'Solução para problemas de lentidão no e-mail',
      category: 'E-mail',
      status: 'Publicado',
      author: 'Maria Santos',
      views: 890,
      likes: 32,
      lastUpdated: '2024-01-08',
      tags: ['E-mail', 'Outlook', 'Performance'],
      rating: 4.5
    },
    {
      id: 'KB003',
      title: 'Procedimento de backup e restauração',
      category: 'Backup',
      status: 'Rascunho',
      author: 'Carlos Oliveira',
      views: 0,
      likes: 0,
      lastUpdated: '2024-01-15',
      tags: ['Backup', 'Restore', 'Segurança'],
      rating: 0
    },
    {
      id: 'KB004',
      title: 'Configuração de impressoras de rede',
      category: 'Hardware',
      status: 'Publicado',
      author: 'Ana Costa',
      views: 567,
      likes: 28,
      lastUpdated: '2024-01-05',
      tags: ['Impressora', 'Rede', 'Hardware'],
      rating: 4.2
    }
  ];

  const categories = [
    { name: 'Rede', count: 15, color: 'bg-blue-100 text-blue-800' },
    { name: 'E-mail', count: 12, color: 'bg-green-100 text-green-800' },
    { name: 'Hardware', count: 8, color: 'bg-purple-100 text-purple-800' },
    { name: 'Software', count: 20, color: 'bg-orange-100 text-orange-800' },
    { name: 'Segurança', count: 10, color: 'bg-red-100 text-red-800' },
    { name: 'Backup', count: 6, color: 'bg-yellow-100 text-yellow-800' }
  ];

  const popularArticles = [
    { title: 'Reset de senha do Active Directory', views: 2350, id: 'KB005' },
    { title: 'Instalação do Office 365', views: 1890, id: 'KB006' },
    { title: 'Configuração de Wi-Fi corporativo', views: 1650, id: 'KB007' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Publicado': return 'bg-green-100 text-green-800';
      case 'Rascunho': return 'bg-yellow-100 text-yellow-800';
      case 'Revisão': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Base de Conhecimento</h1>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Novo Artigo
        </Button>
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
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filtros
              </Button>
              <Button variant="outline">
                <Tag className="h-4 w-4 mr-2" />
                Tags
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3">
          <Tabs defaultValue="articles" className="space-y-4">
            <TabsList>
              <TabsTrigger value="articles">Artigos</TabsTrigger>
              <TabsTrigger value="categories">Categorias</TabsTrigger>
              <TabsTrigger value="drafts">Rascunhos</TabsTrigger>
            </TabsList>

            <TabsContent value="articles" className="space-y-4">
              {articles.filter(article => article.status === 'Publicado').map((article) => (
                <Card key={article.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold text-blue-600 hover:text-blue-800 cursor-pointer">
                            {article.title}
                          </h3>
                          <Badge className={getStatusColor(article.status)}>
                            {article.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                          <span>Por {article.author}</span>
                          <span>•</span>
                          <span>Atualizado em {article.lastUpdated}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {article.views} visualizações
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex items-center gap-1">
                            {renderStars(article.rating)}
                            <span className="text-sm text-gray-600 ml-1">
                              ({article.rating})
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <ThumbsUp className="h-3 w-3" />
                            {article.likes}
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {article.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Badge className="ml-4 bg-blue-100 text-blue-800">
                        {article.category}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="categories">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categories.map((category) => (
                  <Card key={category.name} className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <BookOpen className="h-8 w-8 text-blue-600" />
                          <div>
                            <h3 className="font-semibold">{category.name}</h3>
                            <p className="text-sm text-gray-600">{category.count} artigos</p>
                          </div>
                        </div>
                        <Badge className={category.color}>
                          {category.count}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="drafts">
              <div className="space-y-4">
                {articles.filter(article => article.status === 'Rascunho').map((article) => (
                  <Card key={article.id}>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold mb-2">{article.title}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>Por {article.author}</span>
                            <span>•</span>
                            <span>Última edição: {article.lastUpdated}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">Editar</Button>
                          <Button size="sm">Publicar</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
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
              {popularArticles.map((article, index) => (
                <div key={article.id} className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-blue-600 hover:text-blue-800 cursor-pointer">
                      {article.title}
                    </p>
                    <p className="text-xs text-gray-600 flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {article.views} visualizações
                    </p>
                  </div>
                </div>
              ))}
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
                <span className="font-semibold">71</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Publicados</span>
                <span className="font-semibold text-green-600">65</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Em Rascunho</span>
                <span className="font-semibold text-yellow-600">6</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Visualizações Totais</span>
                <span className="font-semibold">15.8k</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeBase;
