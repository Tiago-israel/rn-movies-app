export class HttpClient {
  constructor(private baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async get<T>(url: string, init: RequestInit = {}): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${url}`, init);
      return response.json();
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  }
}
