
// API key should be stored securely in server-side environment
// For demo purposes only - this would be replaced with a proper server endpoint
const GROQ_API_KEY = ''; // Add your GROQ API key here or fetch from backend

interface GroqRequestBody {
  messages: {
    role: 'system' | 'user' | 'assistant';
    content: string;
  }[];
  model: string;
  temperature?: number;
  max_tokens?: number;
}

export const groqApi = {
  getCompletion: async (prompt: string): Promise<string> => {
    try {
      if (!GROQ_API_KEY) {
        console.warn('Groq API key not found, using fallback response');
        return '';
      }
      
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: 'You are an expert real estate advisor. Provide helpful, accurate, and concise information about apartment matches.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          model: 'llama3-70b-8192',
          temperature: 0.5,
          max_tokens: 250
        } as GroqRequestBody)
      });
      
      if (!response.ok) {
        throw new Error(`Groq API error: ${response.status}`);
      }
      
      const data = await response.json();
      return data.choices?.[0]?.message?.content || '';
    } catch (error) {
      console.error('Error in Groq API call:', error);
      return '';
    }
  }
};
