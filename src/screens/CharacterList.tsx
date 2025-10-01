import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { Grid, Card, CardContent, CardMedia, Typography, Button, Pagination, Box } from '@mui/material';

async function fetchCharacters(page: number) {
  const res = await fetch(`https://rickandmortyapi.com/api/character?page=${page}`);
  if (!res.ok) throw new Error('Network response was not ok');
  return res.json();
}

const CharacterList: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);

  const rowsPerPage = 2; 
  const cardsPerRow = 4; 
  const maxItems = rowsPerPage * cardsPerRow;

  const { data, refetch } = useQuery(
    ['characters', page],
    () => fetchCharacters(page),
    { keepPreviousData: true }
  );

  if (!data) return <div>Loading...</div>;

  return (
    <div>
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button 
        variant="contained" onClick={() => refetch()} sx={{ 
          fontWeight: 'normal',  
          textTransform: 'none'   
        }} >
          Refresh
        </Button>
      </Box>

      <Grid container spacing={2}>
        {data.results.slice(0, maxItems).map((char: any) => (
          <Grid item xs={12} sm={6} md={3} key={char.id}>
            <Card>
              <CardMedia component="img" height="200" image={char.image} alt={char.name} />
              <CardContent>
                <Typography variant="h6">{char.name}</Typography>
                <Typography variant="body2" color="text.secondary">{char.species}</Typography>
               <Button
                  variant="outlined"
                  size="small"
                  sx={{ mt: 1, ml: 'auto', display: 'block', fontWeight: 'normal',  
                          textTransform: 'none' }}
                  onClick={() => navigate({ to: '/character/$id', params: { id: char.id.toString() } })}
                >
                  Details
               </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

     <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
      <Pagination
        count={data.info.pages}
        page={page}
        onChange={(e, value) => setPage(value)}
      />
    </Box>
    </div>
  );
};

export default CharacterList;
