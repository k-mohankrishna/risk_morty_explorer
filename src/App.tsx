import React from 'react';
import { Outlet } from '@tanstack/react-router';
import Container from '@mui/material/Container';

function App() {
  return (
    <Container sx={{ marginTop: 4 }}>
      <h1>Rick and Morty Explorer</h1>
      <Outlet />
    </Container>
  );
}

export default App;
