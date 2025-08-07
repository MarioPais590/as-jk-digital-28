
export class ErrorHandler {
  static logError(context: string, error: any) {
    console.error(`${context}:`, error);
  }

  static handleAsyncError(context: string) {
    return (error: any) => {
      this.logError(context, error);
      throw error;
    };
  }

  static getUserFriendlyMessage(error: any): string {
    if (error.message) {
      return error.message;
    }
    return 'Ocorreu um erro inesperado. Tente novamente.';
  }
}
