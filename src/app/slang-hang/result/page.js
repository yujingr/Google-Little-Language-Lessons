"use client";
import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Volume2, RefreshCw, X } from "lucide-react";
import { generateConversationData } from "../api";
import { getAudioUrl, getLanguageCode } from "@/utils/tts";

// Sample test data for initial rendering
const testData = {
  context: {
    setting: "A cramped capsule hotel room in Tokyo",
    relationship: "Strangers who were accidentally assigned the same room",
    speakers: [
      {
        name: "Meilin",
        background: "A young architect from Shanghai, visiting Tokyo for work",
        personality: "Serious, detail-oriented",
      },
      {
        name: "Jian",
        background: "A musician from Beijing, traveling for inspiration",
        personality: "Laid-back, optimistic",
      },
    ],
  },
  messages: [
    {
      speaker: "Meilin",
      text: "这... 搞什么呢? 我明明订的是单人间!",
      translation: "What's going on? I clearly booked a single room!",
      transliteration:
        "Zhè... gǎo shénme ne? Wǒ míngmíng dìng de shì dānrén jiān!",
    },
    {
      speaker: "Jian",
      text: "哎呀，别生气嘛。既来之，则安之。看看情况再说。",
      translation:
        "Oh, don't be angry. Now that it's here, just make the best of it. Let's see how it goes.",
      transliteration:
        "Āiyā, bié shēngqì ma. Jì lái zhī, zé ān zhī. Kànkan qíngkuàng zài shuō.",
    },
  ],
  slangTerms: [
    {
      term: "搞什么",
      definition:
        "An informal way to say 'what's going on' or 'what are you doing', expressing confusion or slight irritation",
      example:
        "你搞什么呢？我们要迟到了！(What are you doing? We're going to be late!)",
    },
    {
      term: "既来之，则安之",
      definition:
        "A Chinese proverb meaning 'since you've come, you might as well make the best of it' or 'make yourself comfortable with the situation'",
      example:
        "虽然不是我们计划的酒店，但既来之则安之，我们可以享受一下。(Although it's not the hotel we planned, since we're here, let's make the best of it and enjoy.)",
      origin:
        "From Confucian philosophy, emphasizing adaptation to circumstances",
    },
  ],
};

