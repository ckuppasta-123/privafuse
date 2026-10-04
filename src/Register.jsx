import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Hospital,
  UserRound,
  Mail,
  LockKeyhole,
  Phone,
  MapPin,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";
import "./App.css";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    hospitalName: "",
    contactPerson: "",
    email: "",
    phone: "",
    location: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setMessage(
      "Registration form validated! Backend integration comes next."
    );
  }

  return (
    <main className="page">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <section className="login-card register-card">
        <button
          type="button"
          className="back-button"
          onClick={() => (window.location.href = "/")}
        >
          <ArrowLeft size={17} /> Back to Sign In
        </button>

        <div className="register-brand">
          <div className="brand-icon">
            <Hospital size={28} />
          </div>
          <div>
            <h1>Join FL-Health</h1>
            <p>Register your hospital workspace</p>
          </div>
        </div>

        <div className="registration-note">
          <ShieldCheck size={19} />
          <span>
            Collaborate on healthcare AI while protecting patient privacy.
          </span>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="register-field">
            <label htmlFor="hospitalName">Hospital Name</label>
            <div className="input-box">
              <Hospital size={18} />
              <input
                id="hospitalName"
                name="hospitalName"
                placeholder="Enter hospital name"
                value={form.hospitalName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="register-field">
            <label htmlFor="contactPerson">Contact Person</label>
            <div className="input-box">
              <UserRound size={18} />
              <input
                id="contactPerson"
                name="contactPerson"
                placeholder="Full name"
                value={form.contactPerson}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="register-field">
            <label htmlFor="email">Official Email</label>
            <div className="input-box">
              <Mail size={18} />
              <input
                id="email"
                name="email"
                type="email"
                placeholder="name@hospital.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="register-field">
            <label htmlFor="phone">Phone Number</label>
            <div className="input-box">
              <Phone size={18} />
              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="Enter contact number"
                value={form.phone}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="register-field">
            <label htmlFor="location">Hospital Location</label>
            <div className="input-box">
              <MapPin size={18} />
              <input
                id="location"
                name="location"
                placeholder="City, State"
                value={form.location}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="register-field">
            <label htmlFor="password">Create Password</label>
            <div className="input-box">
              <LockKeyhole size={18} />
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Create a password"
                value={form.password}
                onChange={handleChange}
                minLength={8}
                required
              />
            </div>
          </div>

          <div className="register-field">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="input-box">
              <LockKeyhole size={18} />
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Re-enter your password"
                value={form.confirmPassword}
                onChange={handleChange}
                minLength={8}
                required
              />
            </div>
          </div>

          {message && (
            <p className="status-message">{message}</p>
          )}

          <button className="sign-in" type="submit">
            Create Hospital Account <ArrowRight size={18} />
          </button>
        </form>

        <p className="register-footer">
          Already registered?{" "}
          <button
            type="button"
            className="text-button"
            onClick={() => navigate("/")}
          >
            Sign in
          </button>
        </p>
      </section>
    </main>
  );
}
