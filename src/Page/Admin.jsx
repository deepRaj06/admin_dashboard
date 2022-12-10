import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  IconButton,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableContainer,
} from "@chakra-ui/react";
import { Checkbox } from "@chakra-ui/react";
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
} from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";

const Admin = () => {
  // Modal Starts
  const { isOpen, onOpen, onClose } = useDisclosure();

  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);

  // Modal Ends

  // User data array
  const [users, setUsers] = useState([]);

  // Filter Starts

  const [filterUsers, setFilterUsers] = useState([]);
  const [filterBy, setFilterBy] = useState("");

  // Filter Ends

  // Edit Starts
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [userEditId, setUserEditId] = useState();
  // Edit Ends

  //  Pagination
  const pageNums = [];
  const [curPage, setCurPage] = useState(1);
  const [rowPerPage, setRowPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  //   Row Selected
  const [rowColor, setRowColor] = useState("white");

  const getUser = () => {
    fetch(
      `https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json`
    )
      .then((res) => res.json())
      .then((res) => {
        setUsers(res);
        setFilterUsers(res);
        setTotalPages(res.length);
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
        setUsers([{ name: "Data not found!" }]);
      }
    }
    setFilterBy(e.target.value);
  };

  const handleSingleDelete = (id) => {
    const remainingUsers = users.filter((user) => user.id !== id);
    setUsers(remainingUsers);
  };

  let editedUsers = [];
  const handleSingleEdit = (detail) => {
    onOpen();
    setName(detail.name);
    setEmail(detail.email);
    setRole(detail.role);
    setUserEditId(detail.id);
    setUsers(users);
  };

  const handleSaveEditData = () => {
    const obj = {
      id: userEditId,
      name: name,
      email: email,
      role: role,
    };
    for (let i = 0; i < users.length; i++) {
      if (users[i].id == userEditId) {
        editedUsers.push(obj);
      } else {
        editedUsers.push(users[i]);
      }
    }
    setUsers(editedUsers);
    onClose();
  };

  //   Pagination

  const indLastRow = curPage * rowPerPage;
  const indFirstRow = indLastRow - rowPerPage;
  const curRow = users.slice(indFirstRow, indLastRow);

  for (let i = 1; i <= Math.ceil(totalPages / rowPerPage); i++) {
    pageNums.push(i);
  }

  //   Delete selected

  const handleChecked = (e) => {
    const { name, checked } = e.target;
    if (name === "allUserSelect") {
      const checkValue = users.slice(indFirstRow, indLastRow).map((user) => {
        return { ...user, isChecked: checked };
      });
      setUsers(checkValue);
    } else {
      const checkValue = users.map((user) => {
        {
          user.id === name ? setRowColor("grey") : setRowColor("white");
        }
        return user.id === name ? { ...user, isChecked: checked } : user;
      });
      setUsers(checkValue);
    }
  };

  const handleDeleteSelected = () => {
    const checkedUsers = [];
    for (let i = 0; i < users.length; i++) {
      if (users[i].isChecked !== true) {
        checkedUsers.push(users[i]);
      }
    }
    setUsers(checkedUsers);
  };

  useEffect(() => {
    getUser();
  }, [setUsers]);

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
          <Thead>
            <Tr>
              <Th>
                <Checkbox
                  name="allUserSelect"
                  onChange={handleChecked}
                  checked={!users.some((user) => user?.isChecked !== true)}
                ></Checkbox>
              </Th>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Role</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {curRow?.map((user) => {
              return (
                <Tr key={user.id} bgColor={rowColor}>
                  <Td>
                    <Checkbox
                      onChange={handleChecked}
                      name={user.id}
                      checked={user?.isChecked || false}
                    ></Checkbox>
                  </Td>
                  <Td>{user.name}</Td>
                  <Td>{user.email}</Td>
                  <Td>{user.role}</Td>
                  <Td>
                    <IconButton
                      icon={<EditIcon />}
                      w={4}
                      h={4}
                      bgColor="white"
                      color="grey.200"
                      onClick={() => handleSingleEdit(user)}
                    />
                    <Modal
                      initialFocusRef={initialRef}
                      finalFocusRef={finalRef}
                      isOpen={isOpen}
                      onClose={onClose}
                    >
                      <ModalOverlay />
                      <ModalContent>
                        <ModalHeader>Create your account</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody pb={6}>
                          <FormControl>
                            <FormLabel>Name</FormLabel>
                            <Input
                              onChange={(e) => setName(e.target.value)}
                              ref={initialRef}
                              value={name}
                              placeholder="Enter your name"
                            />
                          </FormControl>

                          <FormControl mt={4}>
                            <FormLabel>Email</FormLabel>
                            <Input
                              onChange={(e) => setEmail(e.target.value)}
                              value={email}
                              placeholder="Enter your email"
                            />
                          </FormControl>

                          <FormControl mt={4}>
                            <FormLabel>Role</FormLabel>
                            <Input
                              onChange={(e) => setRole(e.target.value)}
                              value={role}
                              placeholder="Enter your role"
                            />
                          </FormControl>
                        </ModalBody>

                        <ModalFooter>
                          <Button
                            colorScheme="blue"
                            mr={3}
                            onClick={handleSaveEditData}
                          >
                            Save
                          </Button>
                          <Button onClick={onClose}>Cancel</Button>
                        </ModalFooter>
                      </ModalContent>
                    </Modal>
                    <IconButton
                      icon={<DeleteIcon />}
                      w={4}
                      h={4}
                      bgColor="white"
                      color="red.400"
                      onClick={() => handleSingleDelete(user.id)}
                    />
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
          <Tfoot></Tfoot>
        </Table>
      </TableContainer>
      <Flex justifyContent="space-between" alignItems="center">
        <Box>
          <Button onClick={handleDeleteSelected}>Delete Selected</Button>
        </Box>
        <Box mt="2rem" mb="2rem" mr="24rem">
          <Flex justifyContent="center" alignItems="center">
            <HStack spacing={8}>
              <IconButton
                borderRadius="50%"
                w={12}
                h={12}
                icon={<ChevronLeftIcon />}
                onClick={() =>
                  curPage > 1 ? setCurPage(curPage - 1) : curPage
                }
              ></IconButton>
              {pageNums?.map((page) => {
                {
                  return page === curPage ? (
                    <Button
                      key={page}
                      borderRadius="50%"
                      w={12}
                      h={12}
                      bgColor="lightblue"
                    >
                      {page}
                    </Button>
                  ) : (
                    <Button key={page} borderRadius="50%" w={12} h={12}>
                      {page}
                    </Button>
                  );
                }
              })}
              <IconButton
                borderRadius="50%"
                w={12}
                h={12}
                icon={<ChevronRightIcon />}
                onClick={() =>
                  curPage < Math.ceil(totalPages / rowPerPage)
                    ? setCurPage(curPage + 1)
                    : curPage
                }
              ></IconButton>
            </HStack>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
};

export default Admin;
