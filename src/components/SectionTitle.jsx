export default function SectionTitle({ eyebrow, title, lead, align = "left" }) {
  return (
    <div
      className={`max-w-3xl ${align === "center" ? "mx-auto text-center" : ""}`}
    >
      {eyebrow ? (
        <p className="section-eyebrow">
          <span aria-hidden="true" />
          {eyebrow}
        </p>
      ) : null}
      <h2 className="section-heading">{title}</h2>
      {lead ? <p className="section-lead">{lead}</p> : null}
    </div>
  );
}
