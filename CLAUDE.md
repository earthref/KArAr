# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Meteor.js web application for the EarthRef.org KArAr FIESTA Data Repository. It provides a React-based frontend for geological K-Ar data management with OpenSearch/Elasticsearch backend integration.

## Development Commands

### Running the Application
```bash
meteor                          # Start development server on localhost:3000
meteor run --settings settings.json  # Run with settings file
meteor run --inspect --settings settings.json  # Run with debug mode
```

### Testing
```bash
# Run tests with watch mode
meteor test --driver-package=meteortesting:mocha --port 3010 --settings settings.json

# Run specific test file (configured in package.json)
npm test

# Mint data DOIs (run tests once)
npm run mint-data-dois
```

### Building and Deployment
```bash
meteor deploy karar.earthref.org --settings settings.json  # Deploy to production
meteor npm update                                          # Update packages
```

### UI Compilation
```bash
npm run build-semantic-ui  # Compile Semantic UI CSS from LESS
```

## Architecture Overview

### Technology Stack
- **Framework**: Meteor.js 2.7.3 with React 16.13.1
- **Database**: MongoDB (via Meteor's mongo package)
- **Search**: OpenSearch/Elasticsearch integration
- **UI**: Semantic UI React components
- **Routing**: React Router 5.x
- **Styling**: LESS with Semantic UI
- **Testing**: Mocha via meteortesting:mocha

### Directory Structure
```
client/
├── app.jsx                 # Main App component with routing
├── main.js                 # Client entry point
├── modules/
│   ├── er/                 # EarthRef common modules
│   └── karar/              # KArAr-specific components
│       ├── routes.jsx      # KArAr routing
│       └── components/     # React components
└── configs/                # Client configuration

server/
├── main.js                 # Server entry point
├── methods/                # Meteor methods
├── publications/           # Meteor publications
└── routes.js               # Server-side routing

lib/
├── collections/            # Shared MongoDB collections
└── modules/                # Shared business logic

tests/                      # Test files using Mocha
```

### Key Application Flow
1. **Routing**: Main app redirects `/` to `/KArAr`, with React Router handling client-side routing
2. **Data Flow**: Meteor publications/subscriptions for real-time data, with OpenSearch for full-text search
3. **Authentication**: Integrated with EarthRef authentication system
4. **File Handling**: AWS S3 integration for file uploads and storage

### Configuration
- `settings.json`: Contains OpenSearch connection details and other runtime configuration
- `.meteor/packages`: Meteor package dependencies
- `package.json`: NPM dependencies including React ecosystem

### Testing Structure
Tests are located in the `/tests` directory and focus on:
- Data DOI functionality (`data_doi.tests.js`)
- Data quality validation (`data_quality.tests.js`) 
- S3 integration (`s3.tests.js`)
- JSON-LD metadata (`json_ld.tests.js`)
- Reference metadata handling (`reference_metadata.tests.js`)

### Key Dependencies
- **@opensearch-project/opensearch**: Search functionality
- **aws-sdk**: File storage and management
- **handsontable**: Spreadsheet-like data editing
- **semantic-ui-react**: UI components
- **react-router-dom**: Client-side routing
- **lodash & underscore**: Utility functions

## Development Notes

- The application requires access to an OpenSearch/Elasticsearch server (configured in settings.json)
- File uploads are handled through AWS S3 integration
- The codebase uses a mix of ES6+ JavaScript and JSX for React components
- Meteor's reactive data system is used for real-time UI updates
- Cross-browser compatibility is tested using BrowserStack