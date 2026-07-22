export class MethodRequest {
  static GET = "GET";
  static POST = "POST";
  static PUT = "PUT";
  static PATCH = "PATCH";
  static DELETE = "DELETE";

  static isGet(method: string): boolean {
    return method === MethodRequest.GET;
  }

  static isPost(method: string): boolean {
    return method === MethodRequest.POST;
  }
  
  static isPut(method: string): boolean {
    return method === MethodRequest.PUT;
  }

    static isPatch(method: string): boolean {
    return method === MethodRequest.PATCH;
  }

    static isDelete(method: string): boolean {
    return method === MethodRequest.DELETE;
  }
}