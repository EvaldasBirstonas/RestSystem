import Card from "react-bootstrap/Card"
import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import CardsList from '../CardsList';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Modal from 'react-bootstrap/Modal';
import DeleteModal from "../DeleteModal";
import Toast from 'react-bootstrap/Toast';
import Alert from 'react-bootstrap/Alert';
import Container from 'react-bootstrap/Container'
import { useHistory } from 'react-router';

const ViewGames = (props) => {

    const history = useHistory();

    console.log("VIEW GAME USER")
    console.log(props);
    const { id } = useParams();
    const [game, setGame] = useState();
    const [show, setShow] = useState(false);
    const [toastShow, setToastShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleToastClose = () => setToastShow(false);

    const handleDelete = () => {
        fetch('http://localhost:8000/api/Games/' + game.id, {
            method: 'DELETE',
            credentials: 'include',
        })
        .then((data) => {
            console.log(data);
            if (data.ok) {
                history.push('/Games')
                props.setRefresh(x => !x);
            }
            return data.json();
        })
        //props.setGameRefresh(x => !x);
        //history.push('/Games')
        //props.setRefresh(x => !x);
        //history.go(0);
        //history.pushState(null, '/Games')
        //setItemList(itemList.filter(x => x.id !== id));
        handleClose();
    };

    const handleShow = () => setShow(true);
    const handleToastShow = () => setToastShow(true);

    const handleAddLevel = () => {
        history.push('/Games/' + id + '/AddLevel')
    }

    const handleEditGame = () => {
        history.push({
            pathname: '/Games/' + id + '/EditGame',
            state: { game: game}
        });
    }
    
    const handleAddGameToUser = () => {
        fetch('http://localhost:8000/api/Games/' + game.id + '/Users/' + props.user.id, {
            method: 'POST',
            credentials: 'include',
        })
        .then((data) => {
            handleToastShow();
        })
    }

    useEffect(() => {
        (
        () => {
            console.log("FROM ASYNC id")
            console.log(id)
            fetch(("http://localhost:8000/api/Games/" + id), {
                method: "GET",
                headers: {'Content-Type': 'application/json'},
                credentials: 'include',
            })
            .then((data) => {
                console.log(data);
                if (!data.ok) {
                    throw Error(data.statusText);
                }
                return data.json();
            })
            .then((data) => {
                console.log(data)
                setGame(data);
                console.log("success")
            })
            .catch((error) => {
                console.log(error);
                console.log("error");
            });;
            
            /*
            const content = await response.json();
            if (content)
            setUser(content);
            console.log("content" + content);
            */
            } 
        )()
        }, [id]);

        if (game) {
            return (
                <div>
                    <div style={{ padding: "10%" }}>
                        <Card>
                        <Card.Img variant="top" src={!game.picture ? "../logo192.png" : "http://localhost:8000/images/" + game.picture} style={{maxHeight: "30vw"}}/>
                            <Card.Body>
                                <Card.Title>Game #{game.id}</Card.Title>
                                <Card.Title>Game Name:</Card.Title>
                                <Card.Text>{game.name}</Card.Text>
                                <Card.Title>Game Description:</Card.Title>
                                <Card.Text>{game.description}</Card.Text>
                            </Card.Body>
                        </Card>
                    </div>
                    {props.user ?
                    <Container fluid>
                        <Row>
                            <h1>User settings</h1>
                            <Button variant="success" onClick={() => handleAddGameToUser()}>Add this game to your account!</Button>
                            <Alert variant="success" show={toastShow} onHide={handleToastClose}>
                                <Alert.Heading>Success!</Alert.Heading>
                                <p>
                                    {game.name} has been succesfully added to your account
                                </p>
                            </Alert>
                        </Row>
                    </Container>
                    : ""}

                    {props.user.roles > 1 ?
                    <Container fluid>
                        <Row>
                            <h1>Admin settings</h1>
                            <Button variant="danger" onClick={() => handleShow()}>Delete</Button>
                            <Button variant="warning" onClick={() => handleEditGame()}>Edit game</Button>
                            <Button variant="success" onClick={() => handleAddLevel()}>Add level</Button>
                        </Row>
                    </Container>
                    : ""}

                    <h1>Levels for the game</h1>
                    {game.level.length > 0 ? <CardsList games = {game.level} route = {id + "/Levels/"}/> : <h1>Unfortunately there are no levels for this game :(</h1>}


                    <Modal show={show} onHide={handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>Are you sure you want to delete {game.name}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>The change can not be undone and the item will be deleted forever</Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                                Close
                            </Button>
                            <Button variant="danger" onClick={handleDelete}>
                                Delete
                            </Button>
                        </Modal.Footer>
                    </Modal>
                    {//show ? <DeleteModal setShow={setShow} game={game} /> : ""}
                    }
                </div>
            )
        }
        else {
            return (<div></div>)
        }
}

export default ViewGames