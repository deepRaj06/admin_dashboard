import { Box, Icon, IconButton } from "@chakra-ui/react";
import React, { useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from "@chakra-ui/react";
import { Checkbox, CheckboxGroup } from "@chakra-ui/react";
import { useEffect } from "react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { Input } from "@chakra-ui/react";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
  } from '@chakra-ui/react'

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [filterUsers, setFilterUsers] = useState([]);
  const [filterBy, setFilterBy] = useState("");

  const getUser = () => {
    fetch(
      "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
    )
      .then((res) => res.json())
      .then((res) => {
        // console.log(res);
        setUsers(res);
        setFilterUsers(res);
      });
  };

  const handleByFilter = (e) => {
    if (e.target.value == "") {
      setUsers(filterUsers);
    } else {
      const filterByRes = users.filter(
        (user) =>
          user.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
          user.email.toLowerCase().includes(e.target.value.toLowerCase()) ||
          user.role.toLowerCase().includes(e.target.value.toLowerCase())
      );
      if (filterByRes.length > 0) {
        setUsers(filterByRes);
      } else {
        setUsers([{"name": "Data not found!"}]);
      }
    }
    setFilterBy(e.target.value);
  };

  const handleSingleDelete = (id) => {
    const remainingUsers = users.filter( user => user.id !== id);
    setUsers(remainingUsers);
  }

  const handleSingleEdit = (id) => {
    fetch(`https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json/${id}`,{
        method: "POST",
        headers:{
            'Content-Type': 'application/json'
        },
        body:{

        }

    })
        .then((res) => res.json())
        .then((res) => {
            // console.log(res);
            setUsers(res);
            setFilterUsers(res);
        });
  }

  useEffect(() => {
    getUser();
  }, []);

  return (
    <Box w="90%" margin="auto">
      <h1
        style={{
          textAlign: "center",
          fontWeight: "700",
          fontSize: "32px",
          color: "grey",
          marginBottom: "0.6rem",
        }}
      >
        Admin UI
      </h1>
      <Input
        type="search"
        mb="0.6rem"
        placeholder="Search by name, email or role"
        value={filterBy}
        onInput={(e) => handleByFilter(e)}
      />
      <TableContainer>
        <Table variant="simple">
          {/* <TableCaption>Imperial to metric conversion factors</TableCaption> */}
          <Thead>
            <Tr>
              <Th>
                <Checkbox></Checkbox>
              </Th>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Role</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {users?.map((user) => (
              <Tr>
                <Td>
                  <Checkbox></Checkbox>
                </Td>
                <Td>{user.name}</Td>
                <Td>{user.email}</Td>
                <Td>{user.role}</Td>
                <Td>
                  <IconButton
                    icon={<EditIcon/>}
                    w={4}
                    h={4}
                    bgColor="white"
                    color="grey.200"
                    onClick={() => handleSingleEdit(user.id)}
                  />
                  <IconButton 
                    icon={<DeleteIcon/>} 
                    w={4} 
                    h={4} 
                    bgColor="white" 
                    color="red.400" 
                    onClick={() => handleSingleDelete(user.id)}
                   />
                </Td>
              </Tr>
            ))}
          </Tbody>
          <Tfoot>
            <Tr></Tr>
          </Tfoot>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Admin;
