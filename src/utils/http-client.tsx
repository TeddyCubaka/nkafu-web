type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

class HttpClient {
  private baseUrl: string;
  private defaultHeaders: HeadersInit;
  error: {
    code: number;
    message: string;
    [key: string]: any;
  } | null = null;

  constructor(defaultHeaders: HeadersInit = {}) {
    this.baseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";
    this.defaultHeaders = {
      "Content-Type": "application/json",
      ...defaultHeaders,
    };
  }

  private async request<T>(
    endpoint: string,
    method: HttpMethod,
    body?: Record<string, any> | FormData,
    customHeaders?: HeadersInit
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = { ...this.defaultHeaders, ...customHeaders };

    const options: RequestInit = {
      method,
      headers: headers,
    };

    if (body) {
      if (body instanceof FormData) {
        options.body = body;
      } else {
        options.body = JSON.stringify(body);
      }
    }

    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        this.error = await response.json();
        return false as T;
        // throw new Error(
        //   `HTTP Error: ${response.status} - ${
        //     response.statusText
        //   }\nDetails: ${JSON.stringify(errorData)}`
        // );
      }

      if (response.status === 204) return null as T;

      const data = await response.json();
      return data as T;
    } catch (error: any) {
      console.error("HTTP Request Error:", error.message);
      throw error;
    }
  }

  public get<T>(endpoint: string, customHeaders?: HeadersInit): Promise<T> {
    return this.request<T>(endpoint, "GET", undefined, customHeaders);
  }

  public post<T>(
    endpoint: string,
    body: Record<string, any> | FormData,
    customHeaders?: HeadersInit
  ): Promise<T> {
    return this.request<T>(endpoint, "POST", body, customHeaders);
  }

  public put<T>(
    endpoint: string,
    body: Record<string, any> | FormData,
    customHeaders?: HeadersInit
  ): Promise<T> {
    return this.request<T>(endpoint, "PUT", body, customHeaders);
  }

  public delete<T>(endpoint: string, customHeaders?: HeadersInit): Promise<T> {
    return this.request<T>(endpoint, "DELETE", undefined, customHeaders);
  }

  public patch<T>(
    endpoint: string,
    body: Record<string, any> | FormData,
    customHeaders?: HeadersInit
  ): Promise<T> {
    return this.request<T>(endpoint, "PATCH", body, customHeaders);
  }
}

export default HttpClient;
