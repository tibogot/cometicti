export const AboutPage = () => {
  return (
    <div className="w-full min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="w-full relative h-[50vh] bg-gray-900 flex-shrink-0">
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-0 w-full p-8">
          <div className="">
            <h1 className="text-6xl font-bold text-white font-neue mb-4">
              About Us
            </h1>
            <p className="text-xl text-white/90 font-neue max-w-lg">
              Discover our story and commitment to natural beauty
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="w-full bg-red-600 py-20 flex-grow">
        <div className="px-8">
          <div className="prose prose-lg w-full">
            <p>
              At COSMETIC, we believe in the power of natural ingredients and
              sustainable beauty practices. Our journey began with a simple
              mission: to provide high-quality, organic cosmetics that enhance
              your natural beauty while caring for our planet.
            </p>
            <p className="mt-6">
              Every product in our collection is carefully crafted using
              ethically sourced ingredients, ensuring both effectiveness and
              environmental responsibility.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
