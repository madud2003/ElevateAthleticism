import Image from "next/image";

export default function OurStory() {
  return (
    <main>
      {/* Back Button */}
      <div className="bg-white px-6 py-4 border-b border-gray-200">
        <div className="max-w-6xl mx-auto">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-gray-700 hover:text-black transition font-semibold"
          >
            ← Back
          </a>
        </div>
      </div>

      {/* Hero Section - modern light */}
      <section className="py-20 px-6 bg-background reveal-on-scroll">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4">Our Story</h1>
            <p className="text-lg text-text-secondary max-w-lg mb-6">We combine evidence-based coaching with individualised programming to help athletes push boundaries and perform at their best.</p>
            <div className="flex gap-4">
              <a href="/register"><button className="btn-primary">Get Started</button></a>
              <a href="/contact"><button className="btn-secondary">Contact Us</button></a>
            </div>
          </div>
          <div>
            <div className="card p-8 flex items-center justify-center">
              <div className="hero-media" style={{ backgroundImage: `url('/hero-fitness.svg')`, width: '100%', height: 300, borderRadius: 12 }} aria-hidden="true" />
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">Who We Are</h2>
              <p className="text-gray-600 text-lg mb-4">
                Founded by a professional strength and conditioning coach with over 15 years of experience, our mission is to help athletes of all levels reach peak performance through science-based training methods.
              </p>
              <p className="text-gray-600 text-lg mb-4">
                We believe in personalized, data-driven approaches that adapt to each individual's unique needs and goals.
              </p>
              <p className="text-gray-600 text-lg">
                Our commitment to excellence has helped hundreds of athletes break through their limits and achieve their dreams.
              </p>
            </div>
            <div className="bg-background-secondary h-96 rounded-lg flex items-center justify-center border border-border-light">
              <Image src="/coach.svg" alt="Founders" width={192} height={192} className="w-48 h-48 object-contain" />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Our Core Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold mb-3">Excellence</h3>
              <p className="text-gray-600">We strive for the highest standards in everything we do</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-2xl font-bold mb-3">Integrity</h3>
              <p className="text-gray-600">Honest, transparent, and ethical in all our dealings</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow">
              <div className="text-4xl mb-4">📈</div>
              <h3 className="text-2xl font-bold mb-3">Growth</h3>
              <p className="text-gray-600">Continuous improvement for ourselves and our clients</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
  
