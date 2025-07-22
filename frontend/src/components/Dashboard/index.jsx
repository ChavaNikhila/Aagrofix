import { Component } from "react";
import "./index.css";
import { BsArrowUpRight } from "react-icons/bs";
import { IoBusinessOutline } from "react-icons/io5";
import { FcRating } from "react-icons/fc";
import { Circles } from "react-loader-spinner";
import { AiOutlineReload } from "react-icons/ai";

const ICONS = {
  FcRating: FcRating,
  BsArrowUpRight: BsArrowUpRight,
  IoBusinessOutline: IoBusinessOutline
};

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const data = [
  {
    id: 1,
    icon: "FcRating",
    head: "Rating Analytics",
    desc: "Get real-time insights into your customer satisfaction scores and review trends.",
  },
  {
    id: 2,
    icon: "BsArrowUpRight",
    head: "AI-Powered Headlines",
    desc: "Generate compelling SEO headlines tailored to your business and location.",
  },
  {
    id: 3,
    icon: "IoBusinessOutline",
    head: "Business Intelligence",
    desc: "Comprehensive dashboard to monitor and improve your local business performance.",
  },
];

class Dashboard extends Component {
  state = { name: '', location: '', bData: {}, apiStatus: apiStatusConstants.initial };

  submitBusinessData = async () => {
    const { name, location } = this.state;

    if (!name || !location) {
      alert("Please enter both business name and location.");
      return;
    }

    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    });

    try {
      const response = await fetch("https://growthai-1.onrender.com/business-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, location }),
      });

      if (!response.ok) throw new Error("Server error");

      const dat = await response.json();
      this.setState({
        bData: dat,
        apiStatus: apiStatusConstants.success,
      });
    } catch (error) {
      console.error("Error submitting business data:", error);
      alert("Failed to submit business data. Please try again.");
      this.setState({ apiStatus: apiStatusConstants.failure });
    }
  };

  regenRsp = async () => {
    this.setState({ apiStatus: apiStatusConstants.inProgress });
    const { name, location } = this.state;
    try {
      const response = await fetch(`https://growthai-1.onrender.com/regenerate-headline?name=${encodeURIComponent(name)}&location=${encodeURIComponent(location)}`);
      if (!response.ok) throw new Error("Regenerate API failed");
      const data = await response.json();
      this.setState({ bData: { ...this.state.bData, headline: data.headline }, apiStatus: apiStatusConstants.success });
    } catch (error) {
      console.error("Error regenerating headline:", error);
      alert("Failed to regenerate headline.");
      this.setState({ apiStatus: apiStatusConstants.failure });
    }
  }

  renderLoader = () => (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
      <Circles
        height="50"
        width="50"
        color="#4fa94d"
        ariaLabel="loading"
        visible={true}
      />
    </div>
  );

  handleNameChange = (event) => {
    this.setState({ name: event.target.value });
  };

  handleLocationChange = (event) => {
    this.setState({ location: event.target.value });
  };

  renderHeadCard = () => {
    const { bData } = this.state;
    const { headline, rating, reviews } = bData;
    return (
      <div className="container">
        <div className="card rating-card">
          <h3 className="card-title">
            <span role="img" aria-label="location">📍</span> Customer Rating
          </h3>
          <div className="rating-value">{rating}</div>
          <div className="stars">
            <span>⭐</span><span>⭐</span><span>⭐</span><span>⭐</span><span>⭐</span>
          </div>
          <div className="reviews">Based on {reviews} reviews</div>
          <div className="highlight">Your business is performing exceptionally well with customers!</div>
        </div>

        <div className="card seo-card">
          <div className="seo-header">
            <h3 className="card-title">📈 AI SEO Headline</h3>
            <button className="regen-button" onClick={this.regenRsp}>
              <AiOutlineReload /> Regenerate
            </button>
          </div>
          <div className="headline-box">
            <p className="headline-text">{headline}</p>
          </div>
          <div className="seo-info">
            💡 This AI-generated headline is optimized for search engines and social media engagement.
          </div>
        </div>
      </div>
    )
  }

  renderTotal = () => {
    const { name, location, apiStatus } = this.state;
    return (
      <div className="first-container">
        <div className="arrow-cont">
          <BsArrowUpRight className="w-10 h-8 text-white" />
        </div>
        <h1 className="head">Business Intelligence Dashboard</h1>
        <p className="para">
          Get instant insights into your business performance with AI-powered analytics and customer feedback data.
        </p>
        <div className="business-cont">
          <div className="b-cm" id="b-c">
            <IoBusinessOutline className="b" />
            <h3>Business Information</h3>
          </div>
          <div className="b-co">
            <div className="m">
              <label>Business Name</label>
              <br />
              <input type="text" placeholder="e.g., Cake & Co" className="input" onChange={this.handleNameChange}
                value={name}
              />
            </div>
            <div className="m">
              <label>Location</label>
              <br />
              <input type="text" placeholder="e.g., Mumbai" className="input" onChange={this.handleLocationChange}
                value={location}
              />
            </div>
          </div>
          <button type="button" className="butn" onClick={this.submitBusinessData}>Get Business Insights</button>
        </div>

        {apiStatus === apiStatusConstants.success
          ? this.renderHeadCard()
          : (
            <ul className="card-cnt">
              {data.map((each) => {
                const IconComponent = ICONS[each.icon];
                return (
                  <li key={each.id} className="data-item">
                    {IconComponent && <IconComponent className="dt" />}
                    <div>
                      <h3>{each.head}</h3>
                      <p className="para">{each.desc}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
      </div>
    );
  }

  render() {
    const { apiStatus } = this.state;
    return (
      <div>
        {this.renderTotal()}
        {apiStatus === apiStatusConstants.inProgress && (
          <div className="loader-overlay">
            {this.renderLoader()}
          </div>
        )}
      </div>
    );
  }
}

export default Dashboard;
