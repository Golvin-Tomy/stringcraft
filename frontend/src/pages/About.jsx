import React from "react";

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      
      <section className="bg-black text-white py-24">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-7xl font-bold italic mb-6 tracking-tight">
            StringCraft
          </h1>
          <p className="text-xl md:text-2xl max-w-4xl mx-auto opacity-90 leading-relaxed">
            Handcrafted guitars for players who don’t just play — they <span className="text-yellow-400 font-bold">feel</span>.
          </p>
        </div>
      </section>

      
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-5xl">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">Our Story</h2>
          <div className="text-lg md:text-xl text-gray-700 leading-relaxed space-y-6 text-center">
            <p>
              Born in 2025 from late-night jams and endless tone-chasing, 
              <span className="font-bold text-black"> StringCraft </span>
              was created by musicians, for musicians.
            </p>
            <p>
              We got tired of overpriced guitars that looked good in photos but felt dead in our hands.  
              So we decided to build something different — instruments that actually <em>inspire</em> you to play.
            </p>
            <p className="text-xl font-medium text-black mt-8">
              Every StringCraft guitar is setup by hand, tested by real players, and shipped ready to rock — no “setup required” excuses.
            </p>
          </div>
        </div>
      </section>

      
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">Why Players Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto">
            <div className="bg-white p-8 rounded-xl shadow-lg text-center transform hover:scale-105 transition">
              <div className="text-5xl mb-4">100%</div>
              <h3 className="text-2xl font-bold mb-3">Real Tone Woods</h3>
              <p className="text-gray-600">No plywood. No shortcuts. Only solid tops and real mahogany.</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg text-center transform hover:scale-105 transition">
              <div className="text-5xl mb-4">Free</div>
              <h3 className="text-2xl font-bold mb-3">Shipping India-Wide</h3>
              <p className="text-gray-600">Delivered safely to your doorstep — anywhere in India.</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg text-center transform hover:scale-105 transition">
              <div className="text-5xl mb-4">7</div>
              <h3 className="text-2xl font-bold mb-3">Day Play Test</h3>
              <p className="text-gray-600">Try it at home. If it’s not your sound, return it. No questions.</p>
            </div>
          </div>
        </div>
      </section>

     
      <section className="bg-black text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            Your Next Guitar Is Waiting
          </h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto opacity-90">
            Stop scrolling. Start playing.
          </p>
          <a
            href="/products"
            className="inline-block bg-white text-black px-10 py-5 rounded-full text-xl font-bold hover:bg-gray-200 transition transform hover:scale-105"
          >
            Shop Guitars Now
          </a>
        </div>
      </section>
    </div>
  );
};

export default About;