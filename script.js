// ========================================
// Brandliox - ADVANCED ANIMATIONS & INTERACTIONS
// ========================================

// Initialize GSAP and ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// ========================================
// DOCUMENT READY
// ========================================

document.addEventListener('DOMContentLoaded', function () {
    console.log('Brandliox Website Loaded Successfully');
    
    initializeAnimations();
    initializeCounters();
    initializeChatbot();
    initializeToastNotifications();
    initializeFormHandling();
    initializeFancybox();
    initializeStickyButtons();
    initializeScrollAnimations();
});

// ========================================
// ANIMATION INITIALIZATION
// ========================================

function initializeAnimations() {
    // Hero Section Animations
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        gsap.from('.fade-in-up', {
            duration: 1,
            y: 30,
            opacity: 0,
            stagger: 0.15,
            ease: 'power3.out'
        });
    }

    // Floating Cards Animation
    gsap.from('.floating-card', {
        duration: 1.2,
        opacity: 0,
        scale: 0.8,
        stagger: 0.2,
        ease: 'back.out'
    });

    // Scroll Animations for Cards
    const cards = document.querySelectorAll('.value-card, .service-card, .portfolio-card, .testimonial-card');
    cards.forEach((card, index) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 80%',
                end: 'top 60%',
                scrub: 1,
                once: true
            },
            duration: 0.8,
            y: 50,
            opacity: 0,
            ease: 'power3.out'
        });
    });

    // Section Title Animation
    const sectionTitles = document.querySelectorAll('.section-title');
    sectionTitles.forEach((title) => {
        gsap.from(title, {
            scrollTrigger: {
                trigger: title,
                start: 'top 80%',
                once: true
            },
            duration: 0.8,
            y: 30,
            opacity: 0,
            ease: 'power3.out'
        });
    });
}

// ========================================
// COUNTER ANIMATION
// ========================================

function initializeCounters() {
    const counters = document.querySelectorAll('.counter');
    let counterStarted = false;

    // Create Intersection Observer for counters
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !counterStarted) {
                counterStarted = true;
                counters.forEach(counter => {
                    const target = parseInt(counter.getAttribute('data-target'));
                    animateCounter(counter, target);
                });
            }
        });
    }, { threshold: 0.5 });

    if (counters.length > 0) {
        counterObserver.observe(counters[0].closest('.hero-stats'));
    }
}

