import Card from "react-bootstrap/Card"
import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import CardsList from '../CardsList';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Modal from 'react-bootstrap/Modal';
import DeleteModal from "../DeleteModal";
import Container from 'react-bootstrap/Container';
import { useHistory } from 'react-router';

const ViewLevel = (props) => {

    const history = useHistory();

    console.log("VIEW GAME USER")
    console.log(props);
    //console.log(this.props.match.params.pathParam1)
    const { id, id1 } = useParams();
    const [level, setLevel] = useState();
    const [show, setShow] = useState(false);

    console.log(id)
    console.log(id1)
    const handleClose = () => setShow(false);
    const handleDelete = () => {
        fetch('http://localhost:8000/api/Games/' + id + "/Levels/" + id1, {
            method: 'DELETE',
            credentials: 'include',
        })
        .then((data) => {
            console.log(data);
            if (data.ok) {
                history.push('/Games/' + id)
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
    
    useEffect(() => {
        (
        () => {
            console.log("FROM ASYNC id")
            console.log(id)
            fetch(('http://localhost:8000/api/Games/' + id + "/Levels/" + id1), {
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
                setLevel(data);
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

        const handleAddAchievement = () => {
            history.push('/Games/' + id + '/Levels/' + id1 + '/AddAchievement')
        }

        const handleEditLevel = () => {
            history.push({
                pathname: '/Games/' + id + '/Levels/' + id1 + '/EditLevel',
                state: { level: level}
            });
        }

        if (level) {
            return (
                <div>
                    <div style={{ padding: "10%" }}>
                        <Card>
                        <Card.Img variant="top" src={!level.picture ? "http://localhost:8000/images/default.png" : "http://localhost:8000/images/" + level.picture} style={{maxHeight: "30vw"}}/>
                            <Card.Body>
                                <Card.Title>Level #{level.id}</Card.Title>
                                <Card.Title>Level Name:</Card.Title>
                                <Card.Text>{level.name}</Card.Text>
                                <Card.Title>Level Description:</Card.Title>
                                <Card.Text>{level.description}</Card.Text>
                            </Card.Body>
                        </Card>
                    </div>
                    {props.user.roles > 1 ?
                    <Container fluid>
                        <Row>
                            <h1>Admin settings</h1>
                            <Button variant="danger" onClick={() => handleShow()}>Delete</Button>
                            <Button variant="warning" onClick={() => handleEditLevel()}>Edit level</Button>
                            <Button variant="success" onClick={() => handleAddAchievement()}>Add achievement</Button>
                        </Row>
                    </Container>
                    : ""}

                    <h1>Achievements for the game</h1>
                    {level.achievement.length > 0 ? <CardsList games = {level.achievement} route = {id1 + "/Achievements/"}/> : <h1>Unfortunately there are no achievements for this level :(</h1> }


                    <Modal show={show} onHide={handleClose} animation="false">
                        <Modal.Header closeButton>
                            <Modal.Title>Are you sure you want to delete {level.name}</Modal.Title>
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

export default ViewLevel