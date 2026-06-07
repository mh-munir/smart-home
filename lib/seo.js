export function generateBlog(keyword) {
  return {
    title: `Best ${keyword} in 2026`,
    description: `Find the best ${keyword} with expert reviews and buying guide.`,
    intro: `Find the best ${keyword} for your smart home setup with our comprehensive review.`,
    sections: [
      {
        heading: "Overview",
        content: `Detailed analysis of the top ${keyword} products available in the market. We've tested and reviewed multiple options to bring you the best choices.`,
      },
      {
        heading: "Top Picks",
        content: `Best Amazon ${keyword} products listed below with prices, ratings, and specifications.`,
      },
      {
        heading: "Comparison",
        content: `Detailed comparison between top products to help you make an informed decision based on your needs and budget.`,
      },
      {
        heading: "Conclusion",
        content: `Choose the ${keyword} that best fits your requirements. All products listed are verified and highly rated.`,
      },
    ],
  };
}

export function generateSEOMeta(title, description) {
  return {
    title: title || "Smart Home Affiliate Review",
    description: description || "Best smart home gadgets review and buying guide 2026",
    keywords: "smart home, affiliate, review, buying guide",
    openGraph: {
      type: "website",
      locale: "en_US",
    },
  };
}