function MessageBubble({ message, language, isUserPrompt, speakers }) {
  const [playingAudio, setPlayingAudio] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  const audioRef = useRef(null);

  const isSystemMessage = !message.speaker;

  // Determine if this speaker is the first or second speaker
  const isFirstSpeaker =
    speakers?.length > 0 && message.speaker === speakers[0]?.name;

  // Align based on speaker position - first speaker left, second speaker right
  const alignment = isSystemMessage
    ? "justify-center"
    : isFirstSpeaker
    ? "justify-start"
    : "justify-end";

  // Get background color based on speaker position
  const getBgColor = () => {
    if (isSystemMessage) return "bg-gray-100";
    return isFirstSpeaker ? "bg-blue-100" : "bg-indigo-100";
  };

  // Function to handle TTS
  const handleSpeak = () => {
    if (!message.text || !language) return;

    // If already playing, stop it
    if (playingAudio) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setPlayingAudio(false);
      return;
    }

    // Get audio URL
    const audioUrl = getAudioUrl(message.text, {
      lang: getLanguageCode(language),
    });

    if (!audioUrl) return;

    // Create and play audio
    const audio = new Audio(audioUrl);
    audioRef.current = audio;

    // Set playing state
    setPlayingAudio(true);

    // Reset playing state when audio ends
    audio.onended = () => {
      setPlayingAudio(false);
      audioRef.current = null;
    };

    // Handle errors
    audio.onerror = () => {
      console.error("Error playing audio");
      setPlayingAudio(false);
    };

    // Play audio
    audio.play().catch((err) => {
      console.error("Error playing audio:", err);
      setPlayingAudio(false);
    });
  };

  // Toggle translation visibility
  const toggleTranslation = () => {
    setShowTranslation(!showTranslation);
  };

  if (isSystemMessage) {
    return (
      <div className="flex justify-center my-4">
        <div className="px-6 py-3 rounded-lg bg-green-100 text-green-800 max-w-[80%] text-sm">
          {message.text}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${alignment} my-6 max-w-full`}>
      <div
        className={`px-5 py-4 rounded-2xl ${getBgColor()} max-w-[80%] shadow-sm`}
      >
        <div className="text-xs font-semibold mb-2 text-gray-500">
          {message.speaker}
        </div>
        <p className="text-lg mb-2 font-medium">{message.text}</p>

        {showTranslation && message.translation && (
          <p className="text-sm text-gray-600 italic border-t border-gray-200 pt-2 mt-1">
            {message.translation}
          </p>
        )}

        {message.transliteration && (
          <p className="text-xs text-gray-500 mt-2 border-t border-gray-100 pt-1">
            {message.transliteration}
          </p>
        )}

        <div className="flex mt-2 justify-end space-x-2">
          {message.translation && (
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 rounded-full hover:bg-opacity-20 hover:bg-blue-200"
              onClick={toggleTranslation}
            >
              <span className="text-xs font-bold text-gray-500">
                {showTranslation ? "EN" : "en"}
              </span>
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0 rounded-full hover:bg-opacity-20 hover:bg-blue-200"
            onClick={handleSpeak}
          >
            <Volume2
              size={16}
              className={playingAudio ? "text-blue-600" : "text-gray-500"}
            />
          </Button>
        </div>
      </div>
    </div>
  );
}

function SlangTermCard({ term }) {
  return (
    <Card className="mb-6 p-5 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow">
      <h3 className="text-xl font-bold text-blue-800 mb-2">{term.term}</h3>
      <p className="text-gray-700 mt-1">{term.definition}</p>

      {term.example && (
        <div className="mt-3 bg-blue-50 p-3 rounded-lg">
          <span className="text-xs font-semibold text-blue-500 uppercase tracking-wider">
            Example
          </span>
          <p className="text-gray-700 italic mt-1">{term.example}</p>
        </div>
      )}

      {term.origin && (
        <div className="mt-3">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Origin
          </span>
          <p className="text-gray-700 mt-1">{term.origin}</p>
        </div>
      )}
    </Card>
  );
}

function SlangHangContent({ language: initialLanguage }) {
  const [tab, setTab] = useState("conversation");
  const [language, setLanguage] = useState(initialLanguage || "");
  const [conversationData, setConversationData] = useState(testData);
  const [allMessages, setAllMessages] = useState([]); // Store all messages
  const [displayedMessages, setDisplayedMessages] = useState([]); // Only show a portion
  const [currentSegment, setCurrentSegment] = useState(1);
  const [slangTerms, setSlangTerms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [canContinue, setCanContinue] = useState(true);
  const messagesEndRef = useRef(null);

  // Define how many messages to show per segment
  const MESSAGES_PER_SEGMENT = 2;

  const router = useRouter();

  // Handle keypress to reveal next segment
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.code === "Space" && canContinue && !loading) {
        event.preventDefault();
        handleContinue();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [canContinue, loading, currentSegment, allMessages]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [displayedMessages]);

  // Initialize state and fetch data when language changes
  useEffect(() => {
    if (language) {
      fetchConversationData(language);
    }
  }, [language]);

  // Update messages and slang terms when conversation data changes
  useEffect(() => {
    if (conversationData) {
      setAllMessages(conversationData.messages || []);
      // Initially display only the first segment
      setDisplayedMessages(
        (conversationData.messages || []).slice(0, MESSAGES_PER_SEGMENT)
      );
      setSlangTerms(conversationData.slangTerms || []);
    }
  }, [conversationData]);

  // Function to fetch conversation data
  const fetchConversationData = async (lang) => {
    if (!lang) return;

    setLoading(true);
    try {
      // Call API to fetch data
      const data = await generateConversationData(lang);
      setConversationData(data);
      setCurrentSegment(1);
    } catch (error) {
      console.error("Failed to fetch conversation data:", error);
      // Keep using test data if there's an error
    } finally {
      setLoading(false);
    }
  };

  // Function to reveal next segment of the conversation
  const handleContinue = () => {
    // Check if we've displayed all messages
    if (currentSegment * MESSAGES_PER_SEGMENT >= allMessages.length) {
      // We've reached the end of the conversation
      return;
    }

    // Calculate the next segment to show
    const nextSegment = currentSegment + 1;
    const endIndex = Math.min(
      nextSegment * MESSAGES_PER_SEGMENT,
      allMessages.length
    );

    // Add a system message indicating the continuation
    const updatedMessages = [
      ...displayedMessages,
      { text: "Continuing the conversation..." },
      ...allMessages.slice(
        displayedMessages.filter((m) => m.speaker).length,
        endIndex
      ),
    ];

    setDisplayedMessages(updatedMessages);
    setCurrentSegment(nextSegment);

    // Update slang terms based on the displayed messages
    updateSlangTermsForDisplayedMessages(updatedMessages);
  };

  // Function to update the slang terms that correspond to the displayed messages
  const updateSlangTermsForDisplayedMessages = (messages) => {
    // In a real implementation, you might want to filter slang terms to only show
    // those that have appeared in the messages displayed so far
    // For simplicity, we're showing all slang terms regardless
  };

  const handleRefresh = () => {
    // Fetch new conversation
    fetchConversationData(language);
  };

  const handleClose = () => {
    router.push("/slang-hang");
  };

  // Calculate if we have more messages to show
  const hasMoreMessages =
    allMessages.length > displayedMessages.filter((m) => m.speaker).length;

  // Full-screen loading overlay
  if (loading) {
    return (
      <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50">
        <div className="text-3xl font-bold mb-6">
          Generating conversation...
        </div>
        <div className="flex items-center justify-center space-x-3">
          <div
            className="w-4 h-4 bg-blue-600 rounded-full animate-bounce"
            style={{ animationDelay: "0ms" }}
          ></div>
          <div
            className="w-4 h-4 bg-blue-600 rounded-full animate-bounce"
            style={{ animationDelay: "150ms" }}
          ></div>
          <div
            className="w-4 h-4 bg-blue-600 rounded-full animate-bounce"
            style={{ animationDelay: "300ms" }}
          ></div>
          <div
            className="w-4 h-4 bg-blue-600 rounded-full animate-bounce"
            style={{ animationDelay: "450ms" }}
          ></div>
        </div>
        <div className="mt-8 text-gray-500">This may take a few moments...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-4 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-10 pb-4">
        <div>
          <h1 className="text-5xl md:text-6xl font-black leading-tight mb-2">
            Slang Hang
          </h1>
          <p className="text-xl text-gray-600">
            Learning {language} slang through conversation
          </p>
        </div>
        <div className="flex gap-3 self-end">
          <Button
            size="icon"
            variant="ghost"
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={handleRefresh}
            aria-label="Refresh"
          >
            <RefreshCw size={22} />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={handleClose}
            aria-label="Close"
          >
            <X size={22} />
          </Button>
        </div>
      </div>

      {/* Context Information */}
      {conversationData.context && (
        <div className="bg-gray-100 rounded-xl p-4 mb-6">
          <h2 className="text-xl font-bold mb-2">Setting</h2>
          <p className="mb-4">{conversationData.context.setting}</p>

          <h2 className="text-xl font-bold mb-2">Speakers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {conversationData.context.speakers.map((speaker, i) => (
              <div key={i} className="bg-white p-3 rounded-lg">
                <h3 className="font-bold">{speaker.name}</h3>
                <p className="text-sm text-gray-600">{speaker.background}</p>
                {speaker.personality && (
                  <p className="text-sm italic mt-1">{speaker.personality}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tabs */}
      <Tabs value={tab} onValueChange={setTab} className="mt-8">
        <TabsList className="flex gap-6 bg-transparent mb-8">
          <TabsTrigger
            value="conversation"
            className="rounded-full px-6 py-2 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 flex items-center gap-2"
          >
            <span role="img" aria-label="conversation">
              💬
            </span>{" "}
            Conversation
          </TabsTrigger>
          <TabsTrigger
            value="slang"
            className="rounded-full px-6 py-2 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 flex items-center gap-2"
          >
            <span role="img" aria-label="slang">
              📝
            </span>{" "}
            Slang Glossary
          </TabsTrigger>
        </TabsList>

        {/* Conversation Tab */}
        <TabsContent value="conversation" className="focus:outline-none">
          <div className="bg-gray-50 rounded-xl p-6 min-h-[500px] relative shadow-inner">
            <div className="overflow-y-auto max-h-[600px] space-y-2 mb-20 px-4">
              {displayedMessages.map((message, i) => (
                <MessageBubble
                  key={i}
                  message={message}
                  language={language}
                  isUserPrompt={!message.speaker}
                  speakers={conversationData.context?.speakers}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Continue button */}
            <div className="absolute bottom-6 left-0 right-0 flex justify-center">
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-full py-2 px-8 text-base shadow-md"
                onClick={handleContinue}
                disabled={loading || !hasMoreMessages}
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></div>
                    Loading...
                  </div>
                ) : hasMoreMessages ? (
                  <>Press space to continue</>
                ) : (
                  <>Conversation complete</>
                )}
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* Slang Glossary Tab */}
        <TabsContent value="slang" className="focus:outline-none">
          <div className="bg-gray-50 rounded-xl p-6 shadow-inner">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <span className="bg-blue-100 text-blue-700 w-8 h-8 rounded-full inline-flex items-center justify-center mr-2">
                <span role="img" aria-label="slang">
                  📝
                </span>
              </span>
              Slang Glossary
            </h2>
            {slangTerms.length > 0 ? (
              slangTerms.map((term, i) => <SlangTermCard key={i} term={term} />)
            ) : (
              <p className="text-gray-500 text-center py-10">
                No slang terms available yet.
              </p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Main component
export default function SlangHangResultPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-3xl font-bold">Loading...</div>
        </div>
      }
    >
      <SlangHangWrapper />
    </Suspense>
  );
}

// Client component that uses useSearchParams
function SlangHangWrapper() {
  const searchParams = useSearchParams();
  const language = searchParams.get("language");

  return <SlangHangContent language={language} />;
}
