export default function Hero({ docked }) {
  return (
    <div className={`hero ${docked ? 'dock' : 'center'}`}>
      <div className="hero-row">
        <div className="hero-name">Prachi</div>
        <div className="hero-box">Mittal</div>
      </div>
      <div className="hero-tag">Product Designer · Architect</div>
    </div>
  );
}
