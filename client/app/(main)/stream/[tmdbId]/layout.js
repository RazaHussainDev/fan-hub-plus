import { fetchDetails, BASE_IMG_URL } from '@/utils/tmdb';

export async function generateMetadata({ params, searchParams }) {
  const { tmdbId } = await params;
  const resolvedSearchParams = await searchParams;
  const contentType = resolvedSearchParams?.type || 'movie';

  try {
    const data = await fetchDetails(tmdbId, contentType);
    if (!data) return {};

    const title = data.title || data.name || 'Fan Hub Plus';
    const description = data.overview || `Watch ${title} on Fan Hub Plus!`;
    const image = data.backdrop_path || data.poster_path 
      ? `${BASE_IMG_URL}${data.backdrop_path || data.poster_path}` 
      : 'https://fanhubplus.com/default-og.jpg'; // fallback

    return {
      title: `${title} | Fan Hub Plus`,
      description,
      openGraph: {
        title: `${title} | Fan Hub Plus`,
        description,
        url: `https://fanhubplus.com/stream/${tmdbId}?type=${contentType}`,
        images: [
          {
            url: image,
            width: 1280,
            height: 720,
            alt: title,
          },
        ],
        siteName: 'Fan Hub Plus',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${title} | Fan Hub Plus`,
        description,
        images: [image],
      },
    };
  } catch (error) {
    return {
      title: 'Watch on Fan Hub Plus',
    };
  }
}

export default function StreamLayout({ children }) {
  return <>{children}</>;
}
