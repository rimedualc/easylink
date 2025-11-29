export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public code?: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function handleError(error: unknown): { statusCode: number; message: string } {
  if (error instanceof AppError) {
    return {
      statusCode: error.statusCode,
      message: error.message,
    };
  }

  // Tratar erros do Zod
  if (error && typeof error === 'object' && 'issues' in error) {
    const zodError = error as any;
    const firstIssue = zodError.issues?.[0];
    return {
      statusCode: 400,
      message: firstIssue?.message || 'Erro de validação',
    };
  }

  if (error instanceof Error) {
    // Verificar se é erro de validação do Zod
    if (error.name === 'ZodError') {
      return {
        statusCode: 400,
        message: error.message || 'Erro de validação',
      };
    }
    return {
      statusCode: 500,
      message: error.message || 'Erro interno do servidor',
    };
  }

  return {
    statusCode: 500,
    message: 'Erro desconhecido',
  };
}

