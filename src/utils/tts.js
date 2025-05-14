// Browser-compatible implementation based on @sefinek/google-tts-api
// Map language names to Google TTS language codes (BCP-47)
const languageCodeMap = {
  // Language labels with BCP-47 codes
  English: "en",
  "English (US)": "en-US",
  "English (UK)": "en-GB",
  "English (AU)": "en-AU",
  Español: "es-ES",
  Spanish: "es-ES",
  "Spanish (Spain)": "es-ES",
  "Spanish (LatAm)": "es-419",
  Français: "fr-FR",
  French: "fr-FR",
  "French (France)": "fr-FR",
  "French (Canada)": "fr-CA",
  "Português brasileiro": "pt-BR",
  Portuguese: "pt-PT",
  "Portuguese (Brazil)": "pt-BR",
  "Portuguese (Portugal)": "pt-PT",
  Arabic: "ar-XA",
  Chinese: "zh",
  "Chinese (China)": "zh-CN",
  "Chinese (Hong Kong)": "zh-HK",
  "Chinese (Taiwan)": "zh-TW",
  German: "de-DE",
  Greek: "el-GR",
  Hebrew: "he-IL",
  Hindi: "hi-IN",
  Italian: "it-IT",
  Japanese: "ja-JP",
  Korean: "ko-KR",
  Russian: "ru-RU",
  Turkish: "tr-TR",
  Dutch: "nl-NL",
  Indonesian: "id-ID",
  Polish: "pl-PL",
  Thai: "th-TH",
  Vietnamese: "vi-VN",
  Czech: "cs-CZ",
  Danish: "da-DK",
  Finnish: "fi-FI",
  Norwegian: "no-NO",
  Swedish: "sv-SE",
  Bengali: "bn-IN",
  Bulgarian: "bg-BG",
  Croatian: "hr-HR",
  Filipino: "fil-PH",
  Hungarian: "hu-HU",
  Latvian: "lv-LV",
  Lithuanian: "lt-LT",
  Romanian: "ro-RO",
  Serbian: "sr-RS",
  Slovak: "sk-SK",
  Slovenian: "sl-SI",
  Ukrainian: "uk-UA",
  Malay: "ms-MY",
  Estonian: "et-EE",
  Afrikaans: "af-ZA",
  Albanian: "sq-AL",
  Amharic: "am-ET",
  Armenian: "hy-AM",
  Azerbaijani: "az-AZ",
  Basque: "eu-ES",
  Bengali: "bn-IN",
  Bosnian: "bs-BA",
  Catalan: "ca-ES",
  Georgian: "ka-GE",
  Gujarati: "gu-IN",
  Icelandic: "is-IS",
  Kannada: "kn-IN",
  Kazakh: "kk-KZ",
  Khmer: "km-KH",
  Macedonian: "mk-MK",
  Malayalam: "ml-IN",
  Marathi: "mr-IN",
  Nepali: "ne-NP",
  Persian: "fa-IR",
  Punjabi: "pa-IN",
  Sinhala: "si-LK",
  Swahili: "sw-KE",
  Tamil: "ta-IN",
  Telugu: "te-IN",
  Urdu: "ur-PK",
  Zulu: "zu-ZA",

  // Language values (lowercase) mapped to BCP-47 codes
  english: "en-US",
  english_us: "en-US",
  english_uk: "en-GB",
  english_au: "en-AU",
  spanish: "es-ES",
  spanish_sp: "es-ES",
  spanish_la: "es-419",
  french: "fr-FR",
  french_fr: "fr-FR",
  french_ca: "fr-CA",
  portuguese: "pt-PT",
  portuguese_br: "pt-BR",
  portuguese_pt: "pt-PT",
  arabic: "ar-XA",
  chinese: "zh",
  chinese_cn: "zh-CN",
  chinese_hk: "zh-HK",
  chinese_tw: "zh-TW",
  german: "de-DE",
  greek: "el-GR",
  hebrew: "he-IL",
  hindi: "hi-IN",
  italian: "it-IT",
  japanese: "ja-JP",
  korean: "ko-KR",
  russian: "ru-RU",
  turkish: "tr-TR",
  dutch: "nl-NL",
  indonesian: "id-ID",
  polish: "pl-PL",
  thai: "th-TH",
  vietnamese: "vi-VN",
  czech: "cs-CZ",
  danish: "da-DK",
  finnish: "fi-FI",
  norwegian: "no-NO",
  swedish: "sv-SE",
  bengali: "bn-IN",
  bulgarian: "bg-BG",
  croatian: "hr-HR",
  filipino: "fil-PH",
  hungarian: "hu-HU",
  latvian: "lv-LV",
  lithuanian: "lt-LT",
  romanian: "ro-RO",
  serbian: "sr-RS",
  slovak: "sk-SK",
  slovenian: "sl-SI",
  ukrainian: "uk-UA",
  malay: "ms-MY",
  estonian: "et-EE",
  afrikaans: "af-ZA",
  albanian: "sq-AL",
  amharic: "am-ET",
  armenian: "hy-AM",
  azerbaijani: "az-AZ",
  basque: "eu-ES",
  bosnian: "bs-BA",
  catalan: "ca-ES",
  georgian: "ka-GE",
  gujarati: "gu-IN",
  icelandic: "is-IS",
  kannada: "kn-IN",
  kazakh: "kk-KZ",
  khmer: "km-KH",
  macedonian: "mk-MK",
  malayalam: "ml-IN",
  marathi: "mr-IN",
  nepali: "ne-NP",
  persian: "fa-IR",
  punjabi: "pa-IN",
  sinhala: "si-LK",
  swahili: "sw-KE",
  tamil: "ta-IN",
  telugu: "te-IN",
  urdu: "ur-PK",
  zulu: "zu-ZA",
};

