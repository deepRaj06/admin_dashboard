import { Box, Icon } from "@chakra-ui/react";
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
import { Checkbox, CheckboxGroup } from '@chakra-ui/react'
import { useEffect } from "react";
import { EditIcon, DeleteIcon } from '@chakra-ui/icons'
import { Input } from '@chakra-ui/react';

const Admin = () => {

    const [users, setUsers] = useState([]);

    const getUser = () => {
        fetch("https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json")
            .then((res) => res.json())
            .then((res) => {
                // console.log(res);
                setUsers(res)
            })
    }

    useEffect( () => {
        getUser()
    }, [])
  return (
    <Box w='90%' margin='auto'>
      <h1
        style={{
          textAlign: "center",
          fontWeight: "700",
          fontSize: "32px",
          color: "grey",
          marginBottom: "0.6rem"
        }}
      >
        Admin UI
      </h1>
      <Input mb='0.6rem' placeholder='Search by name, email or role' />
      <TableContainer>
        <Table variant="simple">
          {/* <TableCaption>Imperial to metric conversion factors</TableCaption> */}
          <Thead>
            <Tr>
              <Th><Checkbox></Checkbox></Th>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Role</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {
                users?.map( (user) => (
                  <Tr>
                    <Td><Checkbox></Checkbox></Td>
                    <Td>{user.name}</Td>
                    <Td>{user.email}</Td>
                    <Td>{user.role}</Td>
                    <Td>
                        <Icon mr='0.8rem' as={EditIcon} w={4} h={4} color='grey.200' />
                        <Icon as={DeleteIcon} w={4} h={4} color='red.400' />
                    </Td>
                  </Tr>
                ))
            }
            
            
          </Tbody>
          <Tfoot>
            <Tr>
              
            </Tr>
          </Tfoot>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Admin;
