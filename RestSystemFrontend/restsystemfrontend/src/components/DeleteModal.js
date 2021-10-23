import React, {useState} from 'react';
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import { useHistory } from 'react-router';

function DeleteModal(props) {

    console.log(props)
    const history = useHistory();

    const [show, ] = useState(true);

    const handleClose = () => props.setShow(false);
    const handleDelete = () => {
        fetch('http://localhost:8000/api/Games/' + props.game.id, {
            method: 'DELETE',
            credentials: 'include',
        })
        //props.setGameRefresh(x => !x);
        history.push('/Games')
        //setItemList(itemList.filter(x => x.id !== id));
        handleClose();
    };

    return (
        <Modal show={show} onHide={handleClose} animation="false">
            <Modal.Header closeButton>
                <Modal.Title>Are you sure you want to delete {props.game.name}</Modal.Title>
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
    )
}

export default DeleteModal
