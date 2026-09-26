const fs = require('fs');
const path = require('path');

const pages = [
  { file: 'ShippingPolicy.jsx', comp: 'ShippingPolicyPage' },
  { file: 'CancellationPolicy.jsx', comp: 'CancellationPolicyPage' },
  { file: 'CookiePolicy.jsx', comp: 'CookiePolicyPage' },
  { file: 'ReturnExchangePolicy.jsx', comp: 'RefundPolicyPage' },
  { file: 'IntellectualProperty.jsx', comp: 'IntellectualPropertyPage' },
  { file: 'Disclaimer.jsx', comp: 'DisclaimerPage' },
  { file: 'Craftsmanship.jsx', comp: 'CraftsmanshipPage' },
  { file: 'Sustainability.jsx', comp: 'SustainabilityPage' },
  { file: 'ProductCare.jsx', comp: 'ProductCarePage' },
  { file: 'Blogs.jsx', comp: 'BlogsPage' },
  { file: 'StoreLocations.jsx', comp: 'StoreLocationsPage' },
  { file: 'Careers.jsx', comp: 'CareersPage' },
  { file: 'BulkOrders.jsx', comp: 'BulkOrdersPage' },
  { file: 'Styling.jsx', comp: 'StylingPage' },
  { file: 'Appointments.jsx', comp: 'AppointmentsPage' },
];

pages.forEach(p => {
  const content = `import { ${p.comp} } from './_PolicyPages'\nexport default function ${p.file.replace('.jsx', '')}() { return <${p.comp} /> }\n`;
  fs.writeFileSync(path.join('c:/Training/AGVIA/AGVIA  - FRONTEND/src/pages/customer', p.file), content);
});
