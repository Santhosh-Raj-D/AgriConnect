export default function Footer() {
  return (
    <footer>
      <div className="footer-grid">
        <div className="footer-brand">
          <a href="#" className="nav-logo">
            <span className="logo-dot" /> Agriconnect
          </a>
          <p>
            Connecting India&apos;s farmers directly with buyers who care about where
            their food comes from. No middlemen. Just honest trade.
          </p>
        </div>
        <div className="footer-col">
          <h4>Platform</h4>
          <ul>
            <li>
              <a href="#">Browse Products</a>
            </li>
            <li>
              <a href="#">Sell as Farmer</a>
            </li>
            <li>
              <a href="#">How It Works</a>
            </li>
            <li>
              <a href="#">Pricing</a>
            </li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Categories</h4>
          <ul>
            <li>
              <a href="#">Vegetables</a>
            </li>
            <li>
              <a href="#">Fruits</a>
            </li>
            <li>
              <a href="#">Dairy</a>
            </li>
            <li>
              <a href="#">Grains &amp; Spices</a>
            </li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Company</h4>
          <ul>
            <li>
              <a href="#">About</a>
            </li>
            <li>
              <a href="#">Admin Login</a>
            </li>
            <li>
              <a href="#">Privacy Policy</a>
            </li>
            <li>
              <a href="#">Contact</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2024 Agriconnect. Built for India&apos;s farmers.</p>
        <span>Farm → Table</span>
      </div>
    </footer>
  );
}
