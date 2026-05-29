# farewell-tombstones

1. Modern CSS with 3D Effects (styles.css)
8 smooth animations: fade-in, slide-in, float, pulse, shimmer
3D transforms on cards: perspective, rotateX, rotateY, translateZ
Hover effects with depth and scale transformations
Gradient backgrounds on text and buttons
Enhanced shadows with multiple layers
Responsive design optimized for all devices

2. Enhanced Homepage (index.html)
Modern hero section with 3D visual card
Updated product cards with pricing
Better section organization with emoji icons
Improved contact form with phone field
Enhanced call-to-action buttons

3. 3D Gallery (gallery.html)
3D gallery grid with interactive hover effects
Rotating cards with text overlays on hover
Customer testimonials section with ratings
Facebook integration
Professional animations on all elements

4. Restructured Order System (order.html)
The most important update with complete product catalog:

## Memorial Types (9 categories):

Standard Grave Markers (Kids/Adult/Premium)
Full Slab Stones (Kids/Adult/Premium)
Premium Monuments (Classic/Modern/Luxury)
Services Showcase:

Engraving Services
Material Selection
Custom Design
Repair & Restoration
Decorative Accessories
Installation & Delivery
Comprehensive Order Form with fields for:

Memorial category selection
Stone material (7 options)
Size selection
Personalization & engravings
Special requests
Delivery options
Customer contact info

## Key Features Across All Pages
✓ Modern gradient backgrounds
✓ Smooth fade-in & slide-in animations
✓ 3D card hover effects with perspective
✓ Interactive elements with visual feedback
✓ Professional typography hierarchy
✓ Mobile-responsive design
✓ Transparent pricing structure
✓ Clear service differentiation


## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the local server:

   ```bash
   npm start
   ```

3. Open `http://localhost:3000/index.html` in your browser.

<!-------- ## Notes

- Contact and order submissions are handled by the backend at `/api/contact` and `/api/order`.
- Submitted requests are now stored in a local SQLite database for safer client detail storage.
- The gallery page includes a Facebook page plugin to surface photos from the client Facebook page.
- Admin login is available at `/admin.html` for instant order/customer viewing and materials management.
- Environment variables are supported via a `.env` file to configure the server port, database path, and admin credentials.

-------->

## Environment

Copy `.env.example` to `.env` and update values as needed.

Example:

```bash
PORT=3000
DB_PATH=./data/farwell.db
```

The project also uses `.gitignore` to protect local environment files and database storage when editing or sharing the repo.



## Project Summary
A responsive, full-stack memorial website with landing page, gallery, order system, and admin dashboard. Built with modern web technologies for desktop and mobile compatibility.

## WEBSITE FEATURES & RECOMMENDATIONS

### Current State
✓ Functional website with contact form
✓ Basic order system
✓ Admin dashboard for order management
✓ Responsive mobile design


## TECHNICAL RECOMMENDATIONS

### Frontend Technologies
- Modern CSS with 3D transforms and animations
- HTML5 semantic structure
- JavaScript for interactive features
- Responsive design for all devices

### Backend Enhancement
- Keep existing Node.js/Express server
- Expand database schema for:
  - Multiple product categories
  - Service types and pricing
  - Material inventory
  - Customer order history

### Database Structure
```
Products
├── ID, Name, Description
├── Category (Marker, Slab, Monument, etc.)
├── Price, Materials
└── Customization options

Services
├── ID, Name, Description
├── Price, Duration
└── Category (Repair, Custom, Installation)

Customers
├── ID, Name, Email, Phone
├── Order History
└── Preferences

Orders
├── ID, Customer ID
├── Products & Services
├── Materials & Customizations
├── Total Price
└── Status & Timeline
```


### Website Components
1. ✓ Homepage with 3D hero section
2. ✓ Modern gallery with 3D effects
3. ✓ Structured product catalog with pricing
4. ✓ Services page with detailed offerings
5. ✓ Order system with customization
6. ✓ Customer testimonials section
7. ✓ FAQs and information hub
8. ✓ Admin dashboard for order management
9. ✓ Mobile-responsive design
10. ✓ SEO optimization

11. ### Proposed Enhancements

#### 1. **Modern Visual Design**
- [x] 3D animations on product showcases
- [x] Interactive 3D gallery with hover effects
- [x] Smooth scroll animations
- [x] Modern color scheme (sophisticated greys, blacks, golds)
- [x] Professional typography with better hierarchy

#### 2. **Enhanced Gallery**
- [x] 3D carousel/gallery view
- [x] Product detail overlays
- [x] Before/after comparison sliders
- [x] Customer testimonials with images
- [x] Video showcase capability

#### 3. **Improved Product Ordering**
- [ ] Structured product selection (categories, sizes)
- [ ] Real-time price calculator
- [ ] Material selection with preview
- [ ] Customization options selector
- [ ] Add-ons/accessories section
- [ ] Quantity and timeline options

#### 4. **Services Showcase**
- [ ] Dedicated services page
- [ ] Service pricing & packages
- [ ] Repair/restoration portfolio
- [ ] Custom design process explanation
- [ ] Timeline estimator

#### 5. **User Experience Improvements**
- [x] Testimonials section with images
- [x] FAQs about products and services
- [ ] Material comparison guide
- [ ] Design consultation booking system
- [ ] Live chat support option

---

