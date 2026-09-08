// Static content pages (services + legal/support), stored in the admin-editable
// catalog under kind "pages". Body text uses blank lines to separate paragraphs;
// lines beginning with "- " render as bullet list items.

export interface PageSection {
  heading?: string;
  body: string;
}

export interface ContentPageDoc {
  slug: string;
  title: string;
  intro?: string;
  sections: PageSection[];
}

const SERVICE = (
  slug: string,
  title: string,
  paras: string[],
  faqs: [string, string][]
): ContentPageDoc => ({
  slug,
  title,
  intro: paras[0],
  sections: [
    { body: paras.slice(1).join("\n\n") },
    {
      heading: "Frequently asked questions",
      body: faqs.map(([q, a]) => `${q}\n${a}`).join("\n\n"),
    },
  ],
});

export const PAGES: ContentPageDoc[] = [
  SERVICE(
    "services-frcpath-exam-preparation",
    "FRCPath Exam Preparation",
    [
      "Structured FRCPath-oriented pathways with image-rich MCQs, annotated slides, and explanations aligned to postgraduate pathology exam patterns.",
      "Courses and collections cover histopathology, datasets, and related Part 1 / Part 2 study needs for candidates preparing with Pathology MCQ faculty-authored materials.",
      "Browse related products in the shop and pair with mock tests for timed practice.",
    ],
    [
      [
        "What FRCPath resources does Pathology MCQ offer?",
        "Structured FRCPath-oriented pathways with image-rich MCQs, annotated slides, and explanations aligned to postgraduate pathology exam patterns.",
      ],
      [
        "Are FRCPath materials image-rich with explanations?",
        "Structured FRCPath-oriented pathways with image-rich MCQs, annotated slides, and explanations aligned to postgraduate pathology exam patterns.",
      ],
    ]
  ),
  SERVICE(
    "services-neet-ss-and-ini-ss-pathology-prep",
    "NEET-SS and INI-SS Pathology Prep",
    [
      "Superspeciality exam prep for NEET-SS and INI-SS pathology tracks, including oncopathology-focused collections authored and reviewed by practising pathologists.",
      "Content emphasizes exam-authentic questions, annotated slides, and continuously updated classifications relevant to Indian superspeciality pathways.",
    ],
    [
      [
        "Does Pathology MCQ cover NEET-SS oncopathology?",
        "Superspeciality exam prep for NEET-SS and INI-SS pathology tracks, including oncopathology-focused collections authored and reviewed by practising pathologists.",
      ],
      [
        "How do INI-SS resources differ from FRCPath pathways?",
        "Superspeciality exam prep for NEET-SS and INI-SS pathology tracks, including oncopathology-focused collections authored and reviewed by practising pathologists.",
      ],
    ]
  ),
  SERVICE(
    "services-pathology-mcq-practice-banks",
    "Pathology MCQ Practice Banks",
    [
      "Image-rich multiple-choice question banks with annotated slides and detailed explanations for MD/DNB, FRCPath, and superspeciality trainees.",
      "Daily practice and bookmarking flows in the learner app complement the public catalog so trainees can build exam stamina with clinically grounded questions.",
    ],
    [
      [
        "Are Pathology MCQ questions image-based?",
        "Image-rich multiple-choice question banks with annotated slides and detailed explanations for MD/DNB, FRCPath, and superspeciality trainees.",
      ],
      [
        "Who authors and reviews the MCQs?",
        "Image-rich multiple-choice question banks with annotated slides and detailed explanations for MD/DNB, FRCPath, and superspeciality trainees.",
      ],
    ]
  ),
  SERVICE(
    "services-hard-copy-pathology-notes",
    "Hard-Copy Pathology Notes",
    [
      "Chapter-wise and collection hard-copy notes for histotechniques, hematopathology, cytopathology, general pathology, and related subspecialties.",
      "Printed notes ship per the site shipping policy; digital companions and courses remain available in the online shop where listed.",
    ],
    [
      [
        "Do you ship hard-copy pathology notes?",
        "Chapter-wise and collection hard-copy notes for histotechniques, hematopathology, cytopathology, general pathology, and related subspecialties.",
      ],
      [
        "Which subjects are available as printed notes?",
        "Chapter-wise and collection hard-copy notes for histotechniques, hematopathology, cytopathology, general pathology, and related subspecialties.",
      ],
    ]
  ),
  SERVICE(
    "services-full-length-pathology-mock-tests",
    "Full-Length Pathology Mock Tests",
    [
      "Full-length mock papers designed to mirror FRCPath, NEET-SS, and INI-SS timing and pattern pressure, with analytics-oriented review in the learner experience.",
      "Use mocks alongside courses and MCQ banks for end-to-end exam rehearsal before sitting the real exam.",
    ],
    [
      [
        "Are mock tests timed like the real exams?",
        "Full-length mock papers designed to mirror FRCPath, NEET-SS, and INI-SS timing and pattern pressure, with analytics-oriented review in the learner experience.",
      ],
      [
        "Can I review answers after a mock test?",
        "Full-length mock papers designed to mirror FRCPath, NEET-SS, and INI-SS timing and pattern pressure, with analytics-oriented review in the learner experience.",
      ],
    ]
  ),

  {
    slug: "support",
    title: "Support",
    intro:
      "Get help with Pathology MCQ — courses, payments, technical issues, or your account. This page is our App Store support URL hub.",
    sections: [
      {
        body: [
          "FAQ — Answers about accounts, courses, payments, shipping, and Kindle e-books.",
          "Contact us — Email, address, contact form, and WhatsApp for course or account help.",
          "Delete account — Self-service permanent deletion of your learner account and personal data.",
          "Privacy Policy — How we collect, use, and protect information on web and mobile.",
          "Terms & Conditions — Terms governing use of our website and mobile applications.",
        ].join("\n\n"),
      },
      {
        body:
          "You can also connect via WhatsApp for support — courses, enrollment, or account help.\n\nWhatsApp — +91-7825890222",
      },
    ],
  },

  {
    slug: "delete-account",
    title: "Delete your account",
    intro: "Apple App Store Guideline 5.1.1(v) — self-service account deletion",
    sections: [
      {
        body: [
          "If you created a Pathology MCQ account on our website or mobile app, you can delete it yourself from this page (while signed in) or from Profile → Delete account in the app.",
          "After deletion you will lose access to courses, progress, bookmarks, and notes tied to that account. For questions before deleting, see our Support page or Contact us.",
          "Sign in to delete your Pathology MCQ account. After you sign in, return to this page or open Profile → Delete account.",
        ].join("\n\n"),
      },
    ],
  },

  {
    slug: "privacy-policy",
    title: "Privacy Policy",
    intro: "Last updated on July 31st 2026",
    sections: [
      {
        body: [
          'This privacy policy explains how Pathology MCQ ("we", "us", or "our") collects, uses, and protects personal information when you use our website, learning platform, and mobile applications (together, the "Services").',
          "Pathology MCQ is committed to ensuring that your privacy is protected. When we ask you to provide information by which you can be identified, it will only be used in accordance with this privacy statement.",
          "Pathology MCQ may change this policy from time to time by updating this page. You should check this page periodically to stay informed of any changes.",
        ].join("\n\n"),
      },
      {
        heading: "Information we collect",
        body: [
          "- Account details: name, email address, username, and optional profile fields",
          "- Mobile number (including WhatsApp OTP verification for signup and sign-in)",
          "- Learning activity: courses, lessons, MCQ answers, bookmarks, notes, streaks, and XP",
          "- Purchase and order information for courses, eBooks, and hard-copy products",
          "- Device and push notification tokens when you enable notifications in the mobile app",
          "- Technical data such as approximate location derived from IP, browser/device type, and cookies on the website",
          "- Communications you send via contact forms, email, or WhatsApp support",
        ].join("\n"),
      },
      {
        heading: "How we use your information",
        body: [
          "- Create and secure your account, and provide the learning Services",
          "- Process payments, fulfill orders, and deliver digital entitlements",
          "- Send transactional messages (OTP codes, order updates, account security)",
          "- Send optional marketing or digest emails when you opt in (you can unsubscribe)",
          "- Improve products, content, and performance of the website and apps",
          "- Provide customer support and respond to your requests",
          "- Comply with legal, tax, and accounting obligations",
        ].join("\n"),
      },
      {
        heading: "Mobile app data practices",
        body: [
          "Our iOS and Android apps use the same account system as the website. In addition to the categories above, the apps may process:",
          "- Push notification device tokens (Firebase / Expo) to deliver study alerts you enable",
          "- Local session tokens so you stay signed in on your device",
          "- In-app study progress synced to your account on our servers",
          "You can disable notifications in device or in-app settings. Uninstalling the app does not automatically delete your online account — use account deletion below.",
        ].join("\n"),
      },
      {
        heading: "Retention",
        body:
          "We keep account and learning data while your account is active. After you delete your account, we remove personal profile data and learning records associated with your user ID. We may retain limited order or payment records as required by law (for example tax or dispute resolution), with personal identifiers removed or minimized where practicable.",
      },
      {
        heading: "Account deletion and your rights",
        body: [
          "You may delete your learner account at any time through self-service:",
          "- Web or app: open Delete account while signed in, or Profile → Delete account",
          "- Support hub: /support/",
          "You may also request correction of inaccurate information via Contact us or email admin@pathologymcq.com.",
        ].join("\n"),
      },
      {
        heading: "Security",
        body:
          "We are committed to ensuring that your information is secure. We use industry-standard measures such as encrypted transport (HTTPS), access controls, and authenticated APIs to help prevent unauthorised access or disclosure.",
      },
      {
        heading: "How we use cookies",
        body: [
          "A cookie is a small file which asks permission to be placed on your computer's hard drive. Once you agree, the file is added and the cookie helps analyse web traffic or lets you know when you visit a particular site. Cookies allow web applications to respond to you as an individual. The web application can tailor its operations to your needs, likes and dislikes by gathering and remembering information about your preferences.",
          "We use traffic log cookies to identify which pages are being used. This helps us analyse data about webpage traffic and improve our website in order to tailor it to customer needs. We only use this information for statistical analysis purposes and then the data is removed from the system.",
          "You can choose to accept or decline cookies. Most web browsers automatically accept cookies, but you can usually modify your browser setting to decline cookies if you prefer. This may prevent you from taking full advantage of the website.",
        ].join("\n\n"),
      },
      {
        heading: "Sharing and third parties",
        body: [
          "We will not sell, distribute or lease your personal information to third parties unless we have your permission or are required by law to do so. We use trusted processors (for example hosting, authentication, email/SMS delivery, and payment gateways) solely to operate the Services.",
          "If you believe that any information we are holding on you is incorrect or incomplete, please contact us as soon as possible and we will promptly correct information found to be incorrect.",
        ].join("\n\n"),
      },
      {
        heading: "Contact us at",
        body: "WhatsApp — +91-7825890222\n\nEmail — admin@pathologymcq.com",
      },
    ],
  },

  {
    slug: "terms-and-conditions",
    title: "Terms & Conditions",
    intro: "Last updated on July 31st 2026",
    sections: [
      {
        body: [
          'The Website Owner, including subsidiaries and affiliates ("Website" or "Website Owner" or "we" or "us" or "our") provides the information and services on our website, learning platform, and mobile applications (together, the "Services") to visitors and registered users ("you" or "your") subject to these terms and conditions, our Privacy Policy, and any other policies that apply to a specific section or module of the Services.',
          "Welcome to Pathology MCQ. If you continue to browse or use the Services you are agreeing to comply with and be bound by the following terms and conditions of use, which together with our privacy policy govern Pathology MCQ's relationship with you in relation to the Services.",
          "The term 'Pathology MCQ' or 'us' or 'we' refers to the owner of the Services whose registered/operational office is Chennai — 600100. The term 'you' refers to the user or viewer of our website or mobile applications.",
        ].join("\n\n"),
      },
      {
        heading: "Apple App Store licence (iOS)",
        body:
          "For the Pathology MCQ iOS application distributed through the Apple App Store, unless we publish a separate custom End User License Agreement in App Store Connect, your licence to use the iOS app is Apple's Standard End User License Agreement (EULA). These Terms & Conditions continue to apply to your use of our content, accounts, and services accessed through the app.",
      },
      {
        heading: "Use of the Services is subject to the following terms",
        body: [
          "- The content of the Services is for your general information, education, and personal study use. It is subject to change without notice.",
          "- Neither we nor any third parties provide any warranty or guarantee as to the accuracy, timeliness, performance, completeness or suitability of the information and materials found or offered through the Services for any particular purpose. You acknowledge that such information and materials may contain inaccuracies or errors and we expressly exclude liability for any such inaccuracies or errors to the fullest extent permitted by law.",
          "- Your use of any information or materials on the Services is entirely at your own risk, for which we shall not be liable. It shall be your own responsibility to ensure that any products, services or information available through the Services meet your specific requirements. The Services do not replace professional medical advice.",
          "- Account access is personal. You must not share login credentials. We may suspend or terminate accounts that violate these terms.",
          "- You may delete your learner account at any time via Delete account.",
          "- The Services contain material which is owned by or licensed to us. This material includes, but is not limited to, the design, layout, look, appearance, graphics, and educational content. Reproduction is prohibited other than in accordance with the copyright notice, which forms part of these terms and conditions.",
          "- All trademarks reproduced in the Services which are not the property of, or licensed to, the operator are acknowledged on the website or in the apps.",
          "- Unauthorized use of the Services may give rise to a claim for damages and/or be a criminal offense.",
          "- From time to time the Services may also include links to other websites. These links are provided for your convenience to provide further information.",
          "- You may not create a link to this website from another website or document without our prior written consent.",
          "- Your use of the Services and any dispute arising out of such use is subject to the laws of India or other applicable regulatory authority.",
        ].join("\n"),
      },
      {
        heading: "Contact us at",
        body: "WhatsApp — +91-7825890222\n\nEmail — admin@pathologymcq.com",
      },
    ],
  },

  {
    slug: "cancellation-refund-policy",
    title: "Cancellation / Refund Policy",
    intro: "Last updated July 30th 2024",
    sections: [
      {
        heading: "Pre-recorded Self-paced Online Courses and test series",
        body:
          "We follow a strict No Refund policy. To help you make an informed decision, all our online courses allow you to try a part of the course where you can preview the material, also numerous free sample materials are available throughout the website before you enroll for the course.",
      },
      {
        heading: "Study Material / Hard copies",
        body: [
          "If for any reason, you wish to cancel an order that you have placed, it has to be done by contacting our WhatsApp on +91 78258 90222 and follow it up with an email stating your order number BEFORE THE MATERIAL is despatched.",
          "After the study material has been despatched WE WILL NOT BE ABLE TO CANCEL any order.",
          "NO REFUND WILL BE made for materials that have been shipped.",
          "For any further queries you may contact us",
        ].join("\n\n"),
      },
      {
        heading: "Contact us at",
        body: "WhatsApp — +91-7825890222\n\nEmail — admin@pathologymcq.com",
      },
    ],
  },

  {
    slug: "shipping-policy",
    title: "Shipping Policy",
    intro: "Last updated on Jul 30 2024",
    sections: [
      {
        body: [
          "For domestic buyers, orders are shipped through registered domestic courier companies and/or speed post only. Orders are shipped within 7-10 days or as per the delivery date agreed at the time of order confirmation and delivering of the shipment subject to Courier Company / post office norms. Pathology MCQ shall not be liable for any delay in delivery by the courier company / postal authorities.",
          "For international buyers, orders are shipped and delivered through registered international courier companies and/or International speed post only. Orders are shipped within 15-21 days or as per the delivery date agreed at the time of order confirmation and delivering of the shipment subject to Courier Company / post office norms. Pathology MCQ shall not be liable for any delay in delivery by the courier company / postal authorities.",
          "Delivery of all orders will be to the address provided by the buyer. Delivery of our services will be confirmed on your mobile through WhatsApp. For any issues in utilizing our services you may contact our helpdesk.",
          "Pathology MCQ is not liable for any delay in delivery by the courier company / postal authorities and only guarantees to hand over the consignment to the courier company or postal authorities within 15-21 days from the date of the order and payment or as per the delivery date agreed at the time of order confirmation.",
        ].join("\n\n"),
      },
      {
        heading: "Contact us at",
        body: "WhatsApp — +91-7825890222\n\nEmail — admin@pathologymcq.com",
      },
    ],
  },

  {
    slug: "disclaimer",
    title: "Disclaimer",
    sections: [
      {
        body:
          "All posts in our website contain high yield information collected from various educational resources including textbooks, journal articles, educational websites and more. They are intended for educational use only. Email subscription is FREE. Subscription will enable you to access these posts in your inbox whenever they are posted. We make sure to credit any and all sources of information by providing links directly to the source, in a caption, and/or via a list of references. Viewers are encouraged to refer these resources. If you feel that we have not credited a source properly or want a complete list of references, please feel free to reach out to us.",
      },
      {
        heading: "Contact us at",
        body: "Email — admin@pathologymcq.com\n\nWhatsApp — +91-7825890222",
      },
    ],
  },
];
