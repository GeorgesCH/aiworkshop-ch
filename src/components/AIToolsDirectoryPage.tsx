import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { 
  ArrowLeft, 
  ExternalLink, 
  Search, 
  Wrench
} from "lucide-react";
import { toolCategories } from "./data/toolCategories";
import { aiTools } from "./data/aiTools";
import { useLanguage } from "./LanguageProvider";

interface AIToolsDirectoryPageProps {
  onBackToHome?: () => void;
}

export function AIToolsDirectoryPage({ onBackToHome }: AIToolsDirectoryPageProps) {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTools = aiTools.filter(tool => {
    const matchesCategory = selectedCategory === "all" || tool.category === selectedCategory;
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tool.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const featuredTools = aiTools.filter(tool => tool.featured);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="py-16 lg:py-24 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            {onBackToHome && (
              <Button 
                variant="ghost" 
                onClick={onBackToHome}
                className="mb-8 gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                {t("tools_directory.back_to_learn")}
              </Button>
            )}
            
            <div className="text-center">
              <Badge variant="outline" className="mb-4 px-4 py-2 border border-gray-200/60 bg-white/60 backdrop-blur-sm">
                {t("tools_directory.practical_tools")}
              </Badge>
              <h1 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-primary/80 bg-clip-text text-transparent">
                {t("tools_directory.title")}
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                {t("tools_directory.subtitle")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Tools */}
      <section className="py-16 lg:py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-foreground to-primary/80 bg-clip-text text-transparent">
            {t("tools_directory.featured_tools")}
          </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {featuredTools.slice(0, 6).map((tool) => {
                const categoryData = toolCategories.find(cat => cat.id === tool.category);
                const IconComponent = categoryData?.icon || Wrench;
                
                return (
                  <Card key={tool.id} className="group relative overflow-hidden border border-gray-200/60 shadow-xl bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 hover:scale-105">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                            <IconComponent className="w-5 h-5 text-primary" />
                          </div>
                          <Badge variant="secondary">{categoryData?.name}</Badge>
                        </div>
                        <Badge className="bg-primary/10 text-primary">{t("tools_directory.featured")}</Badge>
                      </div>
                      <CardTitle className="text-xl group-hover:text-primary transition-colors">
                        {tool.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-gray-600 leading-relaxed">
                        {tool.description}
                      </p>
                      
                      <div className="space-y-3">
                        <div>
                          <div className="text-sm font-medium mb-2">{t("tools_directory.use_cases")}:</div>
                          <div className="flex flex-wrap gap-2">
                            {tool.useCases.slice(0, 2).map((useCase, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {useCase}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      <Button 
                        className="w-full gap-2 group-hover:bg-primary group-hover:text-primary-foreground"
                        variant="outline"
                        onClick={() => window.open(tool.url, '_blank')}
                      >
                        <ExternalLink className="w-4 h-4" />
                        {t("tools_directory.explore_tool")}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
        </div>
      </section>

      {/* All Tools */}
      <section className="py-16 lg:py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-foreground to-primary/80 bg-clip-text text-transparent">
            {t("tools_directory.tools_by_category")}
          </h2>

            {/* Search and Filter */}
            <div className="flex flex-col lg:flex-row gap-6 items-center mb-12">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-600" />
                <Input
                  placeholder={t("tools_directory.search_placeholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex flex-wrap gap-2">
                {toolCategories.map((category) => {
                  const IconComponent = category.icon;
                  return (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category.id)}
                      className="gap-2"
                    >
                      <IconComponent className="w-4 h-4" />
                      {category.name}
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Tools Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTools.map((tool) => {
                const categoryData = toolCategories.find(cat => cat.id === tool.category);
                const IconComponent = categoryData?.icon || Wrench;
                
                return (
                  <Card key={tool.id} className="group relative overflow-hidden border border-gray-200/60 shadow-xl bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 hover:scale-105">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                            <IconComponent className="w-4 h-4 text-primary" />
                          </div>
                          <h3 className="font-medium group-hover:text-primary transition-colors">
                            {tool.name}
                          </h3>
                        </div>
                        {tool.featured && (
                          <Badge variant="secondary" className="text-xs">{t("tools_directory.featured")}</Badge>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                        {tool.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-1 mb-4">
                        {tool.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="w-full gap-2"
                        onClick={() => window.open(tool.url, '_blank')}
                      >
                        <ExternalLink className="w-3 h-3" />
                        {t("tools_directory.visit")}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {filteredTools.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-600" />
                </div>
                <h3 className="text-xl font-medium mb-2">{t("tools_directory.no_tools_found")}</h3>
                <p className="text-gray-600">
                  {t("tools_directory.adjust_search")}
                </p>
              </div>
            )}
        </div>
      </section>
    </div>
  );
}