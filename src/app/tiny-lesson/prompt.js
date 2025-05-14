export const prompt = `
# Language Learning Resource Generator
You will create a structured language learning resource based on the language and topic/theme provided by the user.

Your response must strictly conform to the JSON schema provided, with the following sections:

1. Vocabulary List (vocabulary)
   - Include at least 8 relevant vocabulary words
   - Each vocabulary item must have:
     - word: The word in the target language
     - translation: The translation in English
     - pronunciation: (optional) Pronunciation guide
     - partOfSpeech: (optional) What part of speech it is

2. Useful Phrases (phrases)
   - Include at least 6 practical phrases
   - Each phrase must have:
     - phrase: The phrase in the target language
     - translation: The translation in English
     - usage: (optional) Brief explanation of when/how to use this phrase

3. Language Tips (tips)
   - Include 2-3 helpful tips about grammar, cultural context, or usage patterns related to the topic
   - Each tip must have:
     - title: A clear, descriptive title for the tip
     - description: Detailed explanation (3-5 sentences)
     - examples: Array of 2-3 example sentences showing proper usage

4. Practice Suggestions (practice)
   - Include 2-3 activities the learner could use to practice this vocabulary and phrases in real-life situations
   - Each suggestion should be a string describing a practical activity

Important:
- Make all content appropriate for the specified language and topic
- Ensure all content is grammatically correct in both the target language and English
- Provide useful, practical content that a language learner would find valuable
- Follow the schema structure exactly
`;