function animateCounter(element, target) {
    let current = 0;
    const increment = target / 50;
    
    const updateCounter = () => {
        current += increment;
        if (current < target) {
            element.textContent = Math.floor(current);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    };
    
    updateCounter();
}

// ========================================
// CHATBOT FUNCTIONALITY
// ========================================

function initializeChatbot() {
    const chatbotToggle = document.getElementById('chatbotToggle');
    const chatbotWidget = document.getElementById('chatbot');
    const closeChatbot = document.querySelector('.chatbot-close');
    const chatbotSend = document.getElementById('chatbotSend');
    const chatbotInput = document.getElementById('chatbotInput');
    const chatbotMessages = document.getElementById('chatbotMessages');

    // Simple session context
    const context = {
        lastIntent: null,
        collected: {}
    };

    // Toggle Chatbot
    if (chatbotToggle) {
        chatbotToggle.addEventListener('click', function () {
            chatbotWidget.classList.toggle('active');
            if (chatbotWidget.classList.contains('active')) {
                chatbotInput.focus();
                // If empty, show greeting and quick replies
                if (!chatbotMessages.hasChildNodes()) {
                    botSay("Hello! I'm Brandliox Sales & Marketing Assistant. How can I help you today?", [
                        { label: 'Services', payload: 'services' },
                        { label: 'Pricing', payload: 'pricing' },
                        { label: 'Website Development', payload: 'website' },
                        { label: 'SEO', payload: 'seo' },
                        { label: 'Talk to an Expert', payload: 'talk_expert' },
                        { label: 'Schedule a Call', payload: 'schedule_call' }
                    ]);
                }
            }
        });
    }

    // Close Chatbot
    if (closeChatbot) {
        closeChatbot.addEventListener('click', function () {
            chatbotWidget.classList.remove('active');
        });
    }

    // Send Message (button)
    if (chatbotSend) {
        chatbotSend.addEventListener('click', () => {
            const value = chatbotInput.value.trim();
            if (value) {
                userSay(value);
                handleUserMessage(value);
            }
        });
    }

    // Enter key to send
    if (chatbotInput) {
        chatbotInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                const value = chatbotInput.value.trim();
                if (value) {
                    userSay(value);
                    handleUserMessage(value);
                }
            }
        });
    }

    // Public helper to simulate quick reply clicks
    window.handleQuickReply = function(payload) {
        // payload can be object or string
        if (typeof payload === 'string') {
            userSay(payload);
            handleUserMessage(payload);
        } else if (payload && payload.type === 'call') {
            userSay('Call Now');
            botSay('Click the button below to call our expert:', [], null, [{ type: 'call', label: payload.label || 'Call Now', tel: payload.tel }]);
        } else if (payload && payload.type === 'collect_contact') {
            userSay('Share Contact Info');
            showTypingIndicator(() => {
                showContactForm();
            });
        } else if (payload && payload.type === 'schedule') {
            userSay('Schedule a Call');
            showTypingIndicator(() => {
                showScheduleOptions();
            });
        } else if (payload && payload.payload) {
            userSay(payload.label || payload.payload);
            handleUserMessage(payload.payload);
        }
    };

    // Render user message
    function userSay(text) {
        const msg = document.createElement('div');
        msg.className = 'message user-message';
        const p = document.createElement('p');
        p.textContent = text;
        msg.appendChild(p);
        chatbotMessages.appendChild(msg);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        chatbotInput.value = '';
    }

    // Render bot message with optional quick replies and call buttons
    function botSay(text, quickReplies = [], afterCallback = null, callButtons = []) {
        const msg = document.createElement('div');
        msg.className = 'message bot-message';

        const p = document.createElement('p');
        p.textContent = text;
        msg.appendChild(p);

        chatbotMessages.appendChild(msg);
        
        // quick replies (dynamic buttons) - placed BELOW the message
        if (Array.isArray(quickReplies) && quickReplies.length) {
            const container = document.createElement('div');
            container.className = 'quick-replies';
            quickReplies.forEach(q => {
                const btn = document.createElement('button');
                btn.className = 'btn btn-sm quick-reply';
                btn.type = 'button';
                btn.textContent = q.label;
                btn.addEventListener('click', () => {
                    // small delay for UX
                    setTimeout(() => window.handleQuickReply(q), 100);
                });
                container.appendChild(btn);
            });
            chatbotMessages.appendChild(container);
        }

        // call buttons (special)
        if (Array.isArray(callButtons) && callButtons.length) {
            const ccontainer = document.createElement('div');
            ccontainer.className = 'call-buttons';
            callButtons.forEach(cb => {
                const a = document.createElement('a');
                a.className = 'btn btn-call-action';
                a.href = cb.tel ? `tel:${cb.tel}` : '#';
                a.setAttribute('aria-label', 'Call Brandliox');
                
                // Add call icon + text
                const icon = document.createElement('i');
                icon.className = 'fas fa-phone';
                icon.style.marginRight = '0.5rem';
                
                const text = document.createElement('span');
                text.textContent = cb.label || 'Call Now';
                
                a.appendChild(icon);
                a.appendChild(text);
                
                // Ensure click works
                a.addEventListener('click', (e) => {
                    if (!cb.tel) {
                        e.preventDefault();
                    }
                });
                
                ccontainer.appendChild(a);
            });
            chatbotMessages.appendChild(ccontainer);
        }

        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

        if (typeof afterCallback === 'function') {
            // allow small typing simulation
            setTimeout(afterCallback, 400);
        }
    }

    // Show contact collection form inside chat
    function showContactForm() {
        const msg = document.createElement('div');
        msg.className = 'message bot-message';

        const p = document.createElement('p');
        p.textContent = 'Great! Please share your details and we will reach out shortly.';
        msg.appendChild(p);

        const form = document.createElement('form');
        form.className = 'chat-contact-form';

        const name = document.createElement('input');
        name.type = 'text';
        name.placeholder = 'Your name';
        name.name = 'name';
        name.required = true;
        name.className = 'form-control';

        const email = document.createElement('input');
        email.type = 'email';
        email.placeholder = 'Email (optional)';
        email.name = 'email';
        email.className = 'form-control';

        const phone = document.createElement('input');
        phone.type = 'tel';
        phone.placeholder = 'Phone (optional)';
        phone.name = 'phone';
        phone.className = 'form-control';

        const submit = document.createElement('button');
        submit.type = 'submit';
        submit.className = 'btn btn-sm btn-primary';
        submit.textContent = 'Send';

        [name, email, phone, submit].forEach(el => {
            const wrapper = document.createElement('div');
            wrapper.style.marginTop = '6px';
            wrapper.appendChild(el);
            form.appendChild(wrapper);
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = {
                name: name.value.trim(),
                email: email.value.trim(),
                phone: phone.value.trim()
            };
            // store in context
            context.collected = Object.assign({}, context.collected, formData);
            // confirmation
            botSay('Thanks! We received your details. Our expert will contact you shortly.', [
                { label: 'Talk to an Expert', payload: 'talk_expert' },
                { label: 'Schedule a Call', payload: { type: 'schedule' } }
            ]);
            form.remove();
            // Here you can send formData to server via fetch
        });

        msg.appendChild(form);
        chatbotMessages.appendChild(msg);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    // Show schedule options (quick available slots)
    function showScheduleOptions() {
        botSay('Pick a convenient time slot. After you select, our expert will call you.', [
            { label: 'Today — 3:00 PM', payload: 'schedule:today:15:00' },
            { label: 'Tomorrow — 11:00 AM', payload: 'schedule:tomorrow:11:00' },
            { label: 'Pick Date', payload: 'schedule:pick_date' }
        ], () => {
            // Callback after bot finishes typing
        });
    }

    // Main handler for user message content
    function handleUserMessage(rawMessage) {
        const message = rawMessage.trim().toLowerCase();

        // Quick matching for scheduling payloads
        if (message.startsWith('schedule:')) {
            const parts = rawMessage.split(':');
            let scheduleText = '';
            
            if (parts[1] === 'pick_date') {
                scheduleText = 'Custom Date Selection';
                botSay('📅 Please provide your preferred date and time. For example: "December 15, 2024 at 3:00 PM" or use our calendar. Our expert will confirm the booking shortly.', [
                    { label: 'Back to Options', payload: { type: 'schedule' } }
                ], null, [{ label: 'Call Now', tel: '+923369295295' }]);
            } else {
                scheduleText = parts.slice(1).join(' ').replace(/:/g, ':');
                botSay(`✅ Your call is scheduled for ${scheduleText}. Our expert will call you at the scheduled time. Thank you!`, [
                    { label: 'Back to Menu', payload: 'services' },
                    { label: 'Talk to Expert Now', payload: 'talk_expert' }
                ], null, [{ label: 'Call Now', tel: '+923369295295' }]);
            }
            return;
        }

        // Hand off to response generator
        const response = getBotResponseComplex(message, context);
        context.lastIntent = response.intent || context.lastIntent;

        // Show typing indicator (simple)
        showTypingIndicator(() => {
            // When typing done, show response
            if (response.action === 'call') {
                botSay(response.text, response.quickReplies || [], null, [{ label: 'Call Our Expert', tel: response.tel || '+923369295295' }]);
            } else if (response.action === 'collect_contact') {
                botSay(response.text, response.quickReplies || []);
                showContactForm();
            } else if (response.action === 'schedule') {
                botSay(response.text, response.quickReplies || []);
                showScheduleOptions();
            } else {
                botSay(response.text, response.quickReplies || []);
            }
        });
    }

    // Simple typing indicator implementation
    function showTypingIndicator(callback) {
        const typing = document.createElement('div');
        typing.className = 'message bot-message typing';
        typing.innerHTML = '<p><span class="dot"></span><span class="dot"></span><span class="dot"></span></p>';
        chatbotMessages.appendChild(typing);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        setTimeout(() => {
            typing.remove();
            if (typeof callback === 'function') callback();
        }, 700 + Math.random() * 700);
    }

    // Enhanced response generator acting like a sales & marketing expert
    function getBotResponseComplex(userMessage, ctx) {
        // Patterns and synonyms
        const words = userMessage.split(/\s+/);

        // Exact matches or contains
        if (containsAny(userMessage, ['service', 'services', 'what do you offer'])) {
            return {
                intent: 'services',
                text: "We provide Website Development, SEO, Social Media & Paid Ads, Content Marketing, Chatbot Integration, and Mobile Apps. Which one interests you most?",
                quickReplies: [
                    { label: 'Website Development', payload: 'website' },
                    { label: 'SEO & Rankings', payload: 'seo' },
                    { label: 'Social Media Ads', payload: 'social_media' },
                    { label: 'Chatbot Integration', payload: 'chatbot_integration' }
                ]
            };
        }

        if (containsAny(userMessage, ['price', 'pricing', 'cost', 'how much'])) {
            return {
                intent: 'pricing',
                text: "We have flexible plans: Basic, Business, Business plus, Business pro. For accurate pricing I can either show package details or connect you to an expert for a customized quote.",
                quickReplies: [
                    { label: 'Show Packages', payload: 'show_packages' },
                    { label: 'Get Custom Quote', payload: 'talk_expert' }
                ]
            };
        }

        if (containsAny(userMessage, ['website', 'website development', 'build website', 'web'])) {
            return {
                intent: 'website',
                text: "Our Website service includes responsive UI, fast performance, SEO-friendly structure, analytics, and maintenance. Would you like a portfolio, package details or to schedule a call?",
                quickReplies: [
                    { label: 'Show Portfolio', payload: 'portfolio' },
                    { label: 'Packages & Pricing', payload: 'pricing' },
                    { label: 'Schedule a Call', payload: { type: 'schedule' } }
                ]
            };
        }

        if (containsAny(userMessage, ['seo', 'search engine', 'rank', 'google'])) {
            return {
                intent: 'seo',
                text: "We handle on-page, technical SEO, content strategy and link building. Typical results appear in 3-6 months depending on competition. Want an audit or a custom plan?",
                quickReplies: [
                    { label: 'Free SEO Audit', payload: 'audit' },
                    { label: 'Custom SEO Plan', payload: 'talk_expert' }
                ]
            };
        }

        if (containsAny(userMessage, ['portfolio', 'work', 'case study', 'projects'])) {
            return {
                intent: 'portfolio',
                text: "You can view our recent projects on the website. Do you want a curated list for your industry or to see specific case studies?",
                quickReplies: [
                    { label: 'Show Web Projects', payload: 'show_web' },
                    { label: 'Show Marketing Case Studies', payload: 'show_marketing' },
                    { label: 'Talk to Expert', payload: 'talk_expert' }
                ]
            };
        }

        if (containsAny(userMessage, ['contact', 'phone', 'call', 'talk']) || userMessage === 'talk_expert') {
            // Instead of showing number, display call button
            return {
                intent: 'contact_call',
                action: 'call',
                text: "I can connect you with one of our sales experts. Click below to call now or schedule a call.",
                tel: '+923369295295',
                quickReplies: [
                    { label: 'Schedule a Call', payload: { type: 'schedule' } },
                    { label: 'Share Contact Info', payload: { type: 'collect_contact' } }
                ]
            };
        }

        if (userMessage === 'show_packages' || containsAny(userMessage, ['basic', 'Business', 'Business plus', 'Business pro', 'packages'])) {
            return {
                intent: 'packages',
                text: "Here are quick package summaries:\n• Basic — Landing page + Basic SEO\n• Business — Multi-page site + SEO + Basic Marketing\n• Business plus — E‑commerce/Complex sites + Advanced SEO + Ads\n• Business pro — Full growth stack + Dedicated manager. Want details on any package?",
                quickReplies: [
                    { label: 'Basic Details', payload: 'package_basic' },
                    { label: 'Business plus Details', payload: 'package_Business plus' },
                    { label: 'Get Custom Quote', payload: 'talk_expert' }
                ]
            };
        }

        if (userMessage.startsWith('package_') || containsAny(userMessage, ['basic details', 'Business plus details'])) {
            // Example expand package
            return {
                intent: 'package_detail',
                text: "Package details: We include project plan, milestones, QA, deployment, and 30 days support. For exact deliverables and timelines, I can schedule a free consultation.",
                quickReplies: [
                    { label: 'Schedule Free Consultation', payload: { type: 'schedule' } },
                    { label: 'Talk to an Expert', payload: 'talk_expert' }
                ]
            };
        }

        if (containsAny(userMessage, ['support', 'help', 'issue'])) {
            return {
                intent: 'support',
                text: "We provide 24/7 support via WhatsApp, Email, and Phone. Would you like to open a ticket or talk to our support team directly?",
                quickReplies: [
                    { label: 'Open Support Ticket', payload: 'support_ticket' },
                    { label: 'Call Support', payload: { type: 'call', tel: '+923369295295', label: 'Call Support' } }
                ]
            };
        }

        if (containsAny(userMessage, ['thanks', 'thank you', 'thx'])) {
            return {
                intent: 'thanks',
                text: "You're welcome! Anything else I can assist with?",
                quickReplies: [
                    { label: 'Services', payload: 'services' },
                    { label: 'Talk to Expert', payload: 'talk_expert' }
                ]
            };
        }

        // If user provides contact details (simple detection)
        if (looksLikeEmail(userMessage) || looksLikePhone(userMessage)) {
            // ask to confirm storing
            ctx.collected = ctx.collected || {};
            if (looksLikeEmail(userMessage)) ctx.collected.email = userMessage;
            if (looksLikePhone(userMessage)) ctx.collected.phone = userMessage;
            return {
                intent: 'collected_contact',
                action: 'collect_contact',
                text: "Thanks — I recorded that. Would you like to add your name or schedule a call?",
                quickReplies: [
                    { label: 'Add Name & More', payload: { type: 'collect_contact' } },
                    { label: 'Schedule a Call', payload: { type: 'schedule' } }
                ]
            };
        }

        // Fallback: try to answer generically like an expert
        const generic = generateExpertAnswer(userMessage);
        return {
            intent: 'fallback',
            text: generic,
            quickReplies: [
                { label: 'Services', payload: 'services' },
                { label: 'Pricing', payload: 'pricing' },
                { label: 'Talk to Expert', payload: 'talk_expert' }
            ]
        };
    }

    // Utility helpers

    function containsAny(text, arr) {
        return arr.some(a => text.indexOf(a) !== -1);
    }

    function looksLikeEmail(text) {
        return /\S+@\S+\.\S+/.test(text);
    }

    function looksLikePhone(text) {
        // simple phone detection (digits 7-15)
        return /(\+?\d[\d\s\-]{6,}\d)/.test(text);
    }

    // A simple rule-based "expert" answer generator for fallback queries
    function generateExpertAnswer(query) {
        // Provide helpful suggestions and next steps
        if (query.length < 40) {
            return "That's a good question. Could you tell me a bit more about your goals? For example — increase sales, generate leads, brand awareness, or improve conversions?";
        }

        // If looks like a product or campaign question, give structured advice
        return "As a marketing specialist, I'd recommend: 1) Define your target audience and goals, 2) Build a conversion-focused funnel, 3) Use SEO + paid ads for demand capture, 4) Track metrics (CPL, CAC, ROAS). Would you like a tailored plan or to talk to an expert?";
    }

    // Initial polite greeting if user focuses bot open manually
    // (Handled on toggle already)
}

