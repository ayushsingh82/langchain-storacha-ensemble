import axios from 'axios';
import { StorachaConfig } from '../types';

export class StorachaClient {
  private endpoint: string;
  private apiKey?: string;
  private namespace: string;

  constructor(config: StorachaConfig = {}) {
    this.endpoint = config.endpoint || 'https://api.storacha.io';
    this.apiKey = config.apiKey;
    this.namespace = config.namespace || 'langchain-ensemble';
  }

  async upload(data: any, tag: string): Promise<string> {
    try {
      const headers: Record<string, string> = {};
      if (this.apiKey) {
        headers['Authorization'] = `Bearer ${this.apiKey}`;
      }

      const response = await axios.post(
        `${this.endpoint}/upload`, 
        {
          tag: `${this.namespace}:${tag}`,
          content: JSON.stringify(data)
        },
        { headers }
      );
      
      if (!response.data?.cid) {
        throw new Error('Failed to get CID from Storacha');
      }
      
      return response.data.cid;
    } catch (error) {
      console.error('Error uploading to Storacha:', error);
      throw new Error(`Storacha upload failed: ${error.message}`);
    }
  }

  async fetch(tag: string): Promise<any[]> {
    try {
      const headers: Record<string, string> = {};
      if (this.apiKey) {
        headers['Authorization'] = `Bearer ${this.apiKey}`;
      }

      const response = await axios.get(
        `${this.endpoint}/fetch`, 
        { 
          params: { tag: `${this.namespace}:${tag}` },
          headers
        }
      );
      
      return (response.data?.items || []).map(item => {
        try {
          return JSON.parse(item.content);
        } catch (e) {
          return item.content;
        }
      });
    } catch (error) {
      console.error('Error fetching from Storacha:', error);
      throw new Error(`Storacha fetch failed: ${error.message}`);
    }
  }
} 