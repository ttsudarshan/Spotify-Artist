import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Card, Row, Col, Spinner } from "react-bootstrap";
import "./ArtistProfile.css";

function ArtistProfile({ accessToken }) {
  const { id } = useParams();
  const [artist, setArtist] = useState(null);

  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/");
  };

  useEffect(() => {
    if (accessToken) {
      const searchParameters = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessToken,
        },
      };

      fetch(`https://api.spotify.com/v1/artists/${id}`, searchParameters)
        .then((response) => response.json())
        .then((data) => setArtist(data));
    }
  }, [accessToken, id]);

  if (!artist) {
    return (
      <div className="loading-spinner">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <Container className="artist-profile">
      <button
        type="button"
        className="btn-close"
        aria-label="Close"
        onClick={handleClick}
      ></button>

      <Row className="justify-content-md-center">
        <Col md={6}>
          <Card className="shadow-lg mb-5 bg-white rounded">
            {artist.images && artist.images.length > 0 && (
              <Card.Img
                variant="top"
                src={artist.images[0].url}
                alt={artist.name}
              />
            )}
            <Card.Body>
              <Card.Title className="text-center">{artist.name}</Card.Title>
              <Card.Text className="text-center">
                <span className="badge bg-primary">
                  {artist.genres.join(", ")}
                </span>
              </Card.Text>
              <Row className="text-center mt-4">
                <Col>
                  <h5>Followers</h5>
                  <p>{artist.followers.total.toLocaleString()}</p>
                </Col>
                <Col>
                  <h5>Popularity</h5>
                  <p>{artist.popularity}</p>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default ArtistProfile;
