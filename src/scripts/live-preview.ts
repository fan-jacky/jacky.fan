// Vanilla replacement for @payloadcms/live-preview-react (LivePreviewPage /
// LivePreviewProject). Active only when the page is loaded inside the Payload
// admin live-preview iframe with ?livePreview=true.
//
// The static HTML already contains the build-time render; when the admin sends
// document events, the live data is fetched and the #cms-content container is
// re-rendered client-side using the same shared block renderers used at build
// time.

import { subscribe } from '@payloadcms/live-preview';
import { getContents, hasProjectGridBlock, bgHeading } from '../lib/cms/blocks';
import { renderProjectDetail } from '../lib/cms/project-detail';
import { fetchProjectGridItems } from '../lib/cms/pages';
import type { PageDocument } from '../lib/cms/types';

type LpConfig = {
  type: 'page' | 'project';
  serverURL: string;
  depth: number;
  initialData: any;
};

function readConfig(): LpConfig | null {
  const params = new URLSearchParams(window.location.search);
  if (params.get('livePreview') !== 'true') return null;

  const container = document.getElementById('cms-content');
  if (!container) return null;

  const type = container.dataset.lpType as 'page' | 'project' | undefined;
  const serverURL = container.dataset.lpServer;
  const depth = parseInt(container.dataset.lpDepth ?? '3', 10);
  if (!type || !serverURL) return null;

  let initialData: any = null;
  const initialJson = document.getElementById('lp-initial');
  if (initialJson?.textContent) {
    try {
      initialData = JSON.parse(initialJson.textContent);
    } catch {
      initialData = null;
    }
  }

  return { type, serverURL, depth, initialData: initialData ?? {} };
}

let projectGridItems: any[] | null = null;

async function renderPage(data: PageDocument): Promise<string> {
  if (hasProjectGridBlock(data.contents) && projectGridItems === null) {
    try {
      projectGridItems = await fetchProjectGridItems();
    } catch (error) {
      console.warn('Live preview: failed to load project grid items.', error);
      projectGridItems = [];
    }
  }

  const contents = getContents(data.contents, {
    pageUrl: data.url ?? undefined,
    projectGridItems: projectGridItems ?? [],
  });

  const heading = data.enableBgHeading && data.pageTitle ? bgHeading(data.pageTitle) : '';

  return heading + contents;
}

async function start() {
  const config = readConfig();
  if (!config) return;

  const container = document.getElementById('cms-content');
  if (!container) return;

  const render = async (data: any) => {
    try {
      const html = config.type === 'project'
        ? renderProjectDetail(data)
        : await renderPage(data);

      container.innerHTML = html;
      window.dispatchEvent(new Event('lp:rerender'));
    } catch (error) {
      console.error('Live preview: failed to re-render.', error);
    }
  };

  subscribe({
    serverURL: config.serverURL,
    depth: config.depth,
    initialData: config.initialData,
    callback: (data: any) => {
      void render(data);
    },
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => void start());
} else {
  void start();
}
