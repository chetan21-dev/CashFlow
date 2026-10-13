const FormField = ({ id, label, type = "text", error, registration, className = "col-12", ...rest }) => (
  <div className={className}>
    <label htmlFor={id} className="form-label">
      {label}
    </label>
    <input
      id={id}
      type={type}
      className={`form-control shadow ${error ? "is-invalid" : ""}`}
      aria-invalid={!!error}
      aria-describedby={error ? `${id}Error` : undefined}
      {...registration}
      {...rest}
    />
    {error && (
      <div id={`${id}Error`} className="text-danger small mt-1" role="alert">
        {error.message}
      </div>
    )}
  </div>
);

export default FormField;