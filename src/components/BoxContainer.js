import React, { useState, useEffect } from 'react';

import toaster from 'toasted-notes';
import 'toasted-notes/src/styles.css'; // optional styles

import '../styles/components/boxContainer.css';

const colors = [
    'green',
    'yellow',
    'pink',
    'violet',
    'red',
    'blue',
    'gray',
    'beige',
];

function BoxContainer() {
    let currentBox = React.createRef();
    const boxContainer = React.createRef();
    let selectedBox = -1;
    const [boxes, setBoxes] = useState([]);
    const [newBoxId, setNewBoxId] = useState(0);
    const [currentId, setCurrentId] = useState(null);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDownEvent);

        return () => {
            window.removeEventListener('keydown', handleKeyDownEvent);
        };
    }, [currentId, boxes]);

    const handleKeyDownEvent = (event) => {
        const { key, keyCode } = event;
        // console.log(currentId, key, keyCode);
        if (currentId === -1) {
            console.log('No box is selected!');
            return;
        }
        let {
            left,
            right,
            top,
            bottom,
        } = boxContainer.current.getBoundingClientRect();
        console.log(boxes[currentId].ref.current.getBoundingClientRect());
        let {
            left: boxLeft,
            right: boxRight,
            top: boxTop,
            bottom: boxBottom,
        } = boxes[currentId].ref.current.getBoundingClientRect();
        let newBox = { ...boxes[currentId] };
        console.log(newBox);
        if (keyCode === 65) {
            console.log('A is pressed', boxLeft <= left, boxLeft, left);
            if (boxLeft <= left) {
                console.log('outside');
                return;
            }
            boxes[currentId].ref.current.style.transform = `translate(${
                boxes[currentId].x * 10
            }px, ${boxes[currentId].y * 10}px)`;
            newBox.x--;
            // newBox.right--;
        } else if (keyCode === 68) {
            console.log('D is pressed');
            if (boxRight >= right) {
                return;
            }

            const { x, y } = boxes[
                currentId
            ].ref.current.getBoundingClientRect();
            boxes[currentId].ref.current.style.transform = `translate(${
                boxes[currentId].x * 10
            }px, ${boxes[currentId].y * 10}px)`;
            newBox.x++;
        } else if (keyCode === 87) {
            console.log('W is pressed');
            if (boxTop <= top) {
                return;
            }
            boxes[currentId].ref.current.style.transform = `translate(${
                boxes[currentId].x * 10
            }px, ${boxes[currentId].y * 10}px)`;
            newBox.y--;
        } else if (keyCode === 83) {
            console.log('S is pressed');
            if (boxBottom >= bottom) {
                return;
            }
            boxes[currentId].ref.current.style.transform = `translate(${
                boxes[currentId].x * 10
            }px, ${boxes[currentId].y * 10}px)`;
            newBox.y++;
        }
        boxes[currentId] = newBox;
        setBoxes(boxes);
    };

    const createBoxHandle = () => {
        boxes.push({
            id: newBoxId,
            backgroundColor: colors[parseInt((Math.random() * 100) % 7)],
            zIndex: newBoxId,
            ref: React.createRef(),
            x: 1,
            y: 1,
            deleted: false,
        });
        setBoxes(boxes);
        setNewBoxId((newBoxId) => newBoxId + 1);
        toaster.notify('Box created!', {
            duration: 2000,
        });
        console.log(boxes, currentBox);
    };

    const handleClick = (id) => {
        if (id < 0) return;
        selectedBox = id;
        setCurrentId(id);
        // const currentBox = boxes.filter((box) => box.id === id);
        // console.log(currentBox);
        boxes[id].ref.current.style.border = '2px solid black';
        // console.log(boxes.entries());
        for (let box of boxes) {
            // console.log(box);
            if (box.id !== id) {
                if (box.ref.current === null) continue;
                box.ref.current.style.border = 'none';
            }
        }
        // console.log(selectedBox);
    };

    const deleteBoxHandle = () => {
        let deletedBox = { ...boxes[currentId] };
        deletedBox.deleted = true;
        boxes[currentId] = deletedBox;
        boxes[currentId].ref.current.style.backgroundColor = '#d8dfff';
        boxes[currentId].ref.current.style.border = 'none';
        boxes[currentId].ref.current.style.zIndex = '-1';
        toaster.notify('Box deleted!', {
            duration: 2000,
        });
        setBoxes(boxes);
    };

    return (
        <div className="boxContainer">
            <div className="boxContainer__boxes" ref={boxContainer}>
                {/* <div>{currentBox}</div> */}
                {boxes.map((box, index) =>
                    !box.deleted ? (
                        <div
                            ref={box.ref}
                            onClick={() => handleClick(index)}
                            key={box.id}
                            style={box}
                        ></div>
                    ) : null
                )}
            </div>
            <div className="boxContainer__buttons">
                <button onClick={createBoxHandle}>Create</button>
                <button onClick={deleteBoxHandle}>Delete</button>
            </div>
        </div>
    );
}

export default BoxContainer;
