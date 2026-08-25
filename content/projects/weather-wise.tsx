import type { Project } from "@/types";
import { Callout, Prose } from "@/components/projects/case-study";

export const weatherWise: Project = {
  slug: "weather-wise",
  title: "Weather Wise",
  summary:
    "A clean React weather app — search any city and get its current conditions back instantly, fetched live from a weather API.",
  year: 2025,
  role: "Frontend Developer",
  featured: false,
  cover: "/images/projects/weather-wise.png",
  stack: ["React", "Vite", "Axios", "JavaScript"],
  tags: ["Frontend", "React", "API"],
  links: {
    repo: "https://github.com/Dhruwvaviya999/weather-app",
    live: "https://weatherwise-ui.vercel.app",
  },
};

export function WeatherWiseCaseStudy() {
  return (
    <Prose>
      <h2>Overview</h2>
      <p>
        Weather Wise is a focused frontend app that does one thing well: the
        user searches for a city, and the app fetches and displays that
        city&apos;s current weather. Built with <strong>React</strong> and{" "}
        <strong>Vite</strong>, with <strong>Axios</strong> handling the API
        requests.
      </p>

      <h2>Challenges</h2>
      <ul>
        <li>
          <strong>Async state.</strong> Every search is a network request, so
          the UI needed clear loading and error states rather than a blank
          screen.
        </li>
        <li>
          <strong>Bad input.</strong> Misspelled or non-existent cities return
          an error from the API, and that had to surface as a readable message.
        </li>
      </ul>

      <h2>Solution</h2>
      <p>
        The app is a single-page <strong>React</strong> build served by{" "}
        <strong>Vite</strong>. A search submits the city name,{" "}
        <strong>Axios</strong> calls the weather API, and the response renders
        into the conditions view. Loading and error states are driven by React
        state so the interface always reflects what the request is doing.
      </p>

      <Callout type="info" title="Scope as a feature">
        No routing, no state library, no component framework — just React and a
        HTTP client. Keeping the dependency list to three packages kept the app
        fast and the code easy to follow.
      </Callout>

      <h2>Key Features</h2>
      <ul>
        <li>Search weather by city name.</li>
        <li>Live data fetched from a weather API via Axios.</li>
        <li>Loading and error states for every request.</li>
        <li>Responsive layout that works on mobile and desktop.</li>
      </ul>

      <h2>Tech Stack</h2>
      <p>
        <strong>React</strong> for the UI, <strong>Vite</strong> for the dev
        server and build, and <strong>Axios</strong> for fetching weather data.
        Deployed on Vercel.
      </p>

      <h2>Future Improvements</h2>
      <ul>
        <li>Multi-day forecast alongside current conditions.</li>
        <li>Geolocation to load local weather on first visit.</li>
        <li>Saved favourite cities.</li>
      </ul>
    </Prose>
  );
}
