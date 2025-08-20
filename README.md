# AI Hotel Digital ID Check-in System

Experience the future of hospitality with secure, contactless check-in using Verifiable Credentials and biometric authentication.

## Features

- **Digital Identity Verification**: Secure check-in using Verifiable Credentials
- **Biometric Authentication**: Advanced security with Daon biometric verification
- **QR Code Generation**: Secure QR codes for mobile device interaction
- **Real-time Progress Tracking**: Visual workflow showing each step of the check-in process
- **Responsive Design**: Works seamlessly across all device sizes

## PingOne API Integration

The system integrates with PingOne APIs for secure authentication and QR code generation:

### Authentication Flow
1. **PingOne Token Request**: The system authenticates with PingOne using client credentials
2. **Access Token Retrieval**: Successfully obtains an access token for API operations
3. **QR Code Generation**: Uses the access token to generate secure QR codes (PingDaVinci integration pending)

### API Configuration
- **Environment ID**: `fd4cecf9-f6b6-45da-a0c3-2f8af9874182`
- **Base URL**: `https://auth.pingone.eu`
- **Authentication**: Client Credentials OAuth2 flow

### Error Handling
- Comprehensive error handling with user-friendly toast notifications
- Detailed console logging for debugging
- Timeout protection for API requests
- Graceful fallbacks for failed operations

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```

3. **Open Browser**
   Navigate to `http://localhost:3000`

## Project Structure

```
├── app/                    # Next.js App Router
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── HotelCheckIn.tsx  # Main check-in interface
├── lib/                  # API utilities and configuration
│   ├── api.ts           # PingOne API integration
│   └── config.ts        # API configuration
├── types/                # TypeScript type definitions
└── styles/               # Global CSS and Tailwind
```

## Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS + shadcn/ui
- **Animations**: Framer Motion
- **State Management**: React hooks
- **API Integration**: PingOne OAuth2 + PingDaVinci (pending)

## Development

### Adding New API Endpoints
1. Define types in `types/api.ts`
2. Add API functions in `lib/api.ts`
3. Update configuration in `lib/config.ts`
4. Integrate with components using proper error handling

### Toast Notifications
Use the toast system for user feedback:
```typescript
import { showToast } from '@/components/ui/toast';

showToast('success', 'Operation completed successfully!');
showToast('error', 'Something went wrong');
```

## Security Features

- **OAuth2 Authentication**: Secure token-based authentication
- **Request Timeouts**: Protection against hanging API calls
- **Error Sanitization**: Safe error messages for users
- **Credential Management**: Centralized API configuration

## Future Enhancements

- [ ] PingDaVinci API integration for advanced QR code features
- [ ] Verifiable Credential validation
- [ ] Biometric authentication flow
- [ ] Multi-language support
- [ ] Analytics and monitoring
- [ ] Admin dashboard

## Contributing

1. Follow the established code structure and patterns
2. Use TypeScript strict mode
3. Implement proper error handling
4. Add tests for new functionality
5. Update documentation as needed

## License

This project is licensed under the MIT License.
