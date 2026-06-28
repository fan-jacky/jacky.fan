'use client'

import { useEffect, useRef, useState } from 'react'

interface CountUpProps {
    end: number
    suffix?: string
    duration?: number
}

export default function CountUp({ end, suffix = '', duration = 2000 }: CountUpProps) {
    const [count, setCount] = useState(0)
    const [hasStarted, setHasStarted] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasStarted) {
                    setHasStarted(true)
                }
            },
            { threshold: 0.3 }
        )

        if (ref.current) {
            observer.observe(ref.current)
        }

        return () => observer.disconnect()
    }, [hasStarted])

    useEffect(() => {
        if (!hasStarted) return

        const startTime = performance.now()
        const step = (currentTime: number) => {
            const elapsed = currentTime - startTime
            const progress = Math.min(elapsed / duration, 1)
            // easeOutCubic
            const eased = 1 - Math.pow(1 - progress, 3)
            setCount(Math.round(eased * end))

            if (progress < 1) {
                requestAnimationFrame(step)
            }
        }

        requestAnimationFrame(step)
    }, [hasStarted, end, duration])

    return (
        <div
            ref={ref}
            style={{
                fontSize: '4rem',
                fontWeight: 800,
                color: 'var(--text-primary)',
                letterSpacing: '-0.04em',
                lineHeight: 1,
            }}
        >
            {count}{suffix}
        </div>
    )
}
