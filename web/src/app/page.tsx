import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-gradient-to-b from-slate-950 to-slate-900 text-white">
        <nav className="border-b border-slate-800">
          <div className="container mx-auto flex items-center justify-between px-4 py-4 md:px-6">
            <div className="text-2xl font-bold">Safe Mine Pro</div>
            <Link href="/dashboard/overview">
              <Button className="bg-blue-600 hover:bg-blue-700">Dashboard</Button>
            </Link>
          </div>
        </nav>

        <section className="container mx-auto px-4 py-20 md:px-6 md:py-32">
          <div className="max-w-3xl">
            <div className="mb-6 inline-block rounded-full bg-blue-500/10 px-3 py-1 text-sm text-blue-300 border border-blue-500/30">
              Advanced Mining Operations
            </div>
            <h1 className="text-5xl font-bold leading-tight md:text-6xl mb-6">
              Enterprise-Grade Coal Mine Health Monitoring
            </h1>
            <p className="text-xl text-slate-300 mb-8 leading-relaxed">
              Real-time monitoring of critical health and environmental metrics for coal miners. Track heart rate, SpO2, body temperature, ambient conditions, and more with instant alerts and comprehensive analytics.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link href="/dashboard/overview">
                <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                  Launch Dashboard
                </Button>
              </Link>
              <Button
                size="lg"
                className="border-slate-300 bg-slate-700 text-white hover:bg-slate-600 font-semibold"
              >
                Documentation
              </Button>
            </div>
          </div>
        </section>
      </div>

      <section className="container mx-auto px-4 py-20 md:px-6">
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Platform Capabilities</h2>
          <p className="text-slate-600 text-lg">Comprehensive monitoring features designed for enterprise operations</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="border-slate-200 bg-white hover:shadow-lg transition-shadow">
            <div className="p-8">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                <div className="text-2xl">24/7</div>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Real-time Monitoring</h3>
              <p className="text-slate-600">Continuous 24/7 monitoring of all safety metrics with instant notifications for anomalies</p>
            </div>
          </Card>

          <Card className="border-slate-200 bg-white hover:shadow-lg transition-shadow">
            <div className="p-8">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                <div className="text-2xl">8</div>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Multi-Metric Tracking</h3>
              <p className="text-slate-600">Monitor up to 8 different metrics including heart rate, SpO2, body temperature, and environmental sensors</p>
            </div>
          </Card>

          <Card className="border-slate-200 bg-white hover:shadow-lg transition-shadow">
            <div className="p-8">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-amber-100">
                <div className="text-2xl">≡</div>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Live Analytics</h3>
              <p className="text-slate-600">Interactive charts and dashboards with historical data analysis and trend reporting</p>
            </div>
          </Card>

          <Card className="border-slate-200 bg-white hover:shadow-lg transition-shadow">
            <div className="p-8">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                <div className="text-2xl">⚡</div>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Instant Alerts</h3>
              <p className="text-slate-600">Configurable thresholds with instant notifications when safety metrics exceed limits</p>
            </div>
          </Card>

          <Card className="border-slate-200 bg-white hover:shadow-lg transition-shadow">
            <div className="p-8">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-100">
                <div className="text-2xl">☁</div>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Cloud Integration</h3>
              <p className="text-slate-600">Seamless integration with ThingSpeak cloud platform for reliable data management</p>
            </div>
          </Card>

          <Card className="border-slate-200 bg-white hover:shadow-lg transition-shadow">
            <div className="p-8">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-rose-100">
                <div className="text-2xl">✓</div>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Safety Compliance</h3>
              <p className="text-slate-600">Meet industry standards with comprehensive audit trails and compliance reporting</p>
            </div>
          </Card>
        </div>
      </section>

      <section className="bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4 py-20 md:px-6">
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Key Metrics</h2>
            <p className="text-slate-600 text-lg">Monitor these critical health and safety indicators</p>
          </div>
          <div className="grid gap-6 md:grid-cols-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">Heart Rate</div>
              <p className="text-slate-600">Miner's heart rate monitoring</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">SpO2</div>
              <p className="text-slate-600">Blood oxygen saturation</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-amber-600 mb-2">Temperature</div>
              <p className="text-slate-600">Body and ambient temperature</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-cyan-600 mb-2">Environment</div>
              <p className="text-slate-600">Light level and distance sensors</p>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-20 md:px-6">
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Choose Safe Mine Pro?</h2>
          <p className="text-slate-600 text-lg">Enterprise solutions for mining safety</p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 mb-12">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-3">Proven Reliability</h3>
            <p className="text-slate-600 leading-relaxed">
              Built on industry-standard cloud infrastructure with 99.9% uptime SLA. Enterprise-grade security with end-to-end encryption and compliance with mining safety regulations.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-3">Scalable Architecture</h3>
            <p className="text-slate-600 leading-relaxed">
              Deploy across multiple mining sites and monitor hundreds of helmets simultaneously. Centralized dashboard with role-based access control for teams of any size.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-3">Real-time Insights</h3>
            <p className="text-slate-600 leading-relaxed">
              Live data visualization with instant anomaly detection. Historical analytics and trend analysis to optimize operations and prevent safety incidents.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-3">Expert Support</h3>
            <p className="text-slate-600 leading-relaxed">
              Dedicated technical support team available 24/7. Comprehensive documentation and training materials for seamless integration and deployment.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-slate-900 to-slate-800 text-white">
        <div className="container mx-auto px-4 py-20 md:px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Enhance Mining Safety?</h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Start monitoring your mining operations with Safe Mine Pro today. Get real-time insights and ensure worker safety across your operations.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link href="/dashboard/overview">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 font-semibold">
                Access Dashboard Now
              </Button>
            </Link>
            <Button
              size="lg"
              className="bg-white text-slate-900 hover:bg-slate-100 font-semibold"
            >
              Contact Sales
            </Button>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-slate-50">
        <div className="container mx-auto px-4 py-12 md:px-6">
          <div className="grid gap-8 md:grid-cols-4 mb-8">
            <div>
              <h4 className="font-semibold text-slate-900 mb-4">Safe Mine Pro</h4>
              <p className="text-slate-600 text-sm">Enterprise mining helmet monitoring platform</p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/dashboard/overview" className="text-slate-600 hover:text-slate-900">Dashboard</a></li>
                <li><a href="#" className="text-slate-600 hover:text-slate-900">Features</a></li>
                <li><a href="#" className="text-slate-600 hover:text-slate-900">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-slate-600 hover:text-slate-900">Documentation</a></li>
                <li><a href="#" className="text-slate-600 hover:text-slate-900">API Reference</a></li>
                <li><a href="#" className="text-slate-600 hover:text-slate-900">Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-slate-600 hover:text-slate-900">About</a></li>
                <li><a href="#" className="text-slate-600 hover:text-slate-900">Blog</a></li>
                <li><a href="#" className="text-slate-600 hover:text-slate-900">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-200 pt-8 text-center text-sm text-slate-600">
            <p>2025 Safe Mine Pro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
