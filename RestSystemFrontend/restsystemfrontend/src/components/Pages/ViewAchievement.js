import Card from "react-bootstrap/Card"
import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import CardsList from '../CardsList';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Modal from 'react-bootstrap/Modal';
import DeleteModal from "../DeleteModal";
import Alert from "react-bootstrap/Alert";
import Container from 'react-bootstrap/Container';
import { useHistory } from 'react-router';

const ViewAchievement = (props) => {

    const history = useHistory();

    console.log("VIEW GAME USER")
    console.log(props);
    //console.log(this.props.match.params.pathParam1)
    const { id, id1, id2 } = useParams();
    const [achievement, setAchievement] = useState();
    const [show, setShow] = useState(false);
    const [toastShow, setToastShow] = useState(false);
    const [failToastShow, setFailToastShow] = useState(false);

    console.log(id)
    console.log(id1)
    const handleClose = () => setShow(false);
    const handleToastClose = () => setToastShow(false);
    const handleDelete = () => {
        fetch('http://localhost:8000/api/Games/' + id + "/Levels/" + id1 + '/Achievements/' + id2, {
            method: 'DELETE',
            credentials: 'include',
        })
        .then((data) => {
            console.log(data);
            if (data.ok) {
                history.push('/Games/' + id + '/Levels/' + id1)
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
    
    useEffect(() => {
        (
        () => {
            console.log("FROM ASYNC id")
            console.log(id)
            fetch(('http://localhost:8000/api/Games/' + id + "/Levels/" + id1 + '/Achievements/' + id2), {
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
                setAchievement(data);
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

        const handleEditAchievement = () => {
            history.push({
                pathname: '/Games/' + id + '/Levels/' + id1 + '/Achievements/' + id2 + '/EditAchievement',
                state: { achievement: achievement}
            });
        }

        const handleAddAchievementToUser = () => {
            fetch('http://localhost:8000/api/Games/' + id + "/Levels/" + id1 + '/Achievements/' + id2 + '/Users/' + props.user.id, {
                method: 'POST',
                credentials: 'include',
            })
            .then((data) => {
                if(data.ok) {
                    handleToastShow();
                }
                else {
                    throw new Error(data);
                }
            })
            .catch((error) => {
                setFailToastShow(true);
            });
        }

        if (achievement) {
            return (
                <div>
                    <div className="paddedDiv">
                        <Card>
                        <Card.Img variant="top" src={!achievement.picture ? "http://localhost:8000/images/default.png" : "http://localhost:8000/images/" + achievement.picture} style={{height: '100%'}}/>
                            <Card.Body>
                                <Card.Title>Achievement #{achievement.id}</Card.Title>
                                <Card.Title>Achievement Name:</Card.Title>
                                <Card.Text>{achievement.name}</Card.Text>
                                <Card.Title>Achievement Description:</Card.Title>
                                <Card.Text className="no-overflow">{achievement.description}</Card.Text>
                            </Card.Body>
                        </Card>
                    </div>
                    {props.user ?
                    <div className="paddedDiv">
                        <Container fluid>
                            <Row>
                                <h1>User settings</h1>
                                <Button variant="success" onClick={() => handleAddAchievementToUser()}>Add this achievement to your account!</Button>
                                <Alert variant="success" show={toastShow} onHide={handleToastClose}>
                                    <Alert.Heading>Success!</Alert.Heading>
                                    <p>
                                        {achievement.name} has been succesfully added to your account
                                    </p>
                                </Alert>
                                <Alert variant="danger" show={failToastShow}>
                                    <Alert.Heading>There was an error with your request!</Alert.Heading>
                                    <p>
                                        The achievement is most likely already in your games list.
                                    </p>
                                </Alert>
                            </Row>
                        </Container>
                    </div>
                    : ""}

                    {props.user.roles > 1 ?
                    <div className="paddedDiv">
                        <Container fluid>
                            <Row>
                                <h1>Admin settings</h1>
                                <Button variant="warning" onClick={() => handleEditAchievement()}>Edit achievement</Button>
                                <Button variant="danger" onClick={() => handleShow()}>Delete</Button>
                            </Row>
                        </Container>
                    </div>
                    : ""}

                    <Modal show={show} onHide={handleClose} animation="false">
                        <Modal.Header closeButton>
                            <Modal.Title>Are you sure you want to delete {achievement.name}</Modal.Title>
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

export default ViewAchievement