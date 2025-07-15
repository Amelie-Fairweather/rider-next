"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Giveride() {
  const [form, setForm] = useState({
    fname: "",
    lname: "",
    kname: "",
    wname: "",
    description: "",
  });

  useEffect(() => {
    setForm((prev) => ({ ...prev, wname: new Date().toDateString() }));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch("https://hooks.airtable.com/workflows/v1/genericWebhook/appjNZtJgj7R7HXr5/wfl5V0hryrH8faqL8/wtr1GAkuJbltYMNe3", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(form),
      });
      window.location = "/redirect";
    } catch {
      window.location = "/redirect";
    }
  };

  return (
    <div>
      <div className="head">
        <div id="snameys">
          <Link href="/" className="button">Take me back!</Link>
        </div>
        <h1>Become a driver!</h1>
      </div>
      <div className="container">
        <div className="middle">
          <h3>What do I need to know?</h3>
        </div>
        <div className="text">
          <p>Good news! In order to become a driver you only need to do 3 things!</p>
          <p>Enter your name, phone number, address and fee! This will allow anyone who needs a ride to contact you! Your address will help them ensure they're reaching out to someone in their area.</p>
          <p>Any other details must be worked out externally, however, feel free to include additional information in the address box.</p>
        </div>
      </div>
    
      
      <div className="sign">
        <h2>Sign up!</h2>
    
      </div>
      <br /><br />
      <form id="loginForm" onSubmit={handleSubmit}>
        <label htmlFor="fname">Full name:</label><br />
        <input type="text" id="fname" name="fname" value={form.fname} onChange={handleChange} /><br /><br />
        <label htmlFor="lname">Phone:</label><br />
        <input type="text" id="lname" name="lname" value={form.lname} onChange={handleChange} /><br /><br />
        <label htmlFor="kname">Fee per mile (include dollar sign):</label><br />
        <input type="text" id="kname" name="kname" value={form.kname} onChange={handleChange} /><br /><br />
        <label htmlFor="wname">date:</label><br />
        <input type="text" id="wname" name="wname" value={form.wname} readOnly /><br /><br />
        <label htmlFor="description">Address:</label><br />
        <textarea id="description" name="description" value={form.description} onChange={handleChange} /><br /><br />
        <input type="submit" value="Sign me up!" />
      </form>
      <div className="bottom">
     
        <p>Thank you!</p>
      </div>
    </div>
  );
} 