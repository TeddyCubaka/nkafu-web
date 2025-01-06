import { useRouter } from "next/navigation";

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
    const url = `${this.baseUrl}${
      endpoint[0] == "/" ? endpoint : `/${endpoint}`
    }`;
    const brutToken = localStorage.getItem("dp-sk-moto-token");
    const headers = {
      ...this.defaultHeaders,
      ...customHeaders,
      Authorization: brutToken == null ? "" : `Bearer ${JSON.parse(brutToken)}`,
    };

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
      console.log("fetching>.....", url);
      const response = await fetch(url, options);

      if (!response.ok) {
        const error = await response.json();
        if (error.statusCode)
          this.error = { code: error.statusCode, message: error.message };
        else this.error = error;

        return false as T;
      }

      if (response.status === 204) return null as T;

      const data = await response.json();
      return data as T;
    } catch (error: any) {
      this.error = {
        code: 500,
        message: "une erreur s'est produite",
        error: {
          errorCode: error.code,
          errorMessage: error.message,
          details: error.toString(),
        },
      };
      return false as T;
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
