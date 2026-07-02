/* import {makeSourcerer, SourcererOutput} from '@/providers/base';
import {MovieScrapeContext, ShowScrapeContext} from '@/utils/context';
import {NotFoundError} from '@/utils/errors';

const VIDIFY_BASE = 'https://vidify.top';

const headers = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
};

async function ScrapeVidifyStream(ctx: ShowScrapeContext | MovieScrapeContext): Promise<SourcererOutput> {
    ctx.progress(10);
    let targetPlayerUrl: string;
    if (ctx.media.type === 'movie') {
        const movieUrl = `${VIDIFY_BASE}/embed/movie/${ctx.media.tmdbId}`;
    } else {
        targetPlayerUrl = `${VIDIFY_BASE}/embed/show/${ctx.media.tmdbId}/${ctx.media.season.number}/${ctx.media.episode.number}`;
    }
  const rawHtmlText = await ctx.proxiedFetcher<string>(playerPageUrl, {
    method: 'GET',
    headers: { ...headers },
  });

  if (!rawHtmlText) {
    throw new NotFoundError('Failed to download Vidify HTML source code');
  }
  ctx.progress(55);

  // 4. Regex targeted exactly at the token format we uncovered:
  // Extracts anything matching: https://volitionvalhalla.site/.../H4sIAAAA.../master.m3u8
  const streamUrlRegex = /https:\/\/volitionvalhalla\.site\/[a-zA-Z0-9_-]+\/pl\/H4sIAAAA[a-zA-Z0-9_+\/=:-]+\/master\.m3u8/;
  const matchResult = rawHtmlText.match(streamUrlRegex);

  if (!matchResult || !matchResult) {
    throw new NotFoundError('Could not find the master.m3u8 compressed stream payload in the page source');
  }

  const rawMasterM3u8Url = matchResult[0];
  ctx.progress(85);

  // 5. Output the structured payload containing the direct HLS streaming target
  return {
    embeds: [], // Kept empty since you are bypassing iframes completely
    stream: [
      {
        id: 'vidify-raw-hls',
        type: 'hls',                 // Declares it as an HTTP Live Streaming asset
        playlist: rawMasterM3u8Url,  // This is the link your custom player needs to execute
        qualities: {},               // Your player will automatically read qualities from the master manifest
        captions: [],
        headers: {
          // These headers are mandatory so volitionvalhalla's server accepts your player's stream chunks
          'Referer': `${VIDIFY_BASE}/`,
          'Origin': VIDIFY_BASE,
          'User-Agent': headers['User-Agent']
        }
      }
    ]
  };
}

// 6. Register the custom provider module
export const vidifySourceScraper = makeSourcerer({
  id: 'vidify-source',
  name: 'Vidify Native🚀',
  rank: 100,
  disabled: false,
  flags: [],
  scrapeMovie: ScrapeVidifyStream,
  scrapeShow: ScrapeVidifyStream,
}); */