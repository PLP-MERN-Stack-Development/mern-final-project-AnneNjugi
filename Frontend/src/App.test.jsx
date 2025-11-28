export default function AppTest() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #0a1929 0%, #0a2f1f 100%)',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '2rem',
      fontWeight: 'bold'
    }}>
      <div>
        <h1>🛰️ React is Working!</h1>
        <p style={{ fontSize: '1rem', marginTop: '20px' }}>
          If you see this, React is rendering correctly.
        </p>
      </div>
    </div>
  );
}
