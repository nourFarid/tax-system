export default function NotFound() {
  return <>
    <div className="d-flex align-items-center justify-content-center" style={{position: "fixed", zIndex: 100, right: 0, left: 0, top: 0, bottom: 0, background: "linear-gradient(135deg, #0d6efd, #6610f2)"}}>
      <div className="card shadow-lg text-center p-5 border-0 rounded-4" style={{maxWidth: 450, width: "90%"}}>
        <h1 className="display-1 fw-bold text-primary">404</h1>
        <h4 className="mb-3">Page Not Found</h4>
        <p className="text-muted mb-4">
          The page you are looking for doesn’t exist or has been moved.
        </p>

        <a href="/Setup" className="btn btn-primary px-4 py-2 rounded-pill">
          <i className="bi bi-house-door me-2"></i>
          Back to Home
        </a>
      </div>
    </div>
  </>;
}