import React from 'react';
import ApplicationStatusTracker from './status-tracking';

export default function page() {
  return (
    <section className="min-h-screen w-full bg-white relative">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
        radial-gradient(125% 125% at 50% 90%, #ffffff 40%, #e7000b

 100%)
      `,
          backgroundSize: '100% 100%',
        }}
      />
      <div className="max-w-6xl relative h-screen flex items-center justify-center mx-auto">
        <ApplicationStatusTracker />
      </div>
    </section>
  );
}