// Send chatbot message triggered from quick reply or programmatic events
function sendChatbotMessage() {
    const chatbotInput = document.getElementById('chatbotInput');
    const chatbotMessages = document.getElementById('chatbotMessages');
    const chatbotSend = document.getElementById('chatbotSend');
    const value = chatbotInput.value.trim();
    if (!value) return;
    // Reuse initialize's internal functions by triggering input behavior
    // Simple approach: dispatch Enter key via click handler (already wired)
    chatbotSend.click();
}

// escapeHtml kept for safety if used elsewhere
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return String(text).replace(/[&<>"']/g, m => map[m]);
}

// ========================================
// TOASTIFY NOTIFICATIONS
// ========================================

function initializeToastNotifications() {
    // Country data with flags, gender-specific businesses, and names
    const countries = [
        { 
            name: 'Pakistan', 
            flag: '🇵🇰', 
            maleBusinesses: ['Karachi Fitness Club', 'Auto Workshop Lahore', 'Tech Solutions Islamabad', 'Builders Rawalpindi', 'Sports Corner Karachi', 'Gents Salon Lahore', 'Hardware Store Multan', 'Car Wash Faisalabad', 'Security Services Karachi', 'Plumber Services Lahore', 'Mobile Shop Peshawar', 'Electronics Mart Islamabad', 'Printing Press Karachi', 'Transport Services Lahore', 'Real Estate Islamabad'],
            femaleBusinesses: ['Beauty Parlor Lahore', 'Nail Art Studio Karachi', 'Bridal Studio Islamabad', 'Flower Shop Lahore', 'Yoga Center Karachi', 'Skin Care Clinic Lahore', 'Fashion Boutique Karachi', 'Cake Shop Islamabad', 'Jewellery Store Lahore', 'Ladies Spa Karachi', 'Mehndi Artist Studio', 'Stitching Boutique Lahore', 'Ladies Gym Karachi', 'Cooking Classes Islamabad', 'Handicraft Store Lahore'],
            maleNames: ['Hamza', 'Bilal', 'Usman', 'Zain', 'Saad', 'Ahsan', 'Fahad', 'Imran', 'Tariq', 'Hassan', 'Hussain', 'Arslan', 'Danish', 'Ahmed', 'Ali', 'Waqar', 'Kamran', 'Adnan', 'Faisal', 'Umar', 'Shahzaib', 'Junaid', 'Asad', 'Rizwan', 'Nabeel'],
            femaleNames: ['Ayesha', 'Sana', 'Hira', 'Maryam', 'Zara', 'Khadija', 'Amina', 'Bushra', 'Nadia', 'Rabia', 'Asma', 'Mehwish', 'Sadia', 'Noor', 'Nimra', 'Farah', 'Saima', 'Uzma', 'Sidra', 'Iqra', 'Fatima', 'Anam', 'Madiha', 'Zainab', 'Kinza']
        },
        { 
            name: 'India', 
            flag: '🇮🇳', 
            maleBusinesses: ['Fit India Gym Mumbai', 'Auto Works Delhi', 'Tech Hub Bangalore', 'Builders Chennai', 'Sports Zone Hyderabad', 'Royal Barber Shop', 'Hardware Mart Mumbai', 'Shine Car Wash', 'Secure India Services', 'Plumbing Solutions Delhi', 'Mobile Repairs Pune', 'Electronics Bazaar', 'Printing Services Mumbai', 'Transport Agency Delhi', 'Property Dealers Bangalore'],
            femaleBusinesses: ['Beauty Parlor Delhi', 'Nail Art Mumbai', 'Bridal Studio Bangalore', 'Flower Decor Shop', 'Yoga Shala Chennai', 'Skin Care Clinic Mumbai', 'Fashion Boutique Delhi', 'Sweet Treats Bakery', 'Gold Jewellery Store', 'Ayurveda Spa Kerala', 'Mehndi Design Studio', 'Tailoring Boutique', 'Ladies Fitness Center', 'Cooking Academy Mumbai', 'Handicrafts Emporium'],
            maleNames: ['Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Reyansh', 'Ayaan', 'Krishna', 'Rohan', 'Rahul', 'Amit', 'Vikram', 'Pranav', 'Karthik', 'Siddharth', 'Varun', 'Nikhil', 'Rajesh', 'Suresh', 'Manish', 'Deepak', 'Akash', 'Ravi', 'Vijay'],
            femaleNames: ['Aadhya', 'Ananya', 'Diya', 'Saanvi', 'Aanya', 'Isha', 'Kavya', 'Riya', 'Pooja', 'Neha', 'Shreya', 'Deepika', 'Anjali', 'Meera', 'Nisha', 'Tanvi', 'Ishita', 'Kritika', 'Aditi', 'Simran', 'Priya', 'Divya', 'Sneha', 'Swati', 'Jyoti']
        },
        { 
            name: 'UAE', 
            flag: '🇦🇪', 
            maleBusinesses: ['Dubai Fitness Club', 'Auto Service Dubai', 'Tech Hub Abu Dhabi', 'Construction Emirates', 'Sports World Dubai', 'Gentlemen Barber Dubai', 'Hardware Mart UAE', 'Premium Car Wash', 'Emirates Security', 'Plumbing Services Dubai', 'Mobile Zone Dubai', 'Electronics Souq', 'Printing Hub Abu Dhabi', 'Desert Transport LLC', 'Real Estate Dubai'],
            femaleBusinesses: ['Luxury Beauty Salon Dubai', 'Nail Spa Marina', 'Bridal Boutique Abu Dhabi', 'Flower Shop Emirates', 'Yoga Studio Dubai', 'Skin Clinic Dubai', 'Fashion House Dubai', 'Cake Design Studio', 'Gold Souk Jewellers', 'Royal Spa Dubai', 'Henna Art Studio', 'Ladies Tailoring Dubai', 'Fitness Studio Marina', 'Culinary Academy Dubai', 'Abaya Boutique'],
            maleNames: ['Mohammed', 'Ahmed', 'Rashid', 'Khalid', 'Sultan', 'Saeed', 'Omar', 'Hamad', 'Abdullah', 'Majid', 'Faisal', 'Zayed', 'Mansoor', 'Yousuf', 'Ali', 'Hassan', 'Ibrahim', 'Nasser', 'Tariq', 'Waleed', 'Fahad', 'Khaled', 'Adel', 'Salem', 'Jassim'],
            femaleNames: ['Fatima', 'Mariam', 'Aisha', 'Noura', 'Hessa', 'Latifa', 'Shamsa', 'Maitha', 'Reem', 'Sara', 'Maryam', 'Amna', 'Shamma', 'Mouza', 'Khawla', 'Hind', 'Layla', 'Dana', 'Sheikha', 'Alia', 'Maha', 'Asma', 'Hala', 'Salama', 'Jawaher']
        },
        { 
            name: 'USA', 
            flag: '🇺🇸', 
            maleBusinesses: ['Golden Fitness Gym', 'Auto Repair Shop NYC', 'Tech Solutions Hub', 'Construction Pro Services', 'Sports Equipment Store', 'Barber Shop Downtown', 'Hardware Store Chicago', 'Car Wash Express', 'Security Services LA', 'Plumbing Solutions', 'Mobile Fix Center', 'Electronics Depot', 'Print Shop Miami', 'Logistics Company', 'Real Estate Agency NYC'],
            femaleBusinesses: ['Beauty Glow Salon', 'Nail Art Studio LA', 'Bridal Boutique NYC', 'Flower Shop Manhattan', 'Yoga & Wellness Studio', 'Skincare Clinic', 'Fashion Boutique', 'Cake & Bakery Shop', 'Jewelry Store', 'Day Spa Retreat', 'Lash & Brow Studio', 'Alterations Boutique', 'Ladies Fitness Club', 'Cooking Studio NYC', 'Handmade Crafts Shop'],
            maleNames: ['James', 'Michael', 'William', 'David', 'Christopher', 'Matthew', 'Daniel', 'Andrew', 'Joshua', 'Robert', 'John', 'Joseph', 'Thomas', 'Brandon', 'Tyler', 'Austin', 'Kevin', 'Brian', 'Ryan', 'Eric', 'Jason', 'Justin', 'Nicholas', 'Anthony', 'Steven'],
            femaleNames: ['Emily', 'Emma', 'Olivia', 'Sophia', 'Isabella', 'Mia', 'Charlotte', 'Amelia', 'Harper', 'Evelyn', 'Jessica', 'Ashley', 'Jennifer', 'Amanda', 'Stephanie', 'Nicole', 'Rachel', 'Lauren', 'Samantha', 'Katherine', 'Sarah', 'Michelle', 'Elizabeth', 'Megan', 'Hannah']
        },
        { 
            name: 'UK', 
            flag: '🇬🇧', 
            maleBusinesses: ['Elite Fitness Gym London', 'Auto Garage Manchester', 'Tech Innovations Ltd', 'Building Contractors UK', 'Sports Direct Shop', 'Gentlemen Barber London', 'Tool Shop Birmingham', 'Valet Car Services', 'Security Solutions UK', 'Plumbing Experts', 'Mobile Repairs Shop', 'Electronics Store London', 'Print Works Manchester', 'Transport Services UK', 'Property Agency London'],
            femaleBusinesses: ['London Beauty Salon', 'Nail Bar Chelsea', 'Bridal Studio Westminster', 'Flower Boutique London', 'Pilates Studio', 'Skin Therapy Clinic', 'Fashion House London', 'Cupcake Corner', 'Diamond Jewellers', 'Luxury Day Spa', 'Lash Lounge London', 'Tailoring Studio', 'Ladies Gym Chelsea', 'Baking Academy', 'Craft Boutique London'],
            maleNames: ['Oliver', 'George', 'Harry', 'Jack', 'Charlie', 'Arthur', 'Jacob', 'Alfie', 'Oscar', 'Henry', 'Alexander', 'Edward', 'Sebastian', 'Theodore', 'Freddie', 'Archie', 'Leo', 'Finley', 'Noah', 'Ethan', 'William', 'James', 'Thomas', 'Max', 'Lucas'],
            femaleNames: ['Amelia', 'Isla', 'Ava', 'Grace', 'Freya', 'Lily', 'Sophie', 'Ivy', 'Ella', 'Charlotte', 'Poppy', 'Daisy', 'Rosie', 'Florence', 'Willow', 'Sienna', 'Phoebe', 'Evie', 'Elsie', 'Maisie', 'Emily', 'Isabella', 'Mia', 'Olivia', 'Ruby']
        },
        { 
            name: 'Singapore', 
            flag: '🇸🇬', 
            maleBusinesses: ['Singapore Fitness Hub', 'Auto Service Orchard', 'Tech Solutions SG', 'Construction Pte Ltd', 'Sports Mart Singapore', 'Classic Barber Raffles', 'Hardware Centre SG', 'Express Car Grooming', 'Secure Guard SG', 'Plumbing Works SG', 'Mobile Hub Orchard', 'Electronics Mart SG', 'Print Shop Marina', 'Transport Pte Ltd', 'Property Hub SG'],
            femaleBusinesses: ['Orchard Beauty Salon', 'Nail Spa Marina Bay', 'Bridal Boutique SG', 'Flower Studio Singapore', 'Yoga Space Orchard', 'Skin Clinic SG', 'Fashion Gallery', 'Patisserie Café', 'Jewellery Boutique', 'Serenity Spa Singapore', 'Lash Studio Orchard', 'Alteration House SG', 'Ladies Fitness Marina', 'Culinary School SG', 'Handmade Gifts Shop'],
            maleNames: ['Adam', 'Ryan', 'Daniel', 'Marcus', 'Brandon', 'Darren', 'Jeremy', 'Jonathan', 'Kevin', 'Adrian', 'Alvin', 'Bryan', 'Calvin', 'Derek', 'Eugene', 'Faizal', 'Gerald', 'Harris', 'Imran', 'Jason', 'Kenneth', 'Leonard', 'Malcolm', 'Nathan', 'Raymond'],
            femaleNames: ['Sarah', 'Rachel', 'Michelle', 'Amanda', 'Natalie', 'Cheryl', 'Denise', 'Felicia', 'Grace', 'Hannah', 'Isabelle', 'Jasmine', 'Karen', 'Lisa', 'Melissa', 'Nicole', 'Olivia', 'Patricia', 'Samantha', 'Tiffany', 'Vanessa', 'Wendy', 'Yvonne', 'Zoe', 'Audrey']
        },
        { 
            name: 'Australia', 
            flag: '🇦🇺', 
            maleBusinesses: ['Beach Fitness Gym Sydney', 'Aussie Auto Repairs', 'Tech Solutions Melbourne', 'Outback Builders', 'Sports Hub Brisbane', 'Classic Cuts Barber', 'Trade Tools Store', 'Shine Car Wash Perth', 'Secure Guard Services', 'Reliable Plumbing', 'Mobile Fix Sydney', 'Electronics World', 'Print Shop Melbourne', 'Transport Australia', 'Real Estate Brisbane'],
            femaleBusinesses: ['Sydney Beauty Lounge', 'Nail Art Brisbane', 'Bridal House Melbourne', 'Fresh Flowers Shop', 'Zen Yoga Studio', 'Skin Glow Clinic', 'Style Boutique Sydney', 'Cupcake Heaven', 'Gold Coast Jewellers', 'Bliss Day Spa', 'Lash Bar Melbourne', 'Tailoring Boutique', 'Ladies Gym Sydney', 'Baking School Brisbane', 'Craft Corner Perth'],
            maleNames: ['Oliver', 'Jack', 'William', 'Noah', 'Thomas', 'James', 'Ethan', 'Lucas', 'Cooper', 'Liam', 'Henry', 'Alexander', 'Max', 'Oscar', 'Leo', 'Archer', 'Hudson', 'Harrison', 'Charlie', 'Mason', 'Riley', 'Hunter', 'Jake', 'Ryan', 'Finn'],
            femaleNames: ['Charlotte', 'Olivia', 'Ava', 'Amelia', 'Mia', 'Grace', 'Chloe', 'Sophie', 'Isla', 'Ella', 'Emily', 'Lily', 'Harper', 'Zoe', 'Matilda', 'Ruby', 'Willow', 'Ivy', 'Sienna', 'Evie', 'Aria', 'Madison', 'Layla', 'Scarlett', 'Hazel']
        },
        { 
            name: 'Canada', 
            flag: '🇨🇦', 
            maleBusinesses: ['Toronto Fitness Club', 'Auto Shop Vancouver', 'Tech Solutions Ottawa', 'Canadian Builders Inc', 'Sports Depot Montreal', 'Classic Barber Toronto', 'Hardware Store Calgary', 'Maple Car Wash', 'Northern Security Services', 'Plumbing Pros Edmonton', 'Mobile Repair Vancouver', 'Electronics Plus Toronto', 'Print Hub Montreal', 'Transport Canada Ltd', 'Real Estate Calgary'],
            femaleBusinesses: ['Beauty Studio Toronto', 'Nail Spa Vancouver', 'Bridal Boutique Montreal', 'Blossom Flower Shop', 'Yoga Haven Ottawa', 'Skin Care Clinic Toronto', 'Fashion Boutique Vancouver', 'Sweet Dreams Bakery', 'Maple Jewellers', 'Serenity Day Spa', 'Lash & Beauty Bar', 'Alterations Plus Toronto', 'Ladies Fitness Montreal', 'Culinary Arts Studio', 'Handcrafted Gifts Shop'],
            maleNames: ['Liam', 'Noah', 'Oliver', 'Ethan', 'Lucas', 'Benjamin', 'Logan', 'Mason', 'Elijah', 'Aiden', 'Jacob', 'James', 'Alexander', 'William', 'Michael', 'Daniel', 'Henry', 'Sebastian', 'Jack', 'Owen', 'Samuel', 'Ryan', 'Nathan', 'Carter', 'Dylan'],
            femaleNames: ['Emma', 'Olivia', 'Ava', 'Sophia', 'Isabella', 'Mia', 'Charlotte', 'Amelia', 'Harper', 'Evelyn', 'Abigail', 'Emily', 'Ella', 'Elizabeth', 'Sofia', 'Avery', 'Chloe', 'Victoria', 'Madison', 'Scarlett', 'Grace', 'Lily', 'Aria', 'Zoey', 'Hannah']
        }
    ];

    const services = [
        'Basic Package',
        'Business Package',
        'Business Plus Package',
        'Business Pro Package',
        'Website Development',
        'Google SEO Optimization'
    ];

    // Create a queue of pre-generated unique notifications
    let notificationQueue = [];
    
    function generateNotificationQueue() {
        const allCombinations = [];
        
        // Generate all possible unique combinations with gender matching
        countries.forEach(country => {
            // Male combinations
            country.maleNames.forEach(name => {
                country.maleBusinesses.forEach(business => {
                    services.forEach(service => {
                        allCombinations.push({
                            flag: country.flag,
                            name: name,
                            business: business,
                            service: service,
                            country: country.name,
                            gender: 'male'
                        });
                    });
                });
            });
            
            // Female combinations
            country.femaleNames.forEach(name => {
                country.femaleBusinesses.forEach(business => {
                    services.forEach(service => {
                        allCombinations.push({
                            flag: country.flag,
                            name: name,
                            business: business,
                            service: service,
                            country: country.name,
                            gender: 'female'
                        });
                    });
                });
            });
        });
        
        // Shuffle the array using Fisher-Yates algorithm
        for (let i = allCombinations.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [allCombinations[i], allCombinations[j]] = [allCombinations[j], allCombinations[i]];
        }
        
        return allCombinations;
    }

    // Initialize the queue
    notificationQueue = generateNotificationQueue();
    let currentIndex = 0;

    function getNextNotification() {
        // If we've gone through all combinations, reshuffle
        if (currentIndex >= notificationQueue.length) {
            notificationQueue = generateNotificationQueue();
            currentIndex = 0;
        }
        
        const notification = notificationQueue[currentIndex];
        currentIndex++;
        return notification;
    }

    function createNotification() {
        const notification = getNextNotification();
        const closeId = 'toast-close-btn-' + Date.now();

        const notificationHtml = `
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 10px; width: 100%;">
                <div style="display: flex; align-items: center; gap: 10px; flex: 1;">
                    <i class="fas fa-check-circle" style="font-size: 20px; color: white;"></i>
                    <div>
                        <div style="font-weight: 600; margin-bottom: 2px;">${notification.flag} ${notification.name}</div>
                        <div style="font-size: 13px; opacity: 0.95;"><strong>${notification.business}</strong> — bought ${notification.service}</div>
                    </div>
                </div>
                <button id="${closeId}" style="
                    background: rgba(255,255,255,0.3);
                    border: none;
                    color: white;
                    width: 28px;
                    height: 28px;
                    border-radius: 50%;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 18px;
                    transition: all 0.2s;
                    flex-shrink: 0;
                " onmouseover="this.style.background='rgba(255,255,255,0.5)'" onmouseout="this.style.background='rgba(255,255,255,0.3)'">
                    ✕
                </button>
            </div>
        `;

        const toast = Toastify({
            text: notificationHtml,
            duration: 5000,
            gravity: "bottom",
            position: "center",
            backgroundColor: "linear-gradient(to right, #4B32A1 0%, #9B308E 40%, #E63E36 75%, #F58220 100%)",
            stopOnFocus: true,
            className: "custom-toast",
            escapeMarkup: false
        }).showToast();

        // Attach close functionality
        setTimeout(() => {
            const closeBtn = document.getElementById(closeId);
            if (closeBtn) {
                closeBtn.addEventListener('click', function() {
                    if (toast && typeof toast.hideToast === 'function') {
                        toast.hideToast();
                    } else {
                        const toastEl = closeBtn.closest('.toastify');
                        if (toastEl) toastEl.remove();
                    }
                });
            }
        }, 100);
    }

    // Show notifications every 8 seconds
    setInterval(() => {
        createNotification();
    }, 8000);

    // Initial notification after 3 seconds
    setTimeout(() => {
        createNotification();
    }, 3000);
}

// ========================================
// FORM HANDLING
// ========================================

function initializeFormHandling() {
    const contactForm = document.getElementById('contactForm');
    const modalContactForm = document.getElementById('modalContactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            handleFormSubmit(this);
        });
    }

    if (modalContactForm) {
        modalContactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            handleFormSubmit(this);
        });
    }
}

