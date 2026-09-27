const STATIC_PUBLIC_ROUTES = [
  { path: '/', changeFrequency: 'daily', priority: 1.0 },
  { path: '/explore', changeFrequency: 'daily', priority: 0.9 },
  { path: '/articles', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/characters', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/events', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/audio', changeFrequency: 'weekly', priority: 0.7 },
  { path: '/live', changeFrequency: 'weekly', priority: 0.7 },
  { path: '/merchandise', changeFrequency: 'weekly', priority: 0.7 },
  { path: '/feedback', changeFrequency: 'monthly', priority: 0.4 },
  { path: '/sitemap', changeFrequency: 'monthly', priority: 0.4 },
];

export default function sitemap() {
  const baseUrl = (
    process.env.NEXT_PUBLIC_SITE_URL || 'https://fan-hub-plus.vercel.app'
  ).replace(/\/$/, '');
  const lastModified = new Date();

  return STATIC_PUBLIC_ROUTES.map(({ path, ...metadata }) => ({
    url: `${baseUrl}${path}`,
    lastModified,
    ...metadata,
  }));
}
