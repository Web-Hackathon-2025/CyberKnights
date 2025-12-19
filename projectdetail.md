# Karigar

## Context & Background
Finding reliable "Karigar" (local service providers such as plumbers, electricians, tutors, cleaners, or technicians) is often difficult. People rely on word of mouth, scattered Facebook groups, unanswered phone calls, or unverified listings. On the other hand, skilled service providers struggle to reach nearby customers and manage service requests and bookings efficiently.

There is a need for a **centralized, location-aware web platform** that connects users with nearby service providers in a **transparent, efficient, and user-friendly manner**.

---

## Problem Statement
Design and implement a **Hyperlocal Services Marketplace Web Application** named **Karigar** that allows users to discover, evaluate, and submit service requests to nearby service providers, while enabling service providers to manage their profiles, availability, and incoming requests.

The platform should balance **simplicity, usability, and scalability**, and handle real-world scenarios such as **availability conflicts, cancellations, and user feedback**.

This problem is intentionally open-ended. Teams are expected to define the **scope**, prioritize **features**, and make smart **technical and product trade-offs** within the given time.

---

## Key Users
The system should consider at least three roles:

1. **Customers** – People looking for local services  
2. **Service Providers** – Individuals or businesses offering services  
3. **Admin** – For moderation and platform oversight (**optional**, bonus points)

---

## High-Level Functional Expectations

### Customer Side
- Browse or search service providers by category and location  
- View service provider profiles (services offered, pricing, availability, ratings)  
- Submit a service request  
- Track request/booking status  
- Submit reviews or ratings after service completion  

### Service Provider Side
- Create and manage a service profile  
- Define services, pricing, and availability  
- Accept, reject, or reschedule service requests  
- View booking history (confirmed requests)  

### Admin Side
- View and manage all users (customers and service providers)  
- Approve, suspend, or remove service provider accounts  
- Monitor and manage service listings  
- View and moderate reviews or ratings  
- Handle reported issues or disputes between users  
- View platform-level activity and basic usage metrics  

### Platform-Level
- Authentication and role-based access  
- Service request & booking workflow (requested → confirmed → completed → cancelled)  
- Data consistency and validation  

---

## Non-Functional Expectations
- Clean and intuitive user experience  
- Logical data modeling  
- Well-structured codebase with clear organization of all components  
- Error handling and edge cases  
- Scalability considerations (even if not fully implemented)  

---

## Technical Guidelines
- Free to choose any technology stack  
- Any web framework or language is allowed  
- Encouraged to use AI tools (e.g., v0, Cursor, Claude, GPT, or Gemini) to boost productivity  
- Use of boilerplate code is allowed only for UI components (e.g., basic layouts, buttons, forms)  
