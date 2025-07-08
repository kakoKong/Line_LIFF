// pages/index.js
import { useState } from 'react';
import Image from 'next/image';

export default function HomePage({ liffProfile, firebaseUser }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState("Upload an image to find similar fashion!");

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      setMessage("Image selected. Click 'Find Similar'!");
    }
  };

  const handleFindSimilar = async () => {
    if (!selectedImage) {
      setMessage("Please select an image first!");
      return;
    }

    if (!liffProfile) { // Ensure LIFF is initialized and user is logged in
        setMessage("Please log in with LINE first!");
        return;
    }

    setIsProcessing(true);
    setMessage("Analyzing your style... This might take a moment.");

    // --- Here's where your backend integration would go ---
    // In a real app:
    // 1. Convert selectedImage (Blob or File) to Base64 or FormData.
    // 2. Send it to your FastAPI backend /recommend/image endpoint.
    // 3. Include liffProfile.userId or a Firebase ID token for authentication/user tracking.
    // 4. Handle the response (display recommendations).

    // Simulate API call for this minimal example
    await new Promise(resolve => setTimeout(resolve, 3000)); // Simulate 3-sec processing

    setMessage("Processing complete! (Recommendations would appear here)");
    setIsProcessing(false);
    // In a real app, you'd then display recommended products here.
    // E.g., `setRecommendations(response.data.recommendations);`
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', textAlign: 'center', padding: '20px', maxWidth: '400px', margin: 'auto' }}>
      <h1>LINE Fashion Recommender</h1>
      {liffProfile && (
        <p>Welcome, {liffProfile.displayName}!</p>
      )}

      <p>{message}</p>

      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        style={{ display: 'none' }}
        id="imageUpload"
      />
      <label htmlFor="imageUpload" style={{
        display: 'block',
        padding: '10px 20px',
        backgroundColor: '#00B900', // LINE Green
        color: 'white',
        borderRadius: '5px',
        cursor: 'pointer',
        marginTop: '20px'
      }}>
        Select Image
      </label>

      {selectedImage && (
        <div style={{ marginTop: '20px' }}>
          <Image src={selectedImage} alt="Selected" width={300} height={300} style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }} />
        </div>
      )}

      <button
        onClick={handleFindSimilar}
        disabled={isProcessing || !selectedImage}
        style={{
          padding: '12px 25px',
          backgroundColor: isProcessing ? '#cccccc' : '#007bff', // Blue or grey if processing
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: isProcessing ? 'not-allowed' : 'pointer',
          marginTop: '20px',
          fontSize: '16px'
        }}
      >
        {isProcessing ? 'Processing...' : 'Find Similar Clothes'}
      </button>

      {/* Add an area to display recommendations here in a full app */}
      {/* {recommendations.length > 0 && (
          <div style={{ marginTop: '30px' }}>
              <h2>Your Recommendations:</h2>
              {/ Render product cards here /}
          </div>
      )} */}
    </div>
  );
}