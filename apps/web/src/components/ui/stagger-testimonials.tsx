"use client"

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const SQRT_5000 = Math.sqrt(5000);

const testimonials = [
    {
        tempId: 0,
        testimonial: "The most advanced AI analysis I've seen in crypto. It identified multiple whale movements before they hit the news.",
        by: "Michael, Quantitative Trader",
        imgSrc: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop"
    },
    {
        tempId: 1,
        testimonial: "I finally feel in control of my portfolio. The read-only connection is secure and the insights are pure gold.",
        by: "Sarah, Long-term Investor",
        imgSrc: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop"
    },
    {
        tempId: 2,
        testimonial: "Banker Expert saved me from three high-risk rugpulls this week alone. The AI analysis is incredibly sharp.",
        by: "David, DeFi Strategist",
        imgSrc: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop"
    },
    {
        tempId: 3,
        testimonial: "Seamless across all my wallets. Tracking P&L has never been this clear or this insightful.",
        by: "Elena, Portfolio Manager",
        imgSrc: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop"
    },
    {
        tempId: 4,
        testimonial: "The best ROI I've had on any tool. It's essentially a personal hedge fund manager in my pocket.",
        by: "James, Crypto Entrepreneur",
        imgSrc: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop"
    }
];

interface TestimonialCardProps {
    position: number;
    testimonial: typeof testimonials[0];
    handleMove: (steps: number) => void;
    cardSize: number;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
    position,
    testimonial,
    handleMove,
    cardSize
}) => {
    const isCenter = position === 0;

    return (
        <div
            onClick={() => handleMove(position)}
            className={cn(
                "absolute left-1/2 top-1/2 cursor-pointer border-2 p-6 transition-all duration-500 ease-in-out select-none",
                isCenter
                    ? "z-10 bg-white text-black border-white shadow-[0_0_50px_rgba(255,255,255,0.15)]"
                    : "z-0 bg-zinc-900/50 text-zinc-400 border-zinc-800 backdrop-blur-sm hover:border-zinc-700"
            )}
            style={{
                width: cardSize,
                height: cardSize,
                clipPath: `polygon(50px 0%, calc(100% - 50px) 0%, 100% 50px, 100% 100%, calc(100% - 50px) 100%, 50px 100%, 0 100%, 0 0)`,
                transform: `
          translate(-50%, -50%) 
          translateX(${(cardSize / 1.5) * position}px)
          translateY(${isCenter ? -65 : position % 2 ? 15 : -15}px)
          rotate(${isCenter ? 0 : position % 2 ? 2.5 : -2.5}deg)
        `,
            }}
        >
            <span
                className="absolute block origin-top-right rotate-45 bg-zinc-800"
                style={{
                    right: -2,
                    top: 48,
                    width: SQRT_5000,
                    height: 2
                }}
            />
            <img
                src={testimonial.imgSrc}
                alt={`${testimonial.by.split(',')[0]}`}
                className="mb-4 h-12 w-10 bg-zinc-800 object-cover object-top grayscale"
                style={{
                    boxShadow: isCenter ? "3px 3px 0px #000" : "3px 3px 0px #333"
                }}
            />
            <h3 className={cn(
                "text-base sm:text-lg font-bold leading-tight tracking-tight",
                isCenter ? "text-black" : "text-zinc-200"
            )}>
                "{testimonial.testimonial}"
            </h3>
            <p className={cn(
                "absolute bottom-6 left-6 right-6 mt-2 text-[10px] sm:text-xs font-bold uppercase tracking-widest",
                isCenter ? "text-black/60" : "text-zinc-500"
            )}>
                — {testimonial.by}
            </p>
        </div>
    );
};

export const StaggerTestimonials: React.FC = () => {
    const [cardSize, setCardSize] = useState(320);
    const [testimonialsList, setTestimonialsList] = useState(testimonials);

    const handleMove = (steps: number) => {
        const newList = [...testimonialsList];
        if (steps > 0) {
            for (let i = steps; i > 0; i--) {
                const item = newList.shift();
                if (!item) return;
                newList.push({ ...item, tempId: Math.random() });
            }
        } else {
            for (let i = steps; i < 0; i++) {
                const item = newList.pop();
                if (!item) return;
                newList.unshift({ ...item, tempId: Math.random() });
            }
        }
        setTestimonialsList(newList);
    };

    useEffect(() => {
        const updateSize = () => {
            const { matches } = window.matchMedia("(min-width: 640px)");
            setCardSize(matches ? 320 : 260);
        };

        updateSize();
        window.addEventListener("resize", updateSize);
        return () => window.removeEventListener("resize", updateSize);
    }, []);

    return (
        <div
            className="relative w-full h-full overflow-hidden bg-black flex items-center justify-center p-8"
            style={{ minHeight: 600 }}
        >
            {/* Subtle background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/5 blur-[120px] rounded-full pointer-events-none" />

            {testimonialsList.map((testimonial, index) => {
                const position = testimonialsList.length % 2
                    ? index - (testimonialsList.length + 1) / 2
                    : index - testimonialsList.length / 2;
                return (
                    <TestimonialCard
                        key={testimonial.tempId}
                        testimonial={testimonial}
                        handleMove={handleMove}
                        position={position}
                        cardSize={cardSize}
                    />
                );
            })}

            <div className="absolute bottom-12 left-1/2 flex -translate-x-1/2 gap-4">
                <button
                    onClick={() => handleMove(-1)}
                    className={cn(
                        "flex h-12 w-12 items-center justify-center transition-all bg-zinc-900 border border-zinc-800 text-white rounded-full hover:bg-white hover:text-black hover:scale-110 active:scale-95",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
                    )}
                    aria-label="Previous testimonial"
                >
                    <ChevronLeft size={20} />
                </button>
                <button
                    onClick={() => handleMove(1)}
                    className={cn(
                        "flex h-12 w-12 items-center justify-center transition-all bg-zinc-900 border border-zinc-800 text-white rounded-full hover:bg-white hover:text-black hover:scale-110 active:scale-95",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
                    )}
                    aria-label="Next testimonial"
                >
                    <ChevronRight size={20} />
                </button>
            </div>
        </div>
    );
};
