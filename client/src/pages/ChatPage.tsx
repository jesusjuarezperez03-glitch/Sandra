import { ChatBot } from "@/components/ChatBot";
import { useEffect, useState } from "react";
import { nanoid } from "nanoid";

export default function ChatPage() {
  const [sessionId, setSessionId] = useState<string>("");

  useEffect(() => {
    // Get or create session ID
    let id = sessionStorage.getItem("chatSessionId");
    if (!id) {
      id = nanoid();
      sessionStorage.setItem("chatSessionId", id);
    }
    setSessionId(id);
  }, []);

  if (!sessionId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-muted-foreground">Cargando chat...</div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="flex-1 p-4 max-w-4xl mx-auto w-full">
        <ChatBot sessionId={sessionId} />
      </div>
    </div>
  );
}
