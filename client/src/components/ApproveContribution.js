import React, { useEffect, useState } from 'react';
import { Box, Flex, Modal, Button, Text, Card, Heading, Form, Field, Radio, Input } from 'rimble-ui';
import recycleist from '../contract.js';

const ApproveContribution = () => {
    const [contributionId, setContributionId] = useState();
    const [recycleId, setRecycleId] = useState();

    const [open, setOpen] = useState(false);
    const [validated, setValidated] = useState(false);
    const [formValidated, setFormValidated] = useState(false);

    const handleRecycleId = (e) => {
        setRecycleId(e.target.value);
        validate(e);
    }

    const handleContributionId = (e) => {
        setContributionId(e.target.value);
        validate(e);
    }

    const validate = (e) => {
        e.target.parentNode.classList.add("was-validated");
    }

    const validateForm = () => {
        if (contributionId >= 0 && recycleId >= 0) {
            setValidated(true);
        } else {
            setValidated(false);
        }
    }

    const closeModal = (e) => {
        e.preventDefault();
        setOpen(false);
    }

    const openModal = (e) => {
        e.preventDefault();
        setOpen(true);
    }

    useEffect(() => {
        validateForm();
    });

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            const accounts = await window.ethereum.enable();
            const account = accounts[0];

            await recycleist.methods.approveContribution(recycleId, contributionId).send({ from: account });
            closeModal(e);
        } catch (error) {
            console.log(error);
            alert(error.message);
            closeModal(true);
        }
    };

    return (
        <React.Fragment>
            <a
                onClick={openModal}
                href="#"
                className="btn btn-ghost"
            >
                Approve A Contribution
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
                            <Heading.h3>Approving Recycle </Heading.h3>
                            <Text>Thank you for approving the contribution!</Text>
                        </Box>
                        <Form onSubmit={handleSubmit} validated={formValidated}>
                            <Flex mx={-3} flexWrap={"wrap"}>
                                <Field label="Recycle ID" validated={validated} width={1}>
                                    <Input
                                        type="number"
                                        required
                                        onChange={handleRecycleId}
                                        value={recycleId}
                                        width={1}
                                    />
                                </Field>
                            </Flex>
                            <Flex mx={-3} flexWrap={"wrap"}>
                                <Field label="Contribution ID" validated={validated} width={1}>
                                    <Input
                                        type="number"
                                        required
                                        onChange={handleContributionId}
                                        value={contributionId}
                                        width={1}
                                    />
                                </Field>
                            </Flex>

                            <Flex
                                px={4}
                                py={3}
                                borderTop={1}
                                borderColor={"#E8E8E8"}
                                justifyContent={"flex-end"}
                            >
                                <Button.Outline variant="danger" onClick={closeModal}>Cancel</Button.Outline>
                                <Button type="submit" variant="success" ml={3} disabled={!validated}>Contribute</Button>
                            </Flex>
                        </Form>
                    </Box>
                </Card>
            </Modal>
        </React.Fragment>
    );
};

export default ApproveContribution;