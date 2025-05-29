import React from "react";
import "./NewsCard.css";

const NewsCard = ({ title, summary, url, image }) => {
  return (
    <div className="news-card">
      {image && <img src={image} alt={title} className="news-image" />}
      <h3 className="news-title">{title}</h3>
      <p className="news-summary">{summary}</p>
      <a href={url} target="_blank" rel="noopener noreferrer" className="news-link">
        Read More
      </a>
    </div>
  );
};

export default NewsCard;