function handleFormSubmit(form) {
    // Get form data
    const formData = new FormData(form);
    
    // Show success toast
    Toastify({
        text: '✅ Thank you for your message! We\'ll get back to you within 24 hours.',
        duration: 5000,
        gravity: "bottom",
        position: "center",
        backgroundColor: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
        stopOnFocus: true
    }).showToast();

    // Reset form
    form.reset();

    // Close modal if it's a modal form
    const modal = form.closest('.modal');
    if (modal) {
        const bootstrapModal = bootstrap.Modal.getInstance(modal);
        if (bootstrapModal) {
            bootstrapModal.hide();
        }
    }

    // Here you would typically send the data to your server
    // Example:
    // fetch('/api/contact', { method: 'POST', body: formData })
    //     .then(response => response.json())
    //     .then(data => console.log('Success:', data))
    //     .catch((error) => console.error('Error:', error));
}

// ========================================
// FANCYBOX INITIALIZATION
// ========================================

function initializeFancybox() {
    Fancybox.bind('[data-fancybox]', {
        on: {
            reveal: (fancybox, $slide) => {
                // Animation on reveal
                gsap.from($slide.$content, {
                    duration: 0.4,
                    opacity: 0,
                    scale: 0.8,
                    ease: 'back.out'
                });
            }
        }
    });
}

