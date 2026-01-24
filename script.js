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
            name: 'USA', 
            flag: '🇺🇸', 
            maleBusinesses: ['Golden Fitness Gym', 'Auto Repair Shop', 'Tech Solutions Hub', 'Construction Pro Services', 'Sports Equipment Store', 'Barber Shop Downtown', 'Hardware Store', 'Car Wash Express', 'Security Services', 'Plumbing Solutions'],
            femaleBusinesses: ['Beauty Glow Salon', 'Nail Art Studio', 'Bridal Boutique', 'Flower Shop', 'Yoga & Wellness Studio', 'Skincare Clinic', 'Fashion Boutique', 'Cake & Bakery Shop', 'Jewelry Store', 'Day Spa Retreat'],
            maleNames: ['James', 'Michael', 'William', 'David', 'Christopher', 'Matthew', 'Daniel', 'Andrew', 'Joshua', 'Robert', 'John', 'Joseph', 'Thomas', 'Brandon', 'Tyler', 'Austin', 'Kevin', 'Brian', 'Ryan', 'Eric'],
            femaleNames: ['Emily', 'Emma', 'Olivia', 'Sophia', 'Isabella', 'Mia', 'Charlotte', 'Amelia', 'Harper', 'Evelyn', 'Jessica', 'Ashley', 'Jennifer', 'Amanda', 'Stephanie', 'Nicole', 'Rachel', 'Lauren', 'Samantha', 'Katherine']
        },
        { 
            name: 'UK', 
            flag: '🇬🇧', 
            maleBusinesses: ['Elite Fitness Gym', 'Auto Garage London', 'Tech Innovations Ltd', 'Building Contractors', 'Sports Direct Shop', 'Gentlemen Barber', 'Tool Shop', 'Valet Car Services', 'Security Solutions UK', 'Plumbing Experts'],
            femaleBusinesses: ['London Beauty Salon', 'Nail Bar Chelsea', 'Bridal Studio Westminster', 'Flower Boutique', 'Pilates Studio', 'Skin Therapy Clinic', 'Fashion House London', 'Cupcake Corner', 'Diamond Jewellers', 'Luxury Day Spa'],
            maleNames: ['Oliver', 'George', 'Harry', 'Jack', 'Charlie', 'Arthur', 'Jacob', 'Alfie', 'Oscar', 'Henry', 'Alexander', 'Edward', 'Sebastian', 'Theodore', 'Freddie', 'Archie', 'Leo', 'Finley', 'Noah', 'Ethan'],
            femaleNames: ['Amelia', 'Isla', 'Ava', 'Grace', 'Freya', 'Lily', 'Sophie', 'Ivy', 'Ella', 'Charlotte', 'Poppy', 'Daisy', 'Rosie', 'Florence', 'Willow', 'Sienna', 'Phoebe', 'Evie', 'Elsie', 'Maisie']
        },
        { 
            name: 'Canada', 
            flag: '🇨🇦', 
            maleBusinesses: ['Mountain Fitness Club', 'Maple Auto Services', 'Tech Hub Toronto', 'Canadian Builders Inc', 'Sports Gear Canada', 'Classic Barber Shop', 'Home Hardware Store', 'Express Car Wash', 'Guardian Security', 'Pro Plumbing Services'],
            femaleBusinesses: ['Aurora Beauty Salon', 'Nail Spa Vancouver', 'Bridal Dreams Boutique', 'Blossom Florist', 'Serenity Yoga Studio', 'Glow Skincare Clinic', 'Chic Fashion Boutique', 'Sweet Delights Bakery', 'Elegant Jewellery', 'Tranquil Day Spa'],
            maleNames: ['Liam', 'Noah', 'Ethan', 'Lucas', 'Benjamin', 'Logan', 'Mason', 'Elijah', 'Aiden', 'Alexander', 'Ryan', 'Owen', 'Jackson', 'Carter', 'Wyatt', 'Jack', 'Luke', 'Jayden', 'Dylan', 'Grayson'],
            femaleNames: ['Emma', 'Olivia', 'Ava', 'Sophia', 'Isabella', 'Chloe', 'Aria', 'Zoe', 'Sarah', 'Hannah', 'Madison', 'Abigail', 'Natalie', 'Layla', 'Riley', 'Zoey', 'Nora', 'Lily', 'Eleanor', 'Hazel']
        },
        { 
            name: 'Australia', 
            flag: '🇦🇺', 
            maleBusinesses: ['Beach Fitness Gym', 'Aussie Auto Repairs', 'Tech Solutions Sydney', 'Outback Builders', 'Sports Hub Melbourne', 'Classic Cuts Barber', 'Trade Tools Store', 'Shine Car Wash', 'Secure Guard Services', 'Reliable Plumbing'],
            femaleBusinesses: ['Sydney Beauty Lounge', 'Nail Art Brisbane', 'Bridal House Melbourne', 'Fresh Flowers Shop', 'Zen Yoga Studio', 'Skin Glow Clinic', 'Style Boutique', 'Cupcake Heaven', 'Gold Coast Jewellers', 'Bliss Day Spa'],
            maleNames: ['Oliver', 'Jack', 'William', 'Noah', 'Thomas', 'James', 'Ethan', 'Lucas', 'Cooper', 'Liam', 'Henry', 'Alexander', 'Max', 'Oscar', 'Leo', 'Archer', 'Hudson', 'Harrison', 'Charlie', 'Mason'],
            femaleNames: ['Charlotte', 'Olivia', 'Ava', 'Amelia', 'Mia', 'Grace', 'Chloe', 'Sophie', 'Isla', 'Ella', 'Emily', 'Lily', 'Harper', 'Zoe', 'Matilda', 'Ruby', 'Willow', 'Ivy', 'Sienna', 'Evie']
        },
        { 
            name: 'Germany', 
            flag: '🇩🇪', 
            maleBusinesses: ['Fit Gym Berlin', 'Auto Werkstatt München', 'Tech Lösungen Hamburg', 'Bau Profis GmbH', 'Sport Shop Frankfurt', 'Herren Friseur', 'Baumarkt Berlin', 'Auto Pflege Service', 'Sicherheit Dienste', 'Sanitär Technik'],
            femaleBusinesses: ['Schönheit Salon Berlin', 'Nagel Studio München', 'Braut Boutique', 'Blumen Laden', 'Yoga Zentrum', 'Hautpflege Klinik', 'Mode Boutique', 'Konditorei Café', 'Schmuck Geschäft', 'Wellness Spa'],
            maleNames: ['Maximilian', 'Alexander', 'Paul', 'Leon', 'Lukas', 'Felix', 'Jonas', 'Noah', 'Elias', 'Ben', 'Finn', 'Luis', 'Julian', 'Tim', 'Niklas', 'Jan', 'Moritz', 'David', 'Philipp', 'Tobias'],
            femaleNames: ['Emma', 'Mia', 'Hannah', 'Sofia', 'Anna', 'Emilia', 'Lena', 'Marie', 'Lea', 'Clara', 'Laura', 'Lina', 'Johanna', 'Amelie', 'Leonie', 'Julia', 'Sarah', 'Lisa', 'Michelle', 'Katharina']
        },
        { 
            name: 'France', 
            flag: '🇫🇷', 
            maleBusinesses: ['Paris Fitness Club', 'Garage Auto Lyon', 'Solutions Tech Paris', 'Constructeurs Pro', 'Sport Boutique', 'Barbier Parisien', 'Bricolage Store', 'Lavage Auto Express', 'Sécurité Services', 'Plomberie Expert'],
            femaleBusinesses: ['Salon de Beauté Paris', 'Nail Bar Champs-Élysées', 'Boutique Mariée', 'Fleuriste Paris', 'Studio de Yoga', 'Clinique Beauté', 'Mode Boutique', 'Pâtisserie Parisienne', 'Bijouterie Élégante', 'Spa Luxe Paris'],
            maleNames: ['Gabriel', 'Louis', 'Raphaël', 'Jules', 'Adam', 'Lucas', 'Léo', 'Hugo', 'Arthur', 'Nathan', 'Ethan', 'Paul', 'Théo', 'Tom', 'Mathis', 'Enzo', 'Maxime', 'Antoine', 'Alexandre', 'Victor'],
            femaleNames: ['Emma', 'Louise', 'Jade', 'Alice', 'Chloé', 'Lina', 'Mila', 'Léa', 'Manon', 'Rose', 'Camille', 'Sarah', 'Inès', 'Léonie', 'Anna', 'Eva', 'Clara', 'Juliette', 'Marie', 'Charlotte']
        },
        { 
            name: 'Japan', 
            flag: '🇯🇵', 
            maleBusinesses: ['Tokyo Fitness Gym', 'Auto Repair Osaka', 'Tech Solutions Tokyo', 'Construction Kyoto', 'Sports Shop Shibuya', 'Barber Shop Ginza', 'Hardware Store Tokyo', 'Car Wash Yokohama', 'Security Services Japan', 'Plumbing Pro Tokyo'],
            femaleBusinesses: ['Beauty Spa Shibuya', 'Nail Salon Harajuku', 'Bridal Shop Tokyo', 'Flower Boutique Ginza', 'Yoga Studio Osaka', 'Skincare Clinic Tokyo', 'Fashion Boutique Shibuya', 'Cake Shop Kyoto', 'Jewelry Store Ginza', 'Relaxation Spa Tokyo'],
            maleNames: ['Haruto', 'Yuto', 'Sota', 'Hayato', 'Haruki', 'Ryota', 'Kota', 'Kaito', 'Ren', 'Takumi', 'Shota', 'Riku', 'Asahi', 'Minato', 'Yusei', 'Daiki', 'Kento', 'Yuma', 'Hiroto', 'Kenji'],
            femaleNames: ['Yui', 'Rio', 'Koharu', 'Hina', 'Himari', 'Mei', 'Miyu', 'Sakura', 'Aoi', 'Yuna', 'Akari', 'Mio', 'Saki', 'Rina', 'Nanami', 'Honoka', 'Ayaka', 'Misaki', 'Kanon', 'Shiori']
        },
        { 
            name: 'India', 
            flag: '🇮🇳', 
            maleBusinesses: ['Fit India Gym Mumbai', 'Auto Works Delhi', 'Tech Hub Bangalore', 'Builders Chennai', 'Sports Zone Hyderabad', 'Royal Barber Shop', 'Hardware Mart', 'Shine Car Wash', 'Secure India Services', 'Plumbing Solutions Delhi'],
            femaleBusinesses: ['Beauty Parlor Delhi', 'Nail Art Mumbai', 'Bridal Studio Bangalore', 'Flower Decor Shop', 'Yoga Shala Chennai', 'Skin Care Clinic Mumbai', 'Fashion Boutique Delhi', 'Sweet Treats Bakery', 'Gold Jewellery Store', 'Ayurveda Spa Kerala'],
            maleNames: ['Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Reyansh', 'Ayaan', 'Krishna', 'Rohan', 'Rahul', 'Amit', 'Vikram', 'Pranav', 'Karthik', 'Siddharth', 'Varun', 'Nikhil', 'Rajesh', 'Suresh'],
            femaleNames: ['Aadhya', 'Ananya', 'Diya', 'Saanvi', 'Aanya', 'Isha', 'Kavya', 'Riya', 'Pooja', 'Neha', 'Shreya', 'Deepika', 'Anjali', 'Meera', 'Nisha', 'Tanvi', 'Ishita', 'Kritika', 'Aditi', 'Simran']
        },
        { 
            name: 'Brazil', 
            flag: '🇧🇷', 
            maleBusinesses: ['Rio Fitness Academia', 'Auto Center São Paulo', 'Tech Solutions Brasil', 'Construtora Rio', 'Loja de Esportes', 'Barbearia Clássica', 'Loja de Ferramentas', 'Lava Rápido Express', 'Segurança Patrimonial', 'Encanador Profissional'],
            femaleBusinesses: ['Salão de Beleza Rio', 'Nail Designer São Paulo', 'Boutique de Noivas', 'Floricultura Bela', 'Estúdio de Yoga', 'Clínica Estética', 'Boutique de Moda', 'Confeitaria Doce', 'Joalheria Elegante', 'Spa Relaxante'],
            maleNames: ['Miguel', 'Arthur', 'Heitor', 'Bernardo', 'Davi', 'Gabriel', 'Pedro', 'Samuel', 'Lucas', 'Matheus', 'Rafael', 'Gustavo', 'Felipe', 'Thiago', 'Bruno', 'Leonardo', 'Enzo', 'João', 'Carlos', 'Ricardo'],
            femaleNames: ['Maria', 'Alice', 'Sophia', 'Laura', 'Isabella', 'Manuela', 'Júlia', 'Helena', 'Valentina', 'Heloísa', 'Ana', 'Beatriz', 'Mariana', 'Giovanna', 'Letícia', 'Larissa', 'Camila', 'Carolina', 'Fernanda', 'Gabriela']
        },
        { 
            name: 'UAE', 
            flag: '🇦🇪', 
            maleBusinesses: ['Dubai Fitness Club', 'Auto Service Dubai', 'Tech Hub Abu Dhabi', 'Construction Emirates', 'Sports World Dubai', 'Gentlemen Barber Dubai', 'Hardware Mart UAE', 'Premium Car Wash', 'Emirates Security', 'Plumbing Services Dubai'],
            femaleBusinesses: ['Luxury Beauty Salon Dubai', 'Nail Spa Marina', 'Bridal Boutique Abu Dhabi', 'Flower Shop Emirates', 'Yoga Studio Dubai', 'Skin Clinic Dubai', 'Fashion House Dubai', 'Cake Design Studio', 'Gold Souk Jewellers', 'Royal Spa Dubai'],
            maleNames: ['Mohammed', 'Ahmed', 'Rashid', 'Khalid', 'Sultan', 'Saeed', 'Omar', 'Hamad', 'Abdullah', 'Majid', 'Faisal', 'Zayed', 'Mansoor', 'Yousuf', 'Ali', 'Hassan', 'Ibrahim', 'Nasser', 'Tariq', 'Waleed'],
            femaleNames: ['Fatima', 'Mariam', 'Aisha', 'Noura', 'Hessa', 'Latifa', 'Shamsa', 'Maitha', 'Reem', 'Sara', 'Maryam', 'Amna', 'Shamma', 'Mouza', 'Khawla', 'Hind', 'Layla', 'Dana', 'Sheikha', 'Alia']
        },
        { 
            name: 'Pakistan', 
            flag: '🇵🇰', 
            maleBusinesses: ['Karachi Fitness Club', 'Auto Workshop Lahore', 'Tech Solutions Islamabad', 'Builders Rawalpindi', 'Sports Corner Karachi', 'Gents Salon Lahore', 'Hardware Store Multan', 'Car Wash Faisalabad', 'Security Services Pakistan', 'Plumber Services Lahore'],
            femaleBusinesses: ['Beauty Parlor Lahore', 'Nail Art Karachi', 'Bridal Studio Islamabad', 'Flower Shop Lahore', 'Yoga Center Karachi', 'Skin Care Clinic Lahore', 'Fashion Boutique Karachi', 'Cake Shop Islamabad', 'Jewellery Store Lahore', 'Ladies Spa Karachi'],
            maleNames: ['Hamza', 'Bilal', 'Usman', 'Zain', 'Saad', 'Ahsan', 'Fahad', 'Imran', 'Tariq', 'Hassan', 'Hussain', 'Arslan', 'Danish', 'Ahmed', 'Ali', 'Waqar', 'Kamran', 'Adnan', 'Faisal', 'Umar'],
            femaleNames: ['Ayesha', 'Sana', 'Hira', 'Maryam', 'Zara', 'Khadija', 'Amina', 'Bushra', 'Nadia', 'Rabia', 'Asma', 'Mehwish', 'Sadia', 'Noor', 'Nimra', 'Farah', 'Saima', 'Uzma', 'Sidra', 'Iqra']
        },
        { 
            name: 'Singapore', 
            flag: '🇸🇬', 
            maleBusinesses: ['Singapore Fitness Hub', 'Auto Service Orchard', 'Tech Solutions SG', 'Construction Pte Ltd', 'Sports Mart Singapore', 'Classic Barber Raffles', 'Hardware Centre', 'Express Car Grooming', 'Secure Guard SG', 'Plumbing Works SG'],
            femaleBusinesses: ['Orchard Beauty Salon', 'Nail Spa Marina Bay', 'Bridal Boutique SG', 'Flower Studio Singapore', 'Yoga Space Orchard', 'Skin Clinic SG', 'Fashion Gallery', 'Patisserie Café', 'Jewellery Boutique', 'Serenity Spa Singapore'],
            maleNames: ['Wei Jie', 'Jun Wei', 'Zhi Wei', 'Jia Hao', 'Zi Hao', 'Jia Jun', 'Wei Liang', 'Ming Wei', 'Kai Xiang', 'Zhi Hao', 'Jun Jie', 'Yu Xuan', 'Yi Jun', 'Hao Wei', 'Shi Jie', 'Wei Ming', 'Jun Hao', 'Zhi Xuan', 'Jian Wei', 'Kai Ming'],
            femaleNames: ['Xin Yi', 'Xin Hui', 'Jia Yi', 'Hui Ling', 'Xin Ying', 'Jia Xin', 'Yi Ling', 'Hui Min', 'Jia Hui', 'Xin Yee', 'Zi Xuan', 'Mei Ling', 'Shu Ting', 'Li Ying', 'Hui Xin', 'Jing Yi', 'Wen Xin', 'Pei Xuan', 'Xiao Hui', 'Yu Ting']
        },
        { 
            name: 'Saudi Arabia', 
            flag: '🇸🇦', 
            maleBusinesses: ['Riyadh Fitness Center', 'Auto Service Jeddah', 'Tech Hub Riyadh', 'Saudi Builders Co', 'Sports Store Dammam', 'Royal Barber Riyadh', 'Hardware Mart Jeddah', 'Premium Car Care', 'Security Solutions KSA', 'Plumbing Services Riyadh'],
            femaleBusinesses: ['Jeddah Beauty Lounge', 'Nail Studio Riyadh', 'Bridal House Jeddah', 'Flower Boutique Riyadh', 'Ladies Yoga Studio', 'Skin Care Center Jeddah', 'Fashion Boutique Riyadh', 'Cake Creations', 'Gold Jewellery Jeddah', 'Ladies Spa Riyadh'],
            maleNames: ['Mohammed', 'Abdullah', 'Abdulrahman', 'Faisal', 'Khalid', 'Salman', 'Saud', 'Turki', 'Nasser', 'Sultan', 'Bandar', 'Fahad', 'Nawaf', 'Abdulaziz', 'Omar', 'Ali', 'Ahmad', 'Youssef', 'Hamad', 'Waleed'],
            femaleNames: ['Nora', 'Sara', 'Lama', 'Hala', 'Reem', 'Asma', 'Maha', 'Nouf', 'Dalal', 'Haifa', 'Fatima', 'Aisha', 'Mariam', 'Jawaher', 'Abeer', 'Wafa', 'Arwa', 'Ghada', 'Lamia', 'Mashael']
        },
        { 
            name: 'South Africa', 
            flag: '🇿🇦', 
            maleBusinesses: ['Cape Town Fitness Gym', 'Auto Workshop Joburg', 'Tech Solutions SA', 'Builders Pretoria', 'Sports Outlet Durban', 'Gents Barber Shop', 'Hardware Warehouse', 'Car Valet Services', 'Secure Guard SA', 'Plumbing Experts SA'],
            femaleBusinesses: ['Johannesburg Beauty Salon', 'Nail Bar Cape Town', 'Bridal Studio Durban', 'Flower Shop Pretoria', 'Yoga Wellness Studio', 'Skin Therapy Clinic', 'Fashion Boutique Joburg', 'Bakery Delights', 'Jewellery Emporium', 'Day Spa Cape Town'],
            maleNames: ['Liam', 'Ethan', 'Sipho', 'Thabo', 'Johan', 'Pieter', 'Andile', 'Bongani', 'Kagiso', 'David', 'Michael', 'Tshepo', 'Mandla', 'Willem', 'Johannes', 'Sibusiso', 'Themba', 'Neo', 'Dean', 'Craig'],
            femaleNames: ['Lerato', 'Naledi', 'Thandiwe', 'Zanele', 'Nomvula', 'Emma', 'Mia', 'Chloe', 'Sarah', 'Jessica', 'Palesa', 'Lindiwe', 'Ayanda', 'Precious', 'Grace', 'Hope', 'Khanyi', 'Mbali', 'Nandi', 'Zinhle']
        },
        { 
            name: 'Italy', 
            flag: '🇮🇹', 
            maleBusinesses: ['Roma Fitness Club', 'Auto Officina Milano', 'Tech Solutions Italia', 'Costruzioni Roma', 'Sport Shop Napoli', 'Barbiere Classico', 'Ferramenta Store', 'Autolavaggio Express', 'Sicurezza Servizi', 'Idraulico Professionista'],
            femaleBusinesses: ['Salone di Bellezza Milano', 'Nail Art Roma', 'Boutique Sposa Venezia', 'Fiorista Elegante', 'Yoga Studio Firenze', 'Clinica Estetica Roma', 'Moda Boutique Milano', 'Pasticceria Dolce', 'Gioielleria Preziosa', 'Centro Benessere Toscana'],
            maleNames: ['Francesco', 'Leonardo', 'Alessandro', 'Lorenzo', 'Matteo', 'Andrea', 'Gabriele', 'Riccardo', 'Tommaso', 'Marco', 'Luca', 'Giuseppe', 'Antonio', 'Davide', 'Federico', 'Simone', 'Filippo', 'Edoardo', 'Nicola', 'Stefano'],
            femaleNames: ['Sofia', 'Aurora', 'Giulia', 'Ginevra', 'Alice', 'Emma', 'Giorgia', 'Greta', 'Beatrice', 'Anna', 'Chiara', 'Martina', 'Sara', 'Francesca', 'Valentina', 'Alessia', 'Elena', 'Elisa', 'Federica', 'Silvia']
        },
        { 
            name: 'Turkey', 
            flag: '🇹🇷', 
            maleBusinesses: ['Istanbul Fitness Gym', 'Oto Servis Ankara', 'Teknoloji Çözümleri', 'İnşaat Şirketi', 'Spor Mağazası', 'Erkek Kuaförü', 'Hırdavat Dükkanı', 'Oto Yıkama', 'Güvenlik Hizmetleri', 'Tesisatçı Usta'],
            femaleBusinesses: ['Güzellik Salonu Istanbul', 'Nail Art Ankara', 'Gelinlik Butik', 'Çiçekçi Dükkanı', 'Yoga Stüdyosu', 'Cilt Bakım Kliniği', 'Moda Butik', 'Pasta Dükkanı', 'Kuyumcu', 'Spa Merkezi'],
            maleNames: ['Mehmet', 'Mustafa', 'Ahmet', 'Ali', 'Hüseyin', 'Hasan', 'İbrahim', 'Murat', 'Osman', 'Yusuf', 'Emre', 'Burak', 'Cem', 'Serkan', 'Tolga', 'Kaan', 'Berk', 'Onur', 'Deniz', 'Can'],
            femaleNames: ['Fatma', 'Ayşe', 'Emine', 'Hatice', 'Zeynep', 'Elif', 'Merve', 'Esra', 'Büşra', 'Seda', 'Derya', 'Gül', 'Özge', 'Pınar', 'Aslı', 'Burcu', 'Ceren', 'Dilara', 'Ebru', 'Gamze']
        },
        { 
            name: 'Indonesia', 
            flag: '🇮🇩', 
            maleBusinesses: ['Jakarta Fitness Center', 'Bengkel Mobil Surabaya', 'Solusi Teknologi', 'Kontraktor Bangunan', 'Toko Olahraga', 'Barbershop Klasik', 'Toko Bangunan', 'Cuci Mobil Express', 'Jasa Keamanan', 'Tukang Ledeng'],
            femaleBusinesses: ['Salon Kecantikan Jakarta', 'Nail Art Bali', 'Butik Pengantin', 'Toko Bunga', 'Studio Yoga', 'Klinik Perawatan Kulit', 'Butik Fashion', 'Toko Kue', 'Toko Perhiasan', 'Spa Relaksasi'],
            maleNames: ['Budi', 'Andi', 'Dedi', 'Eko', 'Agus', 'Hendra', 'Rizki', 'Fajar', 'Dimas', 'Arif', 'Bayu', 'Cahyo', 'Dwi', 'Feri', 'Gilang', 'Hendri', 'Irwan', 'Joko', 'Kevin', 'Lukman'],
            femaleNames: ['Siti', 'Sri', 'Dewi', 'Ani', 'Rina', 'Wati', 'Yuni', 'Ratna', 'Indah', 'Maya', 'Putri', 'Dian', 'Eka', 'Fitri', 'Gita', 'Hani', 'Intan', 'Kartika', 'Lina', 'Mega']
        },
        { 
            name: 'Malaysia', 
            flag: '🇲🇾', 
            maleBusinesses: ['KL Fitness Centre', 'Auto Workshop Penang', 'Tech Solutions Malaysia', 'Construction Sdn Bhd', 'Sports Outlet KL', 'Barbershop Kuala Lumpur', 'Hardware Store Johor', 'Car Wash Selangor', 'Security Services MY', 'Plumbing Works KL'],
            femaleBusinesses: ['Beauty Salon Kuala Lumpur', 'Nail Spa Penang', 'Bridal Boutique KL', 'Florist Shop Johor', 'Yoga Studio Malaysia', 'Skin Care Clinic KL', 'Fashion Boutique Penang', 'Bakery & Cakes', 'Jewellery Store KL', 'Spa Wellness Centre'],
            maleNames: ['Ahmad', 'Mohamed', 'Ali', 'Hafiz', 'Faiz', 'Haziq', 'Amir', 'Irfan', 'Danial', 'Ariff', 'Wei Liang', 'Jun Kit', 'Zhi Yang', 'Kai Wen', 'Raj', 'Kumar', 'Anand', 'Vikram', 'Suresh', 'Ramesh'],
            femaleNames: ['Nur', 'Siti', 'Aisyah', 'Fatimah', 'Sarah', 'Nurul', 'Aisha', 'Farah', 'Liyana', 'Amira', 'Mei Ling', 'Xin Yi', 'Hui Min', 'Jia Xin', 'Priya', 'Lakshmi', 'Kavitha', 'Shanti', 'Deepa', 'Anita']
        },
        { 
            name: 'Philippines', 
            flag: '🇵🇭', 
            maleBusinesses: ['Manila Fitness Gym', 'Auto Repair Cebu', 'Tech Solutions Manila', 'Construction Company PH', 'Sports Shop Davao', 'Barbershop Manila', 'Hardware Store Quezon', 'Car Wash Express PH', 'Security Agency PH', 'Plumbing Services Manila'],
            femaleBusinesses: ['Beauty Salon Manila', 'Nail Spa Cebu', 'Bridal Shop Makati', 'Flower Shop Quezon', 'Yoga Studio BGC', 'Skin Care Clinic Manila', 'Fashion Boutique Makati', 'Cake Shop Davao', 'Jewelry Store Manila', 'Spa Wellness Cebu'],
            maleNames: ['Juan', 'Jose', 'Miguel', 'Antonio', 'Carlo', 'Marco', 'Paolo', 'Rafael', 'Gabriel', 'Angelo', 'Jayson', 'Mark', 'John', 'Michael', 'Kevin', 'Bryan', 'Christian', 'Daniel', 'Francis', 'Patrick'],
            femaleNames: ['Maria', 'Ana', 'Rosa', 'Carmen', 'Sofia', 'Isabella', 'Angela', 'Patricia', 'Jessica', 'Nicole', 'Michelle', 'Stephanie', 'Christine', 'Jennifer', 'Katherine', 'Angelica', 'Maricel', 'Jocelyn', 'Rosalie', 'Grace']
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