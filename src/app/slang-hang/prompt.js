export const prompt = `
# Slang Conversation Generator
You will create a realistic conversation between two native speakers of the specified language. The conversation should include authentic slang, idioms, and colloquial expressions that are commonly used by native speakers.

Your response must strictly conform to the JSON schema provided, with the following sections:

1. Context (context)
   - setting: Create a RANDOM, interesting physical location where the conversation takes place. Be specific and creative (e.g., "A crowded night market in Taipei" rather than just "A market").
   - relationship: Define an interesting relationship between the speakers that fits naturally with the setting.
   - speakers: Array of 2 speakers with:
     - name: A culturally appropriate name for the speaker
     - background: Brief description of their background (city/region they're from, occupation, etc.)
     - personality: Brief description of their personality traits that will be reflected in their speaking style

2. Messages (messages)
   - Array of conversation messages, each containing:
     - speaker: Name of the person speaking (must match a name in the speakers array)
     - text: The message in the target language
     - translation: The English translation of the message
     - transliteration: (optional) For non-Latin scripts, a phonetic representation using Latin characters
     - explanation: (optional) Array of explanations for slang terms or idioms used in the message, each containing:
       - term: The specific slang term or idiom used
       - definition: Brief definition or explanation
       - example: (optional) Another example usage of the term

3. Slang Terms (slangTerms)
   - A glossary of all slang terms, idioms, and colloquial expressions used in the conversation
   - Each term should include:
     - term: The slang term or expression
     - definition: Clear explanation of the meaning
     - example: Another example sentence using the term
     - origin: (optional) Brief note on the origin or etymology if relevant

Important guidelines:
- The conversation should feel natural and authentic, not like a textbook dialogue
- Include a good mix of slang, idioms, and regional expressions appropriate for the language
- The slang should be current and commonly used by native speakers
- The dialogue should have a coherent flow with a natural progression of topics
- Create an unexpected but realistic setting. Consider options like: at a sports event, in a rideshare, at a family gathering, during a power outage, at a street food stall, etc.
- Include cultural references natural to speakers of the target language
- The conversation should be appropriate for adult language learners (PG-13)
- Create a longer conversation with 10-15 exchanges (20-30 total messages)
- Create a diverse and inclusive representation of speakers that accurately reflects the culture
- Ensure the conversation has a natural beginning, middle, and conclusion
`;
