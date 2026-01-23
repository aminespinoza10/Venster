interface OllamaMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface OllamaGenerateRequest {
  model: string;
  prompt: string;
  stream: boolean;
  context?: number[];
}

interface OllamaGenerateResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
  context?: number[];
}

interface OllamaChatRequest {
  model: string;
  messages: OllamaMessage[];
  stream: boolean;
}

interface OllamaChatResponse {
  model: string;
  created_at: string;
  message: {
    role: string;
    content: string;
  };
  done: boolean;
}

export class OllamaService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = this.getOllamaUrl();
  }

  private getOllamaUrl(): string {
    return localStorage.getItem('ollamaUrl') || 'http://localhost:11434';
  }

  async chat(messages: OllamaMessage[], model: string = 'llama3.2'): Promise<string> {
    try {
      return await this.chatWithChatEndpoint(messages, model);
    } catch (error) {
      console.log('Chat endpoint failed, falling back to generate endpoint');
      return await this.chatWithGenerateEndpoint(messages, model);
    }
  }

  private async chatWithChatEndpoint(messages: OllamaMessage[], model: string): Promise<string> {
    const url = `${this.getOllamaUrl()}/api/chat`;
    
    const request: OllamaChatRequest = {
      model,
      messages,
      stream: false,
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Ollama chat API error: ${response.status}`);
    }

    const data: OllamaChatResponse = await response.json();
    return data.message.content;
  }

  private async chatWithGenerateEndpoint(messages: OllamaMessage[], model: string): Promise<string> {
    const url = `${this.getOllamaUrl()}/api/generate`;
    
    // Convert chat messages to a single prompt
    const prompt = messages.map(msg => {
      const role = msg.role === 'user' ? 'User' : 'Assistant';
      return `${role}: ${msg.content}`;
    }).join('\n') + '\nAssistant:';
    
    const request: OllamaGenerateRequest = {
      model,
      prompt,
      stream: false,
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
      }

      const data: OllamaGenerateResponse = await response.json();
      return data.response;
    } catch (error) {
      console.error('Error communicating with Ollama:', error);
      throw new Error(
        error instanceof Error 
          ? `Failed to connect to Ollama: ${error.message}` 
          : 'Failed to connect to Ollama server'
      );
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      const url = `${this.getOllamaUrl()}/api/tags`;
      const response = await fetch(url);
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  async listModels(): Promise<string[]> {
    try {
      const url = `${this.getOllamaUrl()}/api/tags`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch models');
      }

      const data = await response.json();
      return data.models?.map((model: any) => model.name) || [];
    } catch (error) {
      console.error('Error fetching models:', error);
      return [];
    }
  }
}

export const ollamaService = new OllamaService();
