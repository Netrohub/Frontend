import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, Eye, Ban, CheckCircle, Trash2 } from "lucide-react";
import { useState } from "react";

interface AdminListing {
  id: number;
  title: string;
  seller: string;
  sellerEmail: string;
  price: number;
  status: "active" | "pending" | "suspended";
  views: number;
  created: string;
  category: string;
  description: string;
}

const AdminListings = () => {
  const [selectedListing, setSelectedListing] = useState<AdminListing | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const listings = [
    { id: 1, title: "حساب فورتنايت مستوى عالي", seller: "محمد أحمد", sellerEmail: "mohammed@example.com", price: 500, status: "active", views: 245, created: "2025-01-20", category: "فورتنايت", description: "حساب مستوى عالي مع جميع الأسلحة والإضافات" },
    { id: 2, title: "حساب كول أوف ديوتي", seller: "سارة علي", sellerEmail: "sara@example.com", price: 350, status: "active", views: 189, created: "2025-01-19", category: "كول أوف ديوتي", description: "حساب احترافي مع رتب متقدمة" },
    { id: 3, title: "حساب روبلوكس مميز", seller: "خالد العتيبي", sellerEmail: "khalid@example.com", price: 280, status: "pending", views: 92, created: "2025-01-18", category: "روبلوكس", description: "حساب مميز مع عملات وإضافات حصرية" },
    { id: 4, title: "حساب ماين كرافت", seller: "نورة السعيد", sellerEmail: "noura@example.com", price: 420, status: "suspended", views: 156, created: "2025-01-17", category: "ماين كرافت", description: "حساب مع جميع التحديثات" },
  ];

  const handleViewDetails = (listing: AdminListing) => {
    setSelectedListing(listing);
    setIsDialogOpen(true);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white mb-2">إدارة الإعلانات</h1>
        <p className="text-white/60">عرض وإدارة جميع الإعلانات على المنصة</p>
      </div>

      {/* Search */}
      <Card className="p-4 bg-white/5 border-white/10 backdrop-blur-sm mb-6">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/40" />
            <Input 
              placeholder="البحث عن إعلان..."
              className="pr-10 bg-white/5 border-white/10 text-white placeholder:text-white/40"
            />
          </div>
          <Button className="gap-2 bg-[hsl(195,80%,50%)] hover:bg-[hsl(195,80%,60%)] text-white border-0">
            بحث
          </Button>
        </div>
      </Card>

      {/* Listings Grid */}
      <div className="space-y-4">
        {listings.map((listing) => (
          <Card key={listing.id} className="p-5 bg-white/5 border-white/10 backdrop-blur-sm">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-white">{listing.title}</h3>
                  <Badge className={
                    listing.status === "active" 
                      ? "bg-green-500/20 text-green-400 border-green-500/30"
                      : listing.status === "pending"
                      ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                      : "bg-red-500/20 text-red-400 border-red-500/30"
                  }>
                    {listing.status === "active" ? "نشط" : listing.status === "pending" ? "قيد المراجعة" : "موقوف"}
                  </Badge>
                </div>
                <div className="text-sm text-white/60 space-y-1">
                  <div>البائع: {listing.seller}</div>
                  <div className="flex gap-4">
                    <span>السعر: {listing.price} ريال</span>
                    <span>•</span>
                    <span>المشاهدات: {listing.views}</span>
                    <span>•</span>
                    <span>تاريخ النشر: {listing.created}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-3 border-t border-white/10">
              <Button size="sm" variant="outline" className="flex-1 gap-2 bg-white/5 hover:bg-white/10 text-white border-white/20" onClick={() => handleViewDetails(listing)}>
                <Eye className="h-4 w-4" />
                عرض التفاصيل
              </Button>
              {listing.status !== "suspended" ? (
                <Button size="sm" variant="outline" className="gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/30">
                  <Ban className="h-4 w-4" />
                  إيقاف
                </Button>
              ) : (
                <Button size="sm" variant="outline" className="gap-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 border-green-500/30">
                  <CheckCircle className="h-4 w-4" />
                  تفعيل
                </Button>
              )}
              <Button size="sm" variant="outline" className="gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/30">
                <Trash2 className="h-4 w-4" />
                حذف
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-[hsl(217,33%,17%)] border-white/10 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">تفاصيل الإعلان</DialogTitle>
          </DialogHeader>
          {selectedListing && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold mb-2">{selectedListing.title}</h3>
                <Badge className={
                  selectedListing.status === "active" 
                    ? "bg-green-500/20 text-green-400 border-green-500/30"
                    : selectedListing.status === "pending"
                    ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                    : "bg-red-500/20 text-red-400 border-red-500/30"
                }>
                  {selectedListing.status === "active" ? "نشط" : selectedListing.status === "pending" ? "قيد المراجعة" : "موقوف"}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-white/60">البائع:</span>
                  <p className="text-white font-medium">{selectedListing.seller}</p>
                </div>
                <div>
                  <span className="text-white/60">البريد الإلكتروني:</span>
                  <p className="text-white font-medium">{selectedListing.sellerEmail}</p>
                </div>
                <div>
                  <span className="text-white/60">السعر:</span>
                  <p className="text-white font-medium">{selectedListing.price} ريال</p>
                </div>
                <div>
                  <span className="text-white/60">الفئة:</span>
                  <p className="text-white font-medium">{selectedListing.category}</p>
                </div>
                <div>
                  <span className="text-white/60">المشاهدات:</span>
                  <p className="text-white font-medium">{selectedListing.views}</p>
                </div>
                <div>
                  <span className="text-white/60">تاريخ النشر:</span>
                  <p className="text-white font-medium">{selectedListing.created}</p>
                </div>
              </div>

              <div>
                <span className="text-white/60 text-sm">الوصف:</span>
                <p className="text-white mt-1">{selectedListing.description}</p>
              </div>

              <div className="flex gap-2 pt-4 border-t border-white/10">
                {selectedListing.status !== "suspended" ? (
                  <Button className="flex-1 gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/30">
                    <Ban className="h-4 w-4" />
                    إيقاف الإعلان
                  </Button>
                ) : (
                  <Button className="flex-1 gap-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 border-green-500/30">
                    <CheckCircle className="h-4 w-4" />
                    تفعيل الإعلان
                  </Button>
                )}
                <Button className="flex-1 gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/30">
                  <Trash2 className="h-4 w-4" />
                  حذف الإعلان
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminListings;