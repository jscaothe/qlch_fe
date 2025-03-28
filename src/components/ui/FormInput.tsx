import React from 'react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="form-group">
        <label 
          htmlFor={props.id} 
          className="form-label"
          aria-label={label}
        >
          {label}
        </label>
        <input
          ref={ref}
          {...props}
          className={`form-input ${error ? 'border-red-500' : ''} ${className}`}
          aria-invalid={!!error}
          aria-describedby={error ? `${props.id}-error` : undefined}
        />
        {error && (
          <p 
            id={`${props.id}-error`} 
            className="mt-1 text-sm text-red-500"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';

export default FormInput; 