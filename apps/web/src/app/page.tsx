import { Header } from '@/components/landing';
import { FullScreenScrollFX } from '@/components/ui/full-screen-scroll-fx';

const sections = [
    {
        leftLabel: "Intelligence",
        title: "BANKER EXPERT",
        description: "Your advanced AI-powered crypto companion for deep portfolio analysis and intelligent market insights.",
        rightLabel: "AI POWERED",
        background: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2000&auto=format&fit=crop",
    },
    {
        leftLabel: "Experience",
        title: "SMART TRACKING",
        description: "Real-time monitoring of your assets across multiple chains with precision and clarity.",
        rightLabel: "CRYPTO FIRST",
        background: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?q=80&w=2000&auto=format&fit=crop",
    },
    {
        leftLabel: "The Process",
        title: "CONNECT WALLET",
        description: "Secure, read-only access to your public addresses. We never ask for private keys.",
        rightLabel: "READ ONLY",
        background: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2940&auto=format&fit=crop",
    },
    {
        leftLabel: "Analysis",
        title: "AI INSIGHTS",
        description: "Leverage Gemini AI to uncover hidden patterns and optimization opportunities in your trades.",
        rightLabel: "GEMINI POWERED",
        background: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2944&auto=format&fit=crop",
    },
    {
        leftLabel: "Reports",
        title: "PROFIT & LOSS",
        description: "Detailed performance reports that show exactly where your gains are coming from.",
        rightLabel: "REAL TIME",
        background: "https://images.unsplash.com/photo-1611974715853-2b8ef955051b?q=80&w=2940&auto=format&fit=crop",
    },
    {
        leftLabel: "Community",
        title: "JOIN THE EXPERTS",
        description: "Be part of a growing community of data-driven investors making smarter moves.",
        rightLabel: "TESTIMONIALS",
        background: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2880&auto=format&fit=crop",
    },
];

export default function LandingPage() {
    return (
        <main className="min-h-screen bg-black overflow-hidden">
            <Header />
            <FullScreenScrollFX
                sections={sections}
                colors={{
                    text: "rgba(255,255,255,0.95)",
                    overlay: "rgba(0,0,0,0.4)",
                    pageBg: "#000000",
                    stageBg: "#000000",
                }}
                header={
                    <div className="opacity-0 h-20">
                        {/* Empty space for Header */}
                    </div>
                }
                footer={
                    <div className="flex flex-col gap-2 items-center">
                        <div className="flex gap-12 text-[clamp(1rem,4vw,3rem)] font-black opacity-20 tracking-tighter">
                            <span>BANKER</span>
                            <span>EXPERT</span>
                        </div>
                        <div className="text-white/20 text-xs tracking-[0.4em] mt-4 uppercase">Your Personal Crypto Advisor</div>
                    </div>
                }
                durations={{ change: 0.8, snap: 1000 }}
            />
        </main>
    );
}
