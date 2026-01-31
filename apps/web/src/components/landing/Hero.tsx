'use client';

import React, { useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';

// Film grain generator class
class FilmGrain {
    width: number;
    height: number;
    grainCanvas: HTMLCanvasElement;
    grainCtx: CanvasRenderingContext2D;
    grainData: ImageData | null;
    frame: number;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.grainCanvas = document.createElement('canvas');
        this.grainCanvas.width = width;
        this.grainCanvas.height = height;
        this.grainCtx = this.grainCanvas.getContext('2d')!;
        this.grainData = null;
        this.frame = 0;
        this.generateGrainPattern();
    }

    generateGrainPattern() {
        const imageData = this.grainCtx.createImageData(this.width, this.height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            const grain = Math.random();
            const value = grain * 255;
            data[i] = value;
            data[i + 1] = value;
            data[i + 2] = value;
            data[i + 3] = 255;
        }

        this.grainData = imageData;
    }

    update() {
        this.frame++;

        if (this.frame % 2 === 0 && this.grainData) {
            const data = this.grainData.data;

            for (let i = 0; i < data.length; i += 4) {
                const grain = Math.random();
                const time = this.frame * 0.01;
                const x = (i / 4) % this.width;
                const y = Math.floor((i / 4) / this.width);

                const pattern = Math.sin(x * 0.01 + time) * Math.cos(y * 0.01 - time);
                const value = (grain * 0.8 + pattern * 0.2) * 255;

                data[i] = value;
                data[i + 1] = value;
                data[i + 2] = value;
            }

            this.grainCtx.putImageData(this.grainData, 0, 0);
        }
    }

    apply(ctx: CanvasRenderingContext2D, intensity = 0.05, colorize = true, hue = 0) {
        ctx.save();

        ctx.globalCompositeOperation = 'screen';
        ctx.globalAlpha = intensity * 0.5;
        ctx.drawImage(this.grainCanvas, 0, 0);

        ctx.globalCompositeOperation = 'multiply';
        ctx.globalAlpha = 1 - (intensity * 0.3);
        ctx.drawImage(this.grainCanvas, 0, 0);

        if (colorize) {
            ctx.globalCompositeOperation = 'overlay';
            ctx.globalAlpha = intensity * 0.3;
            ctx.fillStyle = `hsla(${hue}, 50%, 50%, 1)`;
            ctx.fillRect(0, 0, this.width, this.height);
        }

        ctx.restore();
    }

    resize(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.grainCanvas.width = width;
        this.grainCanvas.height = height;
        this.generateGrainPattern();
    }
}

interface Wave {
    amplitude: number;
    frequency: number;
    speed: number;
    offset: number;
    thickness: number;
    opacity: number;
}

interface ColorState {
    hue: number;
    targetHue: number;
    saturation: number;
    targetSaturation: number;
    lightness: number;
    targetLightness: number;
}

interface PostProcessing {
    filmGrainIntensity: number;
    vignetteIntensity: number;
    chromaticAberration: number;
    scanlineIntensity: number;
}

interface BeamState {
    bassIntensity: number;
    midIntensity: number;
    trebleIntensity: number;
    time: number;
    filmGrain: FilmGrain | null;
    colorState: ColorState;
    waves: Wave[];
    particles: unknown[];
    bassHistory: number[];
    postProcessing: PostProcessing;
}

