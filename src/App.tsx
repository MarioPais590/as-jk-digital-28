import React from 'react';

function App() {
  return React.createElement('div', {
    style: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'system-ui'
    }
  }, React.createElement('h1', { style: { fontSize: '2rem' } }, 'React Test - No Hooks'));
}

export default App;