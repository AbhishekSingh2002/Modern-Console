# Widget Selector Dashboard

A customizable widget dashboard built with React that allows users to select, reorder, and view different widgets such as weather, news, finance, GitHub, and movie information. It features drag-and-drop functionality, persistent widget ordering with `localStorage`, and smooth animations powered by `framer-motion`.

## Features

- **Drag and Drop**: Reorder widgets using the drag-and-drop interface.
- **Persistent Widget Order**: Widget arrangement is saved in `localStorage`, so the user’s preferred order is remembered across page reloads.
- **Widget Selection**: Click on a widget to view relevant information, such as weather details, news, finance updates, and more.
- **Reset to Default**: Reset the widgets to their default arrangement with a single button.
- **Smooth Animations**: Widgets animate smoothly with `framer-motion` when being reordered or interacted with.
- **Responsive Design**: The dashboard is designed to work across different screen sizes, ensuring a seamless experience on both mobile and desktop.

## Technologies Used

- **React**: JavaScript library for building user interfaces.
- **Framer Motion**: A popular library for animations in React.
- **React DnD**: For implementing the drag-and-drop functionality.
- **Tailwind CSS**: For utility-first styling, making the UI responsive and customizable.
- **TypeScript**: For type safety and improved developer experience.
- **Next.js**: Framework for React applications (if you're using it for your project setup).
- **Lucide Icons**: A set of open-source icons used for widget icons (e.g., Weather, News, etc.).

## Setup

### Prerequisites

Before starting, ensure that you have the following installed:

- **Node.js** (v16 or higher)
- **npm** or **yarn** (for managing dependencies)

### Installation

1. Clone this repository to your local machine:
   ```bash
   git clone https://github.com/your-username/widget-selector-dashboard.git
   cd widget-selector-dashboard
Install dependencies using npm or yarn:

bash
Copy code
npm install
or

bash
Copy code
yarn install
Start the development server:

bash
Copy code
npm run dev
or

bash
Copy code
yarn dev
Open your browser and visit http://localhost:3000 to view the app.

How It Works
1. Widget Selector
The WidgetSelector component is the main component of the dashboard, allowing users to drag and drop widgets in any order. It supports the following widgets:

Weather
News
Finance
GitHub
Movies
Each widget has a corresponding icon and title. Users can click on any widget to select it, which triggers the onSelect function, allowing you to show more detailed information (e.g., weather details, latest news, etc.).

2. Widget Reordering
Widgets can be reordered by dragging and dropping them within the grid. The current order is saved in localStorage, ensuring that even after a page refresh, the widget arrangement persists.

3. Default Widget Layout
You can reset the widget layout back to its default state using the Reset to Default button. This clears any custom widget arrangements and restores the default configuration.

4. Widget Content
Each widget is interactive:

Weather: Displays current weather data based on the user's city input, fetched from the Open Meteo API.
News: Fetches the latest news articles.
Finance: Displays stock data using the Alpha Vantage API.
GitHub: Shows GitHub repositories and stats from a user's GitHub account.
Movies: Displays information about movies using an external movie API (e.g., OMDB).
Customization
Styling: You can modify the widget styles by editing the Tailwind CSS classes.
Widget Types: The WidgetType enum is defined, and you can add more widget types as required.
Icons: You can customize the widget icons by modifying the icons object.
Example Widget Data
Weather: Fetches temperature, wind speed, and other weather-related data based on the city entered.
News: Displays the most recent news headlines from an external news API.
Finance: Fetches stock data and financial insights.
GitHub: Retrieves a user's public GitHub repositories.
Movies: Shows movie-related data (e.g., titles, ratings, descriptions) from an external movie API.
Contribution
Fork the repository.
Create a new branch (git checkout -b feature-name).
Commit your changes (git commit -am 'Add new feature').
Push to the branch (git push origin feature-name).
Create a new Pull Request.
License
This project is licensed under the MIT License - see the LICENSE file for details.