// ========================================
// STICKY BUTTONS FUNCTIONALITY
// ========================================

function initializeStickyButtons() {
    // Call Button (Navbar)
    const navCallBtn = document.getElementById('navCallBtn');
    if (navCallBtn) {
        navCallBtn.addEventListener('click', function () {
            callUs();
        });
    }

    // Sticky Call Button
    const stickyCallBtn = document.getElementById('stickyCallBtn');
    if (stickyCallBtn) {
        stickyCallBtn.addEventListener('click', function () {
            callUs();
        });
    }

    // Smooth scroll for contact buttons
    const contactBtns = document.querySelectorAll('[data-bs-toggle="modal"][data-bs-target="#contactModal"]');
    contactBtns.forEach(btn => {
        btn.addEventListener('click', function (e) {
            // Bootstrap will handle modal opening
        });
    });
}

function callUs() {
    window.location.href = 'tel:+923369295295';
}

// ========================================
// SCROLL ANIMATIONS
// ========================================

function initializeScrollAnimations() {
    // Navbar background on scroll
    window.addEventListener('scroll', function () {
        const navbar = document.querySelector('.navbar-gradient');
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.15)';
        } else {
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        }
    });

    // Reveal animation for sections
    const revealElements = document.querySelectorAll('[data-reveal]');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                gsap.from(entry.target, {
                    duration: 0.8,
                    y: 50,
                    opacity: 0,
                    ease: 'power3.out'
                });
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(element => revealObserver.observe(element));
}

