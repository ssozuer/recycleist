import React, { useEffect, useState } from 'react';
import { Box, Flex, Modal, Button, Text, Card, Heading, Form, Field, Radio, Input } from 'rimble-ui';
import recycleist from '../contract.js';
import web3 from 'web3';

const CreateRecycle = () => {
    const [open, setOpen] = useState(false);
    const [description, setDescription] = useState("");
    const [type, setType] = useState("0");
    const [goal, setGoal] = useState(50);
    const [reward, setReward] = useState(1);
    const [deadline, setDeadline] = useState(15);
    const [validated, setValidated] = useState(false);
    const [formValidated, setFormValidated] = useState(false);

    const handleDescription = (e) => {
        setDescription(e.target.value);
        validate(e);
    }

    const handleType = (e) => {
        setType(e.target.value);
        validate(e);
    }

    const handleGoal = (e) => {
        setGoal(e.target.value);
        validate(e);
    }

    const handleReward = (e) => {
        setReward(e.target.value);
        validate(e);
    }

    const handleDeadline = (e) => {
        setDeadline(e.target.value);
        validate(e);
    }

    const validate = (e) => {
        e.target.parentNode.classList.add("was-validated");
    }

    const validateForm = () => {
        console.log('Reward: ', reward);
        if (description.length > 0
            && type.length > 0
            && goal > 0
            && reward >= 0
            && deadline > 0) {
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
        e.preventDefault();
        console.log("Submitted valid form");
        console.log(
            `Description: ${description}\n
            Type: ${type}\n
            Goal: ${goal}\n
            Reward: ${reward}\n
            Deadline: ${deadline}`
        );

        const accounts = await window.ethereum.enable();
        const account = accounts[0];
        const value = parseFloat(reward) + 0.01;
        const totalReward = web3.utils.toWei(reward + '');

        //const gas = await recycleist.methods.createRecycle(description, type, 0, goal, deadline, reward).estimateGas();
        recycleist.methods.createRecycle(description, type, 0, goal, deadline, totalReward).send({ from: account, value: web3.utils.toWei(`${value}`) });
        closeModal(e);
    };

    return (
        <React.Fragment>
            <a
                onClick={openModal}
                href="#"
                className="btn btn-ghost js--scroll-to-plans"
            >
                Create Recycle
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
                            <Heading.h3>Create Recycle</Heading.h3>
                            <Text>Thank you for saving the earth!</Text>
                        </Box>
                        <Form onSubmit={handleSubmit} validated={formValidated}>
                            <Flex mx={-3} flexWrap={"wrap"}>
                                <Field label="Description" validated={validated} width={1}>
                                    <Input
                                        type="text"
                                        required
                                        onChange={handleDescription}
                                        value={description}
                                        width={1}
                                    />
                                </Field>
                            </Flex>

                            <Field label="Choose Type" validated={validated} width={1}>
                                <Radio
                                    label="Plastic"
                                    my={2}
                                    value={0}
                                    checked={type === "0"}
                                    onChange={handleType}
                                    required
                                />
                                <Radio
                                    label="Paper"
                                    my={2}
                                    value={1}
                                    checked={type === "1"}
                                    onChange={handleType}
                                    required
                                />
                                <Radio
                                    label="Glass"
                                    my={2}
                                    value={2}
                                    checked={type === "2"}
                                    onChange={handleType}
                                    required
                                />
                            </Field>

                            <Flex mx={-3} flexWrap={"wrap"}>
                                <Field label="Goal(in kilogram)" validated={validated} width={1}>
                                    <Input
                                        type="number"
                                        placeholder="e.g. 100"
                                        required
                                        onChange={handleGoal}
                                        value={goal}
                                        width={1}
                                    />
                                </Field>
                            </Flex>

                            <Flex mx={-3} flexWrap={"wrap"}>
                                <Field label="Deadline(in minutes)" validated={validated} width={1}>
                                    <Input
                                        type="number"
                                        placeholder="e.g. 15"
                                        required
                                        onChange={handleDeadline}
                                        value={deadline}
                                        width={1}
                                    />
                                </Field>
                            </Flex>

                            <Flex mx={-3} flexWrap={"wrap"}>
                                <Field label="Total Reward" validated={validated} width={1}>
                                    <Input
                                        type="number"
                                        placeholder="e.g. 1000"
                                        required
                                        onChange={handleReward}
                                        value={reward}
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
                                <Button type="submit" variant="success" ml={3} disabled={!validated}>Create</Button>
                            </Flex>
                        </Form>
                    </Box>

                </Card>
            </Modal>
        </React.Fragment>
    );
};

export default CreateRecycle;