# Atlas - AI Chatbot Interface

A beautiful Next.js application featuring a dark mode interface with a modern AI chatbot.

## Features

- 🌙 **Dark Mode Only**: Sleek dark interface with animated gradients
- 💬 **Chatbot Interface**: Central chat input with a modern, gradient-styled send button
- ✨ **Smooth Animations**: Polished UI with smooth transitions and effects
- 🎨 **Modern Design**: Gradient text, glassmorphism effects, and custom scrollbars

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Navigate to the project directory:
```bash
cd atlas
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

- **Chat**: Type your message in the input box and click "Send" or press Enter
- **Responsive**: The interface adapts to different screen sizes
- **Smooth Interactions**: Enjoy smooth animations and hover effects

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Fonts**: Geist Sans & Geist Mono

## Project Structure

```
atlas/
├── src/
│   ├── app/
│   │   ├── page.tsx          # Main page component
│   │   ├── layout.tsx         # Root layout
│   │   └── globals.css        # Global styles and animations
│   └── components/
│       └── ChatBot.tsx        # Chatbot interface component
├── public/                    # Static assets
└── package.json              # Dependencies
```

## Customization

### Change Colors

Update the Tailwind classes or CSS variables in `src/app/globals.css` to customize the color scheme.

### Bot Responses

Modify the `handleSend` function in `src/components/ChatBot.tsx` to customize chatbot responses.

### Styling

Update the Tailwind classes in `src/components/ChatBot.tsx` to modify the chatbot interface appearance.

## Build for Production

```bash
npm run build
npm start
```

## License

This project is open source and available under the MIT License.

## Credits

Created with ❤️ using Next.js, TypeScript, and Tailwind CSS
