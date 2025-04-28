
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BellRing, X, ChevronUp, ChevronDown, Check, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";

interface Notice {
  id: string;
  title: string;
  content: string;
  type: "info" | "warning" | "success" | "error";
  date: string;
  read: boolean;
}

interface NoticeBoardProps {
  title?: string;
  notices?: Notice[];
  isAdmin?: boolean;
  recipientType?: "hosts" | "vendors" | "fetchmen" | "all";
}

export default function NoticeBoard({ 
  title = "Notice Board",
  notices: initialNotices,
  isAdmin = false, 
  recipientType = "all" 
}: NoticeBoardProps) {
  const isMobile = useIsMobile();
  
  const defaultNotices: Notice[] = initialNotices || [
    {
      id: "1",
      title: "System Maintenance",
      content: "Scheduled maintenance on Saturday from 2AM to 4AM. Brief service interruptions expected.",
      type: "info",
      date: "2023-04-28",
      read: false,
    },
    {
      id: "2",
      title: "New Feature: QR Code Generation",
      content: "You can now generate QR codes for your venues! Find this feature in your venue settings.",
      type: "success",
      date: "2023-04-27",
      read: false,
    },
    {
      id: "3",
      title: "Payment Processing Update",
      content: "We've improved our payment processing system for faster transactions and better reporting.",
      type: "info",
      date: "2023-04-25",
      read: true,
    }
  ];

  const [notices, setNotices] = useState<Notice[]>(defaultNotices);
  const [expanded, setExpanded] = useState(true);

  const handleMarkAsRead = (id: string) => {
    setNotices(notices.map(notice => 
      notice.id === id ? { ...notice, read: true } : notice
    ));
  };

  const handleDismiss = (id: string) => {
    setNotices(notices.filter(notice => notice.id !== id));
  };

  const handleMarkAllAsRead = () => {
    setNotices(notices.map(notice => ({ ...notice, read: true })));
  };

  const getNoticeIcon = (type: Notice["type"]) => {
    switch (type) {
      case "info":
        return <Info className="h-5 w-5 text-blue-500" />;
      case "warning":
        return <Info className="h-5 w-5 text-amber-500" />;
      case "success":
        return <Check className="h-5 w-5 text-green-500" />;
      case "error":
        return <Info className="h-5 w-5 text-red-500" />;
      default:
        return <BellRing className="h-5 w-5 text-blue-500" />;
    }
  };

  const getNoticeColor = (type: Notice["type"]) => {
    switch (type) {
      case "info":
        return "bg-blue-50 border-blue-200";
      case "warning":
        return "bg-amber-50 border-amber-200";
      case "success":
        return "bg-green-50 border-green-200";
      case "error":
        return "bg-red-50 border-red-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const unreadCount = notices.filter(notice => !notice.read).length;

  return (
    <Card className="w-full rounded-lg shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg">{title}</CardTitle>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {unreadCount} unread
              </Badge>
            )}
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setExpanded(!expanded)}
            className="h-8 w-8 p-0"
          >
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </Button>
        </div>
        {isAdmin && (
          <div className="flex items-center gap-2 mt-2">
            <Badge className={`
              ${recipientType === "hosts" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"}
            `}>
              Hosts
            </Badge>
            <Badge className={`
              ${recipientType === "vendors" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"}
            `}>
              Vendors
            </Badge>
            <Badge className={`
              ${recipientType === "fetchmen" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"}
            `}>
              Fetchmen
            </Badge>
            <Badge className={`
              ${recipientType === "all" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"}
            `}>
              All
            </Badge>
          </div>
        )}
      </CardHeader>
      {expanded && (
        <>
          <CardContent className="pt-3 max-h-[350px] overflow-auto">
            {notices.length > 0 ? (
              <div className="space-y-3">
                {notices.map((notice) => (
                  <div 
                    key={notice.id} 
                    className={`border rounded-md p-3 ${getNoticeColor(notice.type)} ${notice.read ? 'opacity-75' : ''}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2 flex-1">
                        {getNoticeIcon(notice.type)}
                        <div>
                          <div className="font-medium flex items-center">
                            {notice.title}
                            {!notice.read && (
                              <span className="ml-2 h-2 w-2 rounded-full bg-blue-500"></span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 mt-1">{notice.content}</p>
                          <div className="text-xs text-gray-400 mt-2">{notice.date}</div>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        {!notice.read && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 w-6 p-0" 
                            onClick={() => handleMarkAsRead(notice.id)}
                            title="Mark as read"
                          >
                            <Check size={14} />
                            <span className="sr-only">Mark as read</span>
                          </Button>
                        )}
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 w-6 p-0" 
                          onClick={() => handleDismiss(notice.id)}
                          title="Dismiss"
                        >
                          <X size={14} />
                          <span className="sr-only">Dismiss</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-32">
                <p className="text-gray-500">No notices at this time.</p>
              </div>
            )}
          </CardContent>
          <CardFooter className="pt-0">
            {notices.length > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleMarkAllAsRead}
                className="text-sm"
                disabled={notices.every(notice => notice.read)}
              >
                Mark all as read
              </Button>
            )}
          </CardFooter>
        </>
      )}
    </Card>
  );
}
