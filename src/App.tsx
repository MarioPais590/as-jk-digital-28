import React from 'react';
import './index.css';

// Minimal test component to verify React works
function App() {
  console.log('Minimal App rendering...');
  
  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">App is Working</h1>
          <p className="text-lg">React is functioning properly</p>
        </div>
      </div>
    </div>
  );
}

export default App;