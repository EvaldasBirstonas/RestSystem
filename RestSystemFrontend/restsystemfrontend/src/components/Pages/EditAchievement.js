import 'bootstrap';
import React, {useState} from 'react';
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"
import Card from "react-bootstrap/Card"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import { useHistory } from 'react-router-dom';
import { useLocation } from "react-router-dom";
import { useParams } from "react-router-dom";

function EditAchievement(props) {
    const location = useLocation();
    console.log(location.state.achievement);
    const [achievement, ] = useState(location.state.achievement);
    const { id, id1, id2 } = useParams();
    let history = useHistory();
    const [name, setName] = useState(achievement.name)
    const [description, setDescription] = useState(achievement.description)
    const [picture, setPicture] = useState(achievement.picture)
    const [checkbox, setCheckbox] = useState(false);
    const [validated, setValidated] = useState(false)
    const submit = e => {
        console.log(name);
        console.log(description);
        console.log(picture);
        e.preventDefault()
        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.preventDefault();
            e.stopPropagation();
        }
        if (name !== "") {
            const formData = new FormData();
            console.log(checkbox);
            formData.append('name', name)
            formData.append('description', description)
            formData.append('keepimage', checkbox)
            if(checkbox) {
                formData.append('picture', achievement.picture)
            }
            else {
                formData.append('picture', picture)
            }

            console.log(formData);
            
            fetch('http://localhost:8000/api/Games/' + id + "/Levels/" + id1 + '/Achievements/' + id2, {
                method: "PUT",
                credentials: 'include',
                body: formData
            })
            .then((data) => {
                console.log(data);
                if (data.ok) {
                    history.push('/Games/' + id + '/Levels/' + id1 + '/Achievements/' + id2);
                    props.setRefresh(x => !x);
                }
                return data.json();
            })
            
            //history.push('/Games');
        }
        //history.push('/');
        setValidated(true);
    }
    
    return (
        <div style={{ padding: "10%" }}>
            <Card>
                <Card.Body>
                    <Form noValidate validated={validated}>
                        <Form.Group controlId="achievementName">
                            <Form.Label>Achievement Name</Form.Label>
                            <Form.Control required type="text" onChange={ e => setName(e.target.value)} value={name} placeholder="Enter the name of the item"/>
                        </Form.Group>

                        <Form.Group controlId="achievementDescription">
                            <Form.Label>Game Description</Form.Label>
                            <Form.Control required type="text" onChange={ e => setDescription(e.target.value)} value={description} as="textarea" rows={3} placeholder="Enter the description of the item"/>
                        </Form.Group>

                        <Form.Group controlId="achievementImage" className="mb-3">
                            <Form.Label>Select a picture for the game (optional, do not add to keep the same picture)</Form.Label>
                            <Form.Control type="file" onChange={ e => setPicture(e.target.files[0])}/>

                            <Form.Group as={Row} className="mb-3" controlId="formHorizontalCheck">
                                <Col>
                                    <Form.Check onChange={ e => setCheckbox(!checkbox)} label="Keep the same picture" />
                                </Col>
                            </Form.Group>
                            
                            <Form.Text>Current picture:
                                <br />
                                {achievement.picture !== null ? <img src={"http://localhost:8000/images/" + achievement.picture} /> : <a>None</a>}
                            </Form.Text>
                        </Form.Group>

                        <Button variant="primary" onClick={submit}>
                            Submit
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    )
}

export default EditAchievement
