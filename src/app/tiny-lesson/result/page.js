"use client";
import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Volume2, Edit2, RefreshCw, X } from "lucide-react";
import { generateLessonData } from "../api";
import { getAudioUrl, getAllAudioUrls, getLanguageCode } from "@/utils/tts";

const testData = {
  vocabulary: [
    { word: "taxi", translation: "taxi" },
    { word: "cab", translation: "taxi" },
    { word: "fare", translation: "the fare" },
    { word: "meter", translation: "meter" },
    { word: "taxi", translation: "taxi" },
    { word: "cab", translation: "taxi" },
    { word: "fare", translation: "the fare" },
    { word: "meter", translation: "meter" },
  ],
  phrases: [
    {
      phrase: "Could you take me to this address?",
      translation: "Could you take me to this address?",
    },
    {
      phrase: "How much will it cost to get to the airport?",
      translation: "How much will it cost to get to the airport?",
    },
    {
      phrase: "Do you accept credit cards?",
      translation: "Do you accept credit cards?",
    },
    { phrase: "Keep the change.", translation: "Keep the change." },
    {
      phrase: "Could you take me to this address?",
      translation: "Could you take me to this address?",
    },
    {
      phrase: "How much will it cost to get to the airport?",
      translation: "How much will it cost to get to the airport?",
    },
    {
      phrase: "Do you accept credit cards?",
      translation: "Do you accept credit cards?",
    },
    { phrase: "Keep the change.", translation: "Keep the change." },
  ],
  tips: [
    {
      title: "Using 'would like' for polite requests",
      description:
        "When taking a taxi, it's helpful to know how to make polite requests! One very common way to do this in American English is by using 'would like'. 'Would like' is a polite way of saying 'want'. It's considered more formal and courteous, especially when you're asking someone for a service. The structure is typically 'I/We would like + to + verb'. For example, 'I would like to go to the airport'. It's also very common to contract 'I would' to 'I'd', making it sound more natural in conversation. So, instead of saying 'I would like to go...', you can say 'I'd like to go...'.",
      examples: [
        "I'd like to go to Grand Central Station, please.",
        "We would like to be dropped off at the corner of Elm Street and Main Street.",
      ],
    },
    {
      title: "Paying the fare and tipping",
      description:
        "In the US, it's customary to tip your taxi driver about 10-15% of the fare. You can pay with cash or, in many cities, with a credit card. Always check if the taxi accepts cards before your ride.",
      examples: ["How much is the fare?", "Can I pay with a credit card?"],
    },
  ],
};

