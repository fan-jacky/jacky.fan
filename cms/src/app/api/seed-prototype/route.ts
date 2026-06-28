import { NextResponse } from 'next/server'

import { seedPrototypeContent } from '../../../scripts/seedPrototypeContent'

export async function POST() {
  try {
    await seedPrototypeContent()

    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    )
  }
}