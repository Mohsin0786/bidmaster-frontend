import {
  FileText,
  TrendingDown,
  Bell,
  LayoutDashboard,
  Award,
  Paperclip,
  type LucideIcon,
} from "lucide-react";

// ─── TypeScript Interfaces ────────────────────────────────────────────────────

export interface Stat {
  value: number;
  suffix: string;
  label: string;
}

export interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface WorkflowStep {
  step: number;
  title: string;
  description: string;
}

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
  organization: string;
  initials: string;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface FooterGroup {
  title: string;
  links: { label: string; href: string }[];
}

// ─── Static Data Constants ────────────────────────────────────────────────────

export const NAV_LINKS: NavLink[] = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Testimonials", href: "#testimonials" },
];

export const STATS: Stat[] = [
  { value: 2400, suffix: "+", label: "Active Buyers" },
  { value: 18000, suffix: "+", label: "Bids Placed" },
  { value: 32, suffix: "%", label: "Average Savings" },
];

export const FEATURES: Feature[] = [
  {
    icon: FileText,
    title: "Requirement Posting",
    description:
      "Buyers can publish detailed procurement requirements with specifications, ceiling prices, and deadlines in minutes.",
  },
  {
    icon: TrendingDown,
    title: "Competitive Bidding",
    description:
      "Vendors compete by bidding downward, driving prices below your ceiling and maximising your savings.",
  },
  {
    icon: Bell,
    title: "Real-Time Updates",
    description:
      "Instant notifications keep both buyers and vendors informed as bids are placed, revised, or awarded.",
  },
  {
    icon: LayoutDashboard,
    title: "Bid Management",
    description:
      "Vendors track all active bids from a single dashboard, with clear status indicators and deadline countdowns.",
  },
  {
    icon: Award,
    title: "Award Workflow",
    description:
      "Buyers review ranked bids and award contracts with one click, triggering automatic notifications to all parties.",
  },
  {
    icon: Paperclip,
    title: "Secure Attachments",
    description:
      "Attach technical documents, drawings, or compliance certificates to requirements and bids with end-to-end encryption.",
  },
];

export const BUYER_STEPS: WorkflowStep[] = [
  {
    step: 1,
    title: "Post a Requirement",
    description:
      "Describe what you need — include specifications, quantities, and any compliance requirements — and publish it to the platform.",
  },
  {
    step: 2,
    title: "Set Ceiling Price & Timeline",
    description:
      "Define the maximum price you are willing to pay and the deadline by which bids must be submitted.",
  },
  {
    step: 3,
    title: "Invite Vendors",
    description:
      "Select vendors from your approved list or open the requirement to the broader BidMaster marketplace.",
  },
  {
    step: 4,
    title: "Review Bids",
    description:
      "Compare all submitted bids side-by-side, sorted by price, and review attached supporting documents.",
  },
  {
    step: 5,
    title: "Award the Contract",
    description:
      "Select the winning bid and award the contract. The vendor is notified instantly and the procurement record is saved.",
  },
];

export const VENDOR_STEPS: WorkflowStep[] = [
  {
    step: 1,
    title: "Receive Invitation",
    description:
      "Get notified by email and in-app alert when a buyer invites you to bid on a new procurement requirement.",
  },
  {
    step: 2,
    title: "Review Requirement Details",
    description:
      "Read the full specification, ceiling price, timeline, and any attached documents before deciding to participate.",
  },
  {
    step: 3,
    title: "Submit a Competitive Bid",
    description:
      "Enter your best price — below the ceiling — attach supporting documents, and submit your bid before the deadline.",
  },
  {
    step: 4,
    title: "Track Bid Status",
    description:
      "Monitor your bid's ranking in real time from your dashboard and revise your offer if the competition allows.",
  },
  {
    step: 5,
    title: "Receive Award Notification",
    description:
      "If your bid wins, you receive an instant award notification with next-step instructions to fulfil the contract.",
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "BidMaster cut our average procurement cycle from three weeks to four days. The competitive bidding model consistently delivers prices 25–30% below our previous negotiated rates.",
    author: "Sarah Mitchell",
    role: "Head of Procurement",
    organization: "Nexus Manufacturing",
    initials: "SM",
  },
  {
    quote:
      "As a vendor, the platform is transparent and fair. I can see exactly where my bid stands and adjust my offer in real time. We have won contracts we would never have heard about otherwise.",
    author: "David Okafor",
    role: "Sales Director",
    organization: "Okafor Supplies Ltd",
    initials: "DO",
  },
  {
    quote:
      "The secure attachment feature was a game-changer for our compliance-heavy requirements. Everything is in one place and fully auditable.",
    author: "Priya Sharma",
    role: "Operations Manager",
    organization: "Vertex Logistics",
    initials: "PS",
  },
];

export const FOOTER_GROUPS: FooterGroup[] = [
  {
    title: "Product",
    links: [
      { label: "Log In", href: "/login" },
      { label: "Register", href: "/register" },
      { label: "Features", href: "#features" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Blog", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
    ],
  },
];
