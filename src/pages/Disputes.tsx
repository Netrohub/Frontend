import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertTriangle, Upload, MessageSquare, Clock, Package, ChevronDown, ShieldAlert, User, Send } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Navbar } from "@/components/Navbar";
import { MobileNav } from "@/components/MobileNav";

const Disputes = () => {
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [showNewDispute, setShowNewDispute] = useState(false);
  const [showConversation, setShowConversation] = useState(false);
  const [selectedDispute, setSelectedDispute] = useState<any>(null);
  const [newMessage, setNewMessage] = useState("");
  const [disputesList, setDisputesList] = useState([
    { 
      id: 1, 
      orderId: "#12458", 
      title: "الحساب لا يعمل", 
      description: "تم تسليم معلومات دخول خاطئة", 
      status: "open", 
      date: "منذ 3 ساعات",
      sellerName: "أحمد السعيد",
      messages: 2,
      escalated: false,
      conversation: [
        { sender: "me", text: "الحساب لا يعمل، المعلومات خاطئة", time: "منذ 3 ساعات" },
        { sender: "seller", text: "سأقوم بالتحقق من المشكلة وحلها خلال 24 ساعة", time: "منذ ساعتين" }
      ]
    },
    { 
      id: 2, 
      orderId: "#12340", 
      title: "معلومات خاطئة", 
      description: "الحساب مختلف عن الوصف", 
      status: "escalated", 
      date: "منذ يوم واحد",
      sellerName: "خالد المطيري",
      messages: 5,
      escalated: true,
      conversation: [
        { sender: "me", text: "الحساب مختلف تماماً عن الوصف", time: "منذ يوم" },
        { sender: "seller", text: "المعلومات صحيحة، يرجى التحقق مرة أخرى", time: "منذ 20 ساعة" },
        { sender: "me", text: "لا، الحساب ليس كما وصفته", time: "منذ 18 ساعة" },
        { sender: "admin", text: "الإدارة: تم استلام النزاع وجاري المراجعة", time: "منذ 5 ساعات" }
      ]
    },
  ]);
  const { toast } = useToast();
  
  // طلبات المستخدم
  const myOrders = [
    { id: "#12458", title: "حساب مميز - السيرفر 201-300", price: "1,250 ريال", date: "2024-01-15", status: "completed" },
    { id: "#12340", title: "حساب قوي - السيرفر 100-200", price: "850 ريال", date: "2024-01-10", status: "completed" },
    { id: "#12289", title: "حساب مبتدئ - السيرفر 0-99", price: "450 ريال", date: "2024-01-05", status: "completed" },
  ];

  const handleOpenConversation = (dispute: any) => {
    setSelectedDispute(dispute);
    setShowConversation(true);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    toast({
      title: "تم إرسال الرسالة",
      description: "تم إرسال رسالتك بنجاح",
    });
    setNewMessage("");
  };

  const handleEscalate = (disputeId: number) => {
    setDisputesList(prevDisputes => 
      prevDisputes.map(d => 
        d.id === disputeId 
          ? { ...d, status: "escalated", escalated: true }
          : d
      )
    );
    
    toast({
      title: "تم التصعيد للإدارة",
      description: "سيتم مراجعة النزاع من قبل الإدارة خلال 24 ساعة",
    });
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      open: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      escalated: "bg-red-500/20 text-red-400 border-red-500/30",
      resolved: "bg-green-500/20 text-green-400 border-green-500/30",
    };
    const labels = { 
      open: "محادثة مع البائع", 
      escalated: "تم التصعيد للإدارة", 
      resolved: "تم الحل" 
    };
    return <Badge className={styles[status as keyof typeof styles]}>{labels[status as keyof typeof labels]}</Badge>;
  };

  return (
    <div className="min-h-screen relative overflow-hidden" dir="rtl">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[hsl(200,70%,15%)] via-[hsl(195,60%,25%)] to-[hsl(200,70%,15%)]" />

      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 md:px-6 py-8 max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-black text-white mb-2">مركز النزاعات</h1>
          <p className="text-white/60">إدارة ومتابعة النزاعات</p>
        </div>

        {/* Active Disputes */}
        {disputesList.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">النزاعات النشطة</h2>
            <div className="grid gap-4">
              {disputesList.map((dispute) => (
                <Card 
                  key={dispute.id}
                  className="p-5 bg-white/5 border-white/10 backdrop-blur-sm"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="h-5 w-5 text-red-400" />
                        <span className="text-sm text-white/60">{dispute.orderId}</span>
                        {getStatusBadge(dispute.status)}
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2">{dispute.title}</h3>
                      <p className="text-sm text-white/60 mb-3">{dispute.description}</p>
                      
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2 text-white/60">
                          <User className="h-4 w-4" />
                          <span>البائع: {dispute.sellerName}</span>
                        </div>
                        <div className="flex items-center gap-2 text-white/60">
                          <MessageSquare className="h-4 w-4" />
                          <span>{dispute.messages} رسائل</span>
                        </div>
                        <div className="flex items-center gap-2 text-white/60">
                          <Clock className="h-4 w-4" />
                          <span>{dispute.date}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Conversation Preview */}
                  <div className="mb-4 p-3 bg-white/5 rounded-lg border border-white/10">
                    <div className="text-xs text-white/60 mb-2">آخر رسالة:</div>
                    <div className="text-sm text-white/80">
                      {dispute.status === "open" 
                        ? "البائع: سأقوم بالتحقق من المشكلة وحلها خلال 24 ساعة"
                        : "الإدارة: تم استلام النزاع وجاري المراجعة"}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      onClick={() => handleOpenConversation(dispute)}
                      className="flex-1 gap-2 bg-[hsl(195,80%,50%)] hover:bg-[hsl(195,80%,60%)] text-white border-0"
                    >
                      <MessageSquare className="h-4 w-4" />
                      عرض المحادثة والرد
                    </Button>
                    
                    {dispute.status === "open" && !dispute.escalated && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleEscalate(dispute.id)}
                        className="gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/30"
                      >
                        <ShieldAlert className="h-4 w-4" />
                        تصعيد للإدارة
                      </Button>
                    )}
                  </div>

                  {dispute.status === "escalated" && (
                    <div className="mt-3 p-3 bg-red-500/10 rounded-lg border border-red-500/30">
                      <div className="flex items-center gap-2 text-sm text-red-400">
                        <ShieldAlert className="h-4 w-4" />
                        <span>تم تصعيد هذا النزاع للإدارة - ستتم المراجعة خلال 24 ساعة</span>
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* My Orders - Open Dispute */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">طلباتي - فتح نزاع</h2>
          <div className="grid gap-4">
            {myOrders.map((order) => {
              const hasDispute = disputesList.some(d => d.orderId === order.id);
              
              return (
                <Card 
                  key={order.id}
                  className="p-5 bg-white/5 border-white/10 backdrop-blur-sm"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3 flex-1">
                      <Package className="h-10 w-10 text-[hsl(195,80%,70%)]" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-bold text-white/60">{order.id}</span>
                          {hasDispute && (
                            <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-xs">
                              يوجد نزاع مفتوح
                            </Badge>
                          )}
                        </div>
                        <h3 className="font-bold text-white mb-1">{order.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-white/60">
                          <span>{order.price}</span>
                          <span>•</span>
                          <span>{order.date}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {!hasDispute ? (
                    <>
                      <Button
                        onClick={() => {
                          setSelectedOrder(order.id);
                          setShowNewDispute(!showNewDispute || selectedOrder !== order.id);
                        }}
                        variant="outline"
                        size="sm"
                        className="w-full gap-2 bg-white/5 hover:bg-white/10 text-white border-white/20"
                      >
                        <AlertTriangle className="h-4 w-4" />
                        فتح نزاع على هذا الطلب
                        <ChevronDown className={`h-4 w-4 transition-transform ${showNewDispute && selectedOrder === order.id ? 'rotate-180' : ''}`} />
                      </Button>

                      {showNewDispute && selectedOrder === order.id && (
                        <div className="mt-4 p-4 bg-white/5 rounded-lg border border-white/10 space-y-4">
                          <div>
                            <label className="text-sm text-white/80 mb-2 block">عنوان المشكلة</label>
                            <input 
                              placeholder="مثال: الحساب لا يعمل"
                              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/40"
                            />
                          </div>

                          <div>
                            <label className="text-sm text-white/80 mb-2 block">وصف تفصيلي للمشكلة</label>
                            <Textarea 
                              placeholder="اشرح المشكلة بالتفصيل..."
                              rows={4}
                              className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                            />
                          </div>

                          <div>
                            <label className="text-sm text-white/80 mb-2 block">إرفاق أدلة (اختياري)</label>
                            <button className="w-full p-4 bg-white/5 border-2 border-dashed border-white/20 rounded-lg hover:border-[hsl(195,80%,70%,0.5)] transition-colors flex flex-col items-center gap-2">
                              <Upload className="h-6 w-6 text-white/40" />
                              <span className="text-sm text-white/60">رفع صور أو فيديوهات</span>
                            </button>
                          </div>

                          <Button className="w-full gap-2 bg-red-500 hover:bg-red-600 text-white border-0">
                            <AlertTriangle className="h-5 w-5" />
                            تأكيد فتح النزاع
                          </Button>

                          <div className="p-3 bg-[hsl(195,80%,50%,0.1)] rounded-lg border border-[hsl(195,80%,70%,0.3)]">
                            <p className="text-xs text-white/80">
                              ℹ️ سيتم فتح محادثة بينك وبين البائع لحل المشكلة. إذا لم يتم الحل، يمكنك تصعيد النزاع للإدارة.
                            </p>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="mt-3 p-3 bg-red-500/10 rounded-lg border border-red-500/30">
                      <p className="text-sm text-red-400 text-center">
                        يوجد نزاع مفتوح على هذا الطلب - يرجى متابعته في الأعلى
                      </p>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>

        {/* Conversation Dialog */}
        <Dialog open={showConversation} onOpenChange={setShowConversation}>
          <DialogContent className="bg-[hsl(200,70%,15%)] border-white/10 text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">
                المحادثة - {selectedDispute?.orderId}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              {/* Conversation Messages */}
              <div className="max-h-96 overflow-y-auto space-y-3 p-4 bg-white/5 rounded-lg">
                {selectedDispute?.conversation?.map((msg: any, idx: number) => (
                  <div 
                    key={idx}
                    className={`p-3 rounded-lg ${
                      msg.sender === "me" 
                        ? "bg-[hsl(195,80%,50%,0.2)] ml-8" 
                        : msg.sender === "admin"
                        ? "bg-red-500/20 mr-8"
                        : "bg-white/10 mr-8"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-white/80">
                        {msg.sender === "me" ? "أنت" : msg.sender === "admin" ? "الإدارة" : "البائع"}
                      </span>
                      <span className="text-xs text-white/50">{msg.time}</span>
                    </div>
                    <p className="text-sm text-white/90">{msg.text}</p>
                  </div>
                ))}
              </div>

              {/* Send Message */}
              <div className="flex gap-2">
                <Textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="اكتب رسالتك هنا..."
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                  rows={3}
                />
                <Button
                  onClick={handleSendMessage}
                  className="gap-2 bg-[hsl(195,80%,50%)] hover:bg-[hsl(195,80%,60%)] text-white border-0"
                >
                  <Send className="h-4 w-4" />
                  إرسال
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Disputes;
