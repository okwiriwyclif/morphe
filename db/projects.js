const projects = [
  {
    name: "Rika",
    imageUrl: "/images/projects/rika.png",
    techStack: [
      "Nuxt.js",
      "Tailwindcss",
      "Strapi",
      "Pinia",
      "Cloudflare Workers",
    ],
    services: [
      "UI/UX design",
      "web platform development",
      "AI health assistant (Kira)",
      "youth-friendly facility finder",
      "headless CMS integration",
    ],
    role: "Software Developer / UI/UX Designer",
    link: "rika.go.ke",
    description:
      "Rika is an AI-powered platform that revolutionizes how young people in Kenya access government-approved sexual and reproductive health resources, safely and anonymously.",
    duration: "Ongoing",
    achievements: [
      "Launched Kira, an anonymous AI health guide answering questions on puberty, mental health, relationships, contraception, pregnancy and GBV.",
      "Built age-based learning journeys for 10–14, 15–17 and 18–24 year olds with articles, books and videos managed through Strapi.",
      "Delivered a youth-friendly facility finder for private, respectful care across Kenya, served from Cloudflare's edge.",
    ],
  },
  {
    name: "Africa Climate Summit 2023",
    imageUrl: "/images/projects/africa-climate-summit.png",
    techStack: [
      "Nuxt.js",
      "React Native",
      "AWS",
      "Cloudflare",
      "Python (Django)",
      "PostgreSQL",
    ],
    services: [
      "Web and mobile application development",
      "real-time event management",
      "live streaming",
      "secure registration system",
    ],
    role: "Software Engineer / Front-end Engineer",
    link: "africaclimatesummit.org",
    description:
      "Designed and developed a high-traffic, multi-platform digital ecosystem for the inaugural Africa Climate Summit, enabling seamless event participation and global outreach.",
    duration: "6 months",
    achievements: [
      "Handled over 30 million visits with zero downtime during the summit.",
      "Enabled real-time updates, live streaming, and content delivery to thousands of delegates worldwide.",
      "Implemented a secure, scalable registration system serving 15,000+ participants.",
    ],
  },
  {
    name: "Kenya Accreditation Service (KENAS) Website Redesign",
    imageUrl: "/images/projects/kenas.png",
    techStack: [
      "Nuxt.js",
      "Cloudflare",
      "Python (Django)",
      "PostgreSQL",
      "AWS",
    ],
    services: [
      "Website redesign",
      "secure portal development",
      "accreditation standards search functionality",
      "HR recruitment system",
    ],
    role: "Software Developer",
    link: "kenas.go.ke",
    description:
      "Led a complete redesign and modernization of the national accreditation agency’s digital platform, integrating a secure portal and advanced HR functionalities.",
    duration: "4 months",
    achievements: [
      "Reduced website bounce rate from 70% to 40% by enhancing UI/UX.",
      "Delivered a secure, searchable accreditation standards portal used nationwide.",
      "Digitized HR processes, processing over 7,000 applications seamlessly.",
    ],
  },
  {
    name: "Takataka ni Mali Platform",
    imageUrl: "/images/projects/taka-ni-mali.png",
    techStack: ["Vue.js", "Node.js (Express)", "MongoDB", "AWS", "Cloudflare"],
    services: [
      "Digital marketplace development",
      "payment gateway integration",
      "logistics management system",
    ],
    role: "Web Developer / Designer",
    link: "takanimali.org",
    description:
      "Built an innovative digital marketplace to drive Africa’s circular economy by connecting waste collectors, buyers, and logistics providers.",
    duration: "5 months",
    achievements: [
      "Enabled over USD 1 million in sustainable material transactions within the first year.",
      "Optimized logistics and operations for waste collection and redistribution.",
      "Boosted recycling and processing capacity by 35%.",
    ],
  },
  {
    name: "Reproductive Health Network Kenya (RHNK) Website Development",
    imageUrl: "/images/projects/rhnk.png",
    techStack: ["Nuxt.js", "Django", "Stripe API", "PostgreSQL", "AWS"],
    services: [
      "Modern website development",
      "event management system",
      "payment integration",
    ],
    role: "Software Developer",
    link: "rhnk.org",
    description:
      "Developed a modern digital hub for RHNK to streamline health-related events, donations, and awareness campaigns.",
    duration: "4 months",
    achievements: [
      "Boosted online engagement by 50% through improved accessibility and design.",
      "Simplified event registrations and ticketing for national conferences.",
      "Integrated secure payments for donations and event participation.",
    ],
  },
  {
    name: "National Cancer Institute Kenya (NCI-K) Website Development",
    imageUrl: "/images/projects/nci-kenya.png",
    techStack: [
      "Nuxt.js",
      "Django",
      "PostgreSQL",
      "AWS",
      "Cloudflare",
      "Firebase",
      "Pesaflow",
    ],
    services: [
      "Website development featuring cancer awareness resources",
      "research publications",
      "donation management",
      "career opportunities",
    ],
    role: "Software Developer",
    link: "ncikenya.go.ke",
    description:
      "Created a comprehensive platform for the national cancer institute to share research, manage donations, and facilitate career opportunities.",
    duration: "5 months",
    achievements: [
      "Increased nationwide engagement with cancer education initiatives.",
      "Facilitated over 10,000 downloads of critical research publications.",
      "Digitized donation workflows, increasing fundraising efficiency.",
    ],
  },
  {
    name: "Crestwood Marketing and Communications",
    imageUrl: "/images/projects/crestwood.png",
    techStack: ["Nuxt.js", "Vue.js", "JavaScript", "Node.js", "AWS"],
    services: [
      "Website design and development",
      "maintenance",
      "project management",
    ],
    role: "Lead Software Developer",
    link: "crestwood.co.ke",
    description:
      "Oversaw the revamp and modernization of Crestwood’s corporate website, aligning design and performance with global agency standards.",
    duration: "Ongoing",
    achievements: [
      "Enhanced brand perception, earning positive feedback from clients.",
      "Generated new client leads and expanded the company’s digital portfolio.",
    ],
  },
  {
    name: "Zuri Place Hotel",
    imageUrl: "/images/projects/zuriplace.png",
    techStack: ["Nuxt.js", "Cloudflare", "Vue.js", "Firebase"],
    services: [
      "Web design & development",
      "Content management",
      "Booking integration",
    ],
    role: "Software Developer",
    link: "zuriplacehotel.com",
    description:
      "Developed a luxury hotel website designed to improve bookings and showcase Zuri Place’s elegant hospitality experience.",
    duration: "DM for quote",
    achievements: [
      "Enhanced guest engagement with a visually appealing, modern interface.",
      "Improved online bookings with seamless reservation integrations.",
      "Strengthened the brand’s online visibility in the competitive hospitality market.",
    ],
  },
  {
    name: "Africa Waste Is Wealth Summit",
    imageUrl: "/images/projects/waste-is-wealth.png",
    techStack: ["Nuxt.js", "Vue.js", "Firebase", "Cloudflare", "WordPress"],
    services: [
      "Web design & development",
      "event management",
      "registration system",
    ],
    role: "Software Developer",
    link: "wasteiswealth.pages.dev",
    description:
      "Built an event-focused platform highlighting Africa’s sustainability efforts, with easy registration and event updates.",
    duration: "DM for quote",
    achievements: [
      "Improved event reach and attendee registration process.",
      "Showcased summit highlights and outcomes effectively.",
      "Strengthened digital visibility of Africa’s circular economy initiatives.",
    ],
  },
  {
    name: "Circular Solutions Network Africa",
    imageUrl: "/images/projects/circular-solutions-network.png",
    techStack: ["Nuxt.js", "Cloudflare", "Wordpress", "Firebase"],
    services: ["Web design & development", "content management"],
    role: "Software Developer",
    link: "www.csn.africa",
    description:
      "Developed a modern website for a pan-African initiative championing circular economy and sustainable solutions.",
    duration: "DM for quote",
    achievements: [
      "Provided a clear, intuitive platform to showcase circular initiatives.",
      "Boosted brand authority and stakeholder engagement.",
      "Delivered a scalable and content-driven platform.",
    ],
  },
  {
    name: "Wasteswift",
    imageUrl: "/images/projects/waste-swift.png",
    techStack: ["Nuxt.js", "Cloudflare", "Firebase"],
    services: [
      "Web design & development",
      "innovative platform building for sustainability",
    ],
    role: "Software Developer",
    link: "wasteswift.org",
    description:
      "Created a digital platform for an eco-startup focusing on waste collection and recycling innovations.",
    duration: "DM for quote",
    achievements: [
      "Improved engagement among waste collectors and sustainability partners.",
      "Positioned the startup as a leader in innovative waste management.",
      "Enhanced digital visibility and operational efficiency.",
    ],
  },
  {
    name: "Game Whisperers Adventures",
    imageUrl: "/images/projects/game-whisperers.png",
    techStack: ["Nuxt.js", "Cloudflare", "Firebase"],
    services: [
      "Web design & development",
      "Content management",
      "Safari tour booking",
    ],
    role: "Software Developer",
    link: "gamewhisperersadventures.com",
    description:
      "Designed a visually immersive safari and travel booking platform showcasing unique African adventure experiences.",
    duration: "DM for quote",
    achievements: [
      "Delivered a visually stunning and easy-to-navigate booking site.",
      "Showcased safari packages with an engaging and modern interface.",
      "Increased tour booking inquiries through an optimized user journey.",
    ],
  },
  {
    name: "Repertoire Logistics",
    imageUrl: "/images/projects/repertoir.png",
    techStack: ["Nuxt.js", "Cloudflare", "Firebase"],
    services: ["Web design & development", "logistics system integration"],
    role: "Software Developer",
    link: "repertoirlogistics.com",
    description:
      "Developed a modern website for a logistics company to highlight services and streamline operations.",
    duration: "DM for quote",
    achievements: [
      "Improved clarity of logistics services for clients.",
      "Strengthened online credibility and brand presence.",
      "Delivered a reliable digital hub for client engagement.",
    ],
  },
  {
    name: "Greenlife Wellness",
    imageUrl: "/images/projects/greenlife-wellness.png",
    techStack: ["Wordpress", "Cloudflare", "WooCommerce"],
    services: [
      "Web design & development",
      "health & wellness resource management",
    ],
    role: "Software Developer",
    link: "greenlifewellness.co.ke",
    description:
      "Developed a user-friendly platform for a health and wellness organization with e-commerce capabilities.",
    duration: "DM for quote",
    achievements: [
      "Improved online accessibility to health resources and products.",
      "Enhanced trust with a clean and professional digital presence.",
      "Provided a seamless e-commerce experience for wellness services.",
    ],
  },
  {
    name: "Darajaplus",
    imageUrl: "/images/projects/darajaplus.png",
    techStack: ["Nuxt.js", "Tailwindcss", "Cloudflare", "Firebase"],
    services: ["Web design & development", "marketing agency website"],
    role: "Software Developer",
    link: "darajaplus.com",
    description:
      "Built a creative portfolio website for a marketing agency focused on behavior change communication.",
    duration: "DM for quote",
    achievements: [
      "Delivered a modern, engaging showcase for campaigns and case studies.",
      "Improved digital branding and lead generation.",
      "Highlighted the agency’s success stories and creative portfolio effectively.",
    ],
  },
  {
    name: "Alba Premium Foods",
    imageUrl: "/images/projects/alba-foods.png",
    techStack: ["Figma", "Nuxt.js", "Firebase", "cloudflare"],
    services: [
      "Web design & development",
      "e-commerce",
      "product catalog management",
    ],
    role: "Software Developer",
    link: "albafoods.pages.dev",
    description:
      "Developed a premium e-commerce platform for a high-end dairy brand to showcase and sell its products online.",
    duration: "DM for quote",
    achievements: [
      "Created a visually appealing and easy-to-browse product catalog.",
      "Strengthened the brand’s premium identity through modern UX/UI.",
      "Delivered a smooth and efficient e-commerce experience for customers.",
    ],
  },
];

const images = [
  "/images/projects/game-whisperers.png",
  "/images/projects/africa-climate-summit.png",
  "/images/projects/alba-foods.png",
  "/images/projects/circular-solutions-network.png",
  "/images/projects/circular-solutions.png",
  "/images/projects/crestwood.png",
  "/images/projects/darajaplus.png",
  "/images/projects/greenlife-wellness.png",
  "/images/projects/kenas.png",
  "/images/projects/nci-kenya.png",
  "/images/projects/repertoir.png",
  "/images/projects/rhnk.png",
  "/images/projects/taka-ni-mali.png",
  "/images/projects/waste-is-wealth.png",
  "/images/projects/waste-swift-2.png",
  "/images/projects/waste-swift.png",
  "/images/projects/whisperers.png",
  "/images/projects/zuriplace-2.png",
  "/images/projects/zuriplace.png",
];

export default projects;
