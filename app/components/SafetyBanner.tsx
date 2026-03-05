export default function SafetyBanner({ message }: { message: string }) {
  return (
    <section
      className="card"
      style={{
        borderColor: "#ef4444",
        background: "#fef2f2"
      }}
    >
      <h3 style={{ color: "#b91c1c", marginTop: 0 }}>Safety Support</h3>
      <p>{message}</p>
      <p className="muted">
        If you are in immediate danger in the U.S., call or text <strong>988</strong> or call 911.
      </p>
    </section>
  );
}