/**
 * Split long text into array of shorter strings
 * @param {string} text - Text to split
 * @param {object} options - Options
 * @param {number} options.maxLength - Maximum length of each chunk
 * @param {string} options.splitPunct - Additional punctuation to split on
 * @returns {string[]} - Array of text chunks
 */
function splitLongText(text, { maxLength = 200, splitPunct = "" } = {}) {
  // Define space and punctuation regex
  const spaceAndPunct =
    " \uFEFF\xA0!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~" + splitPunct;

  // Helper function to check if character is space or punctuation
  const isSpaceOrPunct = (s, i) => {
    return spaceAndPunct.includes(s.charAt(i));
  };

  // Find last index of space or punctuation in a range
  const lastIndexOfSpaceOrPunct = (s, left, right) => {
    for (let i = right; i >= left; i--) {
      if (isSpaceOrPunct(s, i)) return i;
    }
    return -1; // not found
  };

  const result = [];
  let start = 0;

  while (true) {
    // Check if remaining text is short enough
    if (text.length - start <= maxLength) {
      result.push(text.slice(start));
      break;
    }

    // Check if we can split at maxLength
    let end = start + maxLength - 1;
    if (isSpaceOrPunct(text, end) || isSpaceOrPunct(text, end + 1)) {
      result.push(text.slice(start, end + 1));
      start = end + 1;
      continue;
    }

    // Find last space or punctuation
    end = lastIndexOfSpaceOrPunct(text, start, end);
    if (end === -1) {
      // If no space found, force split at maxLength
      result.push(text.slice(start, start + maxLength));
      start += maxLength;
    } else {
      // Split at found position
      result.push(text.slice(start, end + 1));
      start = end + 1;
    }
  }

  return result;
}

/**
 * Generate TTS audio URL using our proxy API
 * @param {string} text - Text to convert to speech (max 200 chars)
 * @param {object} options - Options
 * @param {string} options.lang - Language code
 * @param {boolean} options.slow - Whether to speak slowly
 * @returns {string} - Audio URL
 */
