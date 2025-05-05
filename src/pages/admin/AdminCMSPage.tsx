import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  FileText, 
  Globe, 
  Image, 
  Pencil, 
  Plus, 
  Search, 
  Eye, 
  TrashIcon, 
  CheckCircle, 
  Clock, 
  AlertCircle 
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function AdminCMSPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("pages");
  const [searchTerm, setSearchTerm] = useState("");

  // Mock CMS data
  const pages = [
    { 
      id: "1", 
      title: "Home", 
      slug: "/", 
      lastUpdated: "2025-05-01T14:30:00", 
      status: "published", 
      author: "Admin"
    },
    { 
      id: "2", 
      title: "About Us", 
      slug: "/about", 
      lastUpdated: "2025-04-28T10:15:00", 
      status: "published", 
      author: "Admin"
    },
    { 
      id: "3", 
      title: "Contact", 
      slug: "/contact", 
      lastUpdated: "2025-04-25T09:45:00", 
      status: "published", 
      author: "Admin"
    },
    { 
      id: "4", 
      title: "Privacy Policy", 
      slug: "/privacy", 
      lastUpdated: "2025-03-15T11:20:00", 
      status: "published", 
      author: "Admin"
    },
    { 
      id: "5", 
      title: "Terms of Service", 
      slug: "/terms", 
      lastUpdated: "2025-03-15T11:30:00", 
      status: "published", 
      author: "Admin"
    },
    { 
      id: "6", 
      title: "New Feature Announcement", 
      slug: "/new-features", 
      lastUpdated: "2025-05-02T16:45:00", 
      status: "draft", 
      author: "Admin"
    }
  ];

  const blogPosts = [
    { 
      id: "1", 
      title: "Top 10 Event Planning Tips", 
      slug: "/blog/event-planning-tips", 
      lastUpdated: "2025-05-01T09:30:00", 
      status: "published", 
      author: "Marketing Team",
      category: "Tips & Tricks"
    },
    { 
      id: "2", 
      title: "How to Choose the Perfect Venue", 
      slug: "/blog/choose-perfect-venue", 
      lastUpdated: "2025-04-25T14:20:00", 
      status: "published", 
      author: "Marketing Team",
      category: "Guides"
    },
    { 
      id: "3", 
      title: "Working with Vendors: Best Practices", 
      slug: "/blog/vendor-best-practices", 
      lastUpdated: "2025-04-20T11:15:00", 
      status: "published", 
      author: "Marketing Team",
      category: "Best Practices"
    },
    { 
      id: "4", 
      title: "Upcoming Platform Features - Q3 2025", 
      slug: "/blog/upcoming-features-q3", 
      lastUpdated: "2025-05-02T16:00:00", 
      status: "draft", 
      author: "Product Team",
      category: "Product Updates"
    }
  ];

  const mediaItems = [
    { 
      id: "1", 
      name: "hero-image.jpg", 
      type: "image/jpeg", 
      size: "1.2 MB", 
      dimensions: "1920x1080", 
      uploaded: "2025-04-15T10:30:00",
      url: "/lovable-uploads/c8628e28-1db7-453f-b8d6-13301457b8dc.png"
    },
    { 
      id: "2", 
      name: "event-banner.jpg", 
      type: "image/jpeg", 
      size: "850 KB", 
      dimensions: "1200x600", 
      uploaded: "2025-04-10T14:45:00",
      url: "/lovable-uploads/868a71af-ddc3-4870-a5a0-a5720b9dc63f.png"
    },
    { 
      id: "3", 
      name: "vendor-guide.pdf", 
      type: "application/pdf", 
      size: "2.5 MB", 
      dimensions: "—", 
      uploaded: "2025-04-05T09:15:00",
      url: "#"
    },
    { 
      id: "4", 
      name: "testimonials.mp4", 
      type: "video/mp4", 
      size: "24.6 MB", 
      dimensions: "1080x720", 
      uploaded: "2025-03-28T16:20:00",
      url: "#"
    }
  ];

  const filteredContent = () => {
    switch (activeTab) {
      case "pages":
        return pages.filter(page => 
          page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          page.slug.toLowerCase().includes(searchTerm.toLowerCase())
        );
      case "blog":
        return blogPosts.filter(post => 
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.category.toLowerCase().includes(searchTerm.toLowerCase())
        );
      case "media":
        return mediaItems.filter(item => 
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.type.toLowerCase().includes(searchTerm.toLowerCase())
        );
      default:
        return [];
    }
  };

  const handleCreateContent = () => {
    toast({
      title: `Create new ${activeTab === "media" ? "upload" : activeTab.slice(0, -1)}`,
      description: `Opening ${activeTab === "media" ? "upload" : "editor"} for new content`
    });
  };

  const handleEditContent = (id: string) => {
    toast({
      title: "Edit content",
      description: `Opening editor for item ID: ${id}`
    });
  };

  const handlePreviewContent = (slug: string) => {
    toast({
      title: "Preview content",
      description: `Opening preview for: ${slug}`
    });
  };

  const handleDeleteContent = (id: string) => {
    toast({
      title: "Delete content",
      description: `Item ID: ${id} has been marked for deletion`,
      variant: "destructive"
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return <Badge className="bg-green-100 text-green-800">Published</Badge>;
      case "draft":
        return <Badge className="bg-yellow-100 text-yellow-800">Draft</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Content Management</h1>
          <p className="text-gray-500">Manage website content and media</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button onClick={handleCreateContent}>
            <Plus className="mr-2 h-4 w-4" />
            {activeTab === "media" ? "Upload Media" : activeTab === "pages" ? "Create Page" : "Create Post"}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <Tabs defaultValue="pages" value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="pages">
                <FileText className="h-4 w-4 mr-2" />
                Pages
              </TabsTrigger>
              <TabsTrigger value="blog">
                <Globe className="h-4 w-4 mr-2" />
                Blog Posts
              </TabsTrigger>
              <TabsTrigger value="media">
                <Image className="h-4 w-4 mr-2" />
                Media
              </TabsTrigger>
            </TabsList>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={`Search ${activeTab}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <TabsContent value="pages" className="mt-0">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Slug</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredContent().map((page: any) => (
                      <TableRow key={page.id}>
                        <TableCell className="font-medium">{page.title}</TableCell>
                        <TableCell>{page.slug}</TableCell>
                        <TableCell>{new Date(page.lastUpdated).toLocaleString()}</TableCell>
                        <TableCell>{getStatusBadge(page.status)}</TableCell>
                        <TableCell>{page.author}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => handleEditContent(page.id)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handlePreviewContent(page.slug)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteContent(page.id)}>
                              <TrashIcon className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="blog" className="mt-0">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredContent().map((post: any) => (
                      <TableRow key={post.id}>
                        <TableCell className="font-medium">{post.title}</TableCell>
                        <TableCell>{post.category}</TableCell>
                        <TableCell>{new Date(post.lastUpdated).toLocaleString()}</TableCell>
                        <TableCell>{getStatusBadge(post.status)}</TableCell>
                        <TableCell>{post.author}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => handleEditContent(post.id)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handlePreviewContent(post.slug)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteContent(post.id)}>
                              <TrashIcon className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="media" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredContent().map((item: any) => (
                  <Card key={item.id} className="overflow-hidden">
                    <div className="aspect-video bg-muted flex items-center justify-center">
                      {item.type.startsWith('image/') ? (
                        <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                      ) : item.type === 'application/pdf' ? (
                        <FileText className="h-12 w-12 text-gray-400" />
                      ) : item.type.startsWith('video/') ? (
                        <div className="w-full h-full bg-black flex items-center justify-center">
                          <AlertCircle className="h-12 w-12 text-gray-400" />
                        </div>
                      ) : (
                        <AlertCircle className="h-12 w-12 text-gray-400" />
                      )}
                    </div>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium truncate" title={item.name}>{item.name}</h3>
                          <p className="text-sm text-muted-foreground">{item.size} • {item.type}</p>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteContent(item.id)}>
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(item.uploaded).toLocaleDateString()}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {filteredContent().length === 0 && (
              <div className="flex flex-col items-center justify-center py-8">
                <AlertCircle className="h-12 w-12 text-muted-foreground mb-2" />
                <p className="text-lg font-medium">No content found</p>
                <p className="text-sm text-muted-foreground">
                  {searchTerm ? "Try adjusting your search term" : `No ${activeTab} available`}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Content Statistics</CardTitle>
            <CardDescription>Overview of your website content</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 flex items-center">
                  <FileText className="h-8 w-8 text-blue-500 mr-4" />
                  <div>
                    <p className="text-2xl font-bold">{pages.length}</p>
                    <p className="text-sm text-muted-foreground">Total Pages</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center">
                  <Globe className="h-8 w-8 text-green-500 mr-4" />
                  <div>
                    <p className="text-2xl font-bold">{blogPosts.length}</p>
                    <p className="text-sm text-muted-foreground">Blog Posts</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center">
                  <Image className="h-8 w-8 text-purple-500 mr-4" />
                  <div>
                    <p className="text-2xl font-bold">{mediaItems.length}</p>
                    <p className="text-sm text-muted-foreground">Media Files</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    
  );
}
