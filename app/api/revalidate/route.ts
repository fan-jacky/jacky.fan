import { revalidatePath, revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';

function getConfiguredSecret(): string | null {
  return process.env.REVALIDATE_SECRET ?? process.env.PAYLOAD_SECRET ?? null;
}

function isAuthorized(request: Request, providedSecret: unknown): boolean {
  const configuredSecret = getConfiguredSecret();

  if (!configuredSecret) {
    return process.env.NODE_ENV !== 'production';
  }

  const headerSecret = request.headers.get('x-revalidate-secret');

  return headerSecret === configuredSecret || providedSecret === configuredSecret;
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({} as Record<string, unknown>));
  const providedSecret = typeof body.secret === 'string' ? body.secret : undefined;

  if (!isAuthorized(request, providedSecret)) {
    return NextResponse.json({ revalidated: false, message: 'Unauthorized' }, { status: 401 });
  }

  const tags = [body.tag, ...(Array.isArray(body.tags) ? body.tags : [])].filter(
    (value): value is string => typeof value === 'string' && value.trim().length > 0,
  );
  const paths = [body.path, ...(Array.isArray(body.paths) ? body.paths : [])].filter(
    (value): value is string => typeof value === 'string' && value.trim().length > 0,
  );

  if (tags.length === 0 && paths.length === 0) {
    return NextResponse.json(
      { revalidated: false, message: 'Provide at least one tag or path.' },
      { status: 400 },
    );
  }

  for (const tag of tags) {
    revalidateTag(tag, 'max');
  }

  for (const path of paths) {
    revalidatePath(path);
  }

  return NextResponse.json({ revalidated: true, now: Date.now(), tags, paths });
}