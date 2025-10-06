import React, { useState } from 'react';

// Method 1: Using fetch with FormData (Recommended)
const uploadImagesWithFetch = async (licenseFile, userPhotoFile) => {
  try {
    const formData = new FormData();
    formData.append('license_image', licenseFile);
    formData.append('user_photo', userPhotoFile);

    const response = await fetch('https://drivers-liscence-production.up.railway.app/ocr', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error uploading images:', error);
    throw error;
  }
};

const PinkLicenseVerification = ({ onVerificationComplete, onVerificationError }) => {
  const [licenseFile, setLicenseFile] = useState(null);
  const [userPhotoFile, setUserPhotoFile] = useState(null);
  const [licensePreview, setLicensePreview] = useState(null);
  const [userPhotoPreview, setUserPhotoPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLicenseFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setLicenseFile(file);
      setError(null);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setLicensePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUserPhotoSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUserPhotoFile(file);
      setError(null);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setUserPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!licenseFile || !userPhotoFile) {
      setError('Please select both a license image and a user photo');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await uploadImagesWithFetch(licenseFile, userPhotoFile);
      setResult(result);
      if (onVerificationComplete) {
        onVerificationComplete(result);
      }
    } catch (error) {
      setError('Failed to analyze images. Please try again.');
      if (onVerificationError) {
        onVerificationError();
      }
      console.error('Upload error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#4caf50';
    if (score >= 60) return '#2196f3';
    if (score >= 40) return '#ff9800';
    if (score >= 20) return '#ff5722';
    return '#f44336';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'very_safe': return '🟢';
      case 'safe': return '🟢';
      case 'moderate': return '🟡';
      case 'risky': return '🟠';
      case 'unsafe': return '🔴';
      default: return '❓';
    }
  };

  return (
    <div style={{
      maxWidth: '600px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: 'white',
      borderRadius: '15px',
      boxShadow: '0 6px 24px rgba(255,182,193,0.2)',
      border: '2px solid #ffb6c1'
    }}>
      <h2 style={{
        fontSize: '22px',
        fontWeight: 'bold',
        marginBottom: '20px',
        textAlign: 'center',
        color: '#ffb6c1',
        textShadow: '1px 1px 3px rgba(255,182,193,0.4)'
      }}>
        <span style={{ color: '#ffb6c1', fontSize: '24px', margin: '0 10px' }}>💖</span>
        Driver's License Verification
        <span style={{ color: '#ffb6c1', fontSize: '24px', margin: '0 10px' }}>💖</span>
      </h2>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px',
        marginBottom: '20px'
      }}>
        {/* License Image Upload */}
        <div style={{
          textAlign: 'center',
          padding: '12px',
          backgroundColor: '#fef7f7',
          borderRadius: '12px',
          border: '2px dashed #ffb6c1'
        }}>
          <label style={{
            display: 'block',
            fontSize: '16px',
            fontWeight: '600',
            marginBottom: '10px',
            color: '#ff91a4'
          }}>
            📄 Driver's License
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleLicenseFileSelect}
            style={{
              display: 'none'
            }}
            id="license-upload"
          />
          <label
            htmlFor="license-upload"
            style={{
              display: 'inline-block',
              padding: '12px 24px',
              backgroundColor: '#ffb6c1',
              color: 'white',
              borderRadius: '25px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(255,105,180,0.3)'
            }}
          >
            📁 Choose License Image
          </label>
          
          {/* License Preview */}
          {licensePreview && (
            <div style={{ marginTop: '20px' }}>
              <img
                src={licensePreview}
                alt="License Preview"
                style={{
                  width: '100%',
                  height: '150px',
                  objectFit: 'cover',
                  borderRadius: '12px',
                  border: '3px solid #ffb6c1',
                  boxShadow: '0 4px 15px rgba(255,105,180,0.2)'
                }}
              />
            </div>
          )}
        </div>

        {/* User Photo Upload */}
        <div style={{
          textAlign: 'center',
          padding: '20px',
          backgroundColor: '#fef7f7',
          borderRadius: '15px',
          border: '2px dashed #ffb6c1'
        }}>
          <label style={{
            display: 'block',
            fontSize: '16px',
            fontWeight: '600',
            marginBottom: '10px',
            color: '#ff91a4'
          }}>
            📸 Your Photo
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleUserPhotoSelect}
            style={{
              display: 'none'
            }}
            id="photo-upload"
          />
          <label
            htmlFor="photo-upload"
            style={{
              display: 'inline-block',
              padding: '12px 24px',
              backgroundColor: '#ffb6c1',
              color: 'white',
              borderRadius: '25px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(255,105,180,0.3)'
            }}
          >
            📁 Choose Your Photo
          </label>
          
          {/* User Photo Preview */}
          {userPhotoPreview && (
            <div style={{ marginTop: '20px' }}>
              <img
                src={userPhotoPreview}
                alt="User Photo Preview"
                style={{
                  width: '100%',
                  height: '150px',
                  objectFit: 'cover',
                  borderRadius: '12px',
                  border: '3px solid #ffb6c1',
                  boxShadow: '0 4px 15px rgba(255,105,180,0.2)'
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Upload Button */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <button
          onClick={handleUpload}
          disabled={!licenseFile || !userPhotoFile || loading}
          style={{
            padding: '15px 40px',
            fontSize: '18px',
            fontWeight: 'bold',
            backgroundColor: (!licenseFile || !userPhotoFile || loading) ? '#ccc' : '#ffb6c1',
            color: 'white',
            border: 'none',
            borderRadius: '30px',
            cursor: (!licenseFile || !userPhotoFile || loading) ? 'not-allowed' : 'pointer',
            boxShadow: '0 6px 20px rgba(255,105,180,0.4)',
            transition: 'all 0.3s ease',
            opacity: (!licenseFile || !userPhotoFile || loading) ? 0.6 : 1
          }}
        >
          {loading ? '🔄 Verifying...' : '🚗 Verify License 🚗'}
        </button>
      </div>


      {/* Results */}
      {result && (
        <div style={{
          padding: '25px',
          backgroundColor: '#f8f9fa',
          borderRadius: '15px',
          border: '3px solid #ffb6c1',
          boxShadow: '0 6px 25px rgba(255,105,180,0.2)'
        }}>
          <h3 style={{
            fontSize: '22px',
            fontWeight: 'bold',
            marginBottom: '20px',
            textAlign: 'center',
            color: '#ff91a4'
          }}>
            {getStatusIcon(result.safety_status)} Verification Results
          </h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px',
            marginBottom: '20px'
          }}>
            <div style={{
              padding: '12px',
              backgroundColor: 'white',
              borderRadius: '10px',
              textAlign: 'center',
              border: '2px solid #ffb6c1'
            }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: getScoreColor(result.safety_score) }}>
                {result.safety_score}/100
              </div>
              <div style={{ fontSize: '14px', color: '#666', marginTop: '5px' }}>
                Safety Score
              </div>
            </div>
            
            <div style={{
              padding: '12px',
              backgroundColor: 'white',
              borderRadius: '10px',
              textAlign: 'center',
              border: '2px solid #ffb6c1'
            }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: getScoreColor(result.face_match_score * 100) }}>
                {(result.face_match_score * 100).toFixed(1)}%
              </div>
              <div style={{ fontSize: '14px', color: '#666', marginTop: '5px' }}>
                Face Match
              </div>
            </div>
          </div>
          
          <div style={{
            padding: '12px',
            backgroundColor: 'white',
            borderRadius: '10px',
            border: '2px solid #ffb6c1',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '16px', fontWeight: '600', color: '#ff91a4' }}>
              Status: {result.safety_status.replace('_', ' ').toUpperCase()}
            </div>
            <div style={{ fontSize: '14px', color: '#666', marginTop: '5px' }}>
              Confidence: {result.confidence_level.replace('_', ' ').toUpperCase()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PinkLicenseVerification;
