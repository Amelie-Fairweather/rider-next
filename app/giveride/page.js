"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import PinkLicenseVerification from "../../components/PinkLicenseVerification";

export default function Giveride() {
  const [form, setForm] = useState({
    fname: "",
    lname: "",
    kname: "",
    wname: "",
    description: "",
  });
  const [showCarAnimation, setShowCarAnimation] = useState(false);
  const [licenseVerified, setLicenseVerified] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);

  useEffect(() => {
    setForm((prev) => ({ ...prev, wname: new Date().toDateString() }));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if license is verified
    if (!licenseVerified) {
      alert("Please verify your driver's license first!");
      return;
    }
    
    // Check if verification score is acceptable (minimum 60)
    if (verificationResult && verificationResult.safety_score < 60) {
      alert("License verification failed. Please try again with clearer images.");
      return;
    }
    
    // Show the car animation
    setShowCarAnimation(true);
    
    try {
      await fetch("https://hooks.airtable.com/workflows/v1/genericWebhook/appjNZtJgj7R7HXr5/wfl5V0hryrH8faqL8/wtr1GAkuJbltYMNe3", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(form),
      });
      
      // Wait for animation to complete, then redirect
      setTimeout(() => {
        window.location = "/redirect";
      }, 3000);
    } catch {
      // Still show animation even if submission fails
      setTimeout(() => {
        window.location = "/redirect";
      }, 3000);
    }
  };

  return (
    <div>
              <div className="head" style={{
                backgroundImage: 'url(/star-pattern.png)',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                padding: '30px',
                borderRadius: '15px',
                marginBottom: '20px',
                boxShadow: '0 4px 20px rgba(255,182,193,0.2)'
              }}>
                <div id="snameys">
                  <Link href="/" className="button">Take me back!</Link>
                </div>
                <h1>Become a driver!</h1>
              </div>
      <div className="container">
        <div className="middle">
          <h3>What do I need to know?</h3>
        </div>
        <div className="text" style={{
          lineHeight: '1.8',
          fontSize: '16px',
          maxWidth: '600px',
          margin: '0 auto',
          padding: '20px 0'
        }}>
          <p style={{ marginBottom: '20px' }}>Good news! In order to become a driver you only need to do 4 things!</p>
          <p style={{ marginBottom: '20px' }}>First, we require a simple liscence verification. Then, enter your name, phone number, address and fee! This will allow anyone who needs a ride to contact you! Your address will help them ensure they're reaching out to someone in their area (It can just be your town if that feels more comfortable).</p>
          <p style={{ marginBottom: '20px' }}>Feel free to include any other details in the address box. Also note that the phone number you provide will be users way of contacting you!</p>
        </div>
      </div>
    
      
      <div className="sign">
        <h2>License Verification Required</h2>
        <p style={{ color: "#666", marginBottom: "20px" }}>
          Please upload your driver's license and a photo of yourself for verification.
        </p>
        
        <PinkLicenseVerification 
          onVerificationComplete={(result) => {
            setVerificationResult(result);
            setLicenseVerified(true);
          }}
          onVerificationError={() => {
            setLicenseVerified(false);
            setVerificationResult(null);
          }}
        />
        
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
        <label htmlFor="description">Town:</label><br />
        <textarea id="description" name="description" value={form.description} onChange={handleChange} /><br /><br />
        <input 
          type="submit" 
          value={licenseVerified ? "Sign me up!" : "Complete License Verification First"} 
          disabled={!licenseVerified}
          style={{
            backgroundColor: licenseVerified ? "#ffb6c1" : "#ccc",
            cursor: licenseVerified ? "pointer" : "not-allowed",
            opacity: licenseVerified ? 1 : 0.6
          }}
        />
      </form>
      <div className="bottom">
     
        <p>Thank you!</p>
      </div>

      {/* Pink Car Animation */}
      {showCarAnimation && (
        <div style={{
          position: "fixed",
          top: "50%",
          left: "-200px",
          transform: "translateY(-50%)",
          zIndex: 9999,
          animation: "driveBy 3s ease-in-out forwards"
        }}>
          <div style={{
            position: "relative",
            width: "120px",
            height: "60px",
            animation: "bounce 0.6s ease-in-out infinite alternate"
          }}>
            {/* Custom Pink Car with White Windows */}
            <div style={{
              width: "120px",
              height: "40px",
              backgroundColor: "#ffb6c1",
              borderRadius: "20px 5px 5px 20px",
              position: "relative",
              boxShadow: "3px 3px 6px rgba(255,182,193,0.5)",
              transform: "scaleX(-1)"
            }}>
              {/* White Windows */}
              <div style={{
                position: "absolute",
                top: "5px",
                left: "15px",
                width: "25px",
                height: "25px",
                backgroundColor: "white",
                borderRadius: "3px",
                opacity: "0.9"
              }}></div>
              <div style={{
                position: "absolute",
                top: "5px",
                left: "45px",
                width: "35px",
                height: "25px",
                backgroundColor: "white",
                borderRadius: "3px",
                opacity: "0.9"
              }}></div>
              <div style={{
                position: "absolute",
                top: "5px",
                left: "85px",
                width: "25px",
                height: "25px",
                backgroundColor: "white",
                borderRadius: "3px",
                opacity: "0.9"
              }}></div>
            </div>
            {/* Wheels */}
            <div style={{
              position: "absolute",
              bottom: "0px",
              left: "15px",
              width: "15px",
              height: "15px",
              backgroundColor: "#333",
              borderRadius: "50%",
              transform: "scaleX(-1)"
            }}></div>
            <div style={{
              position: "absolute",
              bottom: "0px",
              right: "15px",
              width: "15px",
              height: "15px",
              backgroundColor: "#333",
              borderRadius: "50%",
              transform: "scaleX(-1)"
            }}></div>
          </div>
          <div style={{
            position: "absolute",
            top: "-50px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "linear-gradient(135deg, #ffb6c1, #ff91a4)",
            color: "white",
            padding: "12px 20px",
            borderRadius: "25px",
            fontSize: "18px",
            fontWeight: "bold",
            whiteSpace: "nowrap",
            animation: "fadeInOut 3s ease-in-out",
            boxShadow: "0 4px 15px rgba(255,182,193,0.4)",
            border: "2px solid rgba(255,255,255,0.3)"
          }}>
            ✨ You're signed up!!! ✨
          </div>
        </div>
      )}

      {/* CSS Animation Styles */}
      <style jsx>{`
        @keyframes driveBy {
          0% {
            left: -200px;
          }
          50% {
            left: 50%;
            transform: translateX(-50%) translateY(-50%);
          }
          100% {
            left: calc(100% + 200px);
            transform: translateX(-50%) translateY(-50%);
          }
        }

        @keyframes fadeInOut {
          0% {
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          80% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }

        @keyframes bounce {
          0% {
            transform: translateY(0px);
          }
          100% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </div>
  );
} 