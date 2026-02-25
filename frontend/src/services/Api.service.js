import AxiosClient from "./Axios.service.js";
import qs from "qs";
import { setVariable } from "../utils/localStorage.js";
import { apiBaseUrl } from '../constants/constant.js';  
import { getVariable } from '../utils/localStorage.js';

const ApiService = {
  login: async (payload) => {
    const { data, loading, error } = await AxiosClient({
      method: "POST",
      url: `user/login`,
      data: payload,
    });
    if (data ) {
      setVariable("km_user_token", data.result.token);
    }
    return { data, error, loading };
  },

   register: async (payload) => {
    const { data, loading, error } = await AxiosClient({
      method: "POST",
      url: `user/register`,
      data: payload,
    });
    
    return { data, error, loading };
  },

   getAllChatBots: async () => {
    const { data, loading, error } = await AxiosClient({
      method: "GET",
      url: `chat-bot/all`,
    });
    
    return { data, error, loading };
  },

   createChatBot: async (payload) => {
    const { data, loading, error } = await AxiosClient({
      method: "POST",
      url: `chat-bot/`,
      data:payload
    });
    
    return { data, error, loading };
  },

   deleteChatBot: async (botId) => {
    const { data, loading, error } = await AxiosClient({
      method: "DELETE",
      url: `chat-bot/${botId}`,
    });
    
    return { data, error, loading };
  },

  //  startConversation: async (payload) => {
  //   const { data, loading, error } = await AxiosClient({
  //     method: "POST",
  //     url: `chat-bot/chat`,
  //     data:payload
  //   });
    
  //   return { data, error, loading };
  // },

   getAllFiles: async (chatBotId) => {
    const { data, loading, error } = await AxiosClient({
      method: "GET",
      url: `files?chatBotId=${chatBotId}`
    });
    
    return { data, error, loading };
  },

  uploadFile: async (payload) => {
    const { data, loading, error } = await AxiosClient({
      method: "POST",
      url: `files/fileUpload`,
      data:payload,
      contentType:'multipart/form-data'
    });
    
    return { data, error, loading };
  },
  deleteFile: async (payload) => {
    const { data, loading, error } = await AxiosClient({
      method: "DELETE",
      url: `files/file`,
      data:payload
    });
    
    return { data, error, loading };
  },

  // Check if bot has uploaded files
  checkBotFiles: async (chatBotId) => {
    const { data, loading, error } = await AxiosClient({
      method: "GET",
      url: `files/check?chatBotId=${chatBotId}`
    });
    
    return { data, error, loading };
  },

  // Vectorize documents for analysis
  vectorizeDocuments: async (payload) => {
    const { data, loading, error } = await AxiosClient({
      method: "POST",
      url: `files/vectorize`,
      data: payload
    });
    
    return { data, error, loading };
  },

  // Get vectorization status
  getVectorizationStatus: async (namespaceId) => {
    const { data, loading, error } = await AxiosClient({
      method: "GET",
      url: `files/vectorize/status?namespace_id=${namespaceId}`
    });
    
    return { data, error, loading };
  },

  // Delete vectorized documents
  deleteVectorizedDocs: async (namespaceId) => {
    const { data, loading, error } = await AxiosClient({
      method: "DELETE",
      url: `files/vectorize?namespace_id=${namespaceId}`
    });
    
    return { data, error, loading };
  },

  // Analyze diabetes report
  analyzeReport: async (chatBotId) => {
    const { data, loading, error } = await AxiosClient({
      method: "POST",
      url: `files/analyze`,
      data: { chatBotId },
      contentType: 'application/json'
    });
    
    return { data, error, loading };
  },

  
};

/**
 * Streams conversation response and calls onChunk for each parsed chunk.
 * onChunk receives either a string or parsed object depending on server.
 */
export const startConversation = async (payload, onChunk) => {
  const token = getVariable('km_user_token');

  const response = await fetch(`${apiBaseUrl}chat-bot/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Network error: ${response.status} ${response.statusText}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder('utf-8');
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunkStr = decoder.decode(value, { stream: true });
      buffer += chunkStr;
 
      const parts = buffer.split('\n');
      buffer = parts.pop();

      for (const part of parts) {
        const line = part.trim();
        if (!line) continue;

 
        const jsonString = line.startsWith('data:') ? line.replace(/^data:\s*/, '') : line;

     
        try {
          const parsed = JSON.parse(jsonString);
          onChunk(parsed);
        } catch (err) {
          
          onChunk(jsonString);
        }
      }
    }

 
    if (buffer && buffer.trim()) {
      const remaining = buffer.trim();
      try {
        onChunk(JSON.parse(remaining));
      } catch {
        onChunk(remaining);
      }
    }
  } finally {
    try { reader.releaseLock(); } catch (e) {}
  }
};

export default ApiService;
