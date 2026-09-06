function SectionHeading({ eyebrow, title, action, onAction }) { return <div className="section-heading"><div><span className="eyebrow">{eyebrow}</span><h2>{title}</h2></div>{action && <button className="text-button" onClick={onAction}>{action} <span>↗</span></button>}</div>; }
export default SectionHeading;
