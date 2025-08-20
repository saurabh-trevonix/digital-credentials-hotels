# 🏨 AI Hotel Digital ID Check-in System

A sophisticated UI prototype demonstrating the future of hospitality with secure, contactless check-in using Verifiable Credentials and biometric authentication powered by NatWest Digital ID.

## ✨ Features

### 🎯 **Overview Page**
- Beautiful landing page explaining digital identity concepts
- Feature highlights and benefits
- Interactive process flow visualization
- Call-to-action buttons for different experiences

### 🖥️ **Hotel Kiosk System**
- Professional check-in terminal interface
- Real-time QR code generation
- Step-by-step verification workflow
- Progress tracking and status updates
- Credential verification display

### 📱 **Mobile App Simulation**
- NatWest Digital Wallet experience
- Biometric authentication (Face ID/Touch ID)
- Verifiable Credential selection
- Consent management and data sharing
- Complete user journey simulation

## 🚀 **Digital Identity Workflow**

1. **QR Code Generation** - Hotel system displays secure QR codes
2. **Mobile Scanning** - Guests scan with their mobile devices
3. **App Redirect** - NatWest app opens automatically
4. **User Login** - Guest authentication
5. **Biometric Verification** - Face ID/Touch ID verification
6. **VC Selection** - Choose credentials to share
7. **Data Sharing** - Consent and selective information sharing
8. **Real-time Verification** - Instant credential verification
9. **Check-in Complete** - Welcome and room key activation

## 🛠️ **Technology Stack**

- **Frontend Framework**: React 18 with TypeScript
- **Full-stack Framework**: Next.js 14
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **UI Components**: shadcn/ui design system
- **Icons**: Lucide React
- **State Management**: React Hooks
- **Build Tool**: Webpack (Next.js)

## 🎨 **Key Benefits Demonstrated**

- **🔒 Bank-grade Security** - Biometric verification with Verifiable Credentials
- **⚡ Lightning-fast** - 30-second check-in process
- **🤝 Contactless** - Completely hygienic and modern
- **📊 Selective Sharing** - Full consent and data control
- **🔄 Real-time** - Instant credential verification
- **⭐ Premium Experience** - Modern, user-friendly interface

## 🚀 **Getting Started**

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ai-hotel-digital-id-checkin-system.git
   cd ai-hotel-digital-id-checkin-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## 📁 **Project Structure**

```
ai-hotel-digital-id-checkin-system/
├── app/                          # Next.js app directory
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Main page
├── components/                   # React components
│   ├── ui/                      # shadcn/ui components
│   │   ├── badge.tsx           # Badge component
│   │   ├── button.tsx          # Button component
│   │   ├── card.tsx            # Card components
│   │   ├── checkbox.tsx        # Checkbox component
│   │   ├── tabs.tsx            # Tabs component
│   │   └── utils.ts            # Utility functions
│   ├── HotelCheckIn.tsx        # Hotel kiosk system
│   └── MobileAppSimulation.tsx # Mobile app simulation
├── styles/                      # Global styles
│   └── globals.css             # Tailwind CSS and custom styles
├── App.tsx                      # Main application component
├── package.json                 # Dependencies and scripts
├── tailwind.config.js          # Tailwind CSS configuration
├── next.config.js              # Next.js configuration
├── tsconfig.json               # TypeScript configuration
└── README.md                   # Project documentation
```

## 🎭 **Usage Examples**

### Overview Experience
- Navigate through the landing page
- Explore feature cards and benefits
- Understand the complete workflow
- Choose your experience path

### Hotel System Demo
- Experience the kiosk interface
- Generate QR codes
- Follow the verification steps
- Complete the check-in process

### Mobile App Simulation
- Navigate through the mobile interface
- Experience biometric authentication
- Select and share credentials
- Complete the verification flow

## 🔧 **Customization**

### Styling
- Modify `styles/globals.css` for global styles
- Update `tailwind.config.js` for theme customization
- Edit component-specific styles in individual files

### Components
- Add new UI components in `components/ui/`
- Extend functionality in main components
- Modify the workflow steps as needed

### Configuration
- Update `next.config.js` for Next.js settings
- Modify `tsconfig.json` for TypeScript options
- Adjust `package.json` for dependencies

## 📚 **Learning Resources**

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Verifiable Credentials](https://www.w3.org/TR/vc-data-model/)

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 **Acknowledgments**

- **shadcn/ui** - Beautiful UI components
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Lucide** - Beautiful icons
- **Next.js Team** - Amazing React framework

## 📞 **Support**

If you have any questions or need help:
- Open an issue on GitHub
- Check the documentation
- Review the code examples

---

**Built with ❤️ for the future of hospitality and digital identity**
