import 'bootstrap';
import React, {useEffect, useState} from 'react';
import CardsList from '../CardsList';
import './Cards.css'
import Card from 'react-bootstrap/Card';
import CardGroup from 'react-bootstrap/CardGroup';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button'
import { useHistory } from 'react-router';
import { Fade } from 'react-bootstrap';

function Games(props) {

    const [games, setGames] = useState([]);
    //const [refresh, setRefresh] = useState(false);
    console.log(props)
    console.log(games)
    
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
              setGames(data);
              console.log("success")
            })
            .catch((error) => {
              console.log(error);
              console.log("error");
            });
          }
          fetchData();
          return () => {
            setGames([]);
          }
      }, [props.refresh]);

      const history = useHistory();

    const routeChange = (id) => {
        history.push('/Games/' + id)
    }

    function sliceIntoChunks(arr, chunkSize) {
        const res = [];
        for (let i = 0; i < arr.length; i += chunkSize) {
            const chunk = arr.slice(i, i + chunkSize);
            res.push(chunk);
        }
        return res;
    }

    const slicedGames = sliceIntoChunks(games, 4)

    const cardsArray = slicedGames.map((game, index) => (
        <Row key={index}>
            {game.map(gameElement => (
                <Col md={3} key={gameElement.id}>
                    <Card style={{maxHeight: "500px", minHeight: "500px"}} className="m-2" key={gameElement.id}>
                        <Card.Img style={{maxHeight: "288px", minHeight: "288px"}} variant="top" src={!gameElement.picture ? "../logo192.png" : "http://localhost:8000/images/" + gameElement.picture}/>
                        <Card.Body>
                            <Card.Title>{gameElement.name}</Card.Title>
                            <Card.Text class="overflow">{gameElement.description}</Card.Text>
                            <Button variant="primary" onClick={() => routeChange(gameElement.id)}>Explore</Button>
                        </Card.Body>
                    </Card>
                </Col>
            ))}
        </Row>
    ));
  //console.log("Home props: " + props);

  return (
    <div className="Game">
      <CardGroup>
          <Container>
              {cardsArray}
          </Container>
      </CardGroup>
    </div>
  )
}

export default Games;
