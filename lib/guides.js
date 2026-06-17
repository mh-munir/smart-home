export const sampleGuides = [
  {
    slug: 'beginner-smart-locks',
    title: "Complete Beginner's Guide to Smart Locks",
    category: 'Smart Locks',
    excerpt: 'Learn everything you need to know about choosing and installing smart locks for your home.',
    image: '/logo.png',
    readTime: '8 min read',
    date: '2 days ago',
    content: `## Introduction

Smart locks are an easy way to improve home security...`,
    tags: ['locks', 'security'],
  },
  {
    slug: 'smart-lighting-101',
    title: 'Smart Lighting 101: Create the Perfect Ambiance',
    category: 'Smart Lighting',
    excerpt: 'Discover how smart bulbs can transform your home lighting and save energy.',
    image: '/logo.png',
    readTime: '6 min read',
    date: '3 days ago',
    content: `## Overview\n\nSmart lighting can...`,
    tags: ['lighting', 'energy'],
  },
];

export function getAllGuides() {
  return sampleGuides;
}

export function getGuideBySlug(slug) {
  return sampleGuides.find((g) => g.slug === slug) || null;
}
