"use client";
import Image from "next/image";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const languages = [
  { value: "english", label: "English" },
  { value: "spanish", label: "Español" },
  { value: "french", label: "Français" },
  { value: "portuguese", label: "Português brasileiro" },
  { value: "arabic", label: "Arabic" },
  { value: "chinese_cn", label: "Chinese (China)" },
  { value: "chinese_hk", label: "Chinese (Hong Kong)" },
  { value: "chinese_tw", label: "Chinese (Taiwan)" },
  { value: "english_au", label: "English (AU)" },
  { value: "english_uk", label: "English (UK)" },
  { value: "english_us", label: "English (US)" },
  { value: "french_ca", label: "French (Canada)" },
  { value: "french_fr", label: "French (France)" },
  { value: "german", label: "German" },
  { value: "greek", label: "Greek" },
  { value: "hebrew", label: "Hebrew" },
  { value: "hindi", label: "Hindi" },
  { value: "italian", label: "Italian" },
  { value: "japanese", label: "Japanese" },
  { value: "korean", label: "Korean" },
  { value: "portuguese_br", label: "Portuguese (Brazil)" },
  { value: "portuguese_pt", label: "Portuguese (Portugal)" },
  { value: "russian", label: "Russian" },
  { value: "spanish_la", label: "Spanish (LatAm)" },
  { value: "spanish_sp", label: "Spanish (Spain)" },
  { value: "turkish", label: "Turkish" },
];

const purposeOptions = [
  "going on a first date",
  "ordering food",
  "taking a taxi",
  "booking a hotel room",
  "shopping at a market",
  "visiting a doctor",
  "making a phone call",
  "asking for directions",
  "attending a meeting",
  "introducing yourself",
];

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function TinyLessonPage() {
  const [purpose, setPurpose] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const router = useRouter();

  // Memoize random placeholder so it doesn't change on every keystroke
  const purposePlaceholder = useMemo(() => getRandomItem(purposeOptions), []);

  const handleGenerate = (e) => {
    e.preventDefault();
    const finalPurpose = purpose.trim() || purposePlaceholder;

    // Find the language label based on the selected value
    const selectedLanguageObject = languages.find(
      (lang) => lang.value === selectedLanguage
    );
    const finalLanguage = selectedLanguageObject
      ? selectedLanguageObject.label
      : selectedLanguage;

    // For now, just log the values
    console.log({
      language: finalLanguage,
      purpose: finalPurpose,
    });
    // Navigate to the result page with query parameters
    router.push(
      `/tiny-lesson/result?language=${encodeURIComponent(
        finalLanguage
      )}&purpose=${encodeURIComponent(finalPurpose)}`
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-white px-4 pb-16">
      {/* Heading */}
      <header className="w-full text-center py-6 border-b border-gray-100 mb-2">
        <h2 className="text-2xl font-medium tracking-tight">Tiny Lesson</h2>
      </header>
      {/* Main Content */}
      <main className="flex flex-col items-center w-full max-w-xl mx-auto mt-2">
        <Image
          src="/hand-ladybug.png"
          alt="Tiny Lesson"
          width={180}
          height={180}
          className="mb-4"
        />
        <span className="text-xs tracking-widest text-blue-700 font-mono font-semibold mb-2 block">
          EXPERIMENT NO. 001
        </span>
        <h1
          className="text-6xl font-black mb-2 text-center"
          style={{ fontFamily: "inherit", lineHeight: 1.1 }}
        >
          Tiny Lesson
        </h1>
        <p className="text-gray-500 text-lg text-center mb-8 max-w-md">
          Find relevant vocabulary, phrases, and grammar tips for any situation.
        </p>
        {/* Form */}
        <form
          className="w-full flex flex-col items-center gap-6 mt-2"
          onSubmit={handleGenerate}
        >
          <div className="w-full flex flex-col gap-5">
            {/* Language */}
            <div className="flex flex-col gap-2 w-full">
              <label className="text-xs font-semibold text-gray-400 mb-1 uppercase tracking-wider">
                Language
              </label>
              <Select
                value={selectedLanguage}
                onValueChange={setSelectedLanguage}
              >
                <SelectTrigger className="w-full rounded-full bg-gray-50 px-6 py-4 text-lg font-medium shadow-none border-0">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Purpose or Theme */}
            <div className="flex flex-col gap-2 w-full">
              <label className="text-xs font-semibold text-gray-400 mb-1 uppercase tracking-wider">
                Purpose or Theme
              </label>
              <input
                type="text"
                className="w-full rounded-full bg-gray-50 px-6 py-4 text-lg font-medium border-0 shadow-none placeholder-gray-400"
                placeholder={purposePlaceholder}
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
              />
            </div>
          </div>
          <Button
            className="rounded-full px-12 py-6 text-lg font-semibold bg-blue-100 text-blue-400 mt-2"
            type="submit"
            disabled={!selectedLanguage}
          >
            Generate ✨
          </Button>
        </form>
      </main>
    </div>
  );
}
