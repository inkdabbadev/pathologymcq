import type { FaqItem } from "@/lib/api/types";

export interface FaqCategory {
  slug: string;
  title: string;
  items: FaqItem[];
}

export const FAQ_CATEGORIES: FaqCategory[] = [
  {
    slug: "general",
    title: "General Questions",
    items: [
      {
        question: "What is Pathology MCQs?",
        answer:
          "Pathology MCQs is an online educational platform providing multiple-choice questions, study materials, and courses for students and professionals in the field of pathology.",
      },
      {
        question: "Who can benefit from using Pathology MCQs?",
        answer:
          "Medical students, pathology residents, and professionals preparing for various pathology exams, such as the USMLE, FRCPath, NEET-SS, and other board and fellowship exams, can benefit from the resources available on our website.",
      },
      {
        question: "How do I create an account?",
        answer:
          "To create an account, click on the “Get Started” link at the top of the homepage, fill in the required details, and submit the form. You will receive a confirmation email with further instructions.",
      },
      {
        question: "How do I reset my password?",
        answer:
          "If you have forgotten your password, click on the “Forgot Password” link on the login page, enter your registered email address, and follow the instructions sent to your email to reset your password.",
      },
      {
        question: "How do I get notified of new posts?",
        answer: "You can subscribe to our newsletter using your email to be notified of new educational posts.",
      },
    ],
  },
  {
    slug: "courses-and-content",
    title: "Courses and Content",
    items: [
      {
        question: "What types of courses are offered on Pathology MCQs?",
        answer:
          "We offer a variety of courses covering different pathology subspecialties, including preparatory materials for NEET-SS/DM Oncopathology, FRCPath Part 1 and Part 2 Histopathology, INI-SS/DM Hematopathology, neuropathology and much more. Each course includes lectures, study materials, and practice questions.",
      },
      {
        question: "How do I enroll in a course?",
        answer:
          "To enroll in a course, browse our courses, open the one you're interested in, and select Enroll Now on the course page. Complete your registration and payment, and you'll be automatically enrolled in the course.",
      },
      {
        question: "Are the courses self-paced?",
        answer:
          "Yes, our courses are designed to be self-paced, allowing you to study and complete the materials at your own convenience.",
      },
      {
        question: "Can I access course materials offline?",
        answer:
          "Some course materials may be available for download, but generally, you need an internet connection to access the full range of resources and interactive content on our website.",
      },
    ],
  },
  {
    slug: "account-management",
    title: "Account Management",
    items: [
      {
        question: "How do I update my account information?",
        answer:
          "To update your account information, log in to your account and navigate to the “Account Settings” page. From there, you can update your personal details, email address, and password.",
      },
      {
        question: "How can I delete my account?",
        answer:
          "If you wish to delete your account, please contact our customer support team. They will assist you with the deletion process. Please note that deleting your account will remove all your data from our system.",
      },
      {
        question: "Is my personal information secure?",
        answer:
          "Yes, we take your privacy and data security very seriously. Our website uses advanced security measures to protect your personal information. For more details, please refer to our Privacy Policy.",
      },
    ],
  },
  {
    slug: "course-content-and-access",
    title: "Course Content and Access",
    items: [
      {
        question: "How often is new content added to the courses?",
        answer:
          "We regularly update our courses with new content, including the latest research, guidelines, and practice questions. Subscribers will be notified of major updates through email or website announcements.",
      },
      {
        question: "Can I preview a course before purchasing?",
        answer:
          "Yes, we offer a preview of select course materials — sample lectures, quizzes, and other resources — right on the course page, so you can get a feel for the content before purchasing. A free course is also available to all users, with comprehensive content drawn from across our courses to give you a general idea.",
      },
      {
        question: "Do you offer any discounts or promotions?",
        answer:
          "We occasionally offer discounts and promotions on our courses. To stay updated, subscribe to our newsletter or follow us on social media.",
      },
      {
        question: "Can I share my course access with others?",
        answer:
          "No, sharing your course access with others is against our terms of use. Each subscription is intended for individual use only. Sharing login details can result in the suspension or termination of your account.",
      },
      {
        question: "What should I do if a video or quiz isn't loading properly?",
        answer:
          "If you encounter issues with videos or quizzes not loading, try refreshing the page or clearing your browser's cache. If the problem persists, contact our technical support team for further assistance.",
      },
      {
        question: "Is there a mobile app for Pathology MCQs?",
        answer:
          "Currently, we do not have a dedicated mobile app. However, our website is fully responsive and can be accessed from any mobile device's web browser.",
      },
      {
        question: "Can I access the courses on multiple devices?",
        answer:
          "Yes, you can access your courses from multiple devices, including desktops, laptops, tablets, and smartphones. However, simultaneous logins from different devices may be restricted.",
      },
    ],
  },
  {
    slug: "hard-copy-notes-and-shipping",
    title: "Hard Copy Notes & Shipping",
    items: [
      {
        question: "Do you offer hard copy notes along with the course materials?",
        answer:
          "Hard copies are not shipped together with course materials, but we do offer hard copy notes (Histopathology, Hematopathology, Histotechniques) separately, which can be purchased through our website.",
      },
      {
        question: "How can I order the hard copy notes?",
        answer:
          "To order hard copies, select the hard copy notes you require (Histopathology, Hematopathology, Histotechniques) and proceed with the purchase. Follow the instructions to complete your order.",
      },
      {
        question: "What are the shipping options available?",
        answer: "We offer standard shipping. All applicable costs will be displayed during the checkout process.",
      },
      {
        question: "Do you ship internationally?",
        answer:
          "Yes, we ship internationally. Shipping costs and delivery times will vary depending on your location — contact us for international payments and shipping.",
      },
      {
        question: "How long does it take to receive the hard copies?",
        answer:
          "Delivery times depend on your location and the shipping method selected. Standard shipping within the country typically takes 5–7 business days, while international shipping can take 10–21 business days. Contact us if you require faster delivery.",
      },
      {
        question: "How can I track my order?",
        answer:
          "Once your order has been shipped, you will receive a tracking number via email. You can use this tracking number to monitor the status of your shipment on the carrier's website.",
      },
      {
        question: "What should I do if my order hasn't arrived?",
        answer:
          "If your order has not arrived within the estimated delivery time, please contact our customer support team with your order details. We will assist you in tracking the shipment and resolving any issues.",
      },
      {
        question: "Can I change my shipping address after placing an order?",
        answer:
          "If you need to change your shipping address after placing an order, please contact our customer support team as soon as possible. We will do our best to accommodate your request, but changes may not be possible if the order has already been shipped.",
      },
      {
        question: "Are there any additional fees for international shipments?",
        answer:
          "International shipments may be subject to customs duties, taxes, and fees, which are the responsibility of the recipient. Please check with your local customs office for more information on potential charges.",
      },
    ],
  },
  {
    slug: "payments",
    title: "Payments",
    items: [
      {
        question: "What payment methods are accepted?",
        answer: "We accept various payment methods, including UPI, credit/debit cards, PayPal, and other secure payment gateways.",
      },
    ],
  },
  {
    slug: "technical-support",
    title: "Technical Support",
    items: [
      {
        question: "What should I do if I encounter technical issues?",
        answer:
          "If you experience any technical issues, please message us on WhatsApp with detailed information about the problem, and our team will assist you as soon as possible.",
      },
      {
        question: "Is the website mobile-friendly?",
        answer:
          "Yes, our website is designed to be mobile-friendly, allowing you to access our content and courses on various devices, including smartphones and tablets.",
      },
    ],
  },
  {
    slug: "pdf-material",
    title: "PDF Material",
    items: [
      {
        question: "Do you offer PDF material along with your courses?",
        answer: "No, we do not offer PDF materials.",
      },
    ],
  },
  {
    slug: "amazon-kindle-ebooks",
    title: "Amazon Kindle E-Books",
    items: [
      {
        question: "Are your books available on Amazon Kindle?",
        answer:
          "Yes, many of our e-books are available for purchase on Amazon Kindle. You can find them by searching for “Pathology MCQs” on the Amazon website or directly through your Kindle device.",
      },
    ],
  },
  {
    slug: "contact",
    title: "Contact Information",
    items: [
      {
        question: "How can I contact Pathology MCQs?",
        answer:
          "You can message us directly on WhatsApp, or email us at admin@pathologymcq.com.",
      },
      {
        question: "Can I suggest new features or content for the website?",
        answer:
          "Absolutely! We welcome feedback and suggestions from our users. Please send your ideas via WhatsApp or email, and our team will review and consider them for future updates.",
      },
    ],
  },
];
