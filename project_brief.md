# Tidhar Portal - SharePoint Framework Project Brief

## Project Overview
**Project Name:** Tidhar Portal  
**Framework:** SharePoint Framework (SPFx) v1.17.3  
**Primary Language:** TypeScript/React  
**Node Version:** 16.13.0  
**Package Manager:** npm  

## Project Structure Summary

### Core Technology Stack
- **SharePoint Framework**: v1.17.3
- **React**: v17.0.1
- **TypeScript**: v5.1.6
- **Fluent UI**: v7.199.1 (@fluentui/react)
- **PnP/SP**: v3.16.0 for SharePoint API operations
- **Build System**: Gulp v4.0.2
- **Bundler**: Webpack v5.88.2

### Key Dependencies
- **UI Components**: @fluentui/react, office-ui-fabric-react
- **SharePoint APIs**: @pnp/sp, @microsoft/sp-* packages
- **Date Handling**: date-fns
- **Form Controls**: react-datepicker, react-select, react-modal
- **Carousel/Slider**: swiper
- **Property Controls**: @pnp/spfx-property-controls

## Component Architecture

### Web Parts (23 total)
The project contains 23 web parts organized into distinct functional areas:

#### Content & Communication
1. **articleSlider** - Article slider/carousel component
2. **gallery** - Image gallery with year filtering
3. **greetings** - Greeting messages system
4. **newEmployees** - New employee showcase
5. **events** - Calendar events display
6. **projects** - Project listing and management

#### User Management & Inquiries
7. **myInquiries** - Personal inquiry management
8. **allMyInquiries** - Extended inquiry view
9. **pendingApproval** - Approval workflow items
10. **allPendingApproval** - Extended approval view
11. **myArchive** - Archived items view
12. **searchContacts** - Contact search functionality
13. **sendUser** - User communication

#### Recognition & Social
14. **thanks** - Appreciation/thanks system
15. **congratulations** - Congratulations messages
16. **allCongratulations** - Extended congratulations view
17. **bringFriends** - Referral system

#### Navigation & Utility
18. **anchorsNav** - Navigation anchors
19. **firstSection** - Landing page section
20. **careerSection** - Career-related content
21. **jobs** - Job listings
22. **systems** - System access/management

### Application Customizers (3 total)
1. **headerExt** - Header customization
2. **footerExt** - Footer customization  
3. **userNameExt** - User name display customization

### Shared Components Structure
- **Components Directory**: Well-organized reusable UI components
- **Services Directory**: API service layers for data operations
- **Interfaces Directory**: TypeScript interfaces and type definitions
- **Assets Directory**: Images, icons, and static resources
- **Utils Directory**: Utility functions and custom hooks

## Key Features & Functionality

### Core Business Functions
- **Employee Portal**: New employee showcase, greetings, recognition
- **Project Management**: Project listings with search capabilities
- **Event Management**: Calendar integration with event registration
- **Inquiry System**: Submit, track, and manage inquiries
- **Approval Workflows**: Pending approval tracking and management
- **Content Management**: Articles, gallery, and content sliders
- **System Integration**: Quick access to various business systems

### Technical Features
- **Responsive Design**: Mobile-first approach with SCSS modules
- **Internationalization**: Hebrew language support (RTL)
- **Custom Fonts**: Custom Almoni and Koteret fonts
- **Modern React Patterns**: Hooks, functional components
- **State Management**: Custom hooks for state management
- **Accessibility**: ARIA compliance and accessibility features
- **Performance**: Code splitting and lazy loading

## Development Environment

### Build Scripts
- `npm start` - Development server (gulp serve)
- `npm run build` - Production build (gulp bundle)
- `npm run clean` - Clean build artifacts
- `npm test` - Run tests

### Key Configuration Files
- **tsconfig.json** - TypeScript configuration
- **config/config.json** - SPFx bundle configuration
- **gulpfile.js** - Build system configuration
- **.eslintrc.js** - Code quality rules

## Deployment & Distribution
- **Target Environment**: SharePoint Online (SPO)
- **Deployment Method**: App Catalog deployment
- **Feature Deployment**: Skip feature deployment enabled
- **Teams Support**: Configured for Teams integration

## Localization
- **Primary Language**: Hebrew (he-IL)
- **Fallback Language**: English (en-US)
- **RTL Support**: Right-to-left layout support

## Notable Technical Decisions
1. **Modular Architecture**: Each web part is self-contained with its own components
2. **Service Layer Pattern**: Centralized API calls through service classes
3. **Custom Hook Usage**: Extensive use of custom hooks for business logic
4. **SCSS Modules**: Component-scoped styling
5. **TypeScript Strict Mode**: Strong typing throughout the application

## Security & Permissions
- **SharePoint API Access**: Uses PnP/SP for secure SharePoint operations
- **User Context**: Leverages SharePoint user context and permissions
- **No Custom Script Required**: Designed to work without custom script permissions

## Maintenance Notes
- **Node Version Constraint**: Requires Node 16.13.0 < 17.0.0
- **SPFx Version**: Locked to v1.17.3 for stability
- **Dependency Management**: Uses package-lock.json for reproducible builds
- **Code Quality**: ESLint configuration for consistent code style

---
*Generated on: 2025-06-29*  
*Last Updated: Project scan completed*
