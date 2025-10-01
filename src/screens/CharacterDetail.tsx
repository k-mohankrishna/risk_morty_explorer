import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  List,
  ListItem,
  ListItemText,
  Divider,
  Paper,
} from "@mui/material";
import { characterDetailsRoute } from "../routes";

async function fetchCharacter(id: string) {
  const res = await fetch(`https://rickandmortyapi.com/api/character/${id}`);
  if (!res.ok) throw new Error("Network response was not ok");
  return res.json();
}

async function fetchLocation(url: string) {
  if (!url) return null;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Location fetch failed");
  return res.json();
}

async function fetchEpisodes(urls: string[]) {
  if (!urls || urls.length === 0) return [];
  const ids = urls.map((u) => u.split("/").pop()).join(",");
  const res = await fetch(`https://rickandmortyapi.com/api/episode/${ids}`);
  if (!res.ok) throw new Error("Episodes fetch failed");
  return res.json();
}

const CharacterDetail: React.FC = () => {
  const { id } = characterDetailsRoute.useParams();

  const { data } = useQuery(["character", id], () => fetchCharacter(id));

  const originQuery = useQuery(
    ["origin", data?.origin?.url],
    () => fetchLocation(data.origin.url),
    { enabled: !!data?.origin?.url }
  );

  const locationQuery = useQuery(
    ["location", data?.location?.url],
    () => fetchLocation(data.location.url),
    { enabled: !!data?.location?.url }
  );

  const episodesQuery = useQuery(
    ["episodes", data?.episode],
    () => fetchEpisodes(data.episode),
    { enabled: !!data?.episode }
  );

  if (!data) return <div>Loading...</div>;

  const episodes = Array.isArray(episodesQuery.data)
    ? episodesQuery.data
    : episodesQuery.data
    ? [episodesQuery.data]
    : [];

  return (
    <Grid container sx={{ height: "100vh" }}>
      <Grid item xs={12} md={4} sx={{ height: "100vh", overflow: "hidden" }}>
        <Paper sx={{ padding: 2, height: "100%" }}>
          <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <CardMedia
              component="img"
              image={data.image}
              alt={data.name}
              sx={{
                objectFit: "contain",
                height: 300,
                backgroundColor: "#f5f5f5",
              }}
            />
            <CardContent sx={{ flexGrow: 1, overflowY: "auto" }}>
              <Typography variant="h4" gutterBottom>
                {data.name}
              </Typography>
              <Typography>Status: {data.status}</Typography>
              <Typography>Species: {data.species}</Typography>
              <Typography>Gender: {data.gender}</Typography>

              {originQuery.data && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6">Origin</Typography>
                  <Typography>Name: {originQuery.data.name}</Typography>
                  <Typography>Type: {originQuery.data.type}</Typography>
                  <Typography>
                    Dimension: {originQuery.data.dimension}
                  </Typography>
                </>
              )}

              {locationQuery.data && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6">Current Location</Typography>
                  <Typography>Name: {locationQuery.data.name}</Typography>
                  <Typography>Type: {locationQuery.data.type}</Typography>
                  <Typography>
                    Dimension: {locationQuery.data.dimension}
                  </Typography>
                </>
              )}
            </CardContent>
          </Card>
        </Paper>
      </Grid>

      <Grid
        item
        xs={12}
        md={8}
        sx={{ height: "100vh", overflowY: "auto", p: 2 }}
      >
        <Paper sx={{ padding: 2 }}>
          <Typography variant="h5" gutterBottom>
            Episodes
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <List dense>
            {episodes.map((ep: any) => (
              <ListItem key={ep.id} divider>
                <ListItemText
                  primary={`${ep.episode} — ${ep.name}`}
                  secondary={`Air Date: ${ep.air_date}`}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default CharacterDetail;
