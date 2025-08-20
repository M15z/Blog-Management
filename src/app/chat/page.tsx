'use client'
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import { UserCircleIcon, PaperAirplaneIcon, MagnifyingGlassIcon, ArrowLeftIcon } from "@heroicons/react/24/solid";

interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
}

interface Message {
  id: string;
  content: string;
  senderId: string;
  conversationId: string;
  createdAt: string;
  sender: User;
}

interface Conversation {
  id: string;
  participants: User[];
  lastMessage?: Message;
  updatedAt: string;
}

export default function ChatPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [users, setUsers] = useState<User[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);

  // Fix hydration by ensuring client-side mounting
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Scroll to bottom of messages
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Fetch initial data
  useEffect(() => {
    if (status === "authenticated") {
      fetchUsers();
      fetchConversations();
    }
  }, [status]);

  // Fetch messages when active conversation changes
  useEffect(() => {
    if (activeConversation) {
      fetchMessages(activeConversation);
    } else {
      setMessages([]);
    }
  }, [activeConversation]);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users");
      if (response.ok) {
        const data = await response.json();
        setUsers(data.filter((user: User) => user.id !== session?.user?.id));
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchConversations = async () => {
    try {
      const response = await fetch("/api/conversations");
      if (response.ok) {
        const data = await response.json();
        setConversations(data);
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    try {
      const response = await fetch(`/api/conversations/${conversationId}/messages`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const startConversation = async (userId: string) => {
    try {
      const response = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ participantId: userId }),
      });

      if (response.ok) {
        const conversation = await response.json();
        setActiveConversation(conversation.id);
        setConversations(prev => {
          const exists = prev.find(c => c.id === conversation.id);
          return exists ? prev : [conversation, ...prev];
        });
      }
    } catch (error) {
      console.error("Error starting conversation:", error);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConversation || sending) return;

    setSending(true);
    const messageContent = newMessage;
    setNewMessage("");

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: messageContent,
          conversationId: activeConversation,
        }),
      });

      if (response.ok) {
        const newMsg = await response.json();
        setMessages(prev => [...prev, newMsg]);
      } else {
        setNewMessage(messageContent);
        throw new Error("Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const handleBackToConversations = () => {
    setActiveConversation(null);
    setMessages([]);
  };

  // Loading and authentication checks
  if (status === "loading" || !isMounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading chat...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  // Filter users based on search
  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get active conversation details
  const activeConv = conversations.find(c => c.id === activeConversation);
  const chatPartner = activeConv?.participants.find(p => p.id !== session?.user?.id);

  // Mobile-first approach - determine what to show
  const showSidebar = !activeConversation;
  const showChat = activeConversation;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="flex h-[calc(100vh-8rem)]">
            {/* Sidebar */}
            <div className={`w-full lg:w-80 border-r border-gray-200 flex flex-col ${activeConversation ? 'hidden lg:flex' : 'flex'}`}>
              {/* Header */}
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                  Messages
                </h1>
                
                {/* Search */}
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 outline-none text-sm"
                  />
                </div>
              </div>

              {/* Conversations & Users List */}
              <div className="flex-1 overflow-y-auto">
                {loading ? (
                  <div className="p-4 text-center text-gray-500">Loading...</div>
                ) : (
                  <div className="space-y-1 p-2">
                    {/* Existing Conversations */}
                    {conversations.map((conversation) => {
                      const partner = conversation.participants.find(p => p.id !== session?.user?.id);
                      return (
                        <button
                          key={conversation.id}
                          onClick={() => setActiveConversation(conversation.id)}
                          className={`w-full p-3 rounded-lg text-left hover:bg-gray-50 transition-colors ${
                            activeConversation === conversation.id ? 'bg-indigo-50 border border-indigo-200' : ''
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            {partner?.image ? (
                              <Image
                                src={partner.image}
                                alt={partner.name || "User"}
                                width={40}
                                height={40}
                                className="rounded-full object-cover"
                              />
                            ) : (
                              <UserCircleIcon className="h-10 w-10 text-gray-300" />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {partner?.name || "Unknown User"}
                              </p>
                              {conversation.lastMessage && (
                                <p className="text-xs text-gray-500 truncate">
                                  {conversation.lastMessage.content}
                                </p>
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })}

                    {/* Available Users to Start Chat */}
                    {searchQuery && (
                      <>
                        <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Start New Chat
                        </div>
                        {filteredUsers
                          .filter(user => !conversations.some(conv => 
                            conv.participants.some(p => p.id === user.id)
                          ))
                          .map((user) => (
                            <button
                              key={user.id}
                              onClick={() => startConversation(user.id)}
                              className="w-full p-3 rounded-lg text-left hover:bg-gray-50 transition-colors"
                            >
                              <div className="flex items-center space-x-3">
                                {user.image ? (
                                  <Image
                                    src={user.image}
                                    alt={user.name || "User"}
                                    width={40}
                                    height={40}
                                    className="rounded-full object-cover"
                                  />
                                ) : (
                                  <UserCircleIcon className="h-10 w-10 text-gray-300" />
                                )}
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 truncate">
                                    {user.name || "Unknown User"}
                                  </p>
                                  <p className="text-xs text-gray-500 truncate">
                                    {user.email}
                                  </p>
                                </div>
                              </div>
                            </button>
                          ))}
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Chat Area */}
            <div className={`flex-1 flex flex-col ${!activeConversation ? 'hidden lg:flex' : 'flex'}`}>
                {activeConversation ? (
                  <>
                    {/* Chat Header with Back Button */}
                    <div className="p-4 sm:p-6 border-b border-gray-200 bg-white">
                      <div className="flex items-center space-x-3">
                        {/* Back button - visible on mobile */}
                        <button
                          onClick={handleBackToConversations}
                          className="lg:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                        >
                          <ArrowLeftIcon className="h-5 w-5" />
                        </button>
                        
                        {chatPartner?.image ? (
                          <Image
                            src={chatPartner.image}
                            alt={chatPartner.name || "User"}
                            width={40}
                            height={40}
                            className="rounded-full object-cover"
                          />
                        ) : (
                          <UserCircleIcon className="h-10 w-10 text-gray-300" />
                        )}
                        <div className="flex-1 min-w-0">
                          <h2 className="text-lg font-semibold text-gray-900 truncate">
                            {chatPartner?.name || "Unknown User"}
                          </h2>
                          <p className="text-sm text-gray-500 truncate">{chatPartner?.email}</p>
                        </div>
                      </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {messages.length === 0 ? (
                        <div className="flex-1 flex items-center justify-center text-gray-500">
                          <p>No messages yet. Start the conversation!</p>
                        </div>
                      ) : (
                        messages.map((message) => {
                          const isOwn = message.senderId === session?.user?.id;
                          return (
                            <div
                              key={message.id}
                              className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                            >
                              <div className={`max-w-xs sm:max-w-md px-4 py-2 rounded-lg ${
                                isOwn 
                                  ? 'bg-indigo-600 text-white' 
                                  : 'bg-gray-100 text-gray-900'
                              }`}>
                                <p className="text-sm sm:text-base">{message.content}</p>
                                <p className={`text-xs mt-1 ${
                                  isOwn ? 'text-indigo-200' : 'text-gray-500'
                                }`}>
                                  {new Date(message.createdAt).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </p>
                              </div>
                            </div>
                          );
                        })
                      )}
                      <div ref={messagesEndRef} />
                    </div>

                    {/* Message Input */}
                    <form onSubmit={sendMessage} className="p-4 border-t border-gray-200 bg-white">
                      <div className="flex space-x-2">
                        <input
                          ref={messageInputRef}
                          type="text"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Type a message..."
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 outline-none"
                          disabled={sending}
                        />
                        <button
                          type="submit"
                          disabled={!newMessage.trim() || sending}
                          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-colors"
                        >
                          <PaperAirplaneIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </form>
                  </>
                ) : (
                  /* Empty State - Only visible on desktop */
                  <div className="hidden lg:flex flex-1 items-center justify-center p-8">
                    <div className="text-center">
                      <div className="text-6xl mb-4">💬</div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Start a Conversation
                      </h3>
                      <p className="text-gray-500 max-w-sm">
                        Search for users and select someone to start chatting with them.
                      </p>
                    </div>
                  </div>
                )}
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}