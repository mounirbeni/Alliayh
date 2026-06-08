import type { Dictionary } from './pt';

/**
 * English (EN) — Secondary locale dictionary
 * Mirrors the Portuguese dictionary structure exactly.
 * Covers: navigation, hero, philosophy, products, cart, footer, legal, cookie consent,
 *         advisor, checkout, contact, login, register, about, search, wishlist, FAQ,
 *         journal, glossary, promo, not-found, validation, accessibility, formatting
 */
export const en: Dictionary = {
  // — Meta & SEO —
  meta: {
    title: 'Lueur Skin by Alliyah | Elegance in Skincare',
    description: 'Premium skincare solutions for your unique glow. Experience the luxury of Lueur Skin by Alliyah.',
    ogTitle: 'Lueur Skin by Alliyah',
    ogDescription: 'Premium botanical skincare for your unique aura.',
    keywords: 'skincare, skin care, sea moss, glow tea, botanical, wellness, Lueur Skin',
  },

  // — Navigation —
  nav: {
    collection: 'Collection',
    advisor: 'Skin Advisor',
    story: 'Our Story',
    journal: 'Journal',
    glossary: 'Botanical Glossary',
    cart: 'Bag',
    account: 'Account',
    search: 'Search',
    menu: 'Menu',
    home: 'Home',
    wishlist: 'Wishlist',
    profile: 'Profile',
    categories: 'Categories',
    languageSwitch: 'PT',
    languageLabel: 'Português',
    closeMenu: 'Close menu',
    openSearch: 'Open search',
    closeSearch: 'Close search',
    toggleTheme: 'Toggle theme',
    goToAccount: 'Go to account',
    goToHome: 'Go to home',
  },

  // — Hero Section —
  hero: {
    badge: 'Lueur Skin by Alliyah',
    headline1: 'Glow',
    headline2: 'Within',
    subtitle: 'Sea Moss · Glow Tea · Botanical Wellness',
    ctaShop: 'Shop the Collection',
    ctaStory: 'Skin Advisor',
    scroll: 'Discover',
    heroImageAlt: 'Lueur Skin radiant aura',
  },

  // — Value Propositions —
  values: {
    crueltyFree: '100% Cruelty-Free',
    labTested: 'Lab Tested',
    freeShipping: 'Free Shipping €50+',
    authentic: '100% Authentic',
  },

  // — Philosophy Section —
  philosophy: {
    badge: 'Our Philosophy',
    headline1: 'Alchemy of',
    headline2: 'Light',
    quote: '"We do not merely treat the skin; we restore the radiant resonance of your natural aura."',
    botanical: 'Botanical Pure',
    botanicalDesc: 'Rare earth actives sourced from zero-impact estates.',
    clinical: 'Clinical Grade',
    clinicalDesc: 'Molecularly optimized for deep cellular permeability.',
    luminous: 'Luminous Tech',
    luminousDesc: 'Proprietary bio-actives that amplify natural reflectance.',
    barrier: 'Barrier Guard',
    barrierDesc: 'Stabilizing the acid mantle with refined lipid complexes.',
    philosophyImageAlt: 'Sea Moss Gummies',
    testimonialQuote: '"A complete transformation in my skincare ritual."',
  },

  // — Best Sellers Section —
  bestSellers: {
    badge: 'Seasonal Edit',
    headline1: 'Best',
    headline2: 'Sellers',
    subtitle: 'Our most-loved wellness rituals.',
    viewAll: 'View All',
  },

  // — Testimonials —
  testimonials: {
    badge: 'Glow Reviews',
    headline1: 'Real',
    headline2: 'Results',
    reviews: [
      {
        name: 'Amira K.',
        location: 'Lisbon',
        text: 'The Sea Moss Gummies completely transformed my skin in 3 weeks. I get compliments everywhere I go now!',
      },
      {
        name: 'Sofia M.',
        location: 'Porto',
        text: 'The Glow Tea is part of my morning ritual now. My complexion is visibly brighter and more even.',
      },
      {
        name: 'Nadia R.',
        location: 'Paris',
        text: 'Finally, a wellness brand that actually delivers on its promises. Lueur Skin has a customer for life.',
      },
    ],
  },

  // — Advisor CTA —
  advisorCta: {
    badge: 'Personalized Advisor',
    headline1: 'Your Skin,',
    headline2: 'Your Ritual',
    description: 'Experience a curated journey. Our AI skin advisor analyzes your profile to match you with the perfect Lueur creations for your unique aura.',
    cta: 'Begin Consultation',
    imageCaption: 'Crafted for Your Aura',
    advisorImageAlt: 'Lueur Skin product detail',
    analyzingLabel: 'Analyzing Complexion Needs',
  },

  // — Product Card —
  product: {
    addToBag: 'Add to Bag',
    quickView: 'Quick View',
    bestSeller: 'Best Seller',
    price: 'Price',
    reviews: 'reviews',
    addedToBag: 'Added to Bag',
    addedDesc: 'has been added.',
    viewProduct: 'View Product',
    texture: 'Texture',
    addToWishlist: 'Add to wishlist',
    removeFromWishlist: 'Remove from wishlist',
  },

  // — Product Detail Page —
  productDetail: {
    premiumSkincare: 'Premium Skincare',
    reviewsCount: 'Reviews',
    discountLabel: '15% Off',
    oneTime: 'One-Time',
    subscribe: 'Subscribe',
    perMonth: '/ month',
    crueltyFree: 'Cruelty-Free',
    ecoConscious: 'Eco-Conscious',
    keyIngredients: 'Key Ingredients',
    howToUse: 'How to Use',
    ritualBenefits: 'The Ritual Benefits',
    productPhilosophy: 'Product Philosophy',
    customerGlow: 'Customer Glow',
    scienceTitle: 'The Science of Illumination',
    scienceDesc: 'At Lueur Aura, we believe that true beauty is revealed through health, not covered by cosmetics. This formula was engineered in our Parisian labs to optimize cellular turnover while providing immediate moisture lock. By mimicking the skin\'s natural lipid structure, we ensure deeper penetration of bio-active ingredients for results you can feel within 48 hours.',
    skinHarmony: 'Skin Harmony',
    skinHarmonyDesc: 'pH balanced at 5.5 to respect the acid mantle, ensuring your skin remains resilient against external stressors.',
    dermatologistTested: 'Dermatologist Tested',
    dermatologistTestedDesc: 'Hypoallergenic and non-comedogenic. Safe for sensitive types and tested across all global skin tones.',
    overallRating: 'Overall Rating',
    basedOn: 'Based on',
    experiences: 'experiences',
    writeReview: 'Write a Review',
    yourRating: 'Your Rating',
    reviewPlaceholder: 'Share your ritual experience...',
    cancel: 'Cancel',
    post: 'Post',
    beFirstReview: 'Be the first to share your glow.',
    verifiedBuyer: 'Verified Buyer',
    reviewPublished: 'Review Published',
    reviewPublishedDesc: 'Thank you for sharing your glow.',
    reviewError: 'Error',
    reviewErrorDesc: 'Failed to submit review.',
    addedToWishlist: 'Added to Wishlist',
    removedFromWishlist: 'Removed from Wishlist',
    savedForLater: 'saved for later.',
    removed: 'removed.',
    productNotFound: 'Product Not Found',
    backToShop: 'Back to Shop',
  },

  // — Cart Drawer —
  cart: {
    title: 'Your Bag',
    empty: 'Your bag is empty',
    emptyDesc: 'Explore our collection and discover your perfect ritual.',
    exploreCta: 'Explore Collection',
    subtotal: 'Subtotal',
    shipping: 'Shipping',
    shippingFree: 'Free',
    shippingCalc: 'Calculated at checkout',
    total: 'Total',
    checkout: 'Checkout',
    continueShopping: 'Continue Shopping',
    remove: 'Remove',
    subscription: 'Subscription',
    itemAdded: 'Item added',
    quantity: 'Quantity',
    decreaseQuantity: 'Decrease quantity',
    increaseQuantity: 'Increase quantity',
  },

  // — Checkout —
  checkout: {
    title: 'Checkout',
    secureCheckout: 'Secure Checkout',
    contact: 'Contact Information',
    email: 'Email address',
    phone: 'Phone',
    shipping: 'Shipping Address',
    shippingDetails: 'Shipping Details',
    firstName: 'First Name',
    lastName: 'Last Name',
    address: 'Address',
    city: 'City',
    postalCode: 'Postal Code',
    country: 'Country',
    payment: 'Payment',
    paymentMethod: 'Payment Method',
    cardNumber: 'Card Number',
    expiry: 'Expiry (MM/YY)',
    cvv: 'CVV',
    cvc: 'CVC',
    placeOrder: 'Place Order',
    orderSummary: 'Order Summary',
    inYourBag: 'In Your Bag',
    processing: 'Processing...',
    payAmount: 'Pay',
    estimatedTax: 'Estimated Tax',
    orderProcessed: 'Order Processed',
    redirecting: 'Redirecting to your confirmation...',
    placeholderFirstName: 'Jane',
    placeholderLastName: 'Doe',
    placeholderEmail: 'jane@example.com',
    placeholderAddress: '123 Ritual Lane',
    placeholderCity: 'London',
    placeholderZipCode: 'SW1A 1AA',
    placeholderCardNumber: '0000 0000 0000 0000',
    placeholderExpiry: '12/25',
    placeholderCvc: '123',
  },

  // — Skin Advisor Quiz —
  advisor: {
    title: 'Skin Advisor',
    subtitle: 'Answer a few questions to discover your perfect ritual.',
    skinType: 'What is your skin type?',
    skinTypeOptions: {
      dry: 'Dry',
      oily: 'Oily',
      combination: 'Combination',
      sensitive: 'Sensitive',
      normal: 'Normal',
    },
    concern: 'What is your primary concern?',
    concernOptions: {
      hydration: 'Hydration',
      aging: 'Anti-Aging',
      brightness: 'Brightness',
      acne: 'Acne',
      sensitivity: 'Sensitivity',
    },
    lifestyle: 'How would you describe your lifestyle?',
    lifestyleOptions: {
      active: 'Active',
      sedentary: 'Sedentary',
      balanced: 'Balanced',
    },
    next: 'Next',
    previous: 'Previous',
    seeResults: 'See Results',
    yourRitual: 'Your Personalized Ritual',
    required: 'This field is required.',
  },

  // — Footer —
  footer: {
    tagline: 'Curating the alchemy of botanical elegance and clinical perfection for your unique aura.',
    collection: 'The Collection',
    cleansing: 'Cleansing Rituals',
    concentrates: 'Concentrates',
    hydration: 'Hydration Layers',
    recovery: 'Overnight Recovery',
    experience: 'Experience',
    consultation: 'Digital Consultation',
    narrative: 'Our Story',
    journal: 'The Journal',
    glossary: 'Glossary',
    concierge: 'Concierge',
    ritualGuide: 'Ritual Guide',
    circleTitle: 'Circle of Light',
    circleDesc: 'Join our circle for seasonal drops and bespoke skincare wisdom.',
    emailPlaceholder: 'Email address',
    subscribe: 'Subscribe',
    subscribed: 'Subscribed to Circle',
    subscribedDesc: "You've successfully joined our inner circle. Check your inbox soon.",
    copyright: '© 2026 Lueur Skin by Alliyah. Crafted for luminaries.',
    regionLabel: 'PT · EU',
    // EU Legal Links
    legal: {
      shipping: 'Shipping & Returns',
      terms: 'Terms & Conditions',
      privacy: 'Privacy Policy',
      cookies: 'Cookie Policy',
      accessibility: 'Accessibility',
      contact: 'Contact',
    },
  },

  // — Cookie Consent (GDPR) —
  cookies: {
    title: 'We respect your privacy',
    description: 'We use cookies to enhance your browsing experience, display personalized content, and analyze our traffic. By clicking "Accept All", you consent to the use of all cookies.',
    acceptAll: 'Accept All',
    rejectAll: 'Reject Non-Essential',
    customize: 'Customize',
    necessary: 'Necessary',
    necessaryDesc: 'Essential for the website to function.',
    analytics: 'Analytics',
    analyticsDesc: 'Help us understand how you use the site.',
    marketing: 'Marketing',
    marketingDesc: 'Used to serve relevant advertisements.',
    savePreferences: 'Save Preferences',
  },

  // — Login —
  login: {
    title: 'Welcome Back',
    subtitle: 'Enter your credentials to access your Lueur Ritual.',
    emailPlaceholder: 'Email Address',
    passwordPlaceholder: 'Password',
    signIn: 'Sign In',
    authenticating: 'Authenticating...',
    noAccount: "Don't have an account?",
    register: 'Register',
    welcomeBack: 'Welcome back',
    signedInAs: 'Successfully signed in as',
    authFailed: 'Authentication Failed',
    authFailedDesc: 'Invalid email or password. Please try again.',
  },

  // — Register —
  register: {
    title: 'Create Account',
    subtitle: 'Join the Lueur Skin universe.',
    namePlaceholder: 'Full Name',
    emailPlaceholder: 'Email Address',
    passwordPlaceholder: 'Password',
    confirmPasswordPlaceholder: 'Confirm Password',
    createAccount: 'Create Account',
    creating: 'Creating...',
    hasAccount: 'Already have an account?',
    signIn: 'Sign In',
    accountCreated: 'Account Created',
    accountCreatedDesc: 'Welcome to the Lueur Skin universe!',
    registrationFailed: 'Registration Failed',
    registrationFailedDesc: 'Could not create account. Please try again.',
  },

  // — About —
  about: {
    metaTitle: 'Our Story | Lueur Skin',
    metaDescription: 'The narrative and botanical alchemy behind Lueur Skin by Alliyah.',
    headline: 'Our',
    headlineAccent: 'Story',
    quote: '"To harmonize the profound depth of nature with the exactness of science."',
    founderBadge: 'The Founder',
    founderTitle: 'Meet Alliyah',
    founderP1: 'Lueur Skin began as a personal quest to heal compromised skin without resorting to harsh, barrier-stripping chemicals. Alliyah traveled globally, studying ancient botanical remedies and modern dermal science.',
    founderP2: 'By isolating the pure actives within sea moss, burdock root, and rare botanicals, she developed formulas that didn\'t just mask imperfections, but fundamentally rebuilt the skin\'s functional health.',
    standardBadge: 'The Standard',
    standardTitle: 'Zero Compromise',
    standardP1: 'Every Lueur Skin product is meticulously crafted in small batches. We source our Sea Moss directly from protected waters and utilize cold-press extraction to ensure the living enzymes remain intact.',
    standardP2: 'Our commitment to purity means zero artificial fragrances, parabens, or synthetic dyes. Just the absolute pinnacle of natural efficacy.',
    founderImageAlt: 'Alliyah formulating skincare',
    ingredientsImageAlt: 'Ingredients macro shot',
  },

  // — Contact —
  contact: {
    metaTitle: 'Contact | Lueur Skin',
    metaDescription: 'Get in touch with the Lueur Skin team for personalized assistance.',
    title: 'Concierge',
    subtitle: 'Bespoke assistance for your Lueur journey.',
    getInTouch: 'Get in touch',
    description: 'Whether you require regimen advice, order tracking, or wish to share your glowing results, our dedicated team is at your service.',
    emailTitle: 'Digital Correspondence',
    emailValue: 'concierge@lueurskin.com',
    hoursTitle: 'Hours of Operation',
    hoursValue: 'Monday - Friday: 9am - 6pm GMT',
    locationTitle: 'Atelier',
    locationValue: 'Avenida da Liberdade, Lisbon, PT',
    formName: 'Full Name',
    formEmail: 'Email Address',
    formSubject: 'Subject',
    formMessage: 'Message',
    selectInquiry: 'Select Inquiry Type',
    orderSupport: 'Order Support',
    regimenAdvice: 'Regimen Advice',
    pressMedia: 'Press & Media',
    other: 'Other',
    sendMessage: 'Dispatch Message',
    sending: 'Transmitting...',
    messageSent: 'Message Sent',
    messageSentDesc: 'Our concierge will respond to your inquiry within 24 hours.',
  },

  // — Products Page —
  productsPage: {
    metaTitle: 'The Collection | Lueur Skin',
    metaDescription: 'Explore our meticulously crafted formulations designed for every skin journey.',
    title: 'The Collection',
    subtitle: 'Explore our meticulously crafted formulations designed for every skin journey.',
    searchPlaceholder: 'Search products...',
    all: 'All',
    filters: 'Filters',
    filterOptions: 'Filter Options',
    priceRange: 'Price Range',
    min: 'Min',
    max: 'Max',
    keyIngredients: 'Key Ingredients',
    resetFilters: 'Reset Filters',
    clearAllFilters: 'Clear All Filters',
    clearCategory: 'Clear Category',
    sortBy: 'Sort By',
    featured: 'Featured',
    priceLowToHigh: 'Price: Low to High',
    priceHighToLow: 'Price: High to Low',
    topRated: 'Top Rated',
    showing: 'Showing',
    results: 'results',
    noProducts: 'No products found',
    noProductsDesc: "We couldn't find any rituals matching your precise specifications. Try adjusting your filters or price range.",
  },

  // — Search —
  search: {
    results: 'Result',
    resultsPlural: 'Results',
    noResults: 'No products found for',
    popularSearches: 'Popular Searches',
    searchTerms: ['Sea Moss', 'Glow Tea', 'Gummies', 'Bundle'],
  },

  // — Wishlist —
  wishlistPage: {
    metaTitle: 'Wishlist | Lueur Skin',
    title: 'Wishlist',
    empty: 'Your wishlist is empty',
    emptyDesc: 'Explore our collection and save your favourite rituals.',
    exploreCta: 'Explore Collection',
  },

  // — Promo Popup —
  promo: {
    title: 'Unlock Your Radiance',
    description: 'Take',
    discount: '15% OFF',
    descriptionSuffix: 'your first order of the Sea Moss Collection.',
    code: 'LUEUR15',
    shopCta: 'Shop',
    closePromo: 'Close promotion',
  },

  // — Not Found —
  notFound: {
    code: '404',
    title: 'Aura Not Found',
    description: 'The ritual or formulation you are seeking has either been removed or does not exist within our current archives.',
    cta: 'Return to Catalog',
  },

  // — Validation (Zod) —
  validation: {
    required: 'Required field.',
    firstNameTooShort: 'First name is too short.',
    lastNameTooShort: 'Last name is too short.',
    invalidEmail: 'Invalid email address.',
    addressTooShort: 'Address is too short.',
    cityRequired: 'City is required.',
    zipCodeInvalid: 'Zip code is invalid.',
    cardNumberInvalid: 'Must be 16 digits.',
    expiryInvalid: 'Format MM/YY.',
    cvcInvalid: 'CVC is invalid.',
    nameTooShort: 'Name is too short.',
    messageTooShort: 'Message is too short.',
    passwordTooShort: 'Password must be at least 6 characters.',
    passwordsDoNotMatch: 'Passwords do not match.',
  },

  // — Accessibility (A11y) —
  a11y: {
    mainNavigation: 'Main navigation',
    skipToContent: 'Skip to content',
    openMobileMenu: 'Open mobile menu',
    closeMobileMenu: 'Close mobile menu',
    openCart: 'Open shopping bag',
    closeCart: 'Close shopping bag',
    openSearch: 'Open search',
    closeSearch: 'Close search',
    switchLanguage: 'Switch to',
    toggleDarkMode: 'Toggle dark mode',
    productImage: 'Product image',
    starRating: 'Star rating',
    scrollDown: 'Scroll down',
  },

  // — Account —
  account: {
    title: 'Your Account',
    welcomeBack: 'Welcome back',
    signOut: 'Sign Out',
    shippingAddress: 'Shipping Address',
    defaultAddress: 'Default Address',
    saveAddress: 'Save Address',
    addressUpdated: 'Address Updated',
    addressUpdatedDesc: 'Your default shipping address has been successfully saved.',
    orderHistory: 'Order History',
    noRecentDeliveries: 'No recent deliveries.',
    exploreProducts: 'Explore Products',
    yourWishlist: 'Your Wishlist',
    noSavedRituals: "You haven't saved any rituals yet.",
    discoverProducts: 'Discover Products',
  },

  // — Common —
  common: {
    from: 'From',
    learnMore: 'Learn More',
    backToHome: 'Back to Home',
    notFound: 'Page Not Found',
    notFoundDesc: 'The page you are looking for does not exist or has been moved.',
    currency: '€',
    close: 'Close',
    loading: 'Loading...',
    any: 'Any',
  },

  // — FAQ —
  faq: {
    title: 'Ritual Guide',
    subtitle: 'Common inquiries regarding our alchemy and shipments.',
    items: [
      {
        question: "Do you ship internationally?",
        answer: "Yes, Lueur Skin ships globally. International shipping times vary between 7-14 business days, depending on customs processing in your specific country."
      },
      {
        question: "Are your products cruelty-free?",
        answer: "Absolutely. We are leaping-bunny certified and strictly refuse to test on animals at any stage of our formulation or production process."
      },
      {
        question: "How long does a bottle typically last?",
        answer: "When following the recommended ritual dosaging (1-2 pumps for serums/cleansers, a dime-size for creams), a single full-size product is designed to last 60 to 90 days."
      },
      {
        question: "Is Sea Moss safe for sensitive skin?",
        answer: "Yes. Our wildcrafted Sea Moss formulas are intensely hydrating and naturally anti-inflammatory, making them exceptional for soothing sensitive or compromised skin barriers."
      },
      {
        question: "Can I use the Celestrial Mask every night?",
        answer: "We recommend using the overnight mask 2-3 times per week to allow your skin to naturally respire on the off-nights, maintaining optimal cellular turnover."
      }
    ]
  },

  // — Journal —
  journal: {
    title: 'The Journal',
    subtitle: 'A curated space for botanical wisdom, mindful beauty rituals, and the science of true radiance.',
  },

  // — Glossary —
  glossary: {
    badge: 'Radical Transparency',
    title: 'The Botanical',
    titleAccent: 'Glossary',
    subtitle: 'We believe you deserve to know exactly what touches your skin. Explore the rare, consciously-sourced elements that power our restorative formulas.',
    sourcedFrom: 'Sourced from',
    benefitsTitle: 'Core Ritual Benefits',
    items: [
      {
        name: 'Wildcrafted Sea Moss',
        origin: 'North Atlantic Ocean',
        benefits: ['Intense hydration', 'Restores lipid barrier', 'Provides 90+ essential minerals'],
        description: 'Sustainably harvested from the rocky shores of the North Atlantic. Our sea moss is sun-dried to preserve its high carrageenan content, which forms a breathable, protective seal over the skin, locking in moisture and active ingredients.'
      },
      {
        name: 'Moringa Leaf Extract',
        origin: 'Himalayan Foothills',
        benefits: ['Potent antioxidant', 'Reduces inflammation', 'Rich in Vitamin C'],
        description: 'Known as the "Miracle Tree," Moringa is exceptionally rich in antioxidants. We extract the active compounds at low temperatures to maintain their potency. It acts as a powerful shield against free radicals and urban pollution.'
      },
      {
        name: 'Rose Quartz Powder',
        origin: 'Madagascar',
        benefits: ['Enhances circulation', 'Illuminating glow', 'Calms redness'],
        description: 'Ethically sourced rose quartz is finely milled into a micro-powder. When applied to the skin, it gently buffs away dull cells and physically reflects light, granting the skin a soft, ethereal luminescence.'
      },
      {
        name: 'Nigella Sativa Oil',
        origin: 'Mediterranean',
        benefits: ['Antibacterial', 'Soothes acne', 'Fades hyperpigmentation'],
        description: 'Cold-pressed from organic black seeds. This ancient oil is rich in thymoquinone, a powerful anti-inflammatory compound that helps to rapidly calm stressed skin and regulate sebum production.'
      }
    ]
  },
};
