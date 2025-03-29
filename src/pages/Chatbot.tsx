
import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";

type Message = {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
};

const initialMessages: Message[] = [
  {
    id: "1",
    content: "Hi there! I'm Justice Bot. I can help answer your questions about children's rights. What would you like to know?",
    sender: "bot",
    timestamp: new Date()
  }
];

// Predefined responses based on keywords
const responses: Record<string, string> = {
  "education": "Education is a fundamental right of every child. According to Article 28 of the UN Convention on the Rights of the Child, all children have the right to education, and primary education should be free for all.",
  
  "play": "Playing and recreation are important rights! Article 31 of the UN Convention says that every child has the right to rest, leisure, play, and to take part in cultural and artistic activities.",
  
  "privacy": "Privacy is an important right. Article 16 of the UN Convention protects children from arbitrary interference with their privacy, family, home or correspondence.",
  
  "bullying": "Everyone has the right to be safe from harm, including bullying. If you're experiencing bullying, it's important to tell a trusted adult like a parent or teacher.",
  
  "healthcare": "Healthcare is a right for all children. Article 24 of the UN Convention states that children have the right to good quality health care, clean water, nutritious food, and a clean environment.",
  
  "opinion": "Your opinion matters! According to Article 12, children have the right to express their views freely in all matters affecting them, and these views should be given due weight.",
  
  "discrimination": "All children have rights, regardless of race, color, gender, language, religion, opinions, origins, wealth, disability status, or any other status. This is protected by Article 2 of the UN Convention.",
  
  "help": "I can answer questions about children's rights, such as education, play, privacy, safety, healthcare, expressing opinions, and protection from discrimination. What would you like to know about?",
  
  "rights": "The UN Convention on the Rights of the Child lists all the rights that children have. These include the right to survival, to develop to the fullest, to protection from harmful influences, abuse and exploitation, and to participate fully in family, cultural and social life."
};

const findResponse = (message: string): string => {
  const lowerMessage = message.toLowerCase();
  
  // Check each keyword for a match
  for (const [keyword, response] of Object.entries(responses)) {
    if (lowerMessage.includes(keyword)) {
      return response;
    }
  }
  
  // Default response if no keywords match
  return "I'm not sure about that. You could ask me about education, play, privacy, bullying, healthcare, expressing opinions, or discrimination. Or type 'help' to see what I can help with!";
};

const Chatbot = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputMessage, setInputMessage] = useState("");
  const messageEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Math.random().toString(36).substring(2, 9),
      content: inputMessage,
      sender: "user",
      timestamp: new Date()
    };
    
    setMessages([...messages, userMessage]);
    setInputMessage("");
    
    // Simulate bot typing
    setTimeout(() => {
      const botResponse: Message = {
        id: Math.random().toString(36).substring(2, 9),
        content: findResponse(inputMessage),
        sender: "bot",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };
  
  return (
    <div className="container max-w-4xl mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Rights Chatbot</h1>
        <p className="text-muted-foreground">
          Ask questions about children's rights and get helpful answers
        </p>
      </div>
      
      <Card className="border-2">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src="/placeholder.svg" alt="Justice Bot" />
              <AvatarFallback className="bg-justice-blue text-white">JB</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>Justice Bot</CardTitle>
              <CardDescription>Your rights learning assistant</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] overflow-y-auto p-2 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.sender === "user"
                      ? "bg-justice-blue text-white"
                      : "bg-muted"
                  }`}
                >
                  <p>{message.content}</p>
                  <p className={`text-xs mt-1 ${
                    message.sender === "user" ? "text-white/70" : "text-muted-foreground"
                  }`}>
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messageEndRef} />
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex w-full space-x-2">
            <Input
              placeholder="Ask about children's rights..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1"
            />
            <Button onClick={handleSendMessage}>Send</Button>
          </div>
        </CardFooter>
      </Card>
      
      <div className="mt-6 p-4 bg-muted rounded-lg">
        <h3 className="font-medium mb-2">Suggested Questions</h3>
        <div className="flex flex-wrap gap-2">
          {[
            "What rights do children have?",
            "Tell me about the right to education",
            "What is the right to play?",
            "How can I stay safe from bullying?",
            "What should I do if my rights are not respected?"
          ].map((suggestion, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => {
                setInputMessage(suggestion);
              }}
            >
              {suggestion}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
