import 'bootstrap';
import React, {useState} from 'react';
import { useParams } from "react-router-dom";
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"
import Card from "react-bootstrap/Card"
import { useHistory } from 'react-router-dom';

function AddAchievement(props) {
    let history = useHistory();
    const { id, id1, id2 } = useParams();
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [picture, setPicture] = useState('')
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
            formData.append('name', name)
            formData.append('description', description)
            formData.append('picture', picture)

            console.log(formData);
            fetch('http://localhost:8000/api/Games/' + id + '/Levels/' + id1 + '/Achievements', {
                method: "POST",
                credentials: 'include',
                body: formData
                /*
                body: JSON.stringify({ 
                    name,
                    description,
                    picture
                })
                */
            })
            .then((data) => {
                console.log(data);
                if (data.ok) {
                    history.push('/Games/' + id + '/Levels/' + id1);
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
                        <Form.Group controlId="gameName">
                            <Form.Label>Achivement Name</Form.Label>
                            <Form.Control required type="text" onChange={ e => setName(e.target.value)} value={name} placeholder="Enter the name of the item"/>
                        </Form.Group>

                        <Form.Group controlId="gameDescription">
                            <Form.Label>Achivement Description</Form.Label>
                            <Form.Control required type="text" onChange={ e => setDescription(e.target.value)} value={description} as="textarea" rows={3} placeholder="Enter the description of the item"/>
                        </Form.Group>

                        <Form.Group controlId="gameImage" className="mb-3">
                            <Form.Label>Select a picture for the Achivement (optional)</Form.Label>
                            <Form.Control type="file" onChange={ e => setPicture(e.target.files[0])}/>
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

export default AddAchievement
