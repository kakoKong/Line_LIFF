// pages/index.js
import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Camera, Plus, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { mockRecommendations } from '../data/mockData';


export default function VibeyAI({ liffProfile }) {
  const [selectedImages, setSelectedImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [showRecommendations, setShowRecommendations] = useState(false);

  const router = useRouter();

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      const newImages = files.slice(0, 5 - selectedImages.length).map(file => ({
        url: URL.createObjectURL(file),
        file: file
      }));

      setSelectedImages(prev => [...prev, ...newImages]);
      setShowRecommendations(false);
      setRecommendations([]);

      // Reset current index if this is the first image
      if (selectedImages.length === 0) {
        setCurrentImageIndex(0);
      }
    }
  };

  const removeImage = (indexToRemove) => {
    setSelectedImages(prev => prev.filter((_, index) => index !== indexToRemove));

    // Adjust current index if needed
    if (currentImageIndex >= selectedImages.length - 1) {
      setCurrentImageIndex(Math.max(0, selectedImages.length - 2));
    }
  };

  const handleFindSimilar = async () => {
    if (selectedImages.length === 0) return;

    setIsProcessing(true);
    setShowRecommendations(false);
    setRecommendations([]);

    // Simulate AI processing with 3-second delay
    await new Promise(resolve => setTimeout(resolve, 3000));

    setRecommendations(mockRecommendations);
    setShowRecommendations(true);
    setIsProcessing(false);
  };

  const handleProductClick = (product_id) => {
    router.push(`/product/${product_id}`);
  };

  const nextImage = () => {
    setCurrentImageIndex(prev => (prev + 1) % selectedImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(prev => (prev - 1 + selectedImages.length) % selectedImages.length);
  };

  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      backgroundColor: '#f8f8f8',
      minHeight: '100vh',
      padding: '0',
      margin: '0',
      color: '#333',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      {/* Minimal Header */}
      <div style={{
        width: '100%',
        maxWidth: '440px',
        padding: '24px 20px',
        borderBottom: '1px solid #eee',
        backgroundColor: '#fff',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        boxSizing: 'border-box'
      }}>
        <h1 style={{
          margin: '0 0 4px 0',
          fontSize: '32px',
          fontWeight: '700',
          color: '#222',
          letterSpacing: '-1px'
        }}>
          Vibey.ai
        </h1>

        {liffProfile && (
          <p style={{
            margin: '0',
            fontSize: '15px',
            color: '#777',
            fontWeight: '400'
          }}>
            Welcome, {liffProfile.displayName}
          </p>
        )}
      </div>

      {/* Main Content Area */}
      <div style={{
        width: '100%',
        maxWidth: '440px',
        padding: '32px 20px',
        boxSizing: 'border-box',
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column'
      }}>

        {/* Recommendations Display */}
        {showRecommendations && recommendations.length > 0 && (
          <div style={{ marginBottom: '40px' }}>
            <h2 style={{
              fontSize: '24px',
              color: '#222',
              marginBottom: '20px',
              fontWeight: '600',
              textAlign: 'center'
            }}>
              Your Vibe Picks
            </h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: '16px'
            }}>
              {recommendations.map((item, index) => (
                <div
                  key={index}
                  onClick={() => handleProductClick(item.product_id)}
                  style={{
                    textAlign: 'center',
                    backgroundColor: '#fff',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    overflow: 'hidden',
                    paddingBottom: '12px',
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
                  }}
                >
                  <Image
                    src={item.image_url}
                    alt={item.product_name}
                    width={160}
                    height={160}
                    style={{
                      width: '100%',
                      height: '160px',
                      objectFit: 'cover',
                      borderRadius: '12px 12px 0 0',
                      marginBottom: '8px'
                    }}
                  />
                  <p style={{
                    fontSize: '14px',
                    color: '#444',
                    margin: '0 8px',
                    fontWeight: '500',
                    lineHeight: '1.4',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {item.product_name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload Section / Selected Images Preview */}
        {!showRecommendations && !isProcessing && (
          <div style={{ marginBottom: '32px' }}>
            {selectedImages.length > 0 ? (
              <div style={{ textAlign: 'center' }}>
                {/* Main Image Display */}
                <div style={{
                  position: 'relative',
                  marginBottom: '20px',
                  width: '100%', // allow arrows to remain at the edges
                  maxWidth: '500px', // optional: limit width
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '10px', // optional for spacing
                  }}>
                    <Image
                      src={selectedImages[currentImageIndex].url}
                      alt={`Selected outfit ${currentImageIndex + 1}`}
                      width={300}
                      height={300}
                      style={{
                        maxWidth: '100%',
                        maxHeight: '280px',
                        width: 'auto',
                        height: 'auto',
                        borderRadius: '12px',
                        border: '1px solid #ddd',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                      }}
                    />
                  </div>

                  {/* Remove current image button */}
                  <button
                    onClick={() => removeImage(currentImageIndex)}
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      backgroundColor: 'rgba(0,0,0,0.5)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: '30px',
                      height: '30px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s ease'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(0,0,0,0.7)'}
                    onMouseOut={(e) => e.target.style.backgroundColor = 'rgba(0,0,0,0.5)'}
                  >
                    <X size={16} />
                  </button>

                  {/* Navigation arrows (only show if more than 1 image) */}
                  {selectedImages.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        style={{
                          position: 'absolute',
                          left: '10px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          backgroundColor: 'rgba(0,0,0,0.5)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '50%',
                          width: '40px',
                          height: '40px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          // transition: 'background-color 0.2s ease'
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(0,0,0,0.7)'}
                        onMouseOut={(e) => e.target.style.backgroundColor = 'rgba(0,0,0,0.5)'}
                      >
                        <ChevronLeft size={20} />
                      </button>

                      <button
                        onClick={nextImage}
                        style={{
                          position: 'absolute',
                          right: '10px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          backgroundColor: 'rgba(0,0,0,0.5)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '50%',
                          width: '40px',
                          height: '40px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          transition: 'background-color 0.2s ease'
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(0,0,0,0.7)'}
                        onMouseOut={(e) => e.target.style.backgroundColor = 'rgba(0,0,0,0.5)'}
                      >
                        <ChevronRight size={20} />
                      </button>
                    </>
                  )}
                </div>

                {/* Image indicators */}
                {selectedImages.length > 1 && (
                  <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '8px',
                    marginBottom: '20px'
                  }}>
                    {selectedImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          border: 'none',
                          backgroundColor: index === currentImageIndex ? '#007bff' : '#ccc',
                          cursor: 'pointer',
                          transition: 'background-color 0.2s ease'
                        }}
                      />
                    ))}
                  </div>
                )}

                {/* Thumbnail strip */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '8px',
                  marginBottom: '20px',
                  flexWrap: 'wrap'
                }}>
                  {selectedImages.map((image, index) => (
                    <div
                      key={index}
                      style={{
                        position: 'relative',
                        cursor: 'pointer'
                      }}
                      onClick={() => setCurrentImageIndex(index)}
                    >
                      <Image
                        src={image.url}
                        alt={`Thumbnail ${index + 1}`}
                        width={60}
                        height={60}
                        style={{
                          width: '60px',
                          height: '60px',
                          objectFit: 'cover',
                          borderRadius: '8px',
                          border: index === currentImageIndex ? '2px solid #007bff' : '2px solid transparent',
                          opacity: index === currentImageIndex ? 1 : 0.7,
                          transition: 'all 0.2s ease'
                        }}
                      />
                    </div>
                  ))}

                  {/* Add more images button */}
                  {selectedImages.length < 5 && (
                    <label
                      htmlFor="imageUploadMore"
                      style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '8px',
                        border: '2px dashed #ccc',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        backgroundColor: '#f8f8f8',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.borderColor = '#007bff';
                        e.target.style.backgroundColor = '#f0f8ff';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.borderColor = '#ccc';
                        e.target.style.backgroundColor = '#f8f8f8';
                      }}
                    >
                      <Plus size={20} color="#666" />
                    </label>
                  )}
                </div>

                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                  id="imageUploadMore"
                />

                <p style={{
                  fontSize: '14px',
                  color: '#666',
                  margin: '0 0 20px 0',
                  textAlign: 'center'
                }}>
                  {selectedImages.length}/5 images • {selectedImages.length < 5 ? 'Add more to get better recommendations' : 'Maximum reached'}
                </p>
              </div>
            ) : (
              // Initial upload box
              <>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                  id="imageUpload"
                />
                <label
                  htmlFor="imageUpload"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    minHeight: '200px',
                    padding: '20px',
                    border: '2px dashed #ccc',
                    borderRadius: '12px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    backgroundColor: '#fff',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = '#007bff';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,123,255,0.2)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = '#ccc';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
                  }}
                >
                  <Camera size={56} color="#aaa" style={{ marginBottom: '12px' }} />
                  <p style={{
                    fontSize: '18px',
                    color: '#555',
                    margin: '0 0 8px 0',
                    fontWeight: '500'
                  }}>
                    Upload your outfit photos
                  </p>
                  <p style={{
                    fontSize: '14px',
                    color: '#777',
                    margin: '0'
                  }}>
                    Upload up to 5 images for better recommendations
                  </p>
                </label>
              </>
            )}
          </div>
        )}

        {/* Find Similar Button */}
        {selectedImages.length > 0 && !isProcessing && !showRecommendations && (
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <button
              onClick={handleFindSimilar}
              style={{
                backgroundColor: '#007bff',
                color: 'white',
                padding: '16px 36px',
                border: 'none',
                borderRadius: '8px',
                fontSize: '18px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 10px rgba(0,123,255,0.3)',
                width: '100%',
                maxWidth: '300px'
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = '#0056b3';
                e.target.style.boxShadow = '0 6px 15px rgba(0,123,255,0.4)';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = '#007bff';
                e.target.style.boxShadow = '0 4px 10px rgba(0,123,255,0.3)';
              }}
            >
              Find My Vibe
            </button>
          </div>
        )}

        {/* Processing State */}
        {isProcessing && (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            marginBottom: '32px'
          }}>
            <div className="spinner" style={{
              border: '4px solid rgba(0, 123, 255, 0.1)',
              borderLeftColor: '#007bff',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 20px auto'
            }}></div>
            <p style={{
              fontSize: '18px',
              color: '#555',
              margin: '0',
              fontWeight: '500'
            }}>
              Analyzing your style...
            </p>
          </div>
        )}
      </div>

      {/* Global Styles */}
      <style jsx global>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}