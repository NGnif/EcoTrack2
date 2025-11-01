# **App Name**: EcoTrack

## Core Features:

- Activity Logging: Log daily activities across transport, home energy, and diet with specific input fields for each category.
- CO₂e Calculation: Calculate the estimated CO₂e emissions for each logged activity using stored and versioned emission factors; the emission factors act as a tool for calculating the correct values.
- Personalized Tips: Provide personalized tips to users based on their logged activities and calculated carbon footprint, focusing on areas with the highest impact.
- Firebase Authentication: Implement user authentication using Firebase Auth with email/password for secure access and data protection.
- Data Visualization: Display weekly total carbon footprint as charts and highlight the top contributing category.
- History Tracking: Allow users to view their activity logging history, including past CO₂e emissions.
- Settings: Let users to manage their profile and app settings.

## Style Guidelines:

- Primary color: Forest green (#388E3C), evokes nature, growth, and sustainability.
- Background color: Light beige (#F5F5DC), offering a neutral and calming backdrop that doesn't distract from the data.
- Accent color: Soft teal (#80CBC4), complementing the green and adding a touch of sophistication.
- Body and headline font: 'PT Sans', a humanist sans-serif, for a modern and clean aesthetic suitable for all text elements.
- Use flat, minimalist icons in the primary green color to represent different activity types (transport, energy, diet).
- Mobile-first, responsive design using Tailwind CSS grid and flexbox to ensure usability across various screen sizes.
- Subtle transitions and animations to enhance user experience, like a smooth chart rendering or feedback when logging activities.