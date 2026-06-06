export default function HowItWorks() {
  const steps = [
    {
      num: '01',
      tag: 'Farmer',
      title: 'Register & List Your Harvest',
      desc: 'Farmers sign up, create a profile, and list whatever they have ready — with their own prices, quantities, and pickup or delivery options.',
    },
    {
      num: '02',
      tag: 'Buyer',
      title: 'Browse, Choose, Order Directly',
      desc: 'Buyers browse produce by category, see who grew it and where, then place an order straight to the farmer — no middleman takes a cut.',
    },
    {
      num: '03',
      tag: 'Both',
      title: 'Delivered or Collected. Done.',
      desc: 'Farmer ships or the buyer collects. Payment is handled securely. The farmer keeps what they earn. The buyer pays what produce is actually worth.',
    },
    {
      num: '04',
      tag: 'Always',
      title: 'Every Order Builds a Relationship',
      desc: 'Rate, review, and return. Buyers build standing orders with farmers they trust. Farmers grow their loyal customer base season after season.',
    },
  ];

  return (
    <section id="how">
      <div className="how-grid">
        <div className="how-left reveal">
          <div className="section-eyebrow">The Process</div>
          <h2 className="section-title">
            Simple as it <em>should</em> always be.
          </h2>
          <p>
            Agriconnect removes every unnecessary step between the farmer who grows
            and the buyer who needs. Three steps, two parties, zero compromise.
          </p>
        </div>
        <div className="steps">
          {steps.map((step, idx) => (
            <div
              key={step.num}
              className="step"
              style={{ transitionDelay: `${(idx + 1) * 0.1}s` }}
            >
              <div className="step-num">{step.num}</div>
              <div className="step-content">
                <div className="step-tag">{step.tag}</div>
                <div className="step-title">{step.title}</div>
                <div className="step-desc">{step.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
