import type { Project } from "@/types";
import { Callout, Metrics, Prose } from "@/components/projects/case-study";

export const meta: Project = {
  slug: "medygo",
  title: "Medygo — Doctor Appointment System",
  summary:
    "A role-based doctor appointment platform where patients book slots by speciality, doctors accept or reject requests, and admins manage the doctor roster.",
  year: 2026,
  role: "Full-Stack Developer",
  featured: true,
  cover: "/images/projects/medygo.png",
  stack: [
    "React",
    "Node.js",
    "Express",
    "MongoDB",
    "Mongoose",
    "JWT",
    "Tailwind CSS",
  ],
  tags: ["Full Stack", "Healthcare", "MERN", "Dashboard"],
  links: {
    live: "https://example.com",
    repo: "https://github.com/dhruwvaviya999/medygo",
  },
};

export function MedygoCaseStudy() {
  return (
    <Prose>
      <h2>Overview</h2>
      <p>
        Medygo is a full-stack doctor appointment system that connects{" "}
        <strong>patients</strong>, <strong>doctors</strong>, and{" "}
        <strong>admins</strong> in one place. Patients create an account, browse
        doctors by speciality, pick an available time slot, and book an
        appointment. Doctors review incoming requests and either{" "}
        <strong>accept</strong> or <strong>reject</strong> them, while admins run
        the platform from a dedicated dashboard.
      </p>
      <p>
        The app is built around three distinct roles. Patients and doctors share
        the same frontend with role-aware views, while admins get a separate
        interface for managing the doctor roster end to end.
      </p>

      <h2>Problem</h2>
      <p>
        Booking a doctor&apos;s appointment is still often a phone call, a
        waiting room, or a manual register. There&apos;s no easy way for patients
        to see which doctors are available, filter by speciality, or pick a slot
        that actually works for them — and no clean way for clinics to keep their
        list of practising doctors accurate and up to date.
      </p>

      <h2>Roles</h2>
      <ul>
        <li>
          <strong>Patient.</strong> Signs up, logs in, finds doctors by
          speciality, selects an open slot, and books an appointment.
        </li>
        <li>
          <strong>Doctor.</strong> Logs in to see appointment requests and
          accepts or rejects each one.
        </li>
        <li>
          <strong>Admin.</strong> Uses a separate frontend to add, update, and
          delete doctors and to toggle them active or inactive.
        </li>
      </ul>

      <h2>Challenges</h2>
      <ul>
        <li>
          <strong>Role-based access.</strong> Three roles — patient, doctor, and
          admin — each needed different permissions and views over shared data.
        </li>
        <li>
          <strong>Slot management.</strong> Appointment slots had to stay
          accurate so two patients could never book the same time with the same
          doctor.
        </li>
        <li>
          <strong>Separate admin surface.</strong> Admins needed their own
          frontend, kept cleanly apart from the patient and doctor experience.
        </li>
        <li>
          <strong>Doctor lifecycle.</strong> Admins had to add, edit, remove, and
          activate or deactivate doctors without breaking existing appointments.
        </li>
      </ul>

      <h2>Solution</h2>
      <p>
        Medygo is built on the <strong>MERN</strong> stack. The frontend is a{" "}
        <strong>React</strong> single-page app styled with{" "}
        <strong>Tailwind CSS</strong>, and the backend is a{" "}
        <strong>Node.js</strong> and <strong>Express</strong> REST API.{" "}
        <strong>MongoDB</strong> with <strong>Mongoose</strong> models users,
        doctors, and appointments, and <strong>JWT</strong> handles
        authentication and role-based authorization.
      </p>
      <p>
        Patients and doctors authenticate against the same app and are routed to
        the right views based on their role, while admins sign in to a separate
        frontend that exposes the doctor-management tools.
      </p>

      <Callout type="info" title="Why split the admin frontend">
        Keeping the admin interface separate from the patient/doctor app keeps
        each surface focused: patients see booking, doctors see requests, and
        admins get full control over the doctor roster without that complexity
        leaking into the public experience.
      </Callout>

      <h2>Architecture</h2>
      <ul>
        <li>React frontend for patients and doctors with role-aware routing.</li>
        <li>Separate React admin frontend for doctor management.</li>
        <li>Node.js + Express REST API for all business logic.</li>
        <li>MongoDB with Mongoose schemas for users, doctors, and appointments.</li>
        <li>JWT-based authentication with role-based authorization middleware.</li>
        <li>Slot validation to prevent double-booking the same doctor.</li>
      </ul>

      <h2>Key Features</h2>
      <ul>
        <li>Patient account creation and secure login.</li>
        <li>Browse and filter doctors by speciality.</li>
        <li>Slot-based appointment booking.</li>
        <li>Doctors accept or reject appointment requests.</li>
        <li>Admin dashboard to add, update, and delete doctors.</li>
        <li>Toggle doctors active or inactive from the admin panel.</li>
        <li>Role-based access across patient, doctor, and admin.</li>
        <li>Responsive UI that works across devices.</li>
      </ul>

      <h2>Tech Stack</h2>
      <p>
        Medygo uses <strong>React</strong> and <strong>Tailwind CSS</strong> on
        the frontend, with <strong>Node.js</strong> and{" "}
        <strong>Express</strong> powering the API. <strong>MongoDB</strong> and{" "}
        <strong>Mongoose</strong> handle the data layer, and <strong>JWT</strong>{" "}
        secures authentication and role-based access.
      </p>

      <h2>Results</h2>
      <Metrics
        items={[
          { label: "Booking", value: "Phone calls → online slots" },
          { label: "Doctor discovery", value: "Manual → filter by speciality" },
          { label: "Appointment flow", value: "Ad hoc → accept / reject" },
          { label: "Roster control", value: "Static → admin-managed" },
        ]}
      />

      <Callout type="success" title="Outcome">
        Medygo turns appointment booking into a clear, self-service flow for
        patients while giving doctors control over their schedule and admins full
        oversight of the doctor roster.
      </Callout>

      <h2>Future Improvements</h2>
      <ul>
        <li>Email and SMS reminders for upcoming appointments.</li>
        <li>Online payments for consultation fees.</li>
        <li>Video consultations and prescription history.</li>
      </ul>
    </Prose>
  );
}