// Component that uses useSearchParams
function TinyLessonContent() {
  const [tab, setTab] = useState("vocab");
  const [editMode, setEditMode] = useState(false);
  const [language, setLanguage] = useState("");
  const [topic, setTopic] = useState("");
  const [topicInput, setTopicInput] = useState("");
  const [showAllVocab, setShowAllVocab] = useState(false);
  const [showAllPhrases, setShowAllPhrases] = useState(false);
  const [showAllTips, setShowAllTips] = useState(false);
  const [lessonData, setLessonData] = useState(testData);
  const [loading, setLoading] = useState(false);
  const [playingAudio, setPlayingAudio] = useState(null);
  const [loadingAudio, setLoadingAudio] = useState(null);
  const audioRef = useRef(null);

  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize state from URL parameters
  useEffect(() => {
    const purposeParam = searchParams.get("purpose");
    const languageParam = searchParams.get("language");

    if (purposeParam) {
      setTopic(purposeParam);
      setTopicInput(purposeParam);
    }

    if (languageParam) {
      setLanguage(languageParam);
    }

    // Load data when parameters change
    if (languageParam && purposeParam) {
      fetchLessonData(languageParam, purposeParam);
    }
  }, [searchParams]);

  // Function to fetch lesson data
  const fetchLessonData = async (lang, top) => {
    if (!lang || !top) return;

    setLoading(true);
    try {
      // Call API to fetch data using our AI model
      const data = await generateLessonData(lang, top);
      setLessonData(data);
    } catch (error) {
      console.error("Failed to fetch lesson data:", error);
      // Keep using test data if there's an error
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setEditMode(true);
    setTopicInput(topic);
  };

  const handleSave = () => {
    setTopic(topicInput);
    setEditMode(false);

    // Update URL with new topic
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("purpose", topicInput);
    router.push(`/tiny-lesson/result?${newSearchParams.toString()}`);
  };

  const handleClose = () => {
    router.push("/tiny-lesson");
  };

  const handleRefresh = () => {
    // Fetch new data
    fetchLessonData(language, topic);
  };

  // Function to handle TTS with visual feedback
  const handleSpeak = (text, itemId) => {
    if (!text || !language) return;

    // Stop any currently playing audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    // If clicking the same item that's already playing, stop it
    if (playingAudio === itemId) {
      setPlayingAudio(null);
      return;
    }

    // Set loading state
    setLoadingAudio(itemId);

    try {
      // For text longer than 200 characters, we need to handle it differently
      if (text.length > 200) {
        // Get all audio URLs for the long text
        const audioSegments = getAllAudioUrls(text, {
          lang: getLanguageCode(language),
        });
        if (!audioSegments.length) {
          setLoadingAudio(null);
          return;
        }

        // Create the first audio element
        const audio = new Audio(audioSegments[0].url);

        // Set up loading handlers
        audio.oncanplaythrough = () => {
          setLoadingAudio(null);
          setPlayingAudio(itemId);
          audioRef.current = audio;

          let currentIndex = 0;
          // Play function that handles all segments sequentially
          const playNextSegment = () => {
            if (currentIndex >= audioSegments.length) {
              setPlayingAudio(null);
              audioRef.current = null;
              return;
            }

            const segmentAudio = new Audio(audioSegments[currentIndex].url);
            audioRef.current = segmentAudio;

            segmentAudio.onended = () => {
              currentIndex++;
              playNextSegment();
            };

            segmentAudio.onerror = () => {
              console.error("Error playing audio segment");
              currentIndex++;
              playNextSegment();
            };

            segmentAudio.play().catch((err) => {
              console.error("Error starting audio playback:", err);
              currentIndex++;
              playNextSegment();
            });
          };

          playNextSegment();
        };

        audio.onerror = () => {
          console.error("Error loading audio");
          setLoadingAudio(null);
        };

        // Trigger loading
        audio.load();
        return;
      }

      // For shorter text (under 200 chars)
      const audioUrl = getAudioUrl(text, { lang: getLanguageCode(language) });
      if (!audioUrl) {
        setLoadingAudio(null);
        return;
      }

      // Create and play audio
      const audio = new Audio(audioUrl);

      // Handle errors during loading
      audio.onerror = () => {
        console.error("Error loading audio");
        setLoadingAudio(null);
        setPlayingAudio(null);
      };

      // When audio can play, start playing
      audio.oncanplaythrough = () => {
        setLoadingAudio(null);
        setPlayingAudio(itemId);
        audioRef.current = audio;

        audio.play().catch((err) => {
          console.error("Error playing audio:", err);
          setPlayingAudio(null);
        });
      };

      // Reset playing state when audio ends
      audio.onended = () => {
        setPlayingAudio(null);
        audioRef.current = null;
      };

      // Trigger loading
      audio.load();
    } catch (error) {
      console.error("TTS error:", error);
      setLoadingAudio(null);
    }
  };

  // Vocab/Phrases slice logic
  const vocabToShow = showAllVocab
    ? lessonData.vocabulary
    : lessonData.vocabulary.slice(0, 4);
  const phrasesToShow = showAllPhrases
    ? lessonData.phrases
    : lessonData.phrases.slice(0, 4);
  // Tips logic
  const tipsToShow = showAllTips ? lessonData.tips : [lessonData.tips[0]];

  // Render loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white px-4 pb-16 flex flex-col items-center justify-center">
        <div className="text-2xl font-bold mb-4">Loading your lesson...</div>
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-blue-200 h-12 w-12"></div>
          <div className="rounded-full bg-blue-300 h-12 w-12"></div>
          <div className="rounded-full bg-blue-400 h-12 w-12"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-4 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-10 pb-4">
        <div>
          <h1 className="text-5xl md:text-6xl font-black leading-tight mb-2">
            <span className="text-blue-600">{language} for</span>{" "}
            {editMode ? (
              <span className="inline-flex items-center gap-2">
                <input
                  className="text-black font-black text-4xl md:text-5xl px-2 py-1 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  value={topicInput}
                  onChange={(e) => setTopicInput(e.target.value)}
                  autoFocus
                />
                <Button
                  size="sm"
                  className="ml-2 px-4 py-1 text-base font-semibold"
                  onClick={handleSave}
                >
                  Save
                </Button>
              </span>
            ) : (
              <span className="text-black">{topic}</span>
            )}
          </h1>
        </div>
        <div className="flex gap-3 self-end">
          <Button
            size="icon"
            variant="ghost"
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={handleEdit}
            aria-label="Edit topic"
          >
            <Edit2 size={22} />
          </Button>
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
      {/* Tabs */}
      <Tabs value={tab} onValueChange={setTab} className="mt-8">
        <TabsList className="flex gap-6 bg-transparent mb-8">
          <TabsTrigger
            value="vocab"
            className="rounded-full px-6 py-2 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 flex items-center gap-2"
          >
            <span role="img" aria-label="vocab">
              📝
            </span>{" "}
            Vocabulary
          </TabsTrigger>
          <TabsTrigger
            value="phrases"
            className="rounded-full px-6 py-2 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 flex items-center gap-2"
          >
            <span role="img" aria-label="phrases">
              💬
            </span>{" "}
            Phrases
          </TabsTrigger>
          <TabsTrigger
            value="tips"
            className="rounded-full px-6 py-2 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 flex items-center gap-2"
          >
            <span role="img" aria-label="tips">
              📖
            </span>{" "}
            Tips
          </TabsTrigger>
        </TabsList>
        {/* Vocabulary Tab */}
        <TabsContent value="vocab">
          <h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
            <span role="img" aria-label="vocab">
              📝
            </span>{" "}
            Vocabulary
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {vocabToShow.map((item, i) => (
              <Card
                key={i}
                className="flex flex-row items-center justify-between bg-blue-50 px-6 py-6 rounded-2xl shadow-none"
              >
                <div>
                  <div className="text-xl font-semibold text-black mb-1">
                    {item.word}
                  </div>
                  <div className="text-gray-500 text-base">
                    {item.translation}
                  </div>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  className={`${
                    playingAudio === `vocab-${i}` ? "bg-blue-200" : ""
                  } text-blue-600`}
                  onClick={() => handleSpeak(item.word, `vocab-${i}`)}
                  aria-label={
                    playingAudio === `vocab-${i}`
                      ? "Stop speaking"
                      : "Speak word"
                  }
                  disabled={loadingAudio === `vocab-${i}`}
                >
                  {loadingAudio === `vocab-${i}` ? (
                    <div className="w-5 h-5 border-2 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
                  ) : (
                    <Volume2 size={20} />
                  )}
                </Button>
              </Card>
            ))}
          </div>
          {lessonData.vocabulary.length > 4 && (
            <Button
              className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full py-6 text-lg font-semibold"
              onClick={() => setShowAllVocab((v) => !v)}
            >
              {showAllVocab ? "See less ▲" : "See more ▼"}
            </Button>
          )}
        </TabsContent>
        {/* Phrases Tab */}
        <TabsContent value="phrases">
          <h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
            <span role="img" aria-label="phrases">
              💬
            </span>{" "}
            Phrases
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {phrasesToShow.map((item, i) => (
              <Card
                key={i}
                className="flex flex-row items-center justify-between bg-blue-50 px-6 py-6 rounded-2xl shadow-none"
              >
                <div>
                  <div className="text-lg font-semibold text-black mb-1">
                    {item.phrase}
                  </div>
                  <div className="text-gray-500 text-base">
                    {item.translation}
                  </div>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  className={`${
                    playingAudio === `phrase-${i}` ? "bg-blue-200" : ""
                  } text-blue-600`}
                  onClick={() => handleSpeak(item.phrase, `phrase-${i}`)}
                  aria-label={
                    playingAudio === `phrase-${i}`
                      ? "Stop speaking"
                      : "Speak phrase"
                  }
                  disabled={loadingAudio === `phrase-${i}`}
                >
                  {loadingAudio === `phrase-${i}` ? (
                    <div className="w-5 h-5 border-2 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
                  ) : (
                    <Volume2 size={20} />
                  )}
                </Button>
              </Card>
            ))}
          </div>
          {lessonData.phrases.length > 4 && (
            <Button
              className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full py-6 text-lg font-semibold"
              onClick={() => setShowAllPhrases((v) => !v)}
            >
              {showAllPhrases ? "See less ▲" : "See more ▼"}
            </Button>
          )}
        </TabsContent>
        {/* Tips Tab */}
        <TabsContent value="tips">
          <h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
            <span role="img" aria-label="tips">
              📖
            </span>{" "}
            Tips
          </h2>
          {tipsToShow.map((currentTip, idx) => (
            <Card
              key={idx}
              className="bg-blue-50 p-8 rounded-2xl shadow-none mb-8"
            >
              <div className="text-xl font-bold mb-2">{currentTip.title}</div>
              <div className="text-gray-700 mb-4">{currentTip.description}</div>
              <div className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">
                Examples
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentTip.examples.map((ex, i) => (
                  <Card
                    key={i}
                    className="flex flex-row items-center justify-between bg-blue-100 px-6 py-6 rounded-2xl shadow-none"
                  >
                    <div className="text-lg font-semibold text-black">
                      {ex}{" "}
                      <span
                        className="ml-2 text-blue-400 cursor-pointer"
                        title="Info"
                      >
                        ⓘ
                      </span>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      className={`${
                        playingAudio === `tip-${idx}-ex-${i}`
                          ? "bg-blue-200"
                          : ""
                      } text-blue-600`}
                      onClick={() => handleSpeak(ex, `tip-${idx}-ex-${i}`)}
                      aria-label={
                        playingAudio === `tip-${idx}-ex-${i}`
                          ? "Stop speaking"
                          : "Speak example"
                      }
                      disabled={loadingAudio === `tip-${idx}-ex-${i}`}
                    >
                      {loadingAudio === `tip-${idx}-ex-${i}` ? (
                        <div className="w-5 h-5 border-2 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
                      ) : (
                        <Volume2 size={20} />
                      )}
                    </Button>
                  </Card>
                ))}
              </div>
            </Card>
          ))}
          {lessonData.tips.length > 1 && (
            <Button
              className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full py-6 text-lg font-semibold"
              onClick={() => setShowAllTips((v) => !v)}
            >
              {showAllTips ? "See less ▲" : "See more ▼"}
            </Button>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Main component with Suspense boundary
export default function TinyLessonResultPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white px-4 pb-16 flex flex-col items-center justify-center">
          <div className="text-2xl font-bold mb-4">Loading...</div>
          <div className="animate-pulse flex space-x-4">
            <div className="rounded-full bg-blue-200 h-12 w-12"></div>
            <div className="rounded-full bg-blue-300 h-12 w-12"></div>
            <div className="rounded-full bg-blue-400 h-12 w-12"></div>
          </div>
        </div>
      }
    >
      <TinyLessonContent />
    </Suspense>
  );
}
