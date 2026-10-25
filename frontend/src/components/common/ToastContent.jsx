const TYPE_STYLES = {
  success: { icon: "✅", bg: "bg-success" },
  error: { icon: "❌", bg: "bg-danger" },
  info: { icon: "ℹ️", bg: "bg-primary" },
  warning: { icon: "⚠️", bg: "bg-warning" },
};

const ToastContent = ({ type = "success", title, message, details = [], icon }) => {
  const style = TYPE_STYLES[type] ?? TYPE_STYLES.info;

  return (
    <div className="d-flex align-items-start gap-3">
      <div
        className={`rounded-circle ${style.bg} bg-opacity-10 d-flex align-items-center justify-content-center fs-4 flex-shrink-0`}
        style={{ width: 44, height: 44 }}
        aria-hidden="true"
      >
        {icon ?? style.icon}
      </div>

      <div className="flex-grow-1">
        {title && <div className="fw-bold">{title}</div>}
        {message && <div className="small">{message}</div>}
        {details.map(({ label, value }) => (
          <div key={label} className="small text-body-secondary">
            {label}: <strong>{value}</strong>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ToastContent;