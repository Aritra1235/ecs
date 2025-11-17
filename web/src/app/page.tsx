"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import BlurText from "@/components/reactbits/BlurText";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.remove("opacity-0");
            entry.target.classList.add("animate-fade-in-up");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "50px" }
    );

    const sections = document.querySelectorAll(".observe-section");
    sections.forEach((section) => {
      if (section.getBoundingClientRect().top < window.innerHeight) {
        section.classList.remove("opacity-0");
        section.classList.add("animate-fade-in-up");
      } else {
        observer.observe(section);
      }
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Animated Navigation */}
      <div className="border-b backdrop-blur-xl sticky top-0 z-50 animate-fade-in">
        <nav className="container mx-auto flex items-center justify-between px-4 py-4 md:px-6">
          <div className="text-xl font-semibold tracking-tight transition-transform hover:scale-105">
            SafeMine Pro
          </div>
          <div className="hidden items-center gap-6 text-sm md:flex">
            <Link
              href="#platform"
              className="transition-all hover:scale-110 hover:-translate-y-0.5"
            >
              Platform
            </Link>
            <Link
              href="#metrics"
              className="transition-all hover:scale-110 hover:-translate-y-0.5"
            >
              Metrics
            </Link>
            <Link
              href="#why-us"
              className="transition-all hover:scale-110 hover:-translate-y-0.5"
            >
              Why Us
            </Link>
          </div>
          <Link href="/dashboard/overview">
            <Button className="rounded-full px-6 text-sm font-medium transition-all hover:scale-105 hover:shadow-lg">
              Dashboard
            </Button>
          </Link>
        </nav>
      </div>

      {/* Hero Section with Animations */}
      <section
        ref={heroRef}
        className="container mx-auto px-4 py-16 md:px-6 md:py-24 relative"
      >
        {/* Floating Background Elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 rounded-full opacity-20 blur-3xl animate-pulse" style={{ animationDuration: '4s' }}></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full opacity-20 blur-3xl animate-pulse" style={{ animationDuration: '6s' }}></div>
        </div>

        <div className="grid gap-12 md:grid-cols-2 md:gap-16 items-center">
          {/* Left Content */}
          <div className={`space-y-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/* Status Badge */}
            <div className="inline-flex items-center rounded-full border px-4 py-2 text-xs backdrop-blur-sm animate-fade-in">
              <span className="font-medium">Real-time mining safety monitoring</span>
            </div>

            {/* Main Heading */}
            <BlurText

              text="Safe Mining For All Workers"

              delay={150}

              animateBy="words"

              direction="top"

              onAnimationComplete={() => { }}

              className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight"

            />

            {/* Description */}
            <p
              className="text-lg md:text-xl leading-relaxed opacity-90"
              style={{
                animation: 'fade-in-up 0.8s ease-out 0.4s both'
              }}
            >
              Enterprise IoT monitoring that connects smart helmets, cloud analytics,
              and instant alerts—protecting every miner, every shift.
            </p>

            {/* CTA Buttons */}
            <div
              className="flex flex-col sm:flex-row gap-4"
              style={{
                animation: 'fade-in-up 0.8s ease-out 0.6s both'
              }}
            >
              <Link href="/dashboard/overview" className="w-full sm:w-auto">
                <Button className="w-full rounded-full px-8 py-6 text-base font-semibold transition-all hover:scale-105 hover:shadow-xl">
                  Explore Dashboard
                  <span className="ml-2 transition-transform group-hover:translate-x-1 inline-block">→</span>
                </Button>
              </Link>
              <Button
                variant="outline"
                className="w-full sm:w-auto rounded-full px-8 py-6 text-base backdrop-blur-sm transition-all hover:scale-105"
                onClick={() => {
                  window.open("https://axw4mt5pb0w8.compat.objectstorage.ap-hyderabad-1.oraclecloud.com/ari-bucket-7788/safeminepro.pdf", "_blank");
                }}
              >
                Watch Demo
              </Button>
            </div>

            {/* Stats */}
            <div
              ref={statsRef}
              className="grid grid-cols-3 gap-6 pt-8"
              style={{
                animation: 'fade-in-up 0.8s ease-out 0.8s both'
              }}
            >
              <div className="space-y-1">
                <div className="text-3xl font-bold animate-counter">8</div>
                <div className="text-sm opacity-70">Vital Sensors</div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-bold animate-counter">24/7</div>
                <div className="text-sm opacity-70">Monitoring</div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-bold animate-counter">30s</div>
                <div className="text-sm opacity-70">Refresh Rate</div>
              </div>
            </div>
          </div>

          {/* Right: Live Metrics Card */}
          <div
            className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0 rotate-0' : 'opacity-0 translate-x-10 rotate-3'}`}
          >
            <Card className="p-6 backdrop-blur-xl shadow-2xl border-2 hover:shadow-3xl transition-all duration-500 hover:scale-[1.02]">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="text-sm font-medium opacity-70">Helmet-001</div>
                  <div className="text-lg font-semibold">Deep Shaft 3</div>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2"></span>
                  </span>
                  Live
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Heart Rate", value: "78", unit: "BPM", progress: 55, delay: 0 },
                  { label: "SpO2", value: "98", unit: "%", progress: 80, delay: 100 },
                  { label: "Skin Temp", value: "98.6", unit: "°F", progress: 70, delay: 200 },
                  { label: "Gas Level", value: "Normal", unit: "", progress: 25, delay: 300 }
                ].map((metric, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border backdrop-blur-sm hover:scale-105 transition-all duration-300 cursor-pointer"
                    style={{
                      animation: `fade-in-up 0.5s ease-out ${metric.delay}ms both`
                    }}
                  >
                    <div className="text-xs opacity-70 mb-2">{metric.label}</div>
                    <div className="flex items-baseline gap-1 mb-3">
                      <span className="text-2xl font-bold">{metric.value}</span>
                      {metric.unit && <span className="text-xs opacity-70">{metric.unit}</span>}
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-1000 ease-out"
                        style={{
                          width: `${metric.progress}%`,
                          animation: `expand-width 1.5s ease-out ${metric.delay}ms both`
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Alert Status */}
              <div className="mt-6 p-4 rounded-xl border">
                <div className="flex items-center justify-between text-sm">
                  <span className="opacity-70">System Status</span>
                  <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium">
                    <span className="h-1.5 w-1.5 rounded-full animate-pulse"></span>
                    All Systems Normal
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section id="platform" className="py-20 md:py-32 border-t observe-section opacity-0">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Built for Enterprise Operations
            </h2>
            <p className="text-lg opacity-80">
              From single shafts to global fleets—complete observability and control
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: (
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                ),
                title: "Health Monitoring",
                description: "Real-time vitals tracking with intelligent threshold alerts",
                features: ["Heart rate & SpO2", "Temperature tracking", "Anomaly detection"]
              },
              {
                icon: (
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                  </svg>
                ),
                title: "Environment Sensing",
                description: "Complete atmospheric risk awareness underground",
                features: ["Gas & flame detection", "Light & distance", "Safety standards"]
              },
              {
                icon: (
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                ),
                title: "Command Dashboard",
                description: "Executive overview in a single pane of glass",
                features: ["Live telemetry", "Historical analytics", "Alert management"]
              }
            ].map((feature, idx) => (
              <Card
                key={idx}
                className="p-8 group hover:scale-105 transition-all duration-500 cursor-pointer backdrop-blur-sm hover:shadow-2xl"
                style={{
                  animation: `fade-in-up 0.6s ease-out ${idx * 150}ms both`
                }}
              >
                <div className="mb-4 transition-transform group-hover:scale-110 group-hover:rotate-6 inline-block">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="opacity-80 mb-6">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.features.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <span className="h-1.5 w-1.5 rounded-full"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Metrics Showcase */}
      <section id="metrics" className="py-20 md:py-32 border-t observe-section opacity-0">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Eight Critical Metrics
            </h2>
            <p className="text-lg opacity-80">
              Standardized telemetry for audit, analysis, and incident response
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-4">
            {[
              { metric: "Heart BPM", range: "60-100 safe", detail: "Automatic threshold warnings" },
              { metric: "SpO2", range: "> 95 target", detail: "Hypoxia risk detection" },
              { metric: "Temperature", range: "Heat stress", detail: "Body & ambient tracking" },
              { metric: "Gas & Flame", range: "Situational", detail: "Complete risk picture" }
            ].map((item, idx) => (
              <Card
                key={idx}
                className="p-6 text-center group hover:scale-105 transition-all duration-500 cursor-pointer backdrop-blur-sm"
                style={{
                  animation: `fade-in-up 0.6s ease-out ${idx * 100}ms both`
                }}
              >
                <div className="text-xs uppercase tracking-wider opacity-70 mb-3">
                  {item.metric}
                </div>
                <div className="text-2xl font-bold mb-2 group-hover:scale-110 transition-transform">
                  {item.range}
                </div>
                <p className="text-sm opacity-80">{item.detail}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section id="why-us" className="py-20 md:py-32 border-t observe-section opacity-0">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid gap-12 md:grid-cols-2 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Safety-Critical by Design
              </h2>
              <p className="text-lg opacity-80 mb-8">
                Combining helmet firmware, robust APIs, and modern dashboards
                into a single safety-first platform.
              </p>

              <div className="grid gap-6">
                {[
                  { title: "Proven Reliability", desc: "Resilient data capture and storage" },
                  { title: "Infinite Scalability", desc: "Multi-helmet, multi-site ready" },
                  { title: "Smart Alerting", desc: "Context-aware threshold engine" },
                  { title: "Compliance Ready", desc: "Complete audit trail" }
                ].map((point, idx) => (
                  <div
                    key={idx}
                    className="flex gap-4 p-4 rounded-xl border backdrop-blur-sm hover:scale-105 transition-all duration-300"
                    style={{
                      animation: `fade-in-left 0.6s ease-out ${idx * 100}ms both`
                    }}
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl">
                      {idx + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{point.title}</h3>
                      <p className="text-sm opacity-80">{point.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Card className="p-8 backdrop-blur-sm hover:scale-105 transition-all duration-500">
              <div className="text-xs uppercase tracking-wider opacity-70 mb-6">
                Safety Thresholds
              </div>
              <div className="space-y-4">
                {[
                  { name: "Heart Rate", value: "60-100 normal, 120 critical" },
                  { name: "SpO2", value: "95+ target, 85 critical" },
                  { name: "Body Temp", value: "97-99 normal, 101 critical" },
                  { name: "Ambient", value: "35 warning, 40 critical" }
                ].map((threshold, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-lg border"
                    style={{
                      animation: `fade-in-right 0.5s ease-out ${idx * 100}ms both`
                    }}
                  >
                    <span className="text-sm font-medium">{threshold.name}</span>
                    <span className="text-xs opacity-70">{threshold.value}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 border-t observe-section opacity-0">
        <div className="container mx-auto px-4 md:px-6">
          <Card className="p-12 md:p-16 text-center backdrop-blur-xl shadow-2xl border-2 overflow-hidden relative">
            <div className="absolute inset-0 -z-10 opacity-10">
              <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in">
              Ready to Enhance Mining Safety?
            </h2>
            <p className="text-lg opacity-80 max-w-2xl mx-auto mb-10">
              Start streaming helmet telemetry, alerts, and analytics
              to your control room in minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard/overview">
                <Button className="rounded-full px-8 py-6 text-base font-semibold transition-all hover:scale-105 hover:shadow-xl">
                  Explore Live Dashboard
                </Button>
              </Link>
              <Button
                variant="outline"
                className="rounded-full px-8 py-6 text-base backdrop-blur-sm transition-all hover:scale-105"
              >
                Contact Sales
              </Button>
            </div>
          </Card>

          {/* Footer */}
          <footer className="mt-16 pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4 text-sm opacity-70">
            <p>SafeMine Pro · Smart Mining Helmet Safety Platform</p>
            <p>© 2025 SafeMine Pro. All rights reserved.</p>
          </footer>
        </div>
      </section>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-left {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fade-in-right {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes expand-width {
          from {
            width: 0%;
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -200% center;
          }
          100% {
            background-position: 200% center;
          }
        }

        .animate-shimmer {
          animation: shimmer 3s ease-in-out infinite;
        }

        .animate-counter {
          animation: counter 2s ease-out;
        }

        @keyframes counter {
          from {
            opacity: 0;
            transform: scale(0.5);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out both;
        }
      `}</style>
    </div>
  );
}
