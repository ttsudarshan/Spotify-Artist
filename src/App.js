import "bootstrap/dist/css/bootstrap.min.css";
import { Container, InputGroup, FormControl, Row, Card } from "react-bootstrap";
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import ArtistProfile from "./components/ArtistProfile";

function App() {
  const [searchInput, setSearchInput] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [artists, setArtists] = useState([]);

  const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
  const CLIENT_SECRET = process.env.REACT_APP_CLIENT_SECRET;

  useEffect(() => {
    var authParameters = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body:
        "grant_type=client_credentials&client_id=" +
        CLIENT_ID +
        "&client_secret=" +
        CLIENT_SECRET,
    };

    fetch("https://accounts.spotify.com/api/token", authParameters)
      .then((result) => result.json())
      .then((data) => setAccessToken(data.access_token));
  }, []);

  const searchParameters = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + accessToken,
    },
  };

  const search = async () => {
    if (searchInput) {
      const artists = await fetch(
        "https://api.spotify.com/v1/search?q=" + searchInput + "&type=artist",
        searchParameters
      )
        .then((response) => response.json())
        .then((data) => data.artists.items);

      setArtists(artists);
    } else {
      setArtists([]);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      search();
    }, 10);

    return () => clearTimeout(delayDebounceFn);
  }, [searchInput]);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            path="/artist/:id"
            element={<ArtistProfile accessToken={accessToken} setSearchInput={setSearchInput}/>}
          />
          <Route
            path="/"
            element={
              <>
                <Container className="my-3">
                  <InputGroup className="mb-3" size="lg">
                    <FormControl
                      placeholder="Search any Artists"
                      type="input"
                      onChange={(event) => setSearchInput(event.target.value)} value={searchInput}
                    />
                  </InputGroup>
                </Container>
                <Container>
                  <Row className="mx-2 row row-cols-4">
                    {artists.map((artist, index) => (
                      <Card key={index} artistid={artist.id}>
                        <Link
                          to={`/artist/${artist.id}`}
                          style={{ textDecoration: "none", color: "inherit" }}
                        >
                          {artist.images && artist.images.length > 0 && (
                            <Card.Img
                              src={artist.images[0].url}
                              alt={artist.name}
                            />
                          )}
                          <Card.Body>
                            <Card.Title>{artist.name}</Card.Title>
                          </Card.Body>
                        </Link>
                      </Card>
                    ))}
                  </Row>
                </Container>
              </>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