// ========================================
// NAVBAR ACTIVE LINK HANDLING
// ========================================

document.addEventListener('DOMContentLoaded', function () {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });

    // Smooth scroll for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });
});

// ========================================
// HOVER EFFECTS FOR CARDS
// ========================================

document.addEventListener('DOMContentLoaded', function () {
    const interactiveElements = document.querySelectorAll('.hover-lift, .service-card, .portfolio-card, .value-card');

    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function () {
            gsap.to(this, {
                duration: 0.3,
                y: -10,
                ease: 'power2.out'
            });
        });

        element.addEventListener('mouseleave', function () {
            gsap.to(this, {
                duration: 0.3,
                y: 0,
                ease: 'power2.out'
            });
        });
    });
});

// ========================================
// RESPONSIVE ADJUSTMENTS
// ========================================

function handleResponsive() {
    const isMobile = window.innerWidth < 768;
    const chatbotWidget = document.getElementById('chatbot');

    if (isMobile && chatbotWidget && chatbotWidget.classList.contains('active')) {
        // Adjust for mobile if needed
    }
}

window.addEventListener('resize', handleResponsive);

// ========================================
// PRELOADER (OPTIONAL)
// ========================================

window.addEventListener('load', function () {
    // All resources loaded
    console.log('All resources loaded');
});

