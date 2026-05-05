import { Link } from "wouter";
import { Zap, Brain, Activity, ShieldCheck, Settings2, ArrowRight } from "lucide-react";
import { SiAudi, SiBmw, SiVolkswagen, SiToyota, SiHonda, SiPorsche, SiKia, SiHyundai, SiNissan } from "react-icons/si";

export default function Home() {
  const brands = [
    { name: "BMW", Icon: SiBmw },
    { name: "Mercedes-Benz" },
    { name: "Audi", Icon: SiAudi },
    { name: "Volkswagen", Icon: SiVolkswagen },
    { name: "Toyota", Icon: SiToyota },
    { name: "Honda", Icon: SiHonda },
    { name: "Ford" },
    { name: "Porsche", Icon: SiPorsche },
    { name: "Nissan", Icon: SiNissan },
    { name: "Subaru" },
    { name: "Hyundai", Icon: SiHyundai },
    { name: "Kia", Icon: SiKia },
    { name: "Ferrari" },
    { name: "Lamborghini" },
    { name: "Chevrolet" },
    { name: "Dodge" },
    { name: "Mazda" },
    { name: "Volvo" },
    { name: "Jeep" },
    { name: "Land Rover" }
  ];

  // Duplicate for seamless marquee
  const marqueeBrands = [...brands, ...brands];

  return (
    <div className="flex flex-col w-full bg-white text-gray-900 overflow-hidden">
      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex flex-col justify-center overflow-hidden bg-gray-50 border-b border-gray-200 py-20">
        <div className="absolute inset-0 pointer-events-none overflow-hidden flex justify-end items-center opacity-10">
          <svg className="w-full h-full text-red-600 max-w-4xl translate-x-1/4" viewBox="0 0 100 100" preserveAspectRatio="none">
            <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="0.5" fill="none" />
            <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="0.5" fill="none" />
            <circle cx="50" cy="50" r="20" stroke="currentColor" strokeWidth="0.5" fill="none" />
            <circle cx="50" cy="50" r="10" stroke="currentColor" strokeWidth="0.5" fill="none" />
            <path d="M0,50 L100,50" stroke="currentColor" strokeWidth="0.5" />
            <path d="M50,0 L50,100" stroke="currentColor" strokeWidth="0.5" />
            <path d="M15,15 L85,85" stroke="currentColor" strokeWidth="0.5" />
            <path d="M15,85 L85,15" stroke="currentColor" strokeWidth="0.5" />
          </svg>
        </div>
        
        <div className="absolute top-0 right-0 p-6 md:p-12 pointer-events-none hidden lg:block">
          <div className="bg-white border-l-4 border-red-600 shadow-xl rounded-r-lg p-4 w-64 animate-pulse">
            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Live Metric</div>
            <div className="text-sm font-bold font-display text-gray-900 leading-tight">PERFORMANCE INDEX 92.4</div>
            <div className="text-xs text-gray-500 mt-1">MAXIMIZE EVERY DRIVE</div>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl">
            <div className="text-red-600 font-bold tracking-[0.2em] text-sm md:text-base uppercase mb-4">Unleash. Optimize. Dominate.</div>
            <h1 className="font-display font-bold text-6xl md:text-7xl lg:text-8xl tracking-tight text-gray-900 leading-[0.9] mb-6">
              ENGINEERED TO <span className="text-red-600">PERFORM</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mb-10 leading-relaxed">
              NeuronDrive connects to your car in real time — live OBD telemetry, AI fault diagnostics, and predictive maintenance. Built for drivers who demand more.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/dashboard">
                <button data-testid="btn-hero-explore" className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-display font-bold text-lg uppercase tracking-wide py-4 px-8 rounded flex items-center justify-center gap-2 transition-all">
                  Explore Performance
                  <ArrowRight className="h-5 w-5" />
                </button>
              </Link>
              <Link href="/diagnostics">
                <button data-testid="btn-hero-diagnostics" className="w-full sm:w-auto bg-transparent border-2 border-gray-900 hover:bg-gray-900 hover:text-white text-gray-900 font-display font-bold text-lg uppercase tracking-wide py-4 px-8 rounded transition-all">
                  AI Diagnostics
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURE STRIP */}
      <section className="bg-gray-900 text-white py-6 border-b-4 border-red-600">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            <div className="flex flex-col items-center text-center">
              <Zap className="h-6 w-6 text-red-500 mb-2" />
              <h3 className="font-display font-bold text-sm tracking-wider uppercase mb-1">More Power</h3>
              <p className="text-[10px] text-gray-400">Unleash hidden performance</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <Brain className="h-6 w-6 text-red-500 mb-2" />
              <h3 className="font-display font-bold text-sm tracking-wider uppercase mb-1">Smart Diagnostics</h3>
              <p className="text-[10px] text-gray-400">AI-powered fault detection</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <Activity className="h-6 w-6 text-red-500 mb-2" />
              <h3 className="font-display font-bold text-sm tracking-wider uppercase mb-1">Real-Time Data</h3>
              <p className="text-[10px] text-gray-400">Live monitoring insights</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <ShieldCheck className="h-6 w-6 text-red-500 mb-2" />
              <h3 className="font-display font-bold text-sm tracking-wider uppercase mb-1">Drive Safe</h3>
              <p className="text-[10px] text-gray-400">Predict issues early</p>
            </div>
            <div className="flex flex-col items-center text-center col-span-2 md:col-span-1">
              <Settings2 className="h-6 w-6 text-red-500 mb-2" />
              <h3 className="font-display font-bold text-sm tracking-wider uppercase mb-1">Custom Solutions</h3>
              <p className="text-[10px] text-gray-400">Tailored tuning for you</p>
            </div>
          </div>
        </div>
      </section>

      {/* THREE FEATURE CARDS */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 border border-gray-200 p-8 rounded hover:shadow-lg transition-shadow group flex flex-col h-full">
              <div className="h-12 w-12 bg-red-100 text-red-600 rounded flex items-center justify-center mb-6">
                <Brain className="h-6 w-6" />
              </div>
              <h3 className="font-display font-bold text-2xl uppercase tracking-tight text-gray-900 mb-4">AI Powered Diagnostics</h3>
              <p className="text-gray-600 mb-8 flex-grow">Our NeuronDrive AI system scans every module, analyzes live data, and gives you accurate solutions in seconds.</p>
              <Link href="/diagnostics">
                <button data-testid="btn-discover-diagnostics" className="text-red-600 font-bold uppercase text-sm tracking-wider flex items-center gap-1 group-hover:gap-2 transition-all">
                  Discover <ArrowRight className="h-4 w-4" />
                </button>
              </Link>
            </div>
            <div className="bg-gray-50 border border-gray-200 p-8 rounded hover:shadow-lg transition-shadow group flex flex-col h-full">
              <div className="h-12 w-12 bg-red-100 text-red-600 rounded flex items-center justify-center mb-6">
                <Activity className="h-6 w-6" />
              </div>
              <h3 className="font-display font-bold text-2xl uppercase tracking-tight text-gray-900 mb-4">Real-World Performance</h3>
              <p className="text-gray-600 mb-8 flex-grow">From 0-100 to dyno runs, track every metric that matters and push your limits with confidence.</p>
              <Link href="/dashboard">
                <button data-testid="btn-discover-dashboard" className="text-red-600 font-bold uppercase text-sm tracking-wider flex items-center gap-1 group-hover:gap-2 transition-all">
                  Discover <ArrowRight className="h-4 w-4" />
                </button>
              </Link>
            </div>
            <div className="bg-gray-50 border border-gray-200 p-8 rounded hover:shadow-lg transition-shadow group flex flex-col h-full">
              <div className="h-12 w-12 bg-red-100 text-red-600 rounded flex items-center justify-center mb-6">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="font-display font-bold text-2xl uppercase tracking-tight text-gray-900 mb-4">Built For Enthusiasts</h3>
              <p className="text-gray-600 mb-8 flex-grow">Whether it's daily driving or track days, we provide the edge you need to stay ahead.</p>
              <Link href="/vehicles">
                <button data-testid="btn-discover-vehicles" className="text-red-600 font-bold uppercase text-sm tracking-wider flex items-center gap-1 group-hover:gap-2 transition-all">
                  Discover <ArrowRight className="h-4 w-4" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CAR BRAND COMPATIBILITY SECTION */}
      <section className="py-20 bg-gray-50 border-y border-gray-200 overflow-hidden">
        <div className="container mx-auto px-4 text-center mb-12">
          <h2 className="font-display font-bold text-3xl md:text-4xl uppercase tracking-tight text-gray-900 mb-3">Trusted by drivers of the world's best brands</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Works with every OBD-II compatible vehicle manufactured after 1996</p>
        </div>
        <div className="relative w-full flex overflow-hidden">
          <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
            {marqueeBrands.map((brand, i) => (
              <div key={i} className="flex-shrink-0 mx-3 bg-white border border-gray-200 border-l-4 border-l-red-600 rounded shadow-sm py-4 px-6 flex items-center gap-3 min-w-[180px]">
                {brand.Icon && <brand.Icon className="h-6 w-6 text-gray-700" />}
                <span className="font-display font-bold text-lg text-gray-900 tracking-wide">{brand.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-center divide-x-0 md:divide-x divide-gray-700">
            <div className="flex flex-col items-center">
              <div className="font-display font-bold text-4xl text-red-500 mb-2">+50-120</div>
              <div className="text-xs font-bold uppercase tracking-widest text-gray-300">HP Potential Gain</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="font-display font-bold text-4xl text-red-500 mb-2">15+</div>
              <div className="text-xs font-bold uppercase tracking-widest text-gray-300">Live Parameters</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="font-display font-bold text-4xl text-red-500 mb-2">1000+</div>
              <div className="text-xs font-bold uppercase tracking-widest text-gray-300">Vehicles Tuned</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="font-display font-bold text-4xl text-red-500 mb-2">5K+</div>
              <div className="text-xs font-bold uppercase tracking-widest text-gray-300">Happy Customers</div>
            </div>
            <div className="flex flex-col items-center col-span-2 md:col-span-1">
              <div className="font-display font-bold text-4xl text-red-500 mb-2">98%</div>
              <div className="text-xs font-bold uppercase tracking-widest text-gray-300">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display font-bold text-4xl uppercase tracking-tight text-gray-900 mb-4">How It Works</h2>
            <div className="h-1 w-16 bg-red-600 mx-auto"></div>
          </div>
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-gray-200"></div>
            
            <div className="flex flex-col items-center text-center relative z-10">
              <div className="w-24 h-24 bg-white border-4 border-gray-100 rounded-full flex items-center justify-center font-display font-bold text-3xl text-gray-900 mb-6 shadow-sm">1</div>
              <h3 className="font-display font-bold text-xl uppercase tracking-tight mb-3">Plug In</h3>
              <p className="text-gray-600">Connect your VLinker BM+ OBD adapter to your car's OBD-II port under the dash.</p>
            </div>
            <div className="flex flex-col items-center text-center relative z-10">
              <div className="w-24 h-24 bg-white border-4 border-gray-100 rounded-full flex items-center justify-center font-display font-bold text-3xl text-gray-900 mb-6 shadow-sm">2</div>
              <h3 className="font-display font-bold text-xl uppercase tracking-tight mb-3">Connect</h3>
              <p className="text-gray-600">Open NeuronDrive on any device and tap Connect via Bluetooth or WiFi.</p>
            </div>
            <div className="flex flex-col items-center text-center relative z-10">
              <div className="w-24 h-24 bg-white border-4 border-red-100 rounded-full flex items-center justify-center font-display font-bold text-3xl text-red-600 mb-6 shadow-sm">3</div>
              <h3 className="font-display font-bold text-xl uppercase tracking-tight mb-3">Dominate</h3>
              <p className="text-gray-600">Access live data, AI diagnostics, and predictive insights instantly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* BOTTOM CTA SECTION */}
      <section className="bg-gray-900 py-24 text-center">
        <div className="container mx-auto px-4">
          <h2 className="font-display font-bold text-4xl md:text-5xl uppercase tracking-tight text-white mb-8">Ready to transform your drive?</h2>
          <Link href="/dashboard">
            <button data-testid="btn-bottom-cta" className="bg-red-600 hover:bg-red-700 text-white font-display font-bold text-xl uppercase tracking-wide py-5 px-10 rounded shadow-lg shadow-red-600/20 transition-all">
              Get Started Free
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
