"use client";
import React, { useState, useEffect } from "react";
import { firestore } from "@/firebase_config";
import { query, collection, getDocs, doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { Box, Typography, Button, TextField, Modal, Stack, IconButton } from "@mui/material";
import { Add, Remove } from "@mui/icons-material";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: 'none',
  boxShadow: 24,
  borderRadius: 2,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
};

const Home = () => {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({ name: doc.id, ...doc.data() });
    });
    setInventory(inventoryList);
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }
    await updateInventory();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }
    await updateInventory();
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      gap={2}
      sx={{ backgroundColor: '#f5f5f5', padding: 2 }}
    >
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Item
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <TextField
              label="Item"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                addItem(itemName);
                setItemName('');
                handleClose();
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Add New Item
      </Button>
      <TextField
        label="Search Items"
        variant="outlined"
        fullWidth
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ marginBottom: 2, width: '800px' }}
      />
      <Box
        width="800px"
        p={2}
        sx={{ backgroundColor: '#fff', borderRadius: 2, boxShadow: 1, overflow: 'auto' }}
      >
        <Box
          width="100%"
          py={2}
          sx={{ backgroundColor: '#1976d2', borderRadius: 1, mb: 2 }}
        >
          <Typography variant="h4" color="#fff" textAlign="center">
            Inventory Items
          </Typography>
        </Box>
        <Stack spacing={2}>
          {filteredInventory.map(({ name, quantity }) => (
            <Box
              key={name}
              p={2}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              sx={{ backgroundColor: '#f0f0f0', borderRadius: 1 }}
            >
              <Typography variant="h6">
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant="h6">
                Quantity: {quantity}
              </Typography>
              <Box>
                <IconButton color="secondary" onClick={() => removeItem(name)}>
                  <Remove />
                </IconButton>
                <IconButton color="primary" onClick={() => addItem(name)}>
                  <Add />
                </IconButton>
              </Box>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
};

export default Home;
