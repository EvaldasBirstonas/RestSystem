import 'bootstrap';
import React, {useEffect, useState} from 'react';
import CardsList from '../CardsList';
import Card from 'react-bootstrap/Card';
import CardGroup from 'react-bootstrap/CardGroup';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button'
import { useHistory } from 'react-router';
import Fade from 'react-bootstrap/Fade';
import './Home.css'

function Home(props) {
  const [games, setGames] = useState([]);
  const [connectedGames, setConnectedGames] = useState([]);
  const [connectedAchievements, setConnectedAchievements] = useState([]);
  console.log("Home props: " + props);
  console.log(props.user.id);

  useEffect(() => {
    async function fetchData() {
      let promised = false;
      await fetch('http://localhost:8000/api/Games', {
        method: "GET",
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
      })
      .then((data) => {
        if(promised) return;
        if (!data.ok) {
          throw Error(data.statusText);
        }
        return data.json();
      })
      .then((data) => {
        setGames([data.slice(0, 4)]);
        console.log("success")
      })
      .catch((error) => {
        console.log(error);
        console.log("error");
      });
    }

    async function fetchConnectedGames() {
      let promised = false;
      await fetch('http://localhost:8000/api/Users/'  + props.user.id + '/Games', {
        method: "GET",
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
      })
      .then((data) => {
        if(promised) return;
        if (!data.ok) {
          throw Error(data.statusText);
        }
        return data.json();
      })
      .then((data) => {
        setConnectedGames([data.slice(0, 4)]);
        console.log("success")
      })
      .catch((error) => {
        console.log(error);
        console.log("error");
      });
    }

    async function fetchConnectedAchievements() {
      let promised = false;
      await fetch('http://localhost:8000/api/Users/' + props.user.id + '/Achievements', {
        method: "GET",
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
      })
      .then((data) => {
        if(promised) return;
        if (!data.ok) {
          throw Error(data.statusText);
        }
        return data.json();
      })
      .then((data) => {
        setConnectedAchievements([data.slice(0, 4)]);
        console.log("success")
      })
      .catch((error) => {
        console.log(error);
        console.log("error");
      });
    }
    fetchData();
    fetchConnectedGames();
    fetchConnectedAchievements();
    return () => {
      setGames([]);
      setConnectedGames([]);
      setConnectedAchievements([]);
    }
  }, [props.refresh]);

  const history = useHistory();

  const routeChange = (id) => {
    history.push('/Games/' + id)
  }

  console.log(games)
  console.log(connectedGames)
  console.log(connectedAchievements)

  function generateCardsArray(games, type) {
    return(games.map((game, index) => (
      <Row key={index}>
          {game.map(gameElement => (
              <Col md={3} key={gameElement.id} className="cardDeck">
                  <Card className="card m-2" key={gameElement.id}>
                      <Card.Img variant="top" src={!gameElement.picture ? "http://localhost:8000/images/default.png" : "http://localhost:8000/images/" + gameElement.picture}/>
                      <Card.Body>
                          <Card.Title>{gameElement.name}</Card.Title>
                          <Card.Text className="cardText">{gameElement.description}</Card.Text>
                          {type == 'game' ? <Button variant="primary" onClick={() => routeChange(gameElement.id)}>Explore</Button> : ""}
                      </Card.Body>
                  </Card>
              </Col>
          ))}
      </Row>
    )));
  }

  console.log(games)
  /*
  const cardsArray = games.map((game, index) => (
    <Row key={index}>
        {game.map(gameElement => (
            <Col md={3} key={gameElement.id}>
                <Card className="m-2" key={gameElement.id}>
                    <Card.Img variant="top" src={!gameElement.picture ? "http://localhost:8000/images/default.png" : "http://localhost:8000/images/" + gameElement.picture}/>
                    <Card.Body>
                        <Card.Title>{gameElement.name}</Card.Title>
                        <Card.Text>{gameElement.description}</Card.Text>
                        <Button variant="primary" onClick={() => routeChange(gameElement.id)}>Explore</Button>
                    </Card.Body>
                </Card>
            </Col>
        ))}
    </Row>
  ));
  */

  console.log(games)
  return (
    <div className="Home">
        <h1>Hello and welcome to the Home page</h1>
        <h1>Here are some games for you to check out:</h1>
        <CardGroup>
            <Container>
                {generateCardsArray(games, 'game')}
            </Container>
        </CardGroup>
        <h1>Here are some of the games you have connected!:</h1>
        <CardGroup>
            <Container>
              {connectedGames.length > 0 ? generateCardsArray(connectedGames, 'game') : <h1>Explore some games to connect to your account!</h1>}
            </Container>
        </CardGroup>
        <h1>Here are some of the achievements you have connected!:</h1>
        <CardGroup>
            <Container>
              {connectedAchievements.length > 0 ? generateCardsArray(connectedAchievements) : <h1>Explore your games and connect some achievements!</h1>}
            </Container>
        </CardGroup>
    </div>
  );
}

export default Home;