export function getAudioUrl(text, { lang = "en", slow = false } = {}) {
  // Input validation
  if (typeof text !== "string" || text.length === 0) {
    throw new TypeError("text should be a string");
  }
  if (typeof lang !== "string" || lang.length === 0) {
    throw new TypeError("lang should be a string");
  }
  if (typeof slow !== "boolean") {
    throw new TypeError("slow should be a boolean");
  }

  if (text.length > 200) {
    throw new RangeError(
      `text length (${text.length}) should be less than 200 characters. Use getAllAudioUrls for long text.`
    );
  }

  // Build query parameters using our proxy API
  const params = new URLSearchParams({
    text: text,
    lang: lang,
    slow: slow ? "true" : "false",
  });

  return `/api/tts?${params.toString()}`;
}

/**
 * Split long text and generate multiple audio URLs
 * @param {string} text - Text to convert to speech
 * @param {object} options - Options
 * @returns {Array<{shortText: string, url: string}>} - List of text chunks and URLs
 */
export function getAllAudioUrls(
  text,
  { lang = "en", slow = false, splitPunct = "" } = {}
) {
  // Input validation
  if (typeof text !== "string" || text.length === 0) {
    throw new TypeError("text should be a string");
  }
  if (typeof splitPunct !== "string") {
    throw new TypeError("splitPunct should be a string");
  }

  return splitLongText(text, { splitPunct }).map((shortText) => ({
    shortText,
    url: getAudioUrl(shortText, { lang, slow }),
  }));
}

/**
 * Get the appropriate language code for Google TTS
 * @param {string} language - The language name or code
 * @returns {string} - The language code
 */
export function getLanguageCode(language) {
  return languageCodeMap[language] || "en-US";
}

/**
 * Get the audio URL for text-to-speech
 * @param {string} text - The text to convert to speech
 * @param {string} language - The language name or code
 * @returns {string} - The audio URL
 */
export function getTextToSpeechUrl(text, language) {
  try {
    if (!text || text.trim() === "") {
      console.warn("Empty text provided to TTS");
      return null;
    }

    // Get the language code
    const langCode = getLanguageCode(language);

    // If text is longer than 200 characters, use getAllAudioUrls
    if (text.length > 200) {
      const results = getAllAudioUrls(text, { lang: langCode });
      // Return the first URL for simplicity
      return results[0]?.url;
    }

    // Otherwise, get a single URL
    return getAudioUrl(text, { lang: langCode });
  } catch (error) {
    console.error("Error generating TTS URL:", error);
    return null;
  }
}

/**
 * Play text as speech
 * @param {string} text - The text to speak
 * @param {string} language - The language name or code
 */
export function speakText(text, language) {
  try {
    if (!text || text.trim() === "") {
      console.warn("Empty text provided to TTS");
      return;
    }

    // Get language code
    const langCode = getLanguageCode(language);

    // For longer text, we need to split it
    if (text.length > 200) {
      const results = getAllAudioUrls(text, { lang: langCode });
      if (!results.length) return;

      // Play the first segment
      playAudioSequence(results, 0);
      return;
    }

    // For shorter text, just play it directly
    const audioUrl = getAudioUrl(text, { lang: langCode });
    if (!audioUrl) return;

    const audio = new Audio(audioUrl);
    audio.play().catch((err) => {
      console.error("Error playing audio:", err);
    });
  } catch (error) {
    console.error("Error speaking text:", error);
  }
}

/**
 * Play a sequence of audio segments
 * @param {Array<{shortText: string, url: string}>} segments - The audio segments
 * @param {number} index - The current index
 */
function playAudioSequence(segments, index) {
  if (index >= segments.length) return;

  const audio = new Audio(segments[index].url);

  audio.onended = () => {
    // Play next segment when this one ends
    playAudioSequence(segments, index + 1);
  };

  audio.onerror = (err) => {
    console.error("Error playing audio segment:", err);
    // Try to continue with next segment
    playAudioSequence(segments, index + 1);
  };

  audio.play().catch((err) => {
    console.error("Error starting audio playback:", err);
    playAudioSequence(segments, index + 1);
  });
}
