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
    // Country data with flags, local businesses, and country-specific names
    const countries = [
        { 
            name: 'USA', 
            flag: '🇺🇸', 
            businesses: ['Golden Fitness Gym', 'Sunset Restaurant', 'Beauty Glow Salon', 'Adventure Travel Agency', 'Cozy Coffee Shop', 'Fresh Juice Bar', 'Hair Studio Pro', 'Downtown Diner', 'Elite Wellness Center', 'American Dream Spa', 'Liberty Cafe', 'Star Fitness Club'],
            names: ['James', 'Michael', 'William', 'David', 'Christopher', 'Matthew', 'Daniel', 'Andrew', 'Joshua', 'Emily', 'Emma', 'Olivia', 'Sophia', 'Isabella', 'Mia', 'Charlotte', 'Amelia', 'Harper', 'Evelyn', 'Robert', 'John', 'Joseph', 'Thomas', 'Jessica', 'Ashley', 'Jennifer', 'Amanda', 'Stephanie', 'Nicole', 'Brandon', 'Tyler', 'Austin', 'Kevin', 'Brian', 'Rachel', 'Lauren', 'Samantha', 'Katherine', 'Elizabeth']
        },
        { 
            name: 'UK', 
            flag: '🇬🇧', 
            businesses: ['Fitness Elite Gym', 'The Royal Restaurant', 'London Beauty Salon', 'British Travel Agency', 'Tea House Cafe', 'Organic Smoothie Bar', 'Westminster Hair Studio', 'The Kings Arms Pub', 'Chelsea Wellness Spa', 'Oxford Bistro', 'Cambridge Cafe', 'Manchester Fitness'],
            names: ['Oliver', 'George', 'Harry', 'Jack', 'Charlie', 'Arthur', 'Jacob', 'Alfie', 'Oscar', 'Amelia', 'Isla', 'Ava', 'Grace', 'Freya', 'Lily', 'Sophie', 'Ivy', 'Ella', 'Henry', 'Alexander', 'Edward', 'Sebastian', 'Charlotte', 'Poppy', 'Daisy', 'Rosie', 'Florence', 'Willow', 'Sienna', 'Phoebe', 'Evie', 'Elsie', 'Maisie', 'Theodore', 'Freddie', 'Archie', 'Leo', 'Finley', 'Noah', 'Ethan']
        },
        { 
            name: 'Canada', 
            flag: '🇨🇦', 
            businesses: ['Mountain Fitness Gym', 'Maple Leaf Restaurant', 'Aurora Beauty Salon', 'Canadian Travel Dreams', 'Tim Hortons Cafe', 'Health Juice Bar', 'Toronto Hair Studio', 'Vancouver Wellness Center', 'Ottawa Bistro', 'Montreal Spa', 'Calgary Fitness Hub', 'Quebec City Cafe'],
            names: ['Liam', 'Noah', 'Ethan', 'Lucas', 'Benjamin', 'Logan', 'Mason', 'Elijah', 'Aiden', 'Emma', 'Olivia', 'Ava', 'Sophia', 'Isabella', 'Chloe', 'Aria', 'Zoe', 'Alexander', 'Ryan', 'Sarah', 'Hannah', 'Madison', 'Abigail', 'Natalie', 'Owen', 'Jackson', 'Carter', 'Wyatt', 'Jack', 'Luke', 'Jayden', 'Dylan', 'Grayson', 'Layla', 'Riley', 'Zoey', 'Nora', 'Lily', 'Eleanor', 'Hazel']
        },
        { 
            name: 'Australia', 
            flag: '🇦🇺', 
            businesses: ['Beach Gym Studio', 'Aussie Grill Restaurant', 'Sydney Beauty Salon', 'Outback Travel Agency', 'Melbourne Cafe', 'Fresh Juice Bar', 'Brisbane Hair Salon', 'Perth Wellness Center', 'Gold Coast Bistro', 'Adelaide Spa', 'Cairns Fitness Club', 'Darwin Restaurant'],
            names: ['Oliver', 'Jack', 'William', 'Noah', 'Thomas', 'James', 'Ethan', 'Lucas', 'Cooper', 'Charlotte', 'Olivia', 'Ava', 'Amelia', 'Mia', 'Grace', 'Chloe', 'Sophie', 'Isla', 'Ella', 'Liam', 'Henry', 'Alexander', 'Max', 'Emily', 'Lily', 'Harper', 'Zoe', 'Matilda', 'Ruby', 'Oscar', 'Leo', 'Archer', 'Hudson', 'Harrison', 'Charlie', 'Willow', 'Ivy', 'Sienna', 'Evie', 'Aria']
        },
        { 
            name: 'Germany', 
            flag: '🇩🇪', 
            businesses: ['Fit Gym Berlin', 'Bratwurst Haus', 'Schönheit Beauty Salon', 'Deutschland Travel Agency', 'German Bakery Cafe', 'Natural Juice Bar', 'Munich Hair Design', 'Hamburg Wellness Spa', 'Frankfurt Bistro', 'Cologne Fitness Studio', 'Dresden Restaurant', 'Stuttgart Cafe'],
            names: ['Maximilian', 'Alexander', 'Paul', 'Leon', 'Lukas', 'Felix', 'Jonas', 'Noah', 'Elias', 'Emma', 'Mia', 'Hannah', 'Sofia', 'Anna', 'Emilia', 'Lena', 'Marie', 'Lea', 'Clara', 'Ben', 'Finn', 'Luis', 'Julian', 'Chris', 'Lina', 'Johanna', 'Amelie', 'Leonie', 'Julia', 'Tim', 'Niklas', 'Jan', 'Moritz', 'David', 'Sarah', 'Lisa', 'Michelle', 'Katharina', 'Sophie', 'Charlotte']
        },
        { 
            name: 'France', 
            flag: '🇫🇷', 
            businesses: ['Paris Fitness Gym', 'Le Petit Bistro', 'Salon de Beauté Paris', 'Voyages France Agency', 'Boulangerie Parisienne', 'Jus de Fruits Bar', 'Coiffure Lyon', 'Nice Wellness Spa', 'Marseille Cafe', 'Bordeaux Restaurant', 'Toulouse Fitness', 'Strasbourg Bistro'],
            names: ['Gabriel', 'Louis', 'Raphaël', 'Jules', 'Adam', 'Lucas', 'Léo', 'Hugo', 'Arthur', 'Emma', 'Louise', 'Jade', 'Alice', 'Chloé', 'Lina', 'Mila', 'Léa', 'Manon', 'Rose', 'Nathan', 'Ethan', 'Paul', 'Théo', 'Camille', 'Sarah', 'Inès', 'Léonie', 'Anna', 'Eva', 'Tom', 'Mathis', 'Enzo', 'Maxime', 'Antoine', 'Clara', 'Juliette', 'Marie', 'Charlotte', 'Ambre', 'Zoé']
        },
        { 
            name: 'Japan', 
            flag: '🇯🇵', 
            businesses: ['Tokyo Fitness Gym', 'Sakura Ramen House', 'Beauty Spa Osaka', 'Japan Tours Agency', 'Matcha Tea House', 'Smoothie Bar Kyoto', 'Hair Salon Shibuya', 'Zen Wellness Center', 'Sushi Paradise', 'Yokohama Restaurant', 'Nagoya Fitness Club', 'Fukuoka Cafe'],
            names: ['Haruto', 'Yuto', 'Sota', 'Yuki', 'Hayato', 'Haruki', 'Ryota', 'Kota', 'Kaito', 'Yui', 'Rio', 'Koharu', 'Hina', 'Himari', 'Mei', 'Miyu', 'Sakura', 'Aoi', 'Yuna', 'Ren', 'Takumi', 'Shota', 'Riku', 'Akari', 'Mio', 'Saki', 'Rina', 'Nanami', 'Honoka', 'Asahi', 'Minato', 'Yusei', 'Daiki', 'Kento', 'Ayaka', 'Misaki', 'Kanon', 'Shiori', 'Riko', 'Yuzuki']
        },
        { 
            name: 'India', 
            flag: '🇮🇳', 
            businesses: ['Fit India Gym Mumbai', 'Taj Mahal Restaurant', 'Beauty Parlor Delhi', 'Incredible India Tours', 'Chai Wala Cafe', 'Fresh Juice Corner', 'Hair Salon Bangalore', 'Ayurveda Wellness Spa', 'Spice Garden Restaurant', 'Chennai Fitness Club', 'Kolkata Bistro', 'Hyderabad Cafe'],
            names: ['Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Reyansh', 'Ayaan', 'Krishna', 'Aadhya', 'Ananya', 'Diya', 'Saanvi', 'Aanya', 'Isha', 'Kavya', 'Riya', 'Pooja', 'Rohan', 'Rahul', 'Amit', 'Vikram', 'Neha', 'Shreya', 'Deepika', 'Anjali', 'Meera', 'Nisha', 'Pranav', 'Karthik', 'Siddharth', 'Varun', 'Nikhil', 'Tanvi', 'Ishita', 'Kritika', 'Aditi', 'Simran', 'Nikita', 'Divya']
        },
        { 
            name: 'Brazil', 
            flag: '🇧🇷', 
            businesses: ['Rio Fitness Gym', 'Churrascaria Gaúcha', 'Salão de Beleza Rio', 'Brasil Travel Agency', 'Açaí Corner Cafe', 'Suco Natural Bar', 'Cabelo Studio São Paulo', 'Copacabana Wellness Spa', 'Feijoada House', 'Salvador Restaurant', 'Brasilia Fitness', 'Recife Bistro'],
            names: ['Miguel', 'Arthur', 'Heitor', 'Bernardo', 'Davi', 'Gabriel', 'Pedro', 'Samuel', 'Lucas', 'Maria', 'Alice', 'Sophia', 'Laura', 'Isabella', 'Manuela', 'Júlia', 'Helena', 'Valentina', 'Heloísa', 'Matheus', 'Rafael', 'Gustavo', 'Felipe', 'Ana', 'Beatriz', 'Mariana', 'Giovanna', 'Letícia', 'Larissa', 'Thiago', 'Bruno', 'Leonardo', 'Enzo', 'João', 'Camila', 'Carolina', 'Fernanda', 'Gabriela', 'Juliana', 'Natália']
        },
        { 
            name: 'UAE', 
            flag: '🇦🇪', 
            businesses: ['Dubai Fitness Gym', 'Al Majlis Restaurant', 'Luxury Beauty Salon Dubai', 'Emirates Travel Agency', 'Arabic Coffee House', 'Fresh Juice Bar Abu Dhabi', 'Hair Studio Marina', 'Burj Wellness Spa', 'Desert Rose Cafe', 'Sharjah Restaurant', 'Ajman Fitness Club', 'Ras Al Khaimah Bistro'],
            names: ['Mohammed', 'Ahmed', 'Rashid', 'Khalid', 'Sultan', 'Saeed', 'Omar', 'Hamad', 'Abdullah', 'Fatima', 'Mariam', 'Aisha', 'Noura', 'Hessa', 'Latifa', 'Shamsa', 'Maitha', 'Reem', 'Sara', 'Majid', 'Faisal', 'Zayed', 'Mansoor', 'Maryam', 'Amna', 'Shamma', 'Mouza', 'Khawla', 'Hind', 'Yousuf', 'Ali', 'Hassan', 'Ibrahim', 'Nasser', 'Layla', 'Dana', 'Sheikha', 'Alia', 'Manal', 'Hala']
        },
        { 
            name: 'Pakistan', 
            flag: '🇵🇰', 
            businesses: ['Karachi Fitness Club', 'Lahore Biryani House', 'Beauty Parlor Islamabad', 'Pakistan Tours Agency', 'Chai Khana Lahore', 'Fresh Juice Corner Karachi', 'Hair Salon Multan', 'Rawalpindi Wellness Center', 'Peshawar Kabab House', 'Faisalabad Restaurant', 'Quetta Fitness Gym', 'Sialkot Cafe'],
            names: ['Hamza', 'Bilal', 'Usman', 'Zain', 'Saad', 'Ahsan', 'Fahad', 'Imran', 'Tariq', 'Ayesha', 'Sana', 'Hira', 'Maryam', 'Zara', 'Khadija', 'Amina', 'Bushra', 'Nadia', 'Rabia', 'Hassan', 'Hussain', 'Arslan', 'Danish', 'Asma', 'Mehwish', 'Sadia', 'Noor', 'Nimra', 'Ahmed', 'Ali', 'Waqar', 'Kamran', 'Adnan', 'Farah', 'Saima', 'Uzma', 'Sidra', 'Iqra', 'Madiha', 'Anam']
        },
        { 
            name: 'Singapore', 
            flag: '🇸🇬', 
            businesses: ['Singapore Fitness Hub', 'Hawker Paradise Restaurant', 'Orchard Beauty Salon', 'Lion City Travel Agency', 'Kopitiam Traditional Cafe', 'Marina Juice Bar', 'Hair Studio Raffles', 'Sentosa Wellness Spa', 'Little India Bistro', 'Chinatown Restaurant', 'Bugis Fitness Club', 'Clarke Quay Cafe'],
            names: ['Wei Jie', 'Jun Wei', 'Zhi Wei', 'Jia Hao', 'Yi Xuan', 'Zi Hao', 'Jia Jun', 'Wei Liang', 'Xin Yi', 'Xin Hui', 'Jia Yi', 'Hui Ling', 'Xin Ying', 'Jia Xin', 'Yi Ling', 'Hui Min', 'Jia Hui', 'Xin Yee', 'Zi Xuan', 'Ming Wei', 'Kai Xiang', 'Zhi Hao', 'Jun Jie', 'Mei Ling', 'Shu Ting', 'Li Ying', 'Hui Xin', 'Jing Yi', 'Wen Xin', 'Yu Xuan', 'Rui En', 'Yi Jun', 'Hao Wei', 'Shi Jie', 'Pei Xuan', 'Xiao Hui', 'Ying Xin', 'Wen Hui', 'Yu Ting', 'Jing Wen']
        },
        { 
            name: 'Saudi Arabia', 
            flag: '🇸🇦', 
            businesses: ['Riyadh Fitness Center', 'Al Baik Restaurant', 'Jeddah Beauty Lounge', 'Saudi Travel Agency', 'Arabic Coffee Majlis', 'Fresh Juice Bar Riyadh', 'Hair Salon Dammam', 'Makkah Wellness Spa', 'Kabsa House Restaurant', 'Medina Cafe', 'Taif Fitness Club', 'Khobar Bistro'],
            names: ['Mohammed', 'Abdullah', 'Abdulrahman', 'Faisal', 'Khalid', 'Salman', 'Saud', 'Turki', 'Nasser', 'Nora', 'Sara', 'Lama', 'Hala', 'Reem', 'Asma', 'Maha', 'Nouf', 'Dalal', 'Haifa', 'Sultan', 'Bandar', 'Fahad', 'Nawaf', 'Fatima', 'Aisha', 'Mariam', 'Jawaher', 'Abeer', 'Wafa', 'Abdulaziz', 'Omar', 'Ali', 'Ahmad', 'Youssef', 'Arwa', 'Ghada', 'Lamia', 'Mashael', 'Shahad', 'Razan']
        },
        { 
            name: 'South Africa', 
            flag: '🇿🇦', 
            businesses: ['Cape Town Fitness Gym', 'Braai House Restaurant', 'Johannesburg Beauty Salon', 'Safari Travel Agency', 'Rooibos Tea Cafe', 'Fresh Juice Bar Durban', 'Hair Salon Pretoria', 'Table Mountain Wellness Spa', 'Ubuntu Bistro', 'Soweto Restaurant', 'Port Elizabeth Fitness', 'Bloemfontein Cafe'],
            names: ['Liam', 'Ethan', 'Sipho', 'Thabo', 'Johan', 'Pieter', 'Andile', 'Bongani', 'Kagiso', 'Lerato', 'Naledi', 'Thandiwe', 'Zanele', 'Nomvula', 'Emma', 'Mia', 'Chloe', 'Sarah', 'Jessica', 'David', 'Michael', 'Tshepo', 'Mandla', 'Palesa', 'Lindiwe', 'Ayanda', 'Precious', 'Grace', 'Hope', 'Willem', 'Johannes', 'Sibusiso', 'Themba', 'Neo', 'Khanyi', 'Mbali', 'Nandi', 'Zinhle', 'Thandi', 'Nokuthula']
        },
        { 
            name: 'Italy', 
            flag: '🇮🇹', 
            businesses: ['Roma Fitness Gym', 'Trattoria Milano', 'Salone di Bellezza Venezia', 'Italia Travel Agency', 'Caffè Napoli', 'Succo Fresco Bar', 'Parrucchiere Firenze', 'Toscana Wellness Spa', 'Pizzeria Bella Italia', 'Bologna Restaurant', 'Torino Fitness Club', 'Palermo Cafe'],
            names: ['Francesco', 'Leonardo', 'Alessandro', 'Lorenzo', 'Matteo', 'Andrea', 'Gabriele', 'Riccardo', 'Tommaso', 'Sofia', 'Aurora', 'Giulia', 'Ginevra', 'Alice', 'Emma', 'Giorgia', 'Greta', 'Beatrice', 'Anna', 'Marco', 'Luca', 'Giuseppe', 'Antonio', 'Chiara', 'Martina', 'Sara', 'Francesca', 'Valentina', 'Alessia', 'Davide', 'Federico', 'Simone', 'Filippo', 'Edoardo', 'Elena', 'Elisa', 'Federica', 'Silvia', 'Roberta', 'Claudia']
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
        
        // Generate all possible unique combinations
        countries.forEach(country => {
            country.names.forEach(name => {
                country.businesses.forEach(business => {
                    services.forEach(service => {
                        allCombinations.push({
                            flag: country.flag,
                            name: name,
                            business: business,
                            service: service,
                            country: country.name
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