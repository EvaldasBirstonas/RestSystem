import 'bootstrap/dist/css/bootstrap.min.css';
import Card from 'react-bootstrap/Card';
import CardGroup from 'react-bootstrap/CardGroup';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button'
import { useHistory } from 'react-router';

const CardsList = (props) => {

    console.log(props);
    const history = useHistory();

    const routeChange = (id) => {
        history.push(props.route + id)
    }

    function sliceIntoChunks(arr, chunkSize) {
        const res = [];
        for (let i = 0; i < arr.length; i += chunkSize) {
            const chunk = arr.slice(i, i + chunkSize);
            res.push(chunk);
        }
        return res;
    }

    const games = sliceIntoChunks(props.games, 4)

    const cardsArray = games.map((game, index) => (
        <Row key={index}>
            {game.map(gameElement => (
                <Col md={3} key={gameElement.id}>
                    <Card style={{maxHeight: "500px", minHeight: "500px"}} className="m-2" key={gameElement.id}>
                        <Card.Img style={{maxHeight: "288px", minHeight: "288px"}} variant="top" src={!gameElement.picture ? "http://localhost:8000/images/default.png" : "http://localhost:8000/images/" + gameElement.picture}/>
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
    return (
        <CardGroup>
            <Container>
                {games !== null ? cardsArray : ""}
            </Container>
        </CardGroup>
    )
}

export default CardsList