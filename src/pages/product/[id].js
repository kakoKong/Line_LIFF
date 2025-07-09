// pages/product/[id].js
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { mockRecommendations, mockShops, YOUR_OWN_LINE_OA_ID } from '../../data/mockData'; // Import from the new data file


export default function ProductDetail({ liffProfile }) {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState(null);
  const [shop, setShop] = useState(null); // New state for shop details
  const [liffError, setLiffError] = useState(null);

  useEffect(() => {
    const foundProduct = mockRecommendations.find(p => p.product_id === id);
    if (foundProduct) {
      setProduct(foundProduct);
      // Find the corresponding shop details
      setShop(mockShops[foundProduct.line_oa_id]);
    }
  }, [id]);

  const handleChatToBuy = async () => {
    if (!product) return;

    if (typeof liff === 'undefined' || !liff.isLoggedIn()) {
      alert("Please log in to LINE to chat about this product.");
      // liff.login(); // Uncomment to automatically trigger login
      return;
    }

    if (product.line_oa_id === YOUR_OWN_LINE_OA_ID) {
      try {
        await liff.sendMessages([
          {
            type: 'image',
            originalContentUrl: product.image_url,
            previewImageUrl: product.image_url
          },
          {
            type: 'text',
            text: `I'm interested in the "${product.product_name}" (Product ID: ${product.product_id}, Price: ${product.price}). Can you tell me more or help me purchase it?`
          }
        ]);
        alert(`Message and image sent to your bot about ${product.product_name}!`);
        liff.closeWindow();
      } catch (error) {
        console.error("Error sending message via LIFF to own OA:", error);
        setLiffError("Failed to send message to your bot: " + error.message);
        alert("Failed to send message to your bot. Please try again.");
      }
    } else {
      const cleanOaId = product.line_oa_id.startsWith('@') ? product.line_oa_id.substring(1) : product.line_oa_id;
      const chatUrl = `https://line.me/ti/p/@${cleanOaId}`;

      try {
        liff.openWindow({
          url: chatUrl,
          external: true
        });
        alert(`Opening chat with ${product.shop_name || product.line_oa_id} about ${product.product_name}. You may need to manually send the product image in the chat.`);
      } catch (error) {
        console.error("Error opening chat window to other OA:", error);
        setLiffError("Failed to open chat with the merchant. Please try again.");
        alert("Failed to open chat with the merchant. Please try again.");
      }
    }
  };

  if (!product) {
    return (
      <div style={{
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        backgroundColor: '#f8f8f8', minHeight: '100vh', display: 'flex',
        flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px'
      }}>
        <p style={{ color: '#555', fontSize: '18px' }}>Product not found or loading...</p>
        <button
          onClick={() => router.back()}
          style={{
            marginTop: '20px',
            backgroundColor: '#007bff', color: 'white', padding: '10px 20px',
            border: 'none', borderRadius: '6px', fontSize: '16px', cursor: 'pointer'
          }}
        >
          Go Back
        </button>
      </div>
    );
  }

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
      {/* Minimal Header with Back Button */}
      <div style={{
        width: '100%',
        maxWidth: '440px',
        padding: '24px 20px',
        borderBottom: '1px solid #eee',
        backgroundColor: '#fff',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center'
      }}>
        <button
          onClick={() => router.back()}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            color: '#666',
            marginRight: '15px'
          }}
        >
          &larr;
        </button>
        <h1 style={{
          margin: '0',
          fontSize: '28px',
          fontWeight: '700',
          color: '#222',
          letterSpacing: '-1px',
          flexGrow: 1
        }}>
          Product Detail
        </h1>
      </div>

      {/* Main Content Area */}
      <div style={{
        width: '100%',
        maxWidth: '440px',
        padding: '32px 20px',
        boxSizing: 'border-box',
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        {liffError && (
          <div style={{ color: 'red', marginBottom: '20px', textAlign: 'center' }}>
            Error: {liffError}
          </div>
        )}

        <div style={{
          backgroundColor: '#fff',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          overflow: 'hidden',
          width: '100%',
          paddingBottom: '20px',
          textAlign: 'center'
        }}>
          <Image
            src={product.image_url}
            alt={product.product_name}
            width={400}
            height={400}
            style={{
              width: '100%',
              height: 'auto',
              maxHeight: '400px',
              objectFit: 'cover',
              borderRadius: '12px 12px 0 0',
              marginBottom: '20px'
            }}
          />

          {/* Shop Name and Logo Display */}
          {shop && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center', // Center the shop info
              gap: '10px',
              marginBottom: '15px', // Space below shop info
              padding: '0 20px'
            }}>
              <Image
                src={shop.shop_logo_url}
                alt={shop.shop_name}
                width={30}
                height={30}
                style={{
                  borderRadius: '50%', // Make it round
                  objectFit: 'cover',
                  border: '1px solid #eee' // Small border for definition
                }}
              />
              <p style={{
                fontSize: '16px',
                color: '#666',
                margin: '0',
                fontWeight: '500'
              }}>
                Sold by <span style={{ color: '#007bff', fontWeight: '600' }}>{shop.shop_name}</span>
              </p>
            </div>
          )}


          <h2 style={{
            fontSize: '26px',
            fontWeight: '600',
            color: '#222',
            marginBottom: '10px',
            padding: '0 20px'
          }}>
            {product.product_name}
          </h2>
          <p style={{
            fontSize: '22px',
            fontWeight: '700',
            color: '#007bff',
            marginBottom: '15px',
            padding: '0 20px'
          }}>
            {product.price}
          </p>
          <p style={{
            fontSize: '16px',
            color: '#555',
            lineHeight: '1.6',
            marginBottom: '30px',
            padding: '0 20px'
          }}>
            {product.description}
          </p>

          <button
            onClick={handleChatToBuy}
            style={{
              backgroundColor: '#00c300',
              color: 'white',
              padding: '16px 36px',
              border: 'none',
              borderRadius: '8px',
              fontSize: '18px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 10px rgba(0,195,0,0.3)',
              width: 'calc(100% - 40px)',
              maxWidth: '300px',
              display: 'inline-block'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#00a300';
              e.target.style.boxShadow = '0 6px 15px rgba(0,195,0,0.4)';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = '#00c300';
              e.target.style.boxShadow = '0 4px 10px rgba(0,195,0,0.3)';
            }}
          >
            Chat to Buy
          </button>
        </div>
      </div>
    </div>
  );
}