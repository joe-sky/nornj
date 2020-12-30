import { FormDataInstance } from 'nornj-react';

declare function useFormData<T>(formDataElement: () => JSX.Element, deps?: any[]): FormDataInstance<T>;

export { useFormData };
