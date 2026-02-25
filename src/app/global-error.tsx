"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // Log for future Sentry integration
  console.error("[global-error]", error);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#09090b",
          color: "#fafafa",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ textAlign: "center", padding: "2rem", maxWidth: "480px" }}>
          <span
            style={{
              fontFamily: "monospace",
              fontSize: "0.875rem",
              letterSpacing: "0.1em",
              color: "#f97316",
            }}
          >
            ERROR
          </span>
          <h1
            style={{
              fontSize: "2.5rem",
              fontWeight: 700,
              marginTop: "1rem",
              lineHeight: 1.1,
            }}
          >
            Something went wrong<span style={{ color: "#f97316" }}>.</span>
          </h1>
          <p
            style={{
              marginTop: "1rem",
              color: "#a1a1aa",
              fontSize: "1.125rem",
              lineHeight: 1.6,
            }}
          >
            An unexpected error occurred. Please try again.
          </p>
          {error.digest && (
            <p
              style={{
                marginTop: "0.5rem",
                fontFamily: "monospace",
                fontSize: "0.75rem",
                color: "#71717a",
              }}
            >
              Error ID: {error.digest}
            </p>
          )}
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: "2rem",
              padding: "0.75rem 2rem",
              borderRadius: "9999px",
              border: "none",
              backgroundColor: "#f97316",
              color: "#09090b",
              fontSize: "0.875rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
