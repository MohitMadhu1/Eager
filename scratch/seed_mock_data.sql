-- SQL Script to seed the bookmarks table with high-quality mock data
-- Copy and paste this into the Supabase SQL Editor

INSERT INTO public.bookmarks (user_id, url, title, description, folder, og_image_url, is_public, created_at)
VALUES 
  -- Tech Guru's Bookmarks (de7f1742-6e52-47d6-8819-bd04c7958a9f)
  ('de7f1742-6e52-47d6-8819-bd04c7958a9f', 'https://react.dev', 'React - The library for web and native user interfaces', 'The official documentation for React. Learn how to build UI components, manage state, and build scalable frontends.', 'Frontend', 'https://react.dev/images/og-home.png', true, now() - interval '1 hour'),
  
  ('de7f1742-6e52-47d6-8819-bd04c7958a9f', 'https://nextjs.org', 'Next.js by Vercel - The React Framework', 'Production grade React applications that scale. The world’s leading companies use Next.js by Vercel to build dynamic, performant, and personalized web experiences.', 'Frameworks', 'https://nextjs.org/api/docs-og?title=Next.js%20by%20Vercel', true, now() - interval '3 hours'),
  
  ('de7f1742-6e52-47d6-8819-bd04c7958a9f', 'https://tailwindcss.com', 'Tailwind CSS - Rapidly build modern websites without ever leaving your HTML.', 'A utility-first CSS framework packed with classes like flex, pt-4, text-center and rotate-90 that can be composed to build any design, directly in your markup.', 'Design', 'https://tailwindcss.com/_next/static/media/twitter-large-card.8fb0a671.jpg', true, now() - interval '5 hours'),

  ('de7f1742-6e52-47d6-8819-bd04c7958a9f', 'https://supabase.com', 'Supabase | The Open Source Firebase Alternative', 'Build in a weekend. Scale to millions. Supabase is an open source Firebase alternative providing all the backend features you need to build a product.', 'Backend', 'https://supabase.com/images/og/og-image.jpg', true, now() - interval '1 day'),

  -- Design Pro's Bookmarks (a0ebf4d0-4f0c-41ea-b6a9-e4d2f9477d3c)
  ('a0ebf4d0-4f0c-41ea-b6a9-e4d2f9477d3c', 'https://figma.com', 'Figma: The Collaborative Interface Design Tool', 'Figma is the leading collaborative design tool for building meaningful products. Seamlessly design, prototype, develop, and collect feedback in a single place.', 'Tools', 'https://cdn.sanity.io/images/599r6htc/localized/5cc2599268d067ed7551069502edb7bc71b3e4be-2400x1260.png?w=1200&q=70&fit=max&auto=format', true, now() - interval '2 days'),

  ('a0ebf4d0-4f0c-41ea-b6a9-e4d2f9477d3c', 'https://dribbble.com', 'Dribbble - Discover the World’s Top Designers & Creative Professionals', 'Find Top Designers & Creative Professionals on Dribbble. We are where designers gain inspiration, feedback, community, and jobs.', 'Inspiration', 'https://cdn.dribbble.com/assets/dribbble-ball-mark-2bd45f09c2fb58dbbfb44766d5d1d07c5a12972d602ef8b32204d28fa3dda554.png', true, now() - interval '2 days 4 hours'),

  ('a0ebf4d0-4f0c-41ea-b6a9-e4d2f9477d3c', 'https://awwwards.com', 'Awwwards - Website Awards - Best Web Design Trends', 'Awwwards are the Website Awards that recognize and promote the talent and effort of the best developers, designers and web agencies in the world.', 'Inspiration', 'https://assets.awwwards.com/assets/images/logo-og.png', true, now() - interval '3 days'),

  ('a0ebf4d0-4f0c-41ea-b6a9-e4d2f9477d3c', 'https://spline.design', 'Spline - 3D Design tool in the browser with real-time collaboration', 'Spline is a free 3D design tool with real-time collaboration to create web interactive experiences in the browser. Easy to learn, yet powerful.', '3D Design', 'https://spline.design/images/og.png', true, now() - interval '3 days 12 hours'),

  -- Crypto Fan's Bookmarks (31b3ccaa-3e64-4712-8dca-83b6b0b80474)
  ('31b3ccaa-3e64-4712-8dca-83b6b0b80474', 'https://ethereum.org', 'Ethereum - The decentralized open source platform', 'Ethereum is a decentralized, open-source blockchain with smart contract functionality. Ether is the native cryptocurrency of the platform.', 'Blockchain', 'https://ethereum.org/images/hero.png', true, now() - interval '4 days'),

  ('31b3ccaa-3e64-4712-8dca-83b6b0b80474', 'https://solana.com', 'Solana: Powerful for developers. Fast for everyone.', 'Solana is a decentralized blockchain built to enable scalable, user-friendly apps for the world.', 'Web3', 'https://solana.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fhero-bg.d481079d.jpg&w=3840&q=75', true, now() - interval '5 days'),

  ('31b3ccaa-3e64-4712-8dca-83b6b0b80474', 'https://stripe.com', 'Stripe | Financial Infrastructure for the Internet', 'Stripe is a suite of APIs powering online payment processing and commerce solutions for internet businesses of all sizes.', 'Fintech', 'https://images.ctfassets.net/fzn2n1nzq965/3l8T4XU54h8Wd8b13JgW0o/5a1b8bb13894cd75128ff0e3db46cb20/stripe-og.png', true, now() - interval '6 days'),

  ('31b3ccaa-3e64-4712-8dca-83b6b0b80474', 'https://vercel.com', 'Vercel: Develop. Preview. Ship.', 'Vercel is the platform for frontend developers, providing the speed and reliability innovators need to create at the moment of inspiration.', 'Infrastructure', 'https://assets.vercel.com/image/upload/q_auto/front/vercel/og-image-v2.png', true, now() - interval '1 week')
  
ON CONFLICT DO NOTHING;
