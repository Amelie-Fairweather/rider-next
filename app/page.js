"use client";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className="header">
        <div id="sname">
          <h1>RIDE</h1>
        </div>
        <h3 style={{ marginTop: 40, fontWeight: 600 }}>
          Lets get you where you need to go
        </h3>
      </div>
      <div className="container">
        <div className="what">
          <h3 style={{ fontWeight: 600, fontSize: 28, marginTop: 40, marginBottom: 40 }}>What is Ride?</h3>
        </div>
        <div className="middle" style={{ maxWidth: 900, margin: "0 auto", fontSize: 18 }}>
          <p>
            As a student at my local public high school, and one who participates in many extracurricular activities, I noticed many parents (including my own) were extremely stressed out trying to find rides for their children.
          </p>
          <p>
            Many kids who only have one parent, really busy schedules, or only one car, had to miss practices or other after school activities. Ride solves this problem. Rather than forcing parents to find a break in their schedule, or paying for Ubers, Ride allows parents too organize carpools or find other people driving in the area.
          </p>
          <p>Use Ride to get you where you need to go</p>
        </div>
        <div style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center", marginTop: 40 }}>
          <div className="buttons" style={{ display: "flex", gap: 32 }}>
            <Link href="/needride" className="button">need a ride ?</Link>
            <Link href="/giveride" className="button">I can drive!</Link>
          </div>
        </div>
      </div>
      <div style={{ marginTop: 80, marginBottom: 24, textAlign: "center", fontSize: 18 }}>
        for any issues, please contact me at 802-489-8855
      </div>
    </>
  );
}
