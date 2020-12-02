import React, { useEffect, useState } from 'react';
import { Box, Flex, Modal, Button, Text, Card, Heading, Form, Field } from 'rimble-ui';

import recycleist from '../contract.js';
import web3 from 'web3';

const SectionRecycles = () => {
    const [recycles, setRecycles] = useState([]);
    const [contributions, setContributions] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedRecycle, setSelectedRecycle] = useState(null);

    useEffect(() => {
        const fetchRecycles = async () => {
            const response = await recycleist.methods.getRecycles().call()
            setRecycles(response);
        };
        fetchRecycles();

    }, [recycles.length]);

    const closeModal = (e) => {
        e.preventDefault();
        setOpen(false);
    }

    const openModal = (e, recycleId) => {
        e.preventDefault();
        setSelectedRecycle(parseInt(recycleId));
        setOpen(true);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const accounts = await window.ethereum.enable();
            const account = accounts[0];
            await recycleist.methods.joinRecycle(selectedRecycle).send({ from: account });
            closeModal(e);
        } catch (error) {
            console.log(error);
            alert(error.message);
            closeModal(e);
        }
    };

    const canJoin = (recycle) => {
        const currentDate = new Date();
        const deadlineDate = new Date(recycle[5] * 1000);

        if (deadlineDate >= currentDate) {
            return (
                <React.Fragment>
                    <a
                        onClick={e => openModal(e, recycle[0])}
                        href="#"
                        className="btn btn-ghost">
                        join recycle
                    </a>

                    <Modal isOpen={open}>
                        <Card width={"420px"} p={0}>
                            <Button.Text
                                icononly
                                icon={"Close"}
                                color={"moon-gray"}
                                position={"absolute"}
                                top={0}
                                right={0}
                                mt={3}
                                mr={3}
                                onClick={closeModal}
                            />

                            <Box p={4} mb={3}>
                                <Box>
                                    <Heading.h3>Join Recycle</Heading.h3>
                                    <Text>Thank you for joining the recycle!</Text>
                                </Box>
                                <Form onSubmit={handleSubmit} >

                                    <Text>
                                        {`Joining the recycle id: ${selectedRecycle}`}
                                    </Text>
                                    <Flex
                                        px={4}
                                        py={3}
                                        borderTop={1}
                                        borderColor={"#E8E8E8"}
                                        justifyContent={"flex-end"}
                                    >
                                        <Button.Outline variant="danger" onClick={closeModal}>Cancel</Button.Outline>
                                        <Button type="submit" variant="success" ml={3} >Join</Button>
                                    </Flex>
                                </Form>
                            </Box>
                        </Card>
                    </Modal>
                </React.Fragment>
            );
        }
    };

    const renderedResults = recycles.map(recycle => {
        console.log(recycle);

        return (
            <div key={recycle[0]} className="col span-1-of-4 box">
                <img src={`resources/images/recycletype_${recycle[2]}.jpeg`} alt={recycle[1]} style={{ width: "100px" }} />
                <div className="recycle-feature">
                    <h3><i className={recycle[3] === "0" ? "ion-unlocked icon-small" : "ion-locked icon-small"}></i>{recycle[1]}</h3>
                    <i className="ion-ios-pricetag icon-small"></i>
                    {recycle[0]}
                    <br />
                    <i className="ion-cash icon-small"></i>
                    {web3.utils.fromWei(recycle[6])}  Ether
                </div>
                <div className="recycle-feature">
                    <i className="ion-trash-a icon-small"></i>
                    {recycle[4]} kg
                </div>
                <div className="recycle-feature">
                    <i className="ion-clock icon-small"></i>
                    {new Date(recycle[5] * 1000).toLocaleDateString()}
                </div>
                <div className="recycle-feature">
                    {canJoin(recycle)}
                </div>

            </div >
        );
    });

    return (
        <div>
            <section className="section-recycles" id="recycles">
                <div className="row">
                    <h2>Recycles</h2>
                </div>
                <div className="row js--wp-3" >
                    {renderedResults}
                </div>
            </section>
        </div>
    );
};

export default SectionRecycles;