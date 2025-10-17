"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { getOrCreateRoom } from "../../lib/roomManager";
import LoginButton from "../../components/LoginButton";

export default function Needride() {
  const { data: session, status } = useSession();
  const [drivers, setDrivers] = useState([]);
  const [filteredDrivers, setFilteredDrivers] = useState([]);
  const [selectedTown, setSelectedTown] = useState('all');
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  
  const towns = [
    'Charlotte', 'Shelburne', 'Hinesburg', 'Williston', 'Colchester', 
    'Burlington', 'South Burlington', 'Jericho', 'Middlebury', 
    'Ferrisburg', 'Winooski', 'Other'
  ];

  useEffect(() => {
    // Fetch drivers from Airtable
    fetch(`https://api.airtable.com/v0/${process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID}/ride`, {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_AIRTABLE_API_KEY}`
      }
    })
      .then(res => res.json())
      .then(records => {
        setDrivers(records.records || []);
        setFilteredDrivers(records.records || []);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  // Filter drivers by selected town
  useEffect(() => {
    if (selectedTown === 'all') {
      setFilteredDrivers(drivers);
    } else {
      const filtered = drivers.filter(driver => {
        const address = driver.fields.address?.toLowerCase() || '';
        const townLower = selectedTown.toLowerCase();
        
        // Check if the address contains the selected town
        return address.includes(townLower);
      });
      
      // Sort so drivers with exact town match come first
      const sortedFiltered = filtered.sort((a, b) => {
        const aAddress = a.fields.address?.toLowerCase() || '';
        const bAddress = b.fields.address?.toLowerCase() || '';
        const townLower = selectedTown.toLowerCase();
        
        const aExactMatch = aAddress.includes(townLower);
        const bExactMatch = bAddress.includes(townLower);
        
        if (aExactMatch && !bExactMatch) return -1;
        if (!aExactMatch && bExactMatch) return 1;
        return 0;
      });
      
      setFilteredDrivers(sortedFiltered);
    }
  }, [selectedTown, drivers]);

  // Function to handle chat button click
  const handleChatClick = async (driver) => {
    setIsCreatingRoom(true);
    try {
      console.log('Creating/Getting room for driver:', driver.fields.Name);
      
      // Use simple identifiers without authentication
      const driverId = `driver_${driver.id || driver.fields.Name}`;
      const driverName = driver.fields.Name;
      const riderId = `rider_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`; // Generate unique rider ID
      const riderName = 'Rider'; // Generic rider name
      
      console.log('Driver ID:', driverId);
      console.log('Rider ID:', riderId);
      
      const room = await getOrCreateRoom(driverId, driverName, riderId, riderName);
      
      console.log('Room created/retrieved:', room);
      
      // Open external chat with room ID as parameter
      const chatUrl = `https://rider-chat-pji2.vercel.app?roomId=${room.id}&driverName=${encodeURIComponent(driverName)}&riderName=${encodeURIComponent(riderName)}`;
      window.open(chatUrl, '_blank');
      
    } catch (error) {
      console.error('Error creating/getting room:', error);
      alert('Failed to start chat. Please try again.');
    } finally {
      setIsCreatingRoom(false);
    }
  };

  return (
    <div className="label">
      <div className="heads" style={{
        backgroundImage: 'url(/star-pattern.png)',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        padding: '30px',
        borderRadius: '15px',
        marginBottom: '20px',
        boxShadow: '0 4px 20px rgba(255,182,193,0.2)'
      }}>
        <div id="snamey">
          <Link href="/" className="button" >take me back!</Link>
        </div>
        <h1>Lets find you a ride!</h1>
      </div>
      <div className="text">
        <p>Time to get you where you need to go! Below you will find a list of qualified drivers who have signed up from the program!</p>
        <p>(Fee is dollars per mile)</p>
      </div>

      {/* Town Chat Rooms */}
      <div style={{
        margin: '20px 0',
        padding: '20px',
        backgroundColor: '#fef7f7',
        borderRadius: '15px',
        border: '2px solid #ffb6c1',
        textAlign: 'center'
      }}>
        <h3 style={{
          color: '#ff91a4',
          marginBottom: '15px',
          fontSize: '18px'
        }}>
          💬 Town Chat Rooms
        </h3>
        <p style={{
          color: '#666',
          fontSize: '14px',
          marginBottom: '15px'
        }}>
          Join your town's community chat!
        </p>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '10px',
          justifyContent: 'center'
        }}>
          {towns.filter(town => town !== 'Other').map(town => (
            <button
              key={town}
              onClick={() => {
                const chatUrl = `https://rider-chat-pji2.vercel.app?town=${encodeURIComponent(town)}`;
                window.open(chatUrl, '_blank');
              }}
              style={{
                padding: '8px 16px',
                backgroundColor: '#ff69b4',
                color: 'white',
                border: 'none',
                borderRadius: '20px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold'
              }}
            >
              🏘️ {town} Chat
            </button>
          ))}
        </div>
      </div>

      {/* Town Filter */}
      <div style={{
        margin: '20px 0',
        padding: '20px',
        backgroundColor: '#fef7f7',
        borderRadius: '15px',
        border: '2px solid #ffb6c1',
        textAlign: 'center'
      }}>
        <h3 style={{
          color: '#ff91a4',
          marginBottom: '15px',
          fontSize: '18px'
        }}>
          🗺️ Filter by Town
        </h3>
        <select
          value={selectedTown}
          onChange={(e) => setSelectedTown(e.target.value)}
          style={{
            padding: '12px 20px',
            fontSize: '16px',
            border: '2px solid #ffb6c1',
            borderRadius: '25px',
            backgroundColor: 'white',
            color: '#333',
            cursor: 'pointer',
            minWidth: '200px',
            outline: 'none'
          }}
        >
          <option value="all">📍 All Towns</option>
          {towns.map(town => (
            <option key={town} value={town}>🏘️ {town}</option>
          ))}
        </select>
        {selectedTown !== 'all' && (
          <p style={{
            color: '#666',
            fontSize: '14px',
            marginTop: '10px',
            margin: '10px 0 0 0'
          }}>
            Showing {filteredDrivers.length} driver{filteredDrivers.length !== 1 ? 's' : ''} in {selectedTown}
          </p>
        )}
      </div>

      <div className="drive" style={{ fontSize: 30, paddingTop: 30 }}>
        Drivers{selectedTown !== 'all' ? ` in ${selectedTown}` : ''}:
      </div>
      
      <div id="info">
        {filteredDrivers.length === 0 && selectedTown !== 'all' ? (
          <div style={{
            textAlign: 'center',
            padding: '40px 20px',
            backgroundColor: '#fef7f7',
            borderRadius: '15px',
            border: '2px solid #ffb6c1',
            margin: '20px 0'
          }}>
            <h3 style={{ color: '#ff91a4', marginBottom: '10px' }}>
              😔 No drivers found in {selectedTown}
            </h3>
            <p style={{ color: '#666', marginBottom: '20px' }}>
              Try selecting a different town or check back later!
            </p>
            <button
              onClick={() => setSelectedTown('all')}
              style={{
                padding: '10px 20px',
                backgroundColor: '#ffb6c1',
                color: 'white',
                border: 'none',
                borderRadius: '20px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Show All Drivers
            </button>
          </div>
        ) : (
          filteredDrivers.map((record, idx) => (
          <div className="center" key={idx}>
            <div className="data">
              <center><p>{record.fields.Name}</p></center>
              <p style={{ color: "white" }}>hi</p>
              <center><p>{record.fields.phone}</p></center>
              <p style={{ color: "white" }}>hi</p>
              <center><p>{record.fields.address}</p></center>
              <p style={{ color: "white" }}>hi</p>
              <center><p>{record.fields.fee}</p></center>
              <p style={{ color: "white" }}>hi</p>
              <center><p>{record.fields.date}</p></center>
            </div>
                    <p style={{ color: "white" }}>hi</p>
                    <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                      <button 
                        onClick={() => handleChatClick(record)}
                        disabled={isCreatingRoom}
                        style={{
                          backgroundColor: isCreatingRoom ? "#ccc" : "#ff69b4",
                          color: "white",
                          border: "none",
                          padding: "10px 20px",
                          borderRadius: "5px",
                          cursor: isCreatingRoom ? "not-allowed" : "pointer",
                          fontSize: "16px"
                        }}
                      >
                        {isCreatingRoom ? "⏳ Starting Chat..." : "💬 Chat"}
                      </button>
                    </div>
          </div>
        ))
        )}
      </div>
      <br /><br />
    </div>
  );
}
