"use client";
import { useEffect, useState } from "react";

const ViewCounter = ({ slug }) => {
  const [views, setViews] = useState(0);

  useEffect(() => {
    const incrementView = async () => {
      try {
        const response = await fetch(`/api/views/${slug}`, {
          method: "POST",
        });
        if (response.ok) {
          const data = await response.json();
          setViews(data.views);
        }
      } catch (error) {
        console.error("Error incrementing view count:", error);
      }
    };

    incrementView();
  }, [slug]);

  return (
    <span className="font-medium">
      {views > 0 ? `${views.toLocaleString()} views` : "––– views"}
    </span>
  );
};

export default ViewCounter;