// ========================================
// KEYBOARD SHORTCUTS
// ========================================

document.addEventListener('keydown', function (e) {
    // Alt + C to call
    if (e.altKey && e.key === 'c') {
        callUs();
    }

    // Alt + W to open WhatsApp
    if (e.altKey && e.key === 'w') {
        window.open('https://wa.me/923369295295', '_blank');
    }

    // Alt + E to scroll to contact
    if (e.altKey && e.key === 'e') {
        document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
    }
});

// ========================================
// LAZY LOADING IMAGES
// ========================================

if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => imageObserver.observe(img));
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

// Add ripple effect on button clicks
document.addEventListener('click', function (e) {
    if (e.target.classList.contains('btn') || e.target.closest('.btn')) {
        const btn = e.target.classList.contains('btn') ? e.target : e.target.closest('.btn');
        
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        
        const rect = btn.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        
        btn.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    }
});

// ========================================
// CONSOLE MESSAGES
// ========================================

console.log('%c🚀 Brandliox - Business plus Digital Marketing & Web Development', 'color: #6366f1; font-size: 16px; font-weight: bold;');
console.log('%cWebsite: https://Brandliox.com', 'color: #ec4899; font-size: 12px;');
console.log('%cPhone: +92 336 9295 295', 'color: #10b981; font-size: 12px;');
console.log('%cEmail: mailbrandliox@gmail.com', 'color: #0ea5e9; font-size: 12px;');
console.log('%cDesigned & Developed by Dilawar Pro ❤️', 'color: #f59e0b; font-size: 12px;');