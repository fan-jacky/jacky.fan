'use client'

import { LocomotiveScrollPositionContext } from '@/contexts/LocomotiveScrollPositionContext';
import { useContext, useEffect, useRef } from 'react';
import { LocomotiveScrollContext } from '@/contexts/LocomotiveScrollContext';

function LocomotiveScrollWrappper({ children }: { children: React.ReactNode }) {

    const cleanupRef = useRef<Array<() => void>>([]);
    const instanceRef = useRef<any>(undefined);

    const { setScrollPos } = useContext(LocomotiveScrollPositionContext);
    const { setlocoScroll } = useContext(LocomotiveScrollContext);

    useEffect(() => {
        let scroll : any;

        (async () => {

            const LocomotiveScroll = (await import('locomotive-scroll')).default;
            const locomotiveScroll = new LocomotiveScroll({
                lenisOptions: {
                    smoothWheel: true,
                    wheelMultiplier: 1,
                },
                scrollCallback: ({ limit, scroll }) => {
                    if (setScrollPos) {
                        setScrollPos({
                            limit: { x: 0, y: limit },
                            scroll: { x: 0, y: scroll },
                        });
                    }
                },
            });
            
            if (setlocoScroll) {
                setlocoScroll(locomotiveScroll);
            }
            instanceRef.current = locomotiveScroll;
            scroll = locomotiveScroll;

            document.querySelectorAll("a[href^='#']").forEach(anchor => {
                const handleClick = (event: Event) => {
                    const anchorTarget = anchor.getAttribute("href") ?? "";
                    if (anchorTarget.length <= 1 || !document.querySelector(anchorTarget)) {
                        return;
                    }

                    event.preventDefault();
                    locomotiveScroll.scrollTo(anchorTarget);
                };

                anchor.addEventListener("click", handleClick);
                cleanupRef.current.push(() => {
                    anchor.removeEventListener("click", handleClick);
                });
            });

            const handleResize = () => {
                locomotiveScroll.resize();
            };

            window.addEventListener('resize', handleResize);
            cleanupRef.current.push(() => {
                window.removeEventListener('resize', handleResize);
            });
        }
        )()

        return () => {
            cleanupRef.current.forEach((cleanup) => cleanup());
            cleanupRef.current = [];
            scroll?.destroy();
            instanceRef.current?.destroy();
            instanceRef.current = undefined;
            if (setlocoScroll) {
                setlocoScroll(undefined);
            }
        }
    }, [setScrollPos, setlocoScroll])

    return <>{children}</>;
}

export default LocomotiveScrollWrappper;