export const Hero = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number | null>(null);
    const beamRef = useRef<BeamState | null>(null);

    const initCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            if (beamRef.current?.filmGrain) {
                beamRef.current.filmGrain.resize(canvas.width, canvas.height);
            }
        };

        const filmGrain = new FilmGrain(window.innerWidth, window.innerHeight);

        const beam: BeamState = {
            bassIntensity: 0,
            midIntensity: 0,
            trebleIntensity: 0,
            time: 0,
            filmGrain: filmGrain,
            colorState: {
                hue: 200,
                targetHue: 200,
                saturation: 60,
                targetSaturation: 60,
                lightness: 50,
                targetLightness: 50
            },
            waves: [
                { amplitude: 30, frequency: 0.003, speed: 0.015, offset: 0, thickness: 1, opacity: 0.9 },
                { amplitude: 25, frequency: 0.004, speed: 0.01, offset: Math.PI * 0.5, thickness: 0.8, opacity: 0.7 },
                { amplitude: 20, frequency: 0.005, speed: 0.02, offset: Math.PI, thickness: 0.6, opacity: 0.5 },
                { amplitude: 35, frequency: 0.002, speed: 0.008, offset: Math.PI * 1.5, thickness: 1.2, opacity: 0.6 }
            ],
            particles: [],
            bassHistory: new Array(20).fill(0),
            postProcessing: {
                filmGrainIntensity: 0.04,
                vignetteIntensity: 0.4,
                chromaticAberration: 0.8,
                scanlineIntensity: 0.02
            }
        };
        beamRef.current = beam;

        resizeCanvas();

        const animate = () => {
            animationRef.current = requestAnimationFrame(animate);

            ctx.fillStyle = 'rgba(0, 0, 0, 0.92)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Smooth animation
            beam.bassIntensity = 0.35 + Math.sin(beam.time * 0.008) * 0.25;
            beam.midIntensity = 0.3 + Math.sin(beam.time * 0.012) * 0.2;
            beam.trebleIntensity = 0.2 + Math.sin(beam.time * 0.015) * 0.1;

            // Crypto-themed colors (cyan/blue/purple)
            beam.colorState.targetHue = 200 + Math.sin(beam.time * 0.003) * 40;
            beam.colorState.targetSaturation = 50 + Math.sin(beam.time * 0.008) * 20;
            beam.colorState.targetLightness = 45 + Math.sin(beam.time * 0.006) * 15;

            beam.colorState.hue += (beam.colorState.targetHue - beam.colorState.hue) * 0.5;
            beam.colorState.saturation += (beam.colorState.targetSaturation - beam.colorState.saturation) * 0.2;
            beam.colorState.lightness += (beam.colorState.targetLightness - beam.colorState.lightness) * 0.1;

            beam.time++;

            const centerY = canvas.height / 2;

            // Draw waves
            beam.waves.forEach((wave, waveIndex) => {
                wave.offset += wave.speed * (1 + beam.bassIntensity * 0.5);

                const freqInfluence = waveIndex < 2 ? beam.bassIntensity : beam.midIntensity;
                const dynamicAmplitude = wave.amplitude * (1 + freqInfluence * 4);

                const waveHue = beam.colorState.hue + waveIndex * 20;
                const waveSaturation = beam.colorState.saturation - waveIndex * 5;
                const waveLightness = beam.colorState.lightness + waveIndex * 5;

                const gradient = ctx.createLinearGradient(0, centerY - dynamicAmplitude, 0, centerY + dynamicAmplitude);
                const alpha = wave.opacity * (0.4 + beam.bassIntensity * 0.4);

                gradient.addColorStop(0, `hsla(${waveHue}, ${waveSaturation}%, ${waveLightness}%, 0)`);
                gradient.addColorStop(0.5, `hsla(${waveHue}, ${waveSaturation}%, ${waveLightness + 10}%, ${alpha})`);
                gradient.addColorStop(1, `hsla(${waveHue}, ${waveSaturation}%, ${waveLightness}%, 0)`);

                ctx.beginPath();
                for (let x = -50; x <= canvas.width + 50; x += 2) {
                    const y1 = Math.sin(x * wave.frequency + wave.offset) * dynamicAmplitude;
                    const y2 = Math.sin(x * wave.frequency * 2 + wave.offset * 1.5) * (dynamicAmplitude * 0.3 * beam.midIntensity);
                    const y3 = Math.sin(x * wave.frequency * 0.5 + wave.offset * 0.7) * (dynamicAmplitude * 0.5);
                    const y = centerY + y1 + y2 + y3;

                    if (x === -50) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }

                ctx.lineTo(canvas.width + 50, canvas.height);
                ctx.lineTo(-50, canvas.height);
                ctx.closePath();

                ctx.fillStyle = gradient;
                ctx.fill();
            });

            // Apply post-processing
            if (beam.filmGrain) {
                beam.filmGrain.update();
                beam.filmGrain.apply(ctx, beam.postProcessing.filmGrainIntensity, true, beam.colorState.hue);
            }

            // Scanlines
            ctx.strokeStyle = `rgba(0, 0, 0, ${beam.postProcessing.scanlineIntensity})`;
            ctx.lineWidth = 1;
            for (let y = 0; y < canvas.height; y += 3) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(canvas.width, y);
                ctx.stroke();
            }

            // Vignette
            const vignette = ctx.createRadialGradient(
                canvas.width / 2, canvas.height / 2, canvas.width * 0.2,
                canvas.width / 2, canvas.height / 2, canvas.width * 0.9
            );
            vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
            vignette.addColorStop(0.5, `rgba(0, 0, 0, ${beam.postProcessing.vignetteIntensity * 0.3})`);
            vignette.addColorStop(0.8, `rgba(0, 0, 0, ${beam.postProcessing.vignetteIntensity * 0.6})`);
            vignette.addColorStop(1, `rgba(0, 0, 0, ${beam.postProcessing.vignetteIntensity})`);
            ctx.fillStyle = vignette;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Film dust
            if (Math.random() < 0.02) {
                const dustCount = Math.floor(Math.random() * 5) + 1;
                for (let i = 0; i < dustCount; i++) {
                    const x = Math.random() * canvas.width;
                    const y = Math.random() * canvas.height;
                    const size = Math.random() * 2 + 0.5;

                    ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.3})`;
                    ctx.beginPath();
                    ctx.arc(x, y, size, 0, Math.PI * 2);
                    ctx.fill();
                }
            }

            // Film flicker
            const flicker = Math.sin(beam.time * 0.3) * 0.015 + Math.random() * 0.008;
            ctx.fillStyle = `rgba(255, 255, 255, ${flicker})`;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        };

        animate();

        window.addEventListener('resize', resizeCanvas);

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, []);

    useEffect(() => {
        const cleanup = initCanvas();
        return cleanup;
    }, [initCanvas]);

    return (
        <section className="relative min-h-screen overflow-hidden">
            {/* Animated Canvas Background */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full z-0"
            />

            {/* Content */}
            <div className="relative z-10 min-h-screen flex items-center justify-center pt-20">
                <div className="text-center px-4 max-w-5xl mx-auto">
                    {/* Tagline */}
                    <p className="text-sm tracking-[0.2em] text-white/50 mb-8 uppercase">
                        AI-Powered Crypto Intelligence
                    </p>

                    {/* Main Title */}
                    <h1 className="text-[clamp(4rem,18vw,12rem)] font-black leading-[0.8] mb-12 text-white tracking-tighter"
                        style={{ textShadow: '0 0 80px rgba(255,255,255,0.4)' }}>
                        <span className="block">BANKER</span>
                        <span className="block">EXPERT</span>
                    </h1>

                    {/* Subtitle */}
                    <p className="text-base md:text-lg text-white/50 italic max-w-xl mx-auto mb-6">
                        Transform your crypto portfolio with intelligent analysis and personalized insights
                    </p>

                    {/* Credit/Brand */}
                    <p className="text-xs tracking-[0.2em] text-white/30 uppercase mb-12">
                        Your Personal Crypto Advisor
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/register"
                            className="px-8 py-3 bg-white text-black font-semibold text-sm tracking-wide hover:bg-white/90 transition-all"
                        >
                            START FREE ANALYSIS
                        </Link>
                        <Link
                            href="#how-it-works"
                            className="px-8 py-3 border border-white/30 text-white font-medium text-sm tracking-wide hover:bg-white/10 transition-all"
                        >
                            HOW IT WORKS
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};
