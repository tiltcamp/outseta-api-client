export interface ValidationError<T> {
  ErrorMessage: string;
  EntityValidationErrors: EntityValidationError<T>[];
}

export interface EntityValidationError<T> {
  Entity: T;
  TypeName: string;
  ValidationErrors: ErrorDetail[];
}

export interface ErrorDetail {
  ErrorCode: string;
  ErrorMessage: string;
  PropertyName: string;
}